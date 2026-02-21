import { useEffect, useState } from "react";
import {
  Building2, Wrench, Camera, Star, Settings, LogOut,
  CalendarDays, Users, LayoutDashboard, Lock,
  Globe, ChevronLeft, ChevronRight, KanbanSquare, ClipboardList, FlaskConical, Zap, CreditCard,
} from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import darkerLogo from "@/assets/darker-logo.png";
import darkerLogoDark from "@/assets/darker-logo-dark.png";
import { cn } from "@/lib/utils";
import { useUpgradeModal } from "@/contexts/UpgradeModalContext";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  alwaysUnlocked?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, alwaysUnlocked: true },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Jobs", url: "/dashboard/jobs", icon: KanbanSquare },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Services", url: "/dashboard/services", icon: Wrench },
  { title: "Estimates", url: "/dashboard/estimates", icon: ClipboardList },
  { title: "Website", url: "/dashboard/website", icon: Globe, alwaysUnlocked: true },
  { title: "Business Info", url: "/dashboard/business", icon: Building2, alwaysUnlocked: true },
  { title: "Photos", url: "/dashboard/photos", icon: Camera },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Star },
  { title: "The Lab", url: "/dashboard/the-lab", icon: FlaskConical },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
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
  collapsed = false,
  onToggleCollapse,
  mobile = false,
}: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [trialActive, setTrialActive] = useState(false);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("trial_active").eq("user_id", user.id).single().then(({ data }) => {
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
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,32%,91%)]"
      )}
      style={{
        width: collapsed ? 64 : 256,
        transition: "width 200ms ease",
        background: isDark
          ? "linear-gradient(180deg, hsl(215 50% 8%) 0%, hsl(217 33% 11%) 100%)"
          : "hsl(0, 0%, 100%)",
        boxShadow: isDark
          ? "4px 0 24px hsla(0, 0%, 0%, 0.18)"
          : "4px 0 20px hsla(215, 25%, 12%, 0.05)",
      }}
    >
      {/* Collapse toggle */}
      {!mobile && (
        <button
          onClick={onToggleCollapse}
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-colors duration-150",
            isDark
              ? "bg-[hsl(217,33%,16%)] border-[hsla(215,25%,25%,1)] text-white/50 hover:text-white/80 hover:bg-[hsl(217,33%,20%)]"
              : "bg-white border-[hsl(214,32%,91%)] text-[hsl(215,14%,51%)] hover:text-[hsl(218,24%,23%)] hover:bg-[hsl(210,40%,98%)]"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} /> : <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />}
        </button>
      )}

      {/* Logo */}
      <div className={cn(
        "px-5 py-4 border-b flex items-center",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,32%,91%)]",
        collapsed ? "justify-center px-0" : "gap-3"
      )}>
        <img
          src={isDark ? darkerLogo : darkerLogoDark}
          alt="Darker"
          className={collapsed ? "h-6 w-6 object-contain" : "h-6 object-contain"}
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 pt-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isItemLocked = !trialActive && !item.alwaysUnlocked;
            const active = isActive(item.url);
            const badge = badgeMap[item.url] || 0;
            return (
              <li key={item.title} className="relative group/lock-tip">
                <RouterNavLink
                  to={item.url}
                  end={item.url === "/dashboard"}
                  title={collapsed ? item.title : undefined}
                  className={cn(
                    "flex rounded-xl group/nav-item transition-all duration-150 ease-in-out",
                    collapsed ? "items-center justify-center px-0 py-2.5" : "items-center gap-3 px-3 py-2.5",
                    isItemLocked && "opacity-60",
                    active
                      ? isDark
                        ? "bg-[hsla(217,91%,60%,0.12)] text-white font-semibold"
                        : "bg-[hsla(217,91%,60%,0.08)] text-[hsl(217,91%,60%)] font-semibold"
                      : isDark
                        ? "text-[hsla(0,0%,100%,0.65)] hover:text-[hsla(0,0%,100%,0.85)] hover:bg-[hsla(0,0%,100%,0.06)]"
                        : "text-[hsl(215,14%,51%)] hover:text-[hsl(218,24%,23%)] hover:bg-[hsl(210,40%,98%)]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-[18px] h-[18px] transition-colors duration-150 ease-in-out flex-shrink-0",
                      active
                        ? "text-[hsl(217,91%,60%)]"
                        : isDark
                          ? "text-[hsla(0,0%,100%,0.45)] group-hover/nav-item:text-[hsla(0,0%,100%,0.85)]"
                          : "text-[hsl(215,14%,51%)] group-hover/nav-item:text-[hsl(218,24%,23%)]"
                    )}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  {!collapsed && (
                    <>
                      <span className={cn("flex-1 text-[14px] tracking-tight leading-tight", active ? "font-semibold" : "font-medium")}>
                        {item.title}
                      </span>
                      {badge > 0 && (
                        <span className="min-w-[20px] h-[20px] px-1.5 rounded-md text-xs font-bold flex items-center justify-center bg-[hsl(0,84%,60%)] text-white">
                          {badge > 9 ? "9+" : badge}
                        </span>
                      )}
                      {isItemLocked && !badge && (
                        <Lock className={cn("w-3 h-3 flex-shrink-0", isDark ? "text-[hsla(0,0%,100%,0.2)]" : "text-[hsl(215,14%,51%)]")} strokeWidth={1.5} />
                      )}
                    </>
                  )}
                  {collapsed && badge > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[hsl(0,84%,60%)]" />
                  )}
                </RouterNavLink>
                {isItemLocked && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover/lock-tip:opacity-100 transition-opacity duration-150 z-50"
                    style={{ background: "hsl(215,50%,10%)", color: "white", boxShadow: "0 4px 12px hsla(0,0%,0%,0.3)" }}
                  >
                    {collapsed ? `${item.title} — ` : ""}Unlock with free trial
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar upgrade pill — visible when no trial/subscription */}
      {!trialActive && !collapsed && (
        <SidebarUpgradePill isDark={isDark} />
      )}

      {/* Settings */}
      <div className="px-2 pb-1">
        <RouterNavLink
          to="/dashboard/account"
          className={cn(
            "flex items-center rounded-xl transition-all duration-150 w-full",
            collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
            isActive("/dashboard/account")
              ? isDark
                ? "bg-[hsla(217,91%,60%,0.12)] text-white font-semibold"
                : "bg-[hsla(217,91%,60%,0.08)] text-[hsl(217,91%,60%)] font-semibold"
              : isDark
                ? "text-[hsla(0,0%,100%,0.65)] hover:text-[hsla(0,0%,100%,0.85)] hover:bg-[hsla(0,0%,100%,0.06)]"
                : "text-[hsl(215,14%,51%)] hover:text-[hsl(218,24%,23%)] hover:bg-[hsl(210,40%,98%)]"
          )}
        >
          <Settings
            className={cn("w-[18px] h-[18px]", isActive("/dashboard/account") ? "text-[hsl(217,91%,60%)]" : isDark ? "text-[hsla(0,0%,100%,0.45)]" : "text-[hsl(215,14%,51%)]")}
            strokeWidth={isActive("/dashboard/account") ? 2 : 1.5}
          />
          {!collapsed && <span className={cn("text-[14px] tracking-tight", isActive("/dashboard/account") ? "font-semibold" : "font-medium")}>Settings</span>}
        </RouterNavLink>
      </div>

      {/* Footer */}
      <div className={cn("border-t px-3 py-2.5", isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,32%,91%)]")}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1.5">
            {user?.email && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
                title={user.email}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150",
                isDark ? "text-[hsla(0,0%,100%,0.3)] hover:text-red-400/70 hover:bg-[hsla(0,0%,100%,0.04)]"
                  : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
              )}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {user?.email && (
              <>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className={cn("text-[12px] truncate flex-1", isDark ? "text-white/45" : "text-[hsl(215,14%,51%)]")}>
                  {user.email}
                </span>
              </>
            )}
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150",
                isDark ? "text-[hsla(0,0%,100%,0.3)] hover:text-red-400/70 hover:bg-[hsla(0,0%,100%,0.05)]"
                  : "text-[hsl(215,16%,65%)] hover:text-red-500 hover:bg-red-50"
              )}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

