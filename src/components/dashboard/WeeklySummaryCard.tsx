import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { X, ArrowUpRight, ArrowDownRight, CalendarDays } from "lucide-react";
import { subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO, format } from "date-fns";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
}

const WeeklySummaryCard = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Only show on Mondays (or any day for testing), and only once per week
    const now = new Date();
    const isMonday = now.getDay() === 1;
    // For production: only Mondays. For dev flexibility, always show if not dismissed this week.
    const lastShownKey = `weekly_summary_shown_${user.id}`;
    const lastShown = localStorage.getItem(lastShownKey);
    const thisWeekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");

    if (lastShown === thisWeekStart) return; // Already shown this week

    // Only show on Mondays
    if (!isMonday) return;

    // Fetch last 2 weeks of bookings
    const twoWeeksAgo = format(subDays(now, 14), "yyyy-MM-dd");
    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .gte("booking_date", twoWeeksAgo)
      .then(({ data }) => {
        setBookings(data || []);
        setLoaded(true);
        if ((data || []).length > 0) setVisible(true);
      });
  }, [user]);

  const now = new Date();
  const lastWeekStart = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
  const priorWeekStart = startOfWeek(subDays(now, 14), { weekStartsOn: 1 });
  const priorWeekEnd = endOfWeek(subDays(now, 14), { weekStartsOn: 1 });

  const lastWeekBookings = useMemo(() =>
    bookings.filter(b => isWithinInterval(parseISO(b.booking_date), { start: lastWeekStart, end: lastWeekEnd })),
    [bookings, lastWeekStart, lastWeekEnd]
  );

  const priorWeekBookings = useMemo(() =>
    bookings.filter(b => isWithinInterval(parseISO(b.booking_date), { start: priorWeekStart, end: priorWeekEnd })),
    [bookings, priorWeekStart, priorWeekEnd]
  );

  const lastRevenue = lastWeekBookings.reduce((s, b) => s + (Number(b.service_price) || 0), 0);
  const priorRevenue = priorWeekBookings.reduce((s, b) => s + (Number(b.service_price) || 0), 0);

  const uniqueCustomers = (bks: any[]) => new Set(bks.map(b => b.customer_email || b.customer_name)).size;
  const lastCustomers = uniqueCustomers(lastWeekBookings);
  const priorCustomers = uniqueCustomers(priorWeekBookings);

  const pctChange = (curr: number, prev: number) => {
    if (prev === 0 && curr === 0) return null;
    if (prev === 0) return 100;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const bookingsPct = pctChange(lastWeekBookings.length, priorWeekBookings.length);
  const revenuePct = pctChange(lastRevenue, priorRevenue);
  const customersPct = pctChange(lastCustomers, priorCustomers);

  const handleDismiss = () => {
    if (!user) return;
    const thisWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
    localStorage.setItem(`weekly_summary_shown_${user.id}`, thisWeekStart);
    // Also update profile timestamp
    supabase.from("profiles").update({ last_weekly_summary_shown_at: new Date().toISOString() }).eq("user_id", user.id);
    setVisible(false);
  };

  if (!visible || !loaded) return null;

  const Stat = ({ label, value, pct }: { label: string; value: string; pct: number | null }) => (
    <div className="flex items-center gap-2">
      <span className="text-white font-bold text-sm">{value}</span>
      <span className="text-white/50 text-xs">{label}</span>
      {pct !== null && (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {pct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(pct)}%
        </span>
      )}
    </div>
  );

  return (
    <div
      className="rounded-2xl p-5 mb-4 animate-in fade-in slide-in-from-top-3 duration-500"
      style={{
        background: "linear-gradient(135deg, hsla(217,91%,60%,0.12) 0%, hsla(217,91%,60%,0.04) 100%)",
        border: "1px solid hsla(217,91%,60%,0.2)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} />
          <h3 className="text-sm font-semibold text-white">Last Week</h3>
        </div>
        <button onClick={handleDismiss} className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Stat label="bookings" value={String(lastWeekBookings.length)} pct={bookingsPct} />
        <Stat label="revenue" value={formatCurrency(lastRevenue)} pct={revenuePct} />
        <Stat label="new customers" value={String(lastCustomers)} pct={customersPct} />
      </div>
      <p className="text-[11px] text-white/30 mt-2">Compared to the prior week</p>
    </div>
  );
};

export default WeeklySummaryCard;
