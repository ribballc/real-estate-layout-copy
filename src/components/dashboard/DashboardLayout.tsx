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

// Extra searchable items that live inside other pages
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

  // Check onboarding + trial status
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("trial_active, onboarding_complete").eq("user_id", user.id).single().then(({ data }) => {
      setTrialActive(data?.trial_active ?? false);
      setOnboardingComplete(data?.onboarding_complete ?? false);
    });
  }, [user]);

  // Redirect to onboarding if not complete
  useEffect(() => {
    if (onboardingComplete === false) {
      navigate("/onboarding", { replace: true });
    }
  }, [onboardingComplete, navigate]);

  // Pages accessible without trial
  const UNLOCKED_PATHS = ["/dashboard", "/dashboard/business", "/dashboard/account"];
  const isLocked = trialActive === false && !UNLOCKED_PATHS.includes(location.pathname);

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
  const bg = isDark ? "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 14%) 100%)" : "linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(210 40% 98%) 100%)";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/40" : "text-gray-500";
  const textMuted = isDark ? "text-white/30" : "text-gray-400";
  const borderColor = isDark ? "border-white/10" : "border-gray-200";
  const cardBg = isDark ? "bg-white/[0.03]" : "bg-white";
  const inputBg = isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-900";
  const triggerClass = isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900";

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
          {/* Header bar */}
          <header className={`flex flex-col shrink-0 border-b ${borderColor}`}>
            <div className="h-14 flex items-center gap-3 px-4 md:px-8">
              <SidebarTrigger className={triggerClass} />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <PageIcon className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <h1 className={`${textPrimary} font-semibold text-sm truncate`}>{page.title}</h1>
                  <p className={`${textSecondary} text-xs hidden sm:block`}>{page.description}</p>
                </div>
              </div>
              {/* Desktop search */}
              <div className="relative hidden sm:block w-64">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <Input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search anything..."
                  className={`pl-10 h-9 text-sm ${inputBg} focus-visible:ring-accent`}
                />
                {searchOpen && searchResults.length > 0 && (
                  <div className={`absolute top-full mt-1 left-0 right-0 rounded-lg border ${borderColor} ${isDark ? "bg-[hsl(215,50%,12%)]" : "bg-white"} shadow-xl z-50 overflow-hidden`}>
                    {searchResults.map(r => (
                      <button
                        key={r.url}
                        onMouseDown={() => { navigate(r.url); setSearchQuery(""); setSearchOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${isDark ? "hover:bg-white/5 text-white/70" : "hover:bg-gray-50 text-gray-700"} transition-colors`}
                      >
                        <r.icon className="w-4 h-4 text-accent" />
                        <div className="text-left">
                          <span className="font-medium">{r.title}</span>
                          <span className={`block text-xs ${textSecondary}`}>{r.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Mobile search */}
            <div className="sm:hidden px-4 pb-3 relative">
              <Search className={`absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted} z-10`} />
              <Input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search anything..."
                className={`pl-10 h-11 text-sm ${inputBg} focus-visible:ring-accent`}
              />
              {searchOpen && searchResults.length > 0 && (
                <div className={`absolute top-full mt-1 left-4 right-4 rounded-lg border ${borderColor} ${isDark ? "bg-[hsl(215,50%,12%)]" : "bg-white"} shadow-xl z-50 overflow-hidden`}>
                  {searchResults.map(r => (
                    <button
                      key={r.url}
                      onMouseDown={() => { navigate(r.url); setSearchQuery(""); setSearchOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${isDark ? "hover:bg-white/5 text-white/70" : "hover:bg-gray-50 text-gray-700"} transition-colors`}
                    >
                      <r.icon className="w-4 h-4 text-accent" />
                      <div className="text-left">
                        <span className="font-medium">{r.title}</span>
                        <span className={`block text-xs ${textSecondary}`}>{r.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </div>

          {isLocked && <TrialLockOverlay isDark={isDark} />}

          {/* Dashboard Footer */}
          <footer className={`border-t ${borderColor} px-4 md:px-8 py-4 shrink-0`}>
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 ${textMuted} text-xs`}>
              <span>© {new Date().getFullYear()} Darker. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="mailto:support@darker.com" className="hover:opacity-70 transition-colors">Support</a>
                <a href="mailto:support@darker.com?subject=Feedback" className="hover:opacity-70 transition-colors">Feedback</a>
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
