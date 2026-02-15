import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import SupportChatbot from "./SupportChatbot";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings,
  TrendingUp, Users, Eye, CalendarDays, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const pageTitles: Record<string, { title: string; description: string; icon: any }> = {
  "/dashboard": { title: "Business Info", description: "Manage your brand, address and service areas", icon: Building2 },
  "/dashboard/calendar": { title: "Calendar", description: "View and manage your bookings", icon: CalendarDays },
  "/dashboard/customers": { title: "Customers", description: "Manage your customer relationships", icon: Users },
  "/dashboard/social": { title: "Social Media", description: "Connect your social profiles", icon: Share2 },
  "/dashboard/services": { title: "Services", description: "Manage your service offerings and pricing", icon: Wrench },
  "/dashboard/add-ons": { title: "Add-ons", description: "Create add-on packages for services", icon: PuzzleIcon },
  "/dashboard/hours": { title: "Business Hours", description: "Set your weekly schedule", icon: Clock },
  "/dashboard/photos": { title: "Photos", description: "Upload your portfolio and gallery", icon: Camera },
  "/dashboard/testimonials": { title: "Testimonials", description: "Manage customer reviews", icon: Star },
  "/dashboard/account": { title: "Account", description: "Manage your account settings", icon: Settings },
};

const searchablePages = Object.entries(pageTitles).map(([url, info]) => ({ url, ...info }));

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

  const [stats, setStats] = useState({ services: 0, photos: 0, testimonials: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("photos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([s, p, t]) => {
      setStats({ services: s.count || 0, photos: p.count || 0, testimonials: t.count || 0 });
    });
  }, [user, location.pathname]);

  const isIndex = location.pathname === "/dashboard";

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isDark ? "" : "dashboard-light"}`} style={{ background: bg }}>
        <DashboardSidebar dashboardTheme={dashboardTheme} onToggleTheme={toggleTheme} />
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
            {/* Quick stats on index page */}
            {isIndex && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                {[
                  { label: "Services", value: stats.services, icon: Wrench, color: "hsl(217 91% 60%)" },
                  { label: "Photos", value: stats.photos, icon: Camera, color: "hsl(271 91% 65%)" },
                  { label: "Reviews", value: stats.testimonials, icon: Star, color: "hsl(45 93% 47%)" },
                  { label: "Page Views", value: "—", icon: Eye, color: "hsl(160 84% 39%)" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl border ${borderColor} ${cardBg} p-4 hover:opacity-90 transition-colors group`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${textSecondary} text-xs font-medium uppercase tracking-wider`}>{s.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${s.color}15` }}>
                        <s.icon className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${textPrimary}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <Outlet />
          </div>

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

          <SupportChatbot />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
