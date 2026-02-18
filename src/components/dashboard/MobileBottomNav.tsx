import { LayoutDashboard, CalendarDays, KanbanSquare, Users, Wrench, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Calendar", icon: CalendarDays, path: "/dashboard/calendar" },
  { label: "Jobs", icon: KanbanSquare, path: "/dashboard/jobs" },
  { label: "Customers", icon: Users, path: "/dashboard/customers" },
  { label: "Services", icon: Wrench, path: "/dashboard/services" },
  { label: "Account", icon: Settings, path: "/dashboard/account" },
] as const;

interface MobileBottomNavProps {
  isDark: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MobileBottomNav = ({ isDark, currentPath, onNavigate }: MobileBottomNavProps) => {
  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden border-t safe-area-pb",
        isDark ? "border-[hsla(215,25%,20%,1)]" : "border-[hsl(214,20%,90%)]"
      )}
      style={{
        background: isDark ? "hsla(215,50%,10%,0.85)" : "hsla(0,0%,100%,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-around px-1 pt-1 pb-1">
        {TABS.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-0 flex-1 min-h-[48px] justify-center active:scale-95 transition-all duration-150 ease-in-out",
                active
                  ? "text-[hsl(217,91%,60%)]"
                  : isDark
                    ? "text-[hsla(0,0%,100%,0.45)]"
                    : "text-[hsl(215,16%,50%)]"
              )}
            >
              <span className={cn(
                "flex items-center justify-center rounded-full transition-all duration-150 ease-in-out",
                active ? "bg-[hsla(217,91%,60%,0.15)] px-3 py-1" : "px-3 py-1"
              )}>
                <tab.icon
                  className="w-[22px] h-[22px]"
                  strokeWidth={active ? 2.2 : 1.5}
                />
              </span>
              <span className={cn(
                "text-[10px] leading-tight tracking-wide uppercase",
                active ? "font-semibold" : "font-medium"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
