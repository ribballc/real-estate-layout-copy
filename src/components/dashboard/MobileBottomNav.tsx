import { LayoutDashboard, CalendarDays, KanbanSquare, Users, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Calendar", icon: CalendarDays, path: "/dashboard/calendar" },
  { label: "Jobs", icon: KanbanSquare, path: "/dashboard/jobs" },
  { label: "Customers", icon: Users, path: "/dashboard/customers" },
] as const;

interface MobileBottomNavProps {
  isDark: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
  onMenuOpen?: () => void;
}

const MobileBottomNav = ({ isDark, currentPath, onNavigate, onMenuOpen }: MobileBottomNavProps) => {
  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  // Check if current path matches any tab — if not, highlight menu
  const anyTabActive = TABS.some((t) => isActive(t.path));

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden border-t safe-area-pb",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(0,0%,90%)]"
      )}
      style={{
        background: isDark ? "hsla(215,50%,10%,0.92)" : "hsla(0,0%,100%,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="flex items-center justify-around px-2 pt-1.5 pb-1.5">
        {TABS.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(8);
                onNavigate(tab.path);
              }}
              className={cn(
                "relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] flex-1 transition-colors duration-150"
              )}
              aria-label={tab.label}
            >
              {/* Active indicator line */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full"
                  style={{ background: "hsl(217,91%,60%)" }}
                />
              )}
              <tab.icon
                className={cn(
                  "w-[22px] h-[22px] transition-colors duration-150",
                  active
                    ? "text-[hsl(217,91%,60%)]"
                    : isDark
                      ? "text-[hsla(0,0%,100%,0.4)]"
                      : "text-[hsl(215,14%,51%)]"
                )}
                strokeWidth={active ? 2.2 : 1.6}
              />
            </button>
          );
        })}

        {/* Hamburger menu button */}
        <button
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(8);
            onMenuOpen?.();
          }}
          className={cn(
            "relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] flex-1 transition-colors duration-150"
          )}
          aria-label="Open menu"
        >
          {!anyTabActive && (
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full"
              style={{ background: "hsl(217,91%,60%)" }}
            />
          )}
          <Menu
            className={cn(
              "w-[22px] h-[22px] transition-colors duration-150",
              !anyTabActive
                ? "text-[hsl(217,91%,60%)]"
                : isDark
                  ? "text-[hsla(0,0%,100%,0.4)]"
                  : "text-[hsl(215,14%,51%)]"
            )}
            strokeWidth={1.6}
          />
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
