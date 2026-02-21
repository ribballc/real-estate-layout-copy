import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, CalendarDays, KanbanSquare, Users, Menu, X,
  Wrench, Building2, Camera, Star, Settings, Globe, ClipboardList, FlaskConical, Search,
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
  { label: "The Lab", icon: FlaskConical, path: "/dashboard/the-lab" },
  { label: "Settings", icon: Settings, path: "/dashboard/account" },
];

interface MobileBottomNavProps {
  isDark: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MobileBottomNav = ({ isDark, currentPath, onNavigate }: MobileBottomNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearch("");
  }, [currentPath]);

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return MENU_ITEMS;
    const q = search.toLowerCase();
    return MENU_ITEMS.filter((i) => i.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <>
      {/* Popup menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] md:hidden cursor-pointer"
              style={{
                background: isDark ? "hsla(215,50%,5%,0.5)" : "hsla(0,0%,0%,0.2)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              onClick={() => { setMenuOpen(false); setSearch(""); }}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="fixed bottom-[88px] left-4 right-4 z-[61] md:hidden rounded-2xl overflow-hidden"
              style={{
                background: isDark ? "hsla(215,40%,13%,0.95)" : "hsla(0,0%,100%,0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${isDark ? "hsla(215,25%,25%,0.6)" : "hsl(0,0%,91%)"}`,
                boxShadow: isDark
                  ? "0 20px 60px hsla(0,0%,0%,0.5)"
                  : "0 20px 60px hsla(220,14%,50%,0.15)",
              }}
            >
              {/* Search bar */}
              <div className="px-4 pt-4 pb-2">
                <div
                  className="flex items-center gap-2.5 h-10 px-3 rounded-xl"
                  style={{
                    background: isDark ? "hsla(0,0%,100%,0.06)" : "hsl(0,0%,96%)",
                    border: `1px solid ${isDark ? "hsla(0,0%,100%,0.08)" : "hsl(0,0%,90%)"}`,
                  }}
                >
                  <Search
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: isDark ? "hsla(0,0%,100%,0.3)" : "hsl(215,14%,65%)" }}
                    strokeWidth={1.8}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pages..."
                    autoFocus={false}
                    className={cn(
                      "flex-1 bg-transparent border-none outline-none text-sm placeholder:opacity-40",
                      isDark ? "text-white placeholder:text-white" : "text-[hsl(218,24%,23%)] placeholder:text-[hsl(215,14%,51%)]"
                    )}
                    style={{ fontSize: 16 }}
                  />
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1 max-h-[50vh] overflow-y-auto">
                {filtered.length === 0 && (
                  <p className={cn("text-center py-6 text-sm", isDark ? "text-white/30" : "text-[hsl(215,14%,51%)]")}>
                    No results
                  </p>
                )}
                {filtered.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.vibrate) navigator.vibrate(8);
                        onNavigate(item.path);
                        // Menu closes via useEffect on currentPath change
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full px-5 py-3 text-left transition-colors duration-100",
                        active
                          ? isDark
                            ? "bg-[hsla(217,91%,60%,0.1)]"
                            : "bg-[hsla(217,91%,60%,0.06)]"
                          : isDark
                            ? "active:bg-[hsla(0,0%,100%,0.06)]"
                            : "active:bg-[hsl(0,0%,96%)]"
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

      {/* Floating bottom nav bar — frosted glass */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden safe-area-pb">
        <div className="flex items-center gap-2.5">
          {/* Icon tabs pill */}
          <div
            className="flex items-center flex-1 rounded-[22px] overflow-hidden"
            style={{
              background: isDark
                ? "hsla(215,30%,12%,0.55)"
                : "hsla(0,0%,100%,0.55)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: `1px solid ${isDark ? "hsla(0,0%,100%,0.08)" : "hsla(0,0%,100%,0.7)"}`,
              boxShadow: isDark
                ? "0 8px 40px hsla(0,0%,0%,0.45), inset 0 1px 0 hsla(0,0%,100%,0.05)"
                : "0 8px 40px hsla(220,14%,50%,0.12), inset 0 1px 0 hsla(0,0%,100%,0.6), 0 1px 3px hsla(0,0%,0%,0.06)",
            }}
          >
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
                    "relative flex items-center justify-center min-h-[56px] flex-1 transition-all duration-200 group",
                    "active:scale-90"
                  )}
                  aria-label={tab.label}
                >
                  {/* Glow behind active icon */}
                  {active && (
                    <motion.div
                      layoutId="mobile-nav-glow"
                      className="absolute inset-2 rounded-2xl pointer-events-none"
                      style={{
                        background: isDark
                          ? "hsla(217,91%,60%,0.1)"
                          : "hsla(217,91%,60%,0.08)",
                        boxShadow: "0 0 20px hsla(217,91%,60%,0.15)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  {/* Hover glow */}
                  <div
                    className={cn(
                      "absolute inset-2 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      active && "hidden"
                    )}
                    style={{
                      background: isDark
                        ? "hsla(0,0%,100%,0.04)"
                        : "hsla(217,91%,60%,0.04)",
                    }}
                  />
                  <tab.icon
                    className={cn(
                      "relative z-10 w-[22px] h-[22px] transition-all duration-200",
                      active
                        ? "text-[hsl(217,91%,60%)]"
                        : isDark
                          ? "text-[hsla(0,0%,100%,0.35)] group-hover:text-[hsla(0,0%,100%,0.6)]"
                          : "text-[hsl(215,14%,51%)] group-hover:text-[hsl(215,14%,30%)]"
                    )}
                    strokeWidth={active ? 2.2 : 1.6}
                  />
                </button>
              );
            })}
          </div>

          {/* Separated hamburger button — glass */}
          <button
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(8);
              setMenuOpen((prev) => {
                if (prev) setSearch("");
                return !prev;
              });
            }}
            className="group flex items-center justify-center w-[56px] h-[56px] rounded-[22px] flex-shrink-0 transition-all duration-200 active:scale-90"
            style={{
              background: isDark
                ? menuOpen ? "hsla(217,91%,60%,0.12)" : "hsla(215,30%,12%,0.55)"
                : menuOpen ? "hsla(217,91%,60%,0.06)" : "hsla(0,0%,100%,0.55)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: `1px solid ${isDark ? "hsla(0,0%,100%,0.08)" : "hsla(0,0%,100%,0.7)"}`,
              boxShadow: isDark
                ? `0 8px 40px hsla(0,0%,0%,0.45), inset 0 1px 0 hsla(0,0%,100%,0.05)${menuOpen ? ", 0 0 20px hsla(217,91%,60%,0.15)" : ""}`
                : `0 8px 40px hsla(220,14%,50%,0.12), inset 0 1px 0 hsla(0,0%,100%,0.6)${menuOpen ? ", 0 0 20px hsla(217,91%,60%,0.1)" : ""}`,
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X
                className="w-[22px] h-[22px]"
                style={{ color: "hsl(217,91%,60%)" }}
                strokeWidth={2}
              />
            ) : (
              <Menu
                className={cn(
                  "w-[22px] h-[22px] transition-colors duration-200",
                  isDark
                    ? "text-[hsla(0,0%,100%,0.4)] group-hover:text-[hsla(0,0%,100%,0.7)]"
                    : "text-[hsl(215,14%,41%)] group-hover:text-[hsl(215,14%,25%)]"
                )}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
