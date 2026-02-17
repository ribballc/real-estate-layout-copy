import { useEffect, useState } from "react";
import {
  Building2, Wrench, Clock, Camera, Star, Settings, LogOut,
  Bug, HelpCircle, CalendarDays, Users, Sun, Moon, LayoutDashboard, Lock,
  Bell,
} from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import darkerLogo from "@/assets/darker-logo.png";
import darkerLogoDark from "@/assets/darker-logo-dark.png";
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
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("logo_url, business_name, trial_active").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.logo_url) setLogoUrl(data.logo_url);
      if (data?.business_name) setBusinessName(data.business_name);
      setTrialActive(data?.trial_active ?? false);
    });
    // Fetch new bookings count (last 24h)
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", yesterday).then(({ count }) => {
      setNewBookingsCount(count ?? 0);
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

  // Badge map — show notification count on specific items
  const badgeMap: Record<string, number> = {
    "/dashboard/calendar": newBookingsCount,
  };

  return (
    <Sidebar
      className={cn(
        "border-r",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,92%)]"
      )}
      style={{
        background: isDark
          ? "linear-gradient(180deg, hsl(215 50% 8%) 0%, hsl(217 33% 12%) 100%)"
          : "hsl(0, 0%, 100%)",
      }}
      data-theme={dashboardTheme}
    >
      {/* Logo block — square icon like Exonad */}
      <div className={cn(
        "px-5 py-5 border-b flex items-center gap-3",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,92%)]"
      )}>
        <img
          src={isDark ? darkerLogoDark : darkerLogo}
          alt="Darker"
          className="h-6 object-contain"
        />
      </div>

      <SidebarContent className="px-3 pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item, idx) => {
                const isItemLocked = !trialActive && !("alwaysUnlocked" in item && item.alwaysUnlocked);
                const active = isActive(item.url);
                const badge = badgeMap[item.url] || 0;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
                  >
                    <SidebarMenuButton asChild>
                      <RouterNavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/nav-item",
                          active
                            ? isDark
                              ? "bg-[hsla(217,91%,60%,0.1)]"
                              : "bg-[hsl(217,91%,96%)]"
                            : "bg-transparent",
                          active
                            ? isDark
                              ? "text-[hsl(217,91%,60%)]"
                              : "text-[hsl(217,91%,50%)]"
                            : isDark
                              ? "text-[hsla(0,0%,100%,0.5)] hover:text-[hsla(0,0%,100%,0.8)] hover:bg-[hsla(0,0%,100%,0.04)]"
                              : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,97%)]"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-[18px] h-[18px] transition-colors duration-200 flex-shrink-0",
                            active
                              ? "text-[hsl(217,91%,60%)]"
                              : isDark
                                ? "text-[hsla(0,0%,100%,0.4)]"
                                : "text-[hsl(215,16%,60%)]"
                          )}
                          strokeWidth={active ? 2 : 1.5}
                        />
                        <span className={cn(
                          "text-[14px] tracking-tight flex-1",
                          active ? "font-semibold" : "font-medium"
                        )}>
                          {item.title}
                        </span>
                        {/* Notification badge */}
                        {badge > 0 && (
                          <span className="min-w-[20px] h-[20px] px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center bg-[hsl(0,84%,60%)] text-white">
                            {badge > 9 ? "9+" : badge}
                          </span>
                        )}
                        {isItemLocked && !badge && (
                          <Lock
                            className={cn(
                              "w-3.5 h-3.5 ml-auto flex-shrink-0",
                              isDark ? "text-[hsla(0,0%,100%,0.12)]" : "text-[hsl(215,16%,80%)]"
                            )}
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

        {/* Bottom utilities — pushed to bottom */}
        <SidebarGroup className="mt-auto pb-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => navigate("/dashboard/account")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full",
                      isActive("/dashboard/account")
                        ? isDark
                          ? "bg-[hsla(217,91%,60%,0.1)] text-[hsl(217,91%,60%)]"
                          : "bg-[hsl(217,91%,96%)] text-[hsl(217,91%,50%)]"
                        : isDark
                          ? "text-[hsla(0,0%,100%,0.4)] hover:text-[hsla(0,0%,100%,0.7)] hover:bg-[hsla(0,0%,100%,0.04)]"
                          : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,97%)]"
                    )}
                  >
                    <Settings className={cn(
                      "w-[18px] h-[18px]",
                      isActive("/dashboard/account") ? "text-[hsl(217,91%,60%)]" : isDark ? "text-[hsla(0,0%,100%,0.35)]" : "text-[hsl(215,16%,60%)]"
                    )} strokeWidth={isActive("/dashboard/account") ? 2 : 1.5} />
                    <span className={cn("text-[14px] tracking-tight", isActive("/dashboard/account") ? "font-semibold" : "font-medium")}>Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Help */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={onNeedHelp}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full",
                      isDark
                        ? "text-[hsla(0,0%,100%,0.4)] hover:text-[hsla(0,0%,100%,0.7)] hover:bg-[hsla(0,0%,100%,0.04)]"
                        : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,97%)]"
                    )}
                  >
                    <HelpCircle className={cn("w-[18px] h-[18px]", isDark ? "text-[hsla(0,0%,100%,0.35)]" : "text-[hsl(215,16%,60%)]")} strokeWidth={1.5} />
                    <span className="text-[14px] tracking-tight font-medium">Help</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer actions */}
      <div className={cn("border-t px-3 py-2", isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,92%)]")}>
        {/* Mobile: horizontal icon row */}
        <div className="flex lg:hidden items-center justify-around py-1">
          {[
            { label: isDark ? "Light" : "Dark", icon: isDark ? Sun : Moon, onClick: onToggleTheme },
            { label: "Bug", icon: Bug, onClick: onReportBug },
            { label: "Sign Out", icon: LogOut, onClick: handleSignOut },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95",
                isDark
                  ? "text-[hsla(0,0%,100%,0.3)] hover:text-[hsla(0,0%,100%,0.7)] hover:bg-[hsla(0,0%,100%,0.06)]"
                  : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
              )}
            >
              <action.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          ))}
        </div>
        {/* Desktop: stacked text buttons */}
        <div className="hidden lg:block space-y-0.5">
          <button
            onClick={onToggleTheme}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-xl transition-all duration-200",
              isDark
                ? "text-[hsla(0,0%,100%,0.3)] hover:text-[hsla(0,0%,100%,0.6)] hover:bg-[hsla(0,0%,100%,0.04)]"
                : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,97%)]"
            )}
          >
            {isDark ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={onReportBug}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-xl transition-all duration-200",
              isDark
                ? "text-[hsla(0,0%,100%,0.3)] hover:text-amber-400/80 hover:bg-[hsla(0,0%,100%,0.04)]"
                : "text-[hsl(215,16%,55%)] hover:text-amber-600 hover:bg-[hsl(214,20%,97%)]"
            )}
          >
            <Bug className="w-4 h-4" strokeWidth={1.5} />
            <span>Report A Bug</span>
          </button>
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-xl transition-all duration-200",
              isDark
                ? "text-[hsla(0,0%,100%,0.2)] hover:text-red-400/70 hover:bg-[hsla(0,0%,100%,0.04)]"
                : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
            )}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

export default DashboardSidebar;
