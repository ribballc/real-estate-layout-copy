import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import SupportChatbot, { type SupportChatbotHandle } from "./SupportChatbot";
import TrialLockOverlay from "./TrialLockOverlay";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings,
  TrendingUp, Users, CalendarDays, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const pageTitles: Record<string, { title: string; description: string; icon: any }> = {
  "/dashboard": { title: "Home", description: "Overview of your business performance", icon: TrendingUp },
  "/dashboard/business": { title: "Business Info", description: "Manage your brand, address and service areas", icon: Building2 },
  "/dashboard/calendar": { title: "Calendar", description: "View and manage your bookings", icon: CalendarDays },
  "/dashboard/customers": { title: "Customers", description: "Manage your customer relationships", icon: Users },
  "/dashboard/services": { title: "Services", description: "Manage your service offerings and pricing", icon: Wrench },
  "/dashboard/photos": { title: "Photos", description: "Upload your portfolio and gallery", icon: Camera },
  "/dashboard/testimonials": { title: "Testimonials", description: "Manage customer reviews", icon: Star },
  "/dashboard/account": { title: "Account", description: "Manage your account settings", icon: Settings },
};

const extraSearchItems = [
  { url: "/dashboard/services#add-ons", title: "Add-ons", description: "Create add-on packages for services", icon: PuzzleIcon },
  { url: "/dashboard/business#social", title: "Social Media", description: "Connect your social profiles", icon: Share2 },
  { url: "/dashboard/business#hours", title: "Business Hours", description: "Set your weekly schedule", icon: Clock },
];

