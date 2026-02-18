import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search, Plus, UserPlus, ClipboardList, FileText, LayoutDashboard,
  Building2, Globe, CalendarDays, KanbanSquare, Users, Wrench, Camera,
  Star, Settings, ArrowRight,
} from "lucide-react";

interface CommandBarProps {
  open: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface CustomerResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
}

interface BookingResult {
  id: string;
  customer_name: string;
  service_title: string;
  booking_date: string;
}

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Business Info", url: "/dashboard/business", icon: Building2 },
  { title: "Website", url: "/dashboard/website", icon: Globe },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarDays },
  { title: "Jobs", url: "/dashboard/jobs", icon: KanbanSquare },
  { title: "Estimates", url: "/dashboard/estimates", icon: ClipboardList },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Services", url: "/dashboard/services", icon: Wrench },
  { title: "Photos", url: "/dashboard/photos", icon: Camera },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: Star },
  { title: "Account", url: "/dashboard/account", icon: Settings },
];

const actions = [
  { title: "New Booking", icon: Plus, action: "new-booking" },
  { title: "Add Customer", icon: UserPlus, action: "new-customer" },
  { title: "New Estimate", icon: ClipboardList, action: "new-estimate" },
  { title: "New Invoice", icon: FileText, action: "new-invoice" },
];

