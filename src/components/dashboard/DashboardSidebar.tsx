import { useEffect, useState } from "react";
import {
  Building2, Share2, Wrench, PuzzleIcon, Clock, Camera, Star, Settings, LogOut,
  Bug, HelpCircle, CalendarDays, Users, Sun, Moon, LayoutDashboard, Lock,
} from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import darkerLogo from "@/assets/darker-logo.png";
import { cn } from "@/lib/utils";

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
  const location = useLocation();
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

  const isActive = (url: string) => {
    if (url === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(url);
  };

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
      <div className={`px-5 py-4 lg:py-5 border-b ${isDark ? "border-white/[0.06]" : "border-[hsl(214,20%,92%)]"}`}>
        <img src={darkerLogo} alt="Darker" className="h-10 lg:h-7" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={`${isDark ? "text-white/20" : "text-[hsl(215,16%,60%)]"} text-[11px] lg:text-[10px] uppercase tracking-[0.15em] px-5 mt-5 mb-3 lg:mt-4 lg:mb-2 font-semibold`}>
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item, idx) => {
                const isItemLocked = !trialActive && !("alwaysUnlocked" in item && item.alwaysUnlocked);
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
                  >
                    <SidebarMenuButton asChild>
                      <RouterNavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={cn(
                          "flex items-center gap-3.5 lg:gap-3 px-4 py-3 lg:py-2.5 rounded-xl mx-2 transition-all duration-200",
                          active
                            ? isDark
                              ? "text-[hsl(217,91%,60%)] font-semibold"
                              : "text-[hsl(217,91%,50%)] font-semibold"
                            : isDark
                              ? "text-white/45 hover:text-white/80"
                              : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,15%)]"
                        )}
                      >
                        {/* Icon: no bg unless active, then accent circle */}
                        <div
                          className={cn(
                            "w-9 h-9 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                            active
                              ? isDark
                                ? "bg-[hsla(217,91%,60%,0.12)]"
                                : "bg-[hsl(217,91%,94%)]"
                              : "bg-transparent"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-[20px] h-[20px] lg:w-[16px] lg:h-[16px] transition-colors duration-200",
                              active
                                ? "text-[hsl(217,91%,60%)]"
                                : isDark
                                  ? "text-white/40"
                                  : "text-[hsl(215,16%,55%)]"
                            )}
                            strokeWidth={active ? 2 : 1.5}
                          />
                        </div>
                        <span className="text-[15px] lg:text-[13px] tracking-tight">{item.title}</span>
                        {isItemLocked && (
                          <Lock
                            className={`w-3.5 h-3.5 ml-auto ${isDark ? "text-white/10" : "text-[hsl(215,16%,80%)]"} shrink-0`}
                            strokeWidth={1.5}
                          />
                        )}
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings + Help — same clean style */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => navigate("/dashboard/account")}
                    className={cn(
                      "flex items-center gap-3.5 lg:gap-3 px-4 py-3 lg:py-2.5 rounded-xl mx-2 transition-all duration-200 w-full",
                      isActive("/dashboard/account")
                        ? isDark ? "text-[hsl(217,91%,60%)] font-semibold" : "text-[hsl(217,91%,50%)] font-semibold"
                        : isDark ? "text-white/35 hover:text-white/70" : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,15%)]"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                      isActive("/dashboard/account")
                        ? isDark ? "bg-[hsla(217,91%,60%,0.12)]" : "bg-[hsl(217,91%,94%)]"
                        : "bg-transparent"
                    )}>
                      <Settings className={cn("w-[20px] h-[20px] lg:w-[16px] lg:h-[16px]",
                        isActive("/dashboard/account") ? "text-[hsl(217,91%,60%)]" : isDark ? "text-white/35" : "text-[hsl(215,16%,55%)]"
                      )} strokeWidth={isActive("/dashboard/account") ? 2 : 1.5} />
                    </div>
                    <span className="text-[15px] lg:text-[13px] tracking-tight">Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={onNeedHelp}
                    className={cn(
                      "flex items-center gap-3.5 lg:gap-3 px-4 py-3 lg:py-2.5 rounded-xl mx-2 transition-all duration-200 w-full",
                      isDark ? "text-white/35 hover:text-white/70" : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,15%)]"
                    )}
                  >
                    <div className="w-9 h-9 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center shrink-0 bg-transparent">
                      <HelpCircle className={cn("w-[20px] h-[20px] lg:w-[16px] lg:h-[16px]",
                        isDark ? "text-white/35" : "text-[hsl(215,16%,55%)]"
                      )} strokeWidth={1.5} />
                    </div>
                    <span className="text-[15px] lg:text-[13px] tracking-tight">Help</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom section */}
      <div className={`border-t ${isDark ? "border-white/[0.04]" : "border-[hsl(214,20%,92%)]"}`}>
        {/* Mobile: 4 horizontal icon buttons */}
        <div className="px-3 py-3 lg:hidden">
          <div className="flex items-center justify-around">
            {[
              { label: dashboardTheme === "dark" ? "Light Mode" : "Dark Mode", icon: dashboardTheme === "dark" ? Sun : Moon, onClick: onToggleTheme },
              { label: "Report A Bug", icon: Bug, onClick: onReportBug },
              { label: "Need Help?", icon: HelpCircle, onClick: onNeedHelp },
              { label: "Sign Out", icon: LogOut, onClick: handleSignOut },
            ].map((action) => (
              <div key={action.label} className="relative group/action">
                <button
                  onClick={action.onClick}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
                    isDark
                      ? "text-white/30 hover:text-white/70 hover:bg-white/[0.06]"
                      : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
                  }`}
                >
                  <action.icon className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover/action:opacity-100 pointer-events-none transition-opacity duration-200 ${
                  isDark ? "bg-white/10 text-white/80 backdrop-blur-sm" : "bg-[hsl(215,25%,20%)] text-white"
                }`}>
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: stacked utility buttons */}
        <div className="hidden lg:block px-3 py-2 space-y-0.5">
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-3 w-full px-4 py-2 text-[13px] rounded-xl transition-all duration-200 ${
              isDark ? "text-white/25 hover:text-white/60 hover:bg-white/[0.03]" : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
            }`}
          >
            {dashboardTheme === "dark" ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
            <span>{dashboardTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={onReportBug}
            className={`flex items-center gap-3 w-full px-4 py-2 text-[13px] rounded-xl transition-all duration-200 ${
              isDark ? "text-white/25 hover:text-amber-400/80 hover:bg-white/[0.03]" : "text-[hsl(215,16%,55%)] hover:text-amber-600 hover:bg-[hsl(214,20%,96%)]"
            }`}
          >
            <Bug className="w-4 h-4" strokeWidth={1.5} />
            <span>Report A Bug</span>
          </button>
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 w-full px-4 py-2 text-[13px] rounded-xl transition-all duration-200 ${
              isDark ? "text-white/15 hover:text-red-400/70 hover:bg-white/[0.03]" : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Business branding */}
        <div className={`px-5 py-3.5 border-t ${isDark ? "border-white/[0.04]" : "border-[hsl(214,20%,92%)]"}`}>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Business" className="w-9 h-9 lg:w-7 lg:h-7 rounded-lg object-cover" style={{ border: `1px solid ${isDark ? "hsla(217,91%,60%,0.15)" : "hsl(214,20%,90%)"}` }} />
            ) : (
              <div
                className="w-9 h-9 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: isDark ? "hsla(217,91%,60%,0.08)" : "hsl(217,91%,96%)",
                  border: `1px solid ${isDark ? "hsla(217,91%,60%,0.15)" : "hsl(214,20%,90%)"}`,
                }}
              >
                <Building2 className={`w-4 h-4 lg:w-3.5 lg:h-3.5 ${isDark ? "text-accent/50" : "text-[hsl(217,91%,60%)]"}`} strokeWidth={1.5} />
              </div>
            )}
            <span className={`text-[14px] lg:text-[12px] truncate flex-1 font-medium ${isDark ? "text-white/30" : "text-[hsl(215,16%,45%)]"}`}>
              {businessName || "Your Business"}
            </span>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
