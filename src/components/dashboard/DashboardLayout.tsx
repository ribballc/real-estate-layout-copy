import DashboardSidebar from "./DashboardSidebar";
import SupportChatbot, { type SupportChatbotHandle } from "./SupportChatbot";
import LockedPageOverlay from "./LockedPageOverlay";
import MobileBottomNav from "./MobileBottomNav";
import CommandBar from "./CommandBar";
import WelcomeModal from "./WelcomeModal";
import PageIntroBanner from "./PageIntroBanner";
import UpgradeModal from "./UpgradeModal";
import { UpgradeModalProvider } from "@/contexts/UpgradeModalContext";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings,
  TrendingUp, Users, CalendarDays, Search, Menu, KanbanSquare, ClipboardList, FlaskConical,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import darkerLogo from "@/assets/darker-logo.png";
import darkerLogoDark from "@/assets/darker-logo-dark.png";

const pageTitles: Record<string, { title: string; description: string; icon: any }> = {
  "/dashboard": { title: "Dashboard", description: "Overview of your business performance", icon: TrendingUp },
  "/dashboard/business": { title: "Business Info", description: "Manage your brand, address and service areas", icon: Building2 },
  "/dashboard/calendar": { title: "Calendar", description: "View and manage your bookings", icon: CalendarDays },
  "/dashboard/jobs": { title: "Jobs", description: "Manage your work orders", icon: KanbanSquare },
  "/dashboard/estimates": { title: "Estimates", description: "Create and manage customer estimates", icon: ClipboardList },
  "/dashboard/customers": { title: "Customers", description: "Manage your customer relationships", icon: Users },
  "/dashboard/services": { title: "Services", description: "Manage your service offerings and pricing", icon: Wrench },
  "/dashboard/photos": { title: "Photos", description: "Upload your portfolio and gallery", icon: Camera },
  "/dashboard/testimonials": { title: "Testimonials", description: "Manage customer reviews", icon: Star },
  "/dashboard/offer-lab": { title: "Offer Lab", description: "Proven strategies to 3x your bookings and revenue", icon: FlaskConical },
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
  const { toast } = useToast();
  const page = pageTitles[location.pathname] || pageTitles["/dashboard"];
  const PageIcon = page.icon;
  const [dashboardTheme, setDashboardTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("dashboard-theme") as "dark" | "light") || "light";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const chatbotRef = useRef<SupportChatbotHandle>(null);
  const [trialActive, setTrialActive] = useState<boolean | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [firstName, setFirstName] = useState("");

  // Entry animation — only on very first visit
  const [showEntryAnim] = useState(() => !localStorage.getItem("darker_dashboard_intro_seen"));

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("trial_active, onboarding_complete, business_name").eq("user_id", user.id).single(),
      supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(),
    ]).then(([profileRes, roleRes]) => {
      setTrialActive(profileRes.data?.trial_active ?? false);
      setOnboardingComplete(profileRes.data?.onboarding_complete ?? false);
      setIsAdmin(!!roleRes.data);
      // Extract first word of business name as a rough first name for welcome
      const bName = profileRes.data?.business_name || "";
      setFirstName(bName.split(" ")[0] || "");
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(location.search);
    const isPostCheckout = params.get("checkout") === "success";
    if (isPostCheckout) {
      window.history.replaceState({}, "", "/dashboard");
    }
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("check-subscription");
        if (!error && data?.subscribed) {
          setTrialActive(true);
          if (isPostCheckout) {
            toast({
              title: "You're live! Your free trial has started.",
              description: "Your site is now active. Start taking bookings.",
            });
          }
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

  // Set html background for overscroll matching
  useEffect(() => {
    const color = dashboardTheme === "dark" ? "hsl(215, 50%, 10%)" : "hsl(210, 40%, 98%)";
    document.documentElement.style.backgroundColor = color;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, [dashboardTheme]);

  const UNLOCKED_PATHS = ["/dashboard", "/dashboard/business", "/dashboard/account"];
  const isLocked = !isAdmin && trialActive === false && !UNLOCKED_PATHS.includes(location.pathname);

  const toggleTheme = () => {
    setDashboardTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("dashboard-theme", next);
      return next;
    });
  };

  // Cmd+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isDark = dashboardTheme === "dark";

  return (
    <UpgradeModalProvider>
    <>
      <div
        className={`min-h-screen flex w-full ${isDark ? "dashboard-dark" : "dashboard-light"} ${showEntryAnim ? "animate-dashboard-entry" : ""}`}
        style={{
          background: isDark
            ? "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 14%) 100%)"
            : "hsl(210, 40%, 98%)",
        }}
      >
        <DashboardSidebar
          dashboardTheme={dashboardTheme}
          onToggleTheme={toggleTheme}
          onReportBug={() => chatbotRef.current?.openWithPrompt("I'd like to report a bug I found:")}
          onNeedHelp={() => chatbotRef.current?.openWithPrompt("I need help with:")}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => {
            setSidebarCollapsed(prev => {
              const next = !prev;
              localStorage.setItem("sidebar-collapsed", String(next));
              return next;
            });
          }}
        />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header bar */}
          <header
            className={`shrink-0 border-b ${isDark ? "border-white/10" : "border-[hsl(214,20%,92%)]"}`}
            style={{
              background: isDark ? "hsla(215,50%,10%,0.8)" : "hsl(0, 0%, 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="h-14 flex items-center gap-3 px-4 md:px-8">
              {/* Mobile: Logo left, hamburger right */}
              <div className="flex md:hidden items-center justify-between w-full">
                <img src={isDark ? darkerLogo : darkerLogoDark} alt="Darker" className="h-7" />
                <div className="flex items-center gap-1">
                  <button onClick={() => setMobileOpen(true)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "text-white/60 hover:text-white hover:bg-white/[0.06]" : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"}`}><Menu className="w-5 h-5" /></button>
                </div>
              </div>
              {/* Desktop: standard header */}
              <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
                <button onClick={() => setSidebarCollapsed(prev => { const next = !prev; localStorage.setItem("sidebar-collapsed", String(next)); return next; })} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDark ? "text-white/60 hover:text-white hover:bg-white/[0.06]" : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"}`}><Menu className="w-4 h-4" /></button>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: isDark ? "hsla(217,91%,60%,0.08)" : "hsl(217,91%,96%)",
                    border: `1px solid ${isDark ? "hsla(217,91%,60%,0.12)" : "hsl(217,91%,90%)"}`,
                  }}
                >
                  <PageIcon className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h1 className={`font-semibold text-sm truncate tracking-tight ${isDark ? "text-white" : "text-[hsl(215,25%,12%)]"}`}>
                    {page.title}
                  </h1>
                  <p className={`text-xs ${isDark ? "text-white/40" : "text-[hsl(215,16%,55%)]"}`}>
                    {page.description}
                  </p>
                </div>
              </div>
              {/* Desktop search trigger → opens command bar */}
              <button
                onClick={() => setCommandBarOpen(true)}
                className={`hidden md:flex items-center gap-2 px-3 h-9 rounded-xl border text-sm transition-colors w-56 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/[0.08] hover:text-white/60"
                    : "bg-[hsl(210,40%,98%)] border-[hsl(214,20%,90%)] text-[hsl(215,16%,55%)] hover:bg-[hsl(214,20%,96%)]"
                }`}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left truncate">Search...</span>
                <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${isDark ? "bg-white/10 text-white/30" : "bg-[hsl(214,20%,92%)] text-[hsl(215,16%,50%)]"}`}>
                  ⌘K
                </kbd>
              </button>
              
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <PageIntroBanner path={location.pathname} />
            {isLocked ? (
              <LockedPageOverlay path={location.pathname} isDark={isDark} />
            ) : (
              <Outlet context={{ chatbotRef, isDark }} />
            )}
          </div>

          {/* Dashboard Footer — hidden on mobile where bottom nav shows */}
          <footer className={`hidden md:block border-t px-4 md:px-8 py-4 shrink-0 ${isDark ? "border-white/10" : "border-[hsl(214,20%,92%)]"}`}>
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${isDark ? "text-white/30" : "text-[hsl(215,16%,60%)]"}`}>
              <span>© {new Date().getFullYear()} Darker. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <a href="mailto:support@darker.com" className="hover:opacity-70 transition-colors">Support</a>
                <a href="mailto:support@darker.com?subject=Feedback" className="hover:opacity-70 transition-colors">Feedback</a>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav isDark={isDark} currentPath={location.pathname} onNavigate={navigate} />

          <SupportChatbot ref={chatbotRef} />
        </main>
      </div>

      {/* Mobile slide-out sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] border-none" style={{
          background: isDark
            ? "linear-gradient(180deg, hsl(215 50% 8%) 0%, hsl(217 33% 12%) 100%)"
            : "hsl(0, 0%, 100%)",
        }}>
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Dashboard navigation sidebar</SheetDescription>
          </VisuallyHidden>
          <DashboardSidebar
            dashboardTheme={dashboardTheme}
            onToggleTheme={toggleTheme}
            onReportBug={() => { setMobileOpen(false); chatbotRef.current?.openWithPrompt("I'd like to report a bug I found:"); }}
            onNeedHelp={() => { setMobileOpen(false); chatbotRef.current?.openWithPrompt("I need help with:"); }}
            collapsed={false}
            onToggleCollapse={() => setMobileOpen(false)}
            mobile
          />
        </SheetContent>
      </Sheet>

      <CommandBar open={commandBarOpen} onClose={() => setCommandBarOpen(false)} isDark={isDark} />

      {/* First-visit welcome modal */}
      {showEntryAnim && <WelcomeModal firstName={firstName} isDark={isDark} />}
      <UpgradeModal />
    </>
    </UpgradeModalProvider>
  );
};

export default DashboardLayout;
