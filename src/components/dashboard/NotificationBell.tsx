import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Bell, CalendarDays, Users, AlertTriangle, Phone, Eye, UserCheck, CheckCheck, X,
} from "lucide-react";
import { format, subDays, addDays } from "date-fns";

interface Alert {
  id: string;
  icon: React.ElementType;
  message: string;
  count: number;
  actionLabel: string;
  actionRoute: string;
  color: string;
}

const DISMISSED_KEY = "dashboard-dismissed-alerts";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getDismissed(): Record<string, number> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const cleaned: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "number" && now - v < TTL_MS) cleaned[k] = v;
    }
    return cleaned;
  } catch { return {}; }
}

function dismissAlert(id: string) {
  const current = getDismissed();
  current[id] = Date.now();
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(current));
}

function dismissAll(ids: string[]) {
  const current = getDismissed();
  const now = Date.now();
  ids.forEach(id => { current[id] = now; });
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(current));
}

interface NotificationBellProps {
  isDark: boolean;
}

const NotificationBell = ({ isDark }: NotificationBellProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Record<string, number>>(getDismissed);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const sixtyDaysAgo = format(subDays(new Date(), 60), "yyyy-MM-dd");
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const [todayRes, tomorrowRes, followUpRes, pendingOldRes, missingContactRes] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true })
        .eq("user_id", user.id).eq("booking_date", today).in("status", ["confirmed", "pending"]),
      supabase.from("bookings").select("id", { count: "exact", head: true })
        .eq("user_id", user.id).eq("booking_date", tomorrow),
      supabase.from("customers").select("id", { count: "exact", head: true })
        .eq("user_id", user.id).lt("last_service_date", sixtyDaysAgo).not("last_service_date", "is", null),
      supabase.from("bookings").select("id", { count: "exact", head: true })
        .eq("user_id", user.id).eq("status", "pending").lt("created_at", fortyEightHoursAgo),
      supabase.from("bookings").select("id", { count: "exact", head: true })
        .eq("user_id", user.id).or("customer_phone.eq.,customer_email.eq."),
    ]);

    const newAlerts: Alert[] = [];

    if ((todayRes.count ?? 0) > 0) {
      newAlerts.push({
        id: `today-${today}`,
        icon: CalendarDays,
        message: `${todayRes.count} booking${todayRes.count !== 1 ? "s" : ""} today`,
        count: todayRes.count!,
        actionLabel: "View",
        actionRoute: "/dashboard/calendar",
        color: "hsl(217, 91%, 60%)",
      });
    }

    if ((tomorrowRes.count ?? 0) > 0) {
      newAlerts.push({
        id: `tomorrow-${tomorrow}`,
        icon: CalendarDays,
        message: `${tomorrowRes.count} booking${tomorrowRes.count !== 1 ? "s" : ""} tomorrow — prepare now`,
        count: tomorrowRes.count!,
        actionLabel: "View",
        actionRoute: "/dashboard/calendar",
        color: "hsl(38, 92%, 50%)",
      });
    }

    if ((followUpRes.count ?? 0) > 0) {
      newAlerts.push({
        id: "followup-customers",
        icon: Users,
        message: `${followUpRes.count} customer${followUpRes.count !== 1 ? "s" : ""} due for follow-up`,
        count: followUpRes.count!,
        actionLabel: "Follow Up",
        actionRoute: "/dashboard/customers",
        color: "hsl(280, 67%, 55%)",
      });
    }

    if ((pendingOldRes.count ?? 0) > 0) {
      newAlerts.push({
        id: "pending-old",
        icon: AlertTriangle,
        message: `${pendingOldRes.count} booking${pendingOldRes.count !== 1 ? "s" : ""} need confirmation`,
        count: pendingOldRes.count!,
        actionLabel: "Review",
        actionRoute: "/dashboard/calendar",
        color: "hsl(0, 84%, 60%)",
      });
    }

    if ((missingContactRes.count ?? 0) > 0) {
      newAlerts.push({
        id: "missing-contact",
        icon: Phone,
        message: `${missingContactRes.count} booking${missingContactRes.count !== 1 ? "s" : ""} missing contact info`,
        count: missingContactRes.count!,
        actionLabel: "Review",
        actionRoute: "/dashboard/calendar",
        color: "hsl(38, 92%, 50%)",
      });
    }

    setAlerts(newAlerts);
  }, [user]);

  // Fetch on mount + every 5 minutes
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Close dropdown on outside click (desktop)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isMobile]);

  const visibleAlerts = alerts.filter(a => !dismissed[a.id]);
  const count = visibleAlerts.length;

  const handleAction = (alert: Alert) => {
    setOpen(false);
    navigate(alert.actionRoute);
  };

  const handleDismiss = (id: string) => {
    dismissAlert(id);
    setDismissed(getDismissed());
  };

  const handleMarkAllRead = () => {
    dismissAll(alerts.map(a => a.id));
    setDismissed(getDismissed());
  };

  const alertList = (
    <div className="py-2">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 pb-2 border-b ${isDark ? "border-white/10" : "border-[hsl(214,20%,92%)]"}`}>
        <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-[hsl(215,25%,12%)]"}`}>Notifications</span>
        {visibleAlerts.length > 0 && (
          <button onClick={handleMarkAllRead} className="text-[11px] font-medium transition-colors" style={{ color: "hsl(217,91%,60%)" }}>
            <CheckCheck className="w-3.5 h-3.5 inline mr-1" />Mark all read
          </button>
        )}
      </div>

      {visibleAlerts.length === 0 ? (
        <div className={`px-4 py-8 text-center text-sm ${isDark ? "text-white/30" : "text-[hsl(215,16%,55%)]"}`}>
          All caught up! No new notifications.
        </div>
      ) : (
        <div className="max-h-[50vh] overflow-y-auto">
          {visibleAlerts.map(alert => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 px-4 py-3 transition-colors ${isDark ? "hover:bg-white/[0.04]" : "hover:bg-[hsl(214,20%,97%)]"}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${alert.color}15`, border: `1px solid ${alert.color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color: alert.color }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${isDark ? "text-white/80" : "text-[hsl(215,25%,20%)]"}`}>
                    {alert.message}
                  </p>
                  <button
                    onClick={() => handleAction(alert)}
                    className="text-[11px] font-medium mt-1 transition-colors"
                    style={{ color: "hsl(217,91%,60%)" }}
                  >
                    {alert.actionLabel} →
                  </button>
                </div>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors ${isDark ? "text-white/20 hover:text-white/50 hover:bg-white/[0.06]" : "text-[hsl(215,16%,70%)] hover:text-[hsl(215,16%,40%)] hover:bg-[hsl(214,20%,96%)]"}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const bellButton = (className?: string) => (
    <button
      onClick={() => setOpen(prev => !prev)}
      className={`relative flex items-center justify-center rounded-xl transition-colors ${className ?? ""} ${
        isDark
          ? "text-white/50 hover:text-white hover:bg-white/[0.06]"
          : "text-[hsl(215,16%,50%)] hover:text-[hsl(215,25%,12%)] hover:bg-[hsl(214,20%,96%)]"
      }`}
    >
      <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "hsl(0, 84%, 60%)" }}>
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );

  return (
    <>
      {/* Desktop: bell + dropdown */}
      <div className="relative hidden md:block" ref={dropdownRef}>
        {bellButton("w-9 h-9")}
        {open && !isMobile && (
          <div
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50 overflow-hidden"
            style={{
              background: isDark ? "hsla(215,50%,8%,0.95)" : "hsla(0,0%,100%,0.95)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${isDark ? "hsla(215,25%,25%,0.6)" : "hsl(214,20%,88%)"}`,
              boxShadow: isDark ? "0 20px 40px -8px hsla(215,50%,5%,0.7)" : "0 20px 40px -8px hsla(0,0%,0%,0.15)",
            }}
          >
            {alertList}
          </div>
        )}
      </div>

      {/* Mobile: bell (inline, used by parent) + bottom sheet */}
      <div className="md:hidden">
        {bellButton("w-10 h-10")}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl p-0 border-none" style={{
            background: isDark ? "hsl(215,50%,8%)" : "hsl(0,0%,100%)",
            maxHeight: "70vh",
          }}>
            <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-1" style={{ background: isDark ? "hsla(0,0%,100%,0.15)" : "hsl(214,20%,85%)" }} />
            {alertList}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default NotificationBell;