const searchablePages = [
  ...Object.entries(pageTitles).map(([url, info]) => ({ url, ...info })),
  ...extraSearchItems,
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const page = pageTitles[location.pathname] || pageTitles["/dashboard"];
  const PageIcon = page.icon;
  const [dashboardTheme, setDashboardTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("dashboard-theme") as "dark" | "light") || "dark";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const chatbotRef = useRef<SupportChatbotHandle>(null);
  const [trialActive, setTrialActive] = useState<boolean | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("trial_active, onboarding_complete").eq("user_id", user.id).single(),
      supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(),
    ]).then(([profileRes, roleRes]) => {
      setTrialActive(profileRes.data?.trial_active ?? false);
      setOnboardingComplete(profileRes.data?.onboarding_complete ?? false);
      setIsAdmin(!!roleRes.data);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(location.search);
    const isPostCheckout = params.get("checkout") === "success";
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("check-subscription");
        if (!error && data?.subscribed) {
          setTrialActive(true);
          if (isPostCheckout) navigate("/dashboard", { replace: true });
        }
      } catch (e) {
        console.error("Failed to check subscription:", e);
      }
    };
    checkSubscription();
  }, [user, location.search, navigate]);

  useEffect(() => {
    if (onboardingComplete === false) navigate("/onboarding", { replace: true });
  }, [onboardingComplete, navigate]);

  const UNLOCKED_PATHS = ["/dashboard", "/dashboard/business", "/dashboard/account"];
  const isLocked = !isAdmin && trialActive === false && !UNLOCKED_PATHS.includes(location.pathname);

  const toggleTheme = () => {
    setDashboardTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("dashboard-theme", next);
      return next;
    });
  };

  const searchResults = searchQuery.trim()
    ? searchablePages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const isDark = dashboardTheme === "dark";
  const bg = isDark ? "linear-gradient(160deg, hsl(215 50% 6%) 0%, hsl(217 33% 10%) 100%)" : "linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(210 40% 98%) 100%)";
  const textPrimary = isDark ? "text-white/90" : "text-gray-900";
  const textSecondary = isDark ? "text-white/30" : "text-gray-500";
  const textMuted = isDark ? "text-white/20" : "text-gray-400";
  const borderColor = isDark ? "border-white/[0.04]" : "border-gray-200";
  const inputBg = isDark ? "bg-white/[0.03] border-white/[0.06] text-white/70" : "bg-white border-gray-200 text-gray-900";
  const triggerClass = isDark ? "text-white/40 hover:text-white/70" : "text-gray-500 hover:text-gray-900";

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isDark ? "" : "dashboard-light"}`} style={{ background: bg }}>
        <DashboardSidebar
          dashboardTheme={dashboardTheme}
          onToggleTheme={toggleTheme}
          onReportBug={() => chatbotRef.current?.openWithPrompt("I'd like to report a bug I found:")}
          onNeedHelp={() => chatbotRef.current?.openWithPrompt("I need help with:")}
        />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className={`flex flex-col shrink-0 border-b ${borderColor}`} style={{ backdropFilter: "blur(20px)" }}>
            <div className="h-12 flex items-center gap-3 px-4 md:px-6">
              <SidebarTrigger className={triggerClass} />
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <PageIcon className="w-3.5 h-3.5 text-accent/50 shrink-0" strokeWidth={1.5} />
                <h1 className={`${textPrimary} font-medium text-[13px] truncate tracking-tight`}>{page.title}</h1>
                <span className={`${textSecondary} text-[11px] hidden sm:block`}>·</span>
                <p className={`${textSecondary} text-[11px] hidden sm:block truncate`}>{page.description}</p>
              </div>
              {/* Desktop search */}
              <div className="relative hidden sm:block w-52">
                <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 ${textMuted}`} />
                <Input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search..."
                  className={`pl-8 h-7 text-[11px] rounded-lg ${inputBg} focus-visible:ring-accent/30`}
                />
                {searchOpen && searchResults.length > 0 && (
                  <div className={`absolute top-full mt-1 left-0 right-0 rounded-lg border ${borderColor} ${isDark ? "bg-[hsl(215,50%,8%)]" : "bg-white"} shadow-2xl z-50 overflow-hidden`}>
                    {searchResults.map(r => (
                      <button
                        key={r.url}
                        onMouseDown={() => { navigate(r.url); setSearchQuery(""); setSearchOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] ${isDark ? "hover:bg-white/[0.03] text-white/50" : "hover:bg-gray-50 text-gray-600"} transition-colors`}
                      >
                        <r.icon className="w-3 h-3 text-accent/60" strokeWidth={1.5} />
                        <div className="text-left">
                          <span className="font-medium">{r.title}</span>
                          <span className={`block text-[10px] ${textSecondary}`}>{r.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Mobile search */}
            <div className="sm:hidden px-4 pb-2.5 relative">
              <Search className={`absolute left-7 top-1/2 -translate-y-1/2 w-3 h-3 ${textMuted} z-10`} />
              <Input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search..."
                className={`pl-8 h-9 text-[12px] ${inputBg} focus-visible:ring-accent/30`}
              />
              {searchOpen && searchResults.length > 0 && (
                <div className={`absolute top-full mt-1 left-4 right-4 rounded-lg border ${borderColor} ${isDark ? "bg-[hsl(215,50%,8%)]" : "bg-white"} shadow-xl z-50 overflow-hidden`}>
                  {searchResults.map(r => (
                    <button
                      key={r.url}
                      onMouseDown={() => { navigate(r.url); setSearchQuery(""); setSearchOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] ${isDark ? "hover:bg-white/[0.03] text-white/50" : "hover:bg-gray-50 text-gray-600"} transition-colors`}
                    >
                      <r.icon className="w-3 h-3 text-accent/60" strokeWidth={1.5} />
                      <span className="font-medium">{r.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </div>

          {isLocked && <TrialLockOverlay isDark={isDark} />}

          {/* Footer */}
          <footer className={`border-t ${borderColor} px-4 md:px-6 py-3 shrink-0`}>
            <div className={`flex items-center justify-between ${textMuted} text-[10px]`}>
              <span>© {new Date().getFullYear()} Darker</span>
              <div className="flex items-center gap-3">
                <a href="mailto:support@darker.com" className="hover:opacity-60 transition-opacity">Support</a>
                <a href="mailto:support@darker.com?subject=Feedback" className="hover:opacity-60 transition-opacity">Feedback</a>
              </div>
            </div>
          </footer>

          <SupportChatbot ref={chatbotRef} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