const SidebarUpgradePill = ({ isDark }: { isDark: boolean }) => {
  const { openUpgradeModal } = useUpgradeModal();

  return (
    <div className="px-2 pb-2">
      <button
        onClick={openUpgradeModal}
        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all hover:brightness-110 group"
        style={{
          background: isDark
            ? "linear-gradient(135deg, hsla(30,100%,50%,0.12) 0%, hsla(15,100%,50%,0.08) 100%)"
            : "linear-gradient(135deg, hsla(30,100%,50%,0.10) 0%, hsla(15,100%,50%,0.05) 100%)",
          border: `1px solid ${isDark ? "hsla(30,100%,50%,0.20)" : "hsla(30,100%,50%,0.15)"}`,
        }}
      >
        <Zap
          className="w-4 h-4 shrink-0"
          style={{ color: "hsl(30,100%,50%)" }}
          strokeWidth={2}
        />
        <div className="flex-1 text-left min-w-0">
          <p
            className="text-[13px] font-bold leading-tight"
            style={{ color: isDark ? "hsl(30,100%,65%)" : "hsl(25,90%,38%)" }}
          >
            Go live today
          </p>
          <p
            className="text-[11px] leading-tight mt-0.5"
            style={{ color: isDark ? "hsla(0,0%,100%,0.4)" : "hsl(215,16%,55%)" }}
          >
            14-day free trial · No card
          </p>
        </div>
        <ChevronRight
          className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: isDark ? "hsl(30,100%,65%)" : "hsl(25,90%,38%)" }}
        />
      </button>
    </div>
  );
};

export default DashboardSidebar;
