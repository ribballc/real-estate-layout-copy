import { useEffect, useState } from "react";
import {
  Building2, Wrench, Clock, Camera, Star, Settings, LogOut,
  Bug, HelpCircle, CalendarDays, Users, Sun, Moon, LayoutDashboard, Lock,
  Bell, Globe, ChevronLeft, ChevronRight, KanbanSquare, ClipboardList,
} from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import darkerLogo from "@/assets/darker-logo.png";
import darkerLogoDark from "@/assets/darker-logo-dark.png";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, alwaysUnlocked: true },
  { title: "Business Info", url: "/dashboard/business", icon: Building2, alwaysUnlocked: true },
  { title: "Website", url: "/dashboard/website", icon: Globe, alwaysUnlocked: true },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Jobs", url: "/dashboard/jobs", icon: KanbanSquare },
  { title: "Estimates", url: "/dashboard/estimates", icon: ClipboardList },
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobile?: boolean;
}

const DashboardSidebar = ({
  dashboardTheme = "dark",
  onToggleTheme,
  onReportBug,
  onNeedHelp,
  collapsed = false,
  onToggleCollapse,
  mobile = false,
}: DashboardSidebarProps) => {
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

  const badgeMap: Record<string, number> = {
    "/dashboard/calendar": newBookingsCount,
  };

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 border-r relative h-screen sticky top-0",
        mobile ? "" : "hidden lg:flex",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,92%)]"
      )}
      style={{
        width: collapsed ? 64 : 256,
        transition: "width 200ms ease",
        background: isDark
          ? "linear-gradient(180deg, hsl(215 50% 8%) 0%, hsl(217 33% 12%) 100%)"
          : "hsl(0, 0%, 100%)",
      }}
    >
      {/* Collapse toggle — hidden in mobile sheet */}
      {!mobile && <button
        onClick={onToggleCollapse}
        className={cn(
          "absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-colors duration-150",
          isDark
            ? "bg-[hsl(217,33%,16%)] border-[hsla(215,25%,25%,1)] text-white/50 hover:text-white/80 hover:bg-[hsl(217,33%,20%)]"
            : "bg-white border-[hsl(214,20%,88%)] text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,96%)]"
        )}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
          : <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
        }
      </button>}

      {/* Logo */}
      <div className={cn(
        "px-5 py-5 border-b flex items-center",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,92%)]",
        collapsed ? "justify-center px-0" : "gap-3"
      )}>
        {collapsed ? (
          <img
            src={isDark ? darkerLogo : darkerLogoDark}
            alt="Darker"
            className="h-6 w-6 object-contain"
          />
        ) : (
          <img
            src={isDark ? darkerLogo : darkerLogoDark}
            alt="Darker"
            className="h-6 object-contain"
          />
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 pt-4">
        <ul className="space-y-0.5">
          {items.map((item, idx) => {
            const isItemLocked = !trialActive && !("alwaysUnlocked" in item && item.alwaysUnlocked);
            const active = isActive(item.url);
            const badge = badgeMap[item.url] || 0;
            return (
              <li
                key={item.title}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
              >
                <RouterNavLink
                  to={item.url}
                  end={item.url === "/dashboard"}
                  title={collapsed ? item.title : undefined}
                  className={cn(
                    "flex items-center rounded-xl group/nav-item transition-all duration-150 ease-in-out",
                    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                    active
                      ? isDark
                        ? "bg-[hsla(217,91%,60%,0.12)] border-l-[3px] border-l-[hsl(217,91%,60%)] text-[hsl(217,91%,60%)]"
                        : "bg-[hsla(217,91%,60%,0.08)] border-l-[3px] border-l-[hsl(217,91%,60%)] text-[hsl(217,91%,60%)]"
                      : isDark
                        ? "border-l-[3px] border-l-transparent text-[hsla(0,0%,100%,0.5)] hover:text-[hsl(217,91%,60%)] hover:bg-[hsla(255,255,255,0.06)]"
                        : "border-l-[3px] border-l-transparent text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsla(0,0%,0%,0.04)]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-[18px] h-[18px] transition-colors duration-150 ease-in-out flex-shrink-0",
                      active
                        ? "text-[hsl(217,91%,60%)]"
                        : isDark
                          ? "text-[hsla(0,0%,100%,0.4)] group-hover/nav-item:text-[hsl(217,91%,60%)]"
                          : "text-[hsl(215,16%,60%)]"
                    )}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  {!collapsed && (
                    <>
                      <span className={cn(
                        "text-[14px] tracking-tight flex-1",
                        active ? "font-semibold" : "font-medium"
                      )}>
                        {item.title}
                      </span>
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
                    </>
                  )}
                  {collapsed && badge > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[hsl(0,84%,60%)]" />
                  )}
                </RouterNavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom utilities */}
      <div className="px-2 pb-2 mt-auto space-y-0.5">
        {/* Settings */}
        <button
          onClick={() => navigate("/dashboard/account")}
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center rounded-xl transition-all duration-150 w-full",
            collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
            isActive("/dashboard/account")
              ? isDark
                ? "bg-[hsla(217,91%,60%,0.12)] text-[hsl(217,91%,60%)]"
                : "bg-[hsla(217,91%,60%,0.08)] text-[hsl(217,91%,60%)]"
              : isDark
                ? "text-[hsla(0,0%,100%,0.4)] hover:text-[hsla(0,0%,100%,0.7)] hover:bg-[hsla(0,0%,100%,0.04)]"
                : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,97%)]"
          )}
        >
          <Settings className={cn(
            "w-[18px] h-[18px]",
            isActive("/dashboard/account") ? "text-[hsl(217,91%,60%)]" : isDark ? "text-[hsla(0,0%,100%,0.35)]" : "text-[hsl(215,16%,60%)]"
          )} strokeWidth={isActive("/dashboard/account") ? 2 : 1.5} />
          {!collapsed && (
            <span className={cn("text-[14px] tracking-tight", isActive("/dashboard/account") ? "font-semibold" : "font-medium")}>Settings</span>
          )}
        </button>
        {/* Help */}
        <button
          onClick={onNeedHelp}
          title={collapsed ? "Help" : undefined}
          className={cn(
            "flex items-center rounded-xl transition-all duration-150 w-full",
            collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
            isDark
              ? "text-[hsla(0,0%,100%,0.4)] hover:text-[hsla(0,0%,100%,0.7)] hover:bg-[hsla(0,0%,100%,0.04)]"
              : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,97%)]"
          )}
        >
          <HelpCircle className={cn("w-[18px] h-[18px]", isDark ? "text-[hsla(0,0%,100%,0.35)]" : "text-[hsl(215,16%,60%)]")} strokeWidth={1.5} />
          {!collapsed && <span className="text-[14px] tracking-tight font-medium">Help</span>}
        </button>
      </div>

      {/* Footer */}
      <div className={cn("border-t px-2 py-2", isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,92%)]")}>
        {collapsed ? (
          /* Collapsed: icon-only actions */
          <div className="flex flex-col items-center gap-1">
            <button onClick={onToggleTheme} title={isDark ? "Light Mode" : "Dark Mode"} className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
              isDark ? "text-[hsla(0,0%,100%,0.3)] hover:text-[hsla(0,0%,100%,0.7)] hover:bg-[hsla(0,0%,100%,0.06)]"
                : "text-[hsl(215,16%,55%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
            )}>
              {isDark ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
            </button>
            <button onClick={onReportBug} title="Report A Bug" className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
              isDark ? "text-[hsla(0,0%,100%,0.3)] hover:text-amber-400/80 hover:bg-[hsla(0,0%,100%,0.04)]"
                : "text-[hsl(215,16%,55%)] hover:text-amber-600 hover:bg-[hsl(214,20%,96%)]"
            )}>
              <Bug className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button onClick={handleSignOut} title="Sign Out" className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
              isDark ? "text-[hsla(0,0%,100%,0.2)] hover:text-red-400/70 hover:bg-[hsla(0,0%,100%,0.04)]"
                : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
            )}>
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          /* Expanded: full footer */
          <div className="space-y-0.5">
            {user?.email && (
              <div className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl",
                isDark ? "bg-[hsla(0,0%,100%,0.03)]" : "bg-[hsl(214,20%,97%)]"
              )}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                  style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-[12px] truncate text-white/40">
                  {user.email}
                </span>
              </div>
            )}
            <button
              onClick={onToggleTheme}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-xl transition-all duration-150",
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
                "flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-xl transition-all duration-150",
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
                "flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-xl transition-all duration-150",
                isDark
                  ? "text-[hsla(0,0%,100%,0.2)] hover:text-red-400/70 hover:bg-[hsla(0,0%,100%,0.04)]"
                  : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
              )}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
