import { useState } from "react";
import {
  LayoutDashboard, CalendarDays, KanbanSquare, Users, Menu, X,
  Wrench, Building2, Camera, Star, Settings, Globe, ClipboardList, FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const TABS = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Calendar", icon: CalendarDays, path: "/dashboard/calendar" },
  { label: "Jobs", icon: KanbanSquare, path: "/dashboard/jobs" },
  { label: "Customers", icon: Users, path: "/dashboard/customers" },
] as const;

const MENU_ITEMS = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Calendar", icon: CalendarDays, path: "/dashboard/calendar" },
  { label: "Jobs", icon: KanbanSquare, path: "/dashboard/jobs" },
  { label: "Customers", icon: Users, path: "/dashboard/customers" },
  { label: "Services", icon: Wrench, path: "/dashboard/services" },
  { label: "Estimates", icon: ClipboardList, path: "/dashboard/estimates" },
  { label: "Website", icon: Globe, path: "/dashboard/website" },
  { label: "Business Info", icon: Building2, path: "/dashboard/business" },
  { label: "Photos", icon: Camera, path: "/dashboard/photos" },
  { label: "Testimonials", icon: Star, path: "/dashboard/testimonials" },
  { label: "Offer Lab", icon: FlaskConical, path: "/dashboard/offer-lab" },
  { label: "Settings", icon: Settings, path: "/dashboard/account" },
];

interface MobileBottomNavProps {
  isDark: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MobileBottomNav = ({ isDark, currentPath, onNavigate }: MobileBottomNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  const anyTabActive = TABS.some((t) => isActive(t.path));

  return (
    <>
      {/* Popup menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] md:hidden"
              style={{
                background: isDark ? "hsla(215,50%,5%,0.6)" : "hsla(0,0%,0%,0.25)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Menu card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="fixed bottom-24 left-4 right-4 z-[61] md:hidden rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: isDark ? "hsl(215,40%,13%)" : "hsl(0,0%,100%)",
                border: `1px solid ${isDark ? "hsla(215,25%,25%,0.8)" : "hsl(0,0%,92%)"}`,
                boxShadow: isDark
                  ? "0 20px 60px hsla(0,0%,0%,0.5), 0 0 0 1px hsla(215,25%,25%,0.3)"
                  : "0 20px 60px hsla(220,14%,50%,0.15), 0 0 0 1px hsla(0,0%,0%,0.04)",
              }}
            >
              <div className="py-2 max-h-[60vh] overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(8);
                        setMenuOpen(false);
                        onNavigate(item.path);
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full px-5 py-3 text-left transition-colors duration-100",
                        active
                          ? isDark
                            ? "bg-[hsla(217,91%,60%,0.1)]"
                            : "bg-[hsla(217,91%,60%,0.06)]"
                          : isDark
                            ? "hover:bg-[hsla(0,0%,100%,0.04)]"
                            : "hover:bg-[hsl(0,0%,97%)]"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-[18px] h-[18px] flex-shrink-0",
                          active
                            ? "text-[hsl(217,91%,60%)]"
                            : isDark
                              ? "text-[hsla(0,0%,100%,0.4)]"
                              : "text-[hsl(215,14%,51%)]"
                        )}
                        strokeWidth={active ? 2 : 1.5}
                      />
                      <span
                        className={cn(
                          "text-[15px]",
                          active
                            ? "font-semibold text-[hsl(217,91%,60%)]"
                            : isDark
                              ? "font-medium text-[hsla(0,0%,100%,0.75)]"
                              : "font-medium text-[hsl(218,24%,23%)]"
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating bottom nav bar */}
      <nav
        className="fixed bottom-4 left-4 right-4 z-50 md:hidden safe-area-pb"
      >
        <div
          className="flex items-center rounded-2xl overflow-hidden"
          style={{
            background: isDark ? "hsla(215,40%,13%,0.92)" : "hsla(0,0%,100%,0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${isDark ? "hsla(215,25%,25%,0.6)" : "hsl(0,0%,90%)"}`,
            boxShadow: isDark
              ? "0 8px 32px hsla(0,0%,0%,0.4)"
              : "0 8px 32px hsla(220,14%,50%,0.12)",
          }}
        >
          {/* Icon tabs */}
          <div className="flex items-center flex-1">
            {TABS.map((tab) => {
              const active = isActive(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(8);
                    onNavigate(tab.path);
                  }}
                  className="relative flex items-center justify-center min-h-[52px] flex-1 transition-colors duration-150"
                  aria-label={tab.label}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-indicator"
                      className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full"
                      style={{ background: "hsl(217,91%,60%)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <tab.icon
                    className={cn(
                      "w-[22px] h-[22px] transition-colors duration-150",
                      active
                        ? "text-[hsl(217,91%,60%)]"
                        : isDark
                          ? "text-[hsla(0,0%,100%,0.35)]"
                          : "text-[hsl(215,14%,51%)]"
                    )}
                    strokeWidth={active ? 2.2 : 1.5}
                  />
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div
            className="w-px h-7 flex-shrink-0"
            style={{
              background: isDark ? "hsla(0,0%,100%,0.08)" : "hsl(0,0%,90%)",
            }}
          />

          {/* Hamburger / close */}
          <button
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(8);
              setMenuOpen((prev) => !prev);
            }}
            className={cn(
              "flex items-center justify-center min-h-[52px] px-4 transition-colors duration-150",
              !anyTabActive && !menuOpen
                ? "text-[hsl(217,91%,60%)]"
                : isDark
                  ? "text-[hsla(0,0%,100%,0.4)]"
                  : "text-[hsl(215,14%,51%)]"
            )}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="w-[22px] h-[22px]" strokeWidth={1.8} />
            ) : (
              <Menu className="w-[22px] h-[22px]" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