const CommandBar = ({ open, onClose, isDark }: CommandBarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customers, setCustomers] = useState<CustomerResult[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setCustomers([]);
      setTimeout(() => inputRef.current?.focus(), 50);
      // Load recent bookings
      if (user) {
        supabase
          .from("bookings")
          .select("id, customer_name, service_title, booking_date")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)
          .then(({ data }) => {
            if (data) setRecentBookings(data);
          });
      }
    }
  }, [open, user]);

  // Debounced customer search
  useEffect(() => {
    if (!query.trim() || !user) {
      setCustomers([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const q = query.trim();
      const { data } = await supabase
        .from("customers")
        .select("id, name, email, phone, vehicle")
        .eq("user_id", user.id)
        .or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
        .limit(5);
      if (data) setCustomers(data);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, user]);

  // Build flat list of items
  const allItems = useMemo(() => {
    const items: { type: string; id: string; title: string; subtitle?: string; icon?: any; url?: string; action?: string }[] = [];
    const lq = query.toLowerCase();

    if (!query.trim()) {
      // Show actions first
      actions.forEach(a => items.push({ type: "action", id: a.action, title: a.title, icon: a.icon, action: a.action }));
      navItems.forEach(n => items.push({ type: "nav", id: n.url, title: n.title, icon: n.icon, url: n.url }));
      recentBookings.forEach(b => items.push({ type: "booking", id: b.id, title: b.customer_name || "Booking", subtitle: `${b.service_title} · ${b.booking_date}` }));
    } else {
      // Filtered actions
      actions.filter(a => a.title.toLowerCase().includes(lq)).forEach(a =>
        items.push({ type: "action", id: a.action, title: a.title, icon: a.icon, action: a.action })
      );
      // Filtered nav
      navItems.filter(n => n.title.toLowerCase().includes(lq)).forEach(n =>
        items.push({ type: "nav", id: n.url, title: n.title, icon: n.icon, url: n.url })
      );
      // Customers from search
      customers.forEach(c =>
        items.push({ type: "customer", id: c.id, title: c.name || c.email, subtitle: c.vehicle || c.email })
      );
      // Filtered recent bookings
      recentBookings
        .filter(b => b.customer_name?.toLowerCase().includes(lq) || b.service_title?.toLowerCase().includes(lq))
        .forEach(b => items.push({ type: "booking", id: b.id, title: b.customer_name || "Booking", subtitle: `${b.service_title} · ${b.booking_date}` }));
    }
    return items;
  }, [query, customers, recentBookings]);

  // Reset selection on items change
  useEffect(() => { setSelectedIdx(0); }, [allItems.length]);

  const activateItem = useCallback((item: typeof allItems[0]) => {
    onClose();
    if (item.type === "nav" && item.url) {
      navigate(item.url);
    } else if (item.type === "action") {
      switch (item.action) {
        case "new-booking": navigate("/dashboard/calendar?action=new-booking"); break;
        case "new-customer": navigate("/dashboard/customers?action=new-customer"); break;
        case "new-estimate": navigate("/dashboard/estimates?action=new-estimate"); break;
        case "new-invoice": navigate("/dashboard/estimates"); break;
      }
    } else if (item.type === "customer") {
      navigate(`/dashboard/customers?highlight=${item.id}`);
    } else if (item.type === "booking") {
      navigate("/dashboard/calendar");
    }
  }, [navigate, onClose]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, allItems.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && allItems[selectedIdx]) { e.preventDefault(); activateItem(allItems[selectedIdx]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selectedIdx, allItems, activateItem, onClose]);

  if (!open) return null;

  // Group items for section headers
  const groupOrder = ["action", "nav", "customer", "booking"];
  const groupLabels: Record<string, string> = { action: "Actions", nav: "Navigation", customer: "Customers", booking: "Recent Bookings" };

  let flatIdx = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: isDark ? "hsla(215,50%,5%,0.7)" : "hsla(0,0%,0%,0.4)", backdropFilter: "blur(8px)" }} />

      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg mx-4 rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: isDark ? "hsla(215,50%,8%,0.95)" : "hsla(0,0%,100%,0.95)",
          backdropFilter: "blur(24px)",
          border: `1px solid ${isDark ? "hsla(215,25%,25%,0.6)" : "hsl(214,20%,88%)"}`,
          boxShadow: isDark
            ? "0 25px 50px -12px hsla(215,50%,5%,0.8)"
            : "0 25px 50px -12px hsla(0,0%,0%,0.25)",
        }}
      >
        {/* Search input */}
        <div className={`flex items-center gap-3 px-4 h-14 border-b ${isDark ? "border-white/10" : "border-[hsl(214,20%,92%)]"}`}>
          <Search className={`w-5 h-5 shrink-0 ${isDark ? "text-white/30" : "text-[hsl(215,16%,65%)]"}`} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className={`flex-1 bg-transparent outline-none text-sm ${isDark ? "text-white placeholder:text-white/30" : "text-[hsl(215,25%,12%)] placeholder:text-[hsl(215,16%,65%)]"}`}
          />
          <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? "bg-white/10 text-white/30" : "bg-[hsl(214,20%,95%)] text-[hsl(215,16%,55%)]"}`}>ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {allItems.length === 0 && query.trim() && (
            <div className={`px-4 py-8 text-center text-sm ${isDark ? "text-white/30" : "text-[hsl(215,16%,55%)]"}`}>
              No results found for "{query}"
            </div>
          )}

          {groupOrder.map(group => {
            const groupItems = allItems.filter(i => i.type === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group}>
                <div className={`px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-white/25" : "text-[hsl(215,16%,65%)]"}`}>
                  {groupLabels[group]}
                </div>
                {groupItems.map(item => {
                  flatIdx++;
                  const idx = flatIdx;
                  const isSelected = idx === selectedIdx;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => activateItem(item)}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? isDark ? "bg-[hsla(217,91%,60%,0.12)]" : "bg-[hsla(217,91%,60%,0.08)]"
                          : ""
                      }`}
                    >
                      {Icon ? (
                        <Icon className="w-4 h-4 shrink-0" style={{ color: isSelected ? "hsl(217,91%,60%)" : isDark ? "hsla(0,0%,100%,0.4)" : "hsl(215,16%,55%)" }} strokeWidth={1.5} />
                      ) : item.type === "customer" ? (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                          style={{ background: "hsla(217,91%,60%,0.15)", color: "hsl(217,91%,60%)" }}
                        >
                          {(item.title?.[0] || "?").toUpperCase()}
                        </div>
                      ) : (
                        <CalendarDays className="w-4 h-4 shrink-0" style={{ color: isDark ? "hsla(0,0%,100%,0.4)" : "hsl(215,16%,55%)" }} strokeWidth={1.5} />
                      )}
                      <div className="flex-1 text-left min-w-0">
                        <span className={`truncate block ${isDark ? "text-white/80" : "text-[hsl(215,25%,20%)]"} ${isSelected ? "font-medium" : ""}`}>
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className={`text-xs truncate block ${isDark ? "text-white/30" : "text-[hsl(215,16%,55%)]"}`}>
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(217,91%,60%)" }} />}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {/* Reset flatIdx for next render */}
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
