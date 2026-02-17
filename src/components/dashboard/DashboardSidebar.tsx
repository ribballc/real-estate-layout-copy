import { useEffect, useState } from "react";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings, LogOut,
  Bug, HelpCircle, CalendarDays, Users, Sun, Moon, LayoutDashboard, Lock,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import darkerLogo from "@/assets/darker-logo.png";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, alwaysUnlocked: true },
  { title: "Business Info", url: "/dashboard/business", icon: Building2, alwaysUnlocked: true },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Services", url: "/dashboard/services", icon: Wrench },
  { title: "Photos", url: "/dashboard/photos", icon: Camera },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Star },
];

interface DashboardSidebarProps {
  dashboardTheme?: "dark" | "light";
  onToggleTheme?: () => void;
  onReportBug?: () => void;
  onNeedHelp?: () => void;
}

const DashboardSidebar = ({ dashboardTheme = "dark", onToggleTheme, onReportBug, onNeedHelp }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [trialActive, setTrialActive] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("logo_url, business_name, trial_active").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.logo_url) setLogoUrl(data.logo_url);
      if (data?.business_name) setBusinessName(data.business_name);
      setTrialActive(data?.trial_active ?? false);
    });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isDark = dashboardTheme === "dark";

  return (
    <Sidebar
      className={`border-r ${isDark ? "border-white/[0.06]" : "border-[hsl(214,20%,92%)]"}`}
      style={{
        background: isDark
          ? "linear-gradient(180deg, hsl(215 50% 8%) 0%, hsl(217 33% 12%) 100%)"
          : "hsl(0, 0%, 100%)",
      }}
    >
      {/* Logo */}
      <div className={`p-5 lg:p-5 border-b ${isDark ? "border-white/[0.06]" : "border-[hsl(214,20%,92%)]"}`}>
        <div className="flex items-center gap-3">
          <img src={darkerLogo} alt="Darker" className="h-12 lg:h-8" />
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={`${isDark ? "text-white/20" : "text-[hsl(215,16%,60%)]"} text-xs lg:text-[10px] uppercase tracking-[0.2em] px-5 mt-4 mb-2 lg:mt-3 lg:mb-1 font-semibold`}>
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isItemLocked = !trialActive && !("alwaysUnlocked" in item && item.alwaysUnlocked);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={`group/nav flex items-center gap-4 lg:gap-3 px-4 py-4 lg:py-2.5 text-[17px] lg:text-[13px] rounded-xl transition-all duration-200 mx-2 relative overflow-hidden ${
                          isDark
                            ? "text-white/40 hover:text-white/90 hover:bg-white/[0.04]"
                            : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(217,91%,97%)]"
                        }`}
                        activeClassName={isDark
                          ? "!bg-accent/10 !text-white font-medium !border-accent/20"
                          : "!bg-[hsl(217,91%,96%)] !text-[hsl(217,91%,50%)] font-medium !border-[hsl(217,91%,85%)]"
                        }
                        style={{ border: "1px solid transparent" }}
                      >
                        <div
                          className={`w-12 h-12 lg:w-8 lg:h-8 rounded-xl lg:rounded-lg flex items-center justify-center transition-all duration-300 group-hover/nav:scale-105`}
                          style={{
                            background: isDark ? "hsla(217,91%,60%,0.06)" : "hsla(217,91%,60%,0.06)",
                          }}
                        >
                          <item.icon className="w-6 h-6 lg:w-4 lg:h-4 shrink-0 transition-all duration-200 opacity-60 group-hover/nav:opacity-100" strokeWidth={1.5} />
                        </div>
                        <span className="flex-1 tracking-tight font-medium lg:font-normal">{item.title}</span>
                        {isItemLocked && <Lock className={`w-4 h-4 lg:w-3 lg:h-3 ${isDark ? "text-white/10" : "text-[hsl(215,16%,80%)]"} shrink-0`} strokeWidth={1.5} />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom section */}
      <div className={`mt-auto border-t ${isDark ? "border-white/[0.04]" : "border-[hsl(214,20%,92%)]"}`}>
        {/* Theme toggle */}
        <div className="px-3 pt-3">
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-4 lg:gap-3 w-full px-4 py-3.5 lg:py-2 text-[17px] lg:text-[13px] rounded-xl transition-all duration-200 ${
              isDark
                ? "text-white/25 hover:text-white/60 hover:bg-white/[0.03]"
                : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
            }`}
          >
            {dashboardTheme === "dark" ? <Sun className="w-6 h-6 lg:w-4 lg:h-4" strokeWidth={1.5} /> : <Moon className="w-6 h-6 lg:w-4 lg:h-4" strokeWidth={1.5} />}
            <span>{dashboardTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* Help links */}
        <div className="p-3 space-y-0.5">
          <button
            onClick={onReportBug}
            className={`flex items-center gap-4 lg:gap-3 w-full px-4 py-3.5 lg:py-2 text-[17px] lg:text-[13px] rounded-xl transition-all duration-200 ${
              isDark
                ? "text-white/25 hover:text-amber-400/80 hover:bg-white/[0.03]"
                : "text-[hsl(215,16%,55%)] hover:text-amber-600 hover:bg-[hsl(214,20%,96%)]"
            }`}
          >
            <Bug className="w-6 h-6 lg:w-4 lg:h-4" strokeWidth={1.5} />
            <span>Report A Bug</span>
          </button>
          <button
            onClick={onNeedHelp}
            className={`flex items-center gap-4 lg:gap-3 w-full px-4 py-3.5 lg:py-2 text-[17px] lg:text-[13px] rounded-xl transition-all duration-200 ${
              isDark
                ? "text-white/25 hover:text-white/60 hover:bg-white/[0.03]"
                : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
            }`}
          >
            <HelpCircle className="w-6 h-6 lg:w-4 lg:h-4" strokeWidth={1.5} />
            <span>Need Help?</span>
          </button>
        </div>

        {/* Sign out */}
        <div className="px-3 pb-3">
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-4 lg:gap-3 w-full px-4 py-3.5 lg:py-2 text-[17px] lg:text-[13px] rounded-xl transition-all duration-200 ${
              isDark
                ? "text-white/15 hover:text-red-400/70 hover:bg-white/[0.03]"
                : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <LogOut className="w-6 h-6 lg:w-4 lg:h-4" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Business logo + Account gear */}
        <div className={`px-5 py-4 border-t ${isDark ? "border-white/[0.04]" : "border-[hsl(214,20%,92%)]"}`}>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Business" className="w-11 h-11 lg:w-8 lg:h-8 rounded-xl object-cover" style={{ border: `1px solid ${isDark ? "hsla(217,91%,60%,0.15)" : "hsl(214,20%,90%)"}` }} />
            ) : (
              <div
                className="w-11 h-11 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: isDark ? "hsla(217,91%,60%,0.08)" : "hsl(217,91%,96%)",
                  border: `1px solid ${isDark ? "hsla(217,91%,60%,0.15)" : "hsl(214,20%,90%)"}`,
                }}
              >
                <Building2 className={`w-5 h-5 lg:w-3.5 lg:h-3.5 ${isDark ? "text-accent/50" : "text-[hsl(217,91%,60%)]"}`} strokeWidth={1.5} />
              </div>
            )}
            <span className={`text-[15px] lg:text-[12px] truncate flex-1 font-medium ${isDark ? "text-white/25" : "text-[hsl(215,16%,45%)]"}`}>
              {businessName || "Your Business"}
            </span>
            <button
              onClick={() => navigate("/dashboard/account")}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
                isDark
                  ? "text-white/15 hover:text-white/50 hover:bg-white/[0.04]"
                  : "text-[hsl(215,16%,65%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
              }`}
              title="Account Settings"
            >
              <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
