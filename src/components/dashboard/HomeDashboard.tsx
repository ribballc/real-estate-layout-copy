import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import WebsitePage from "./WebsitePage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight,
  CalendarDays, Star, MoreHorizontal, Briefcase,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfYear, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";

type DateRange = "7d" | "14d" | "30d" | "90d" | "ytd";

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "ytd", label: "Year to date" },
];

function getDateRange(range: DateRange): { start: Date; end: Date } {
  const end = endOfDay(new Date());
  if (range === "ytd") return { start: startOfYear(new Date()), end };
  const days = range === "7d" ? 7 : range === "14d" ? 14 : range === "30d" ? 30 : 90;
  return { start: startOfDay(subDays(new Date(), days - 1)), end };
}

function getPreviousPeriod(start: Date, end: Date) {
  const diff = end.getTime() - start.getTime();
  return { start: new Date(start.getTime() - diff), end: new Date(start.getTime() - 1) };
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
}

/* ─── Metric Card ─── */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number | null;
  subtext?: string;
  highlighted?: boolean;
}

const MetricCard = ({ icon, label, value, pct, subtext, highlighted }: MetricCardProps) => (
  <div className={`rounded-2xl p-5 transition-all duration-200 ${highlighted ? "dash-card-highlight" : "alytics-card"}`}>
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlighted ? "bg-[hsla(0,0%,100%,0.2)] border border-[hsla(0,0%,100%,0.15)]" : "bg-[hsla(217,91%,60%,0.08)] border border-[hsla(217,91%,60%,0.12)]"}`}
      >
        {icon}
      </div>
      <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${highlighted ? "text-white/50 hover:text-white/80" : "dash-menu-btn"}`}>
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${highlighted ? "text-white/70" : "dash-card-label"}`}>{label}</p>
    <p className={`text-2xl lg:text-3xl font-bold tracking-tight mb-1 ${highlighted ? "text-white" : "dash-card-value"}`}>{value}</p>
    {pct !== null && (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${pct >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {pct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(pct)}%
        </span>
        <span className={`text-[11px] ${highlighted ? "text-white/50" : "dash-card-sublabel"}`}>
          {subtext || "vs last period"}
        </span>
      </div>
    )}
  </div>
);

/* ─── Main Dashboard ─── */
const HomeDashboard = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<{ chatbotRef?: any } | null>();
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ services: 0, photos: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("bookings").select("*").eq("user_id", user.id),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("photos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("profiles").select("business_name").eq("user_id", user.id).single(),
    ]).then(([b, s, p, t, profile]) => {
      setBookings(b.data || []);
      setStats({ services: s.count || 0, photos: p.count || 0, testimonials: t.count || 0 });
      setBusinessName(profile.data?.business_name || "");
      setLoading(false);
    });
  }, [user]);

  const { start, end } = getDateRange(dateRange);
  const prev = getPreviousPeriod(start, end);

  const currentBookings = useMemo(() =>
    bookings.filter(b => {
      const d = parseISO(b.booking_date);
      return isWithinInterval(d, { start, end });
    }), [bookings, start, end]);

  const previousBookings = useMemo(() =>
    bookings.filter(b => {
      const d = parseISO(b.booking_date);
      return isWithinInterval(d, { start: prev.start, end: prev.end });
    }), [bookings, prev]);

  const currentRevenue = currentBookings.reduce((sum, b) => sum + (Number(b.service_price) || 0), 0);
  const previousRevenue = previousBookings.reduce((sum, b) => sum + (Number(b.service_price) || 0), 0);
  const currentJobCount = currentBookings.length;
  const previousJobCount = previousBookings.length;
  const revenuePct = pctChange(currentRevenue, previousRevenue);
  const jobsPct = pctChange(currentJobCount, previousJobCount);

  /* Bar chart: revenue by day */
  const chartData = useMemo(() => {
    const days = eachDayOfInterval({ start, end });
    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayBookings = currentBookings.filter(b => b.booking_date === dayStr);
      return {
        date: format(day, "MMM d"),
        revenue: dayBookings.reduce((s, b) => s + (Number(b.service_price) || 0), 0),
        bookings: dayBookings.length,
      };
    });
  }, [currentBookings, start, end]);

  /* Pie chart: service breakdown */
  const serviceBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    currentBookings.forEach(b => {
      const title = b.service_title || "Other";
      map[title] = (map[title] || 0) + (Number(b.service_price) || 0);
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return entries.map(([name, value]) => ({
      name: name.length > 16 ? name.slice(0, 14) + "…" : name,
      value,
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  }, [currentBookings]);

  const PIE_COLORS = [
    "hsl(217, 91%, 60%)",
    "hsl(160, 84%, 39%)",
    "hsl(45, 93%, 47%)",
    "hsl(280, 67%, 55%)",
    "hsl(340, 82%, 52%)",
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(217 91% 60%)" },
    bookings: { label: "Bookings", color: "hsl(217 91% 60%)" },
  };

  return (
    <div className="space-y-5">
      {/* Greeting + date picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="dash-title text-xl lg:text-2xl font-bold tracking-tight">
            {greeting}{businessName ? `, ${businessName}` : ""}
          </h2>
          <p className="dash-subtitle text-xs lg:text-sm mt-0.5">Here's how your business is doing</p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="h-9 w-[150px] dash-select text-xs rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ═══ Metric cards — 2x2 mobile, 4-col desktop ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          icon={<DollarSign className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
          label="Total Revenue"
          value={currentRevenue > 0 ? formatCurrency(currentRevenue) : "—"}
          pct={revenuePct}
          subtext={`vs last ${dateRange === "ytd" ? "year" : dateRange.replace("d", " days")}`}
        />
        <MetricCard
          icon={<Briefcase className="w-5 h-5 text-white" strokeWidth={1.5} />}
          label="Total Bookings"
          value={currentJobCount > 0 ? String(currentJobCount) : "—"}
          pct={jobsPct}
          subtext={`vs last ${dateRange === "ytd" ? "year" : dateRange.replace("d", " days")}`}
          highlighted
        />
        <MetricCard
          icon={<Star className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
          label="Reviews"
          value={stats.testimonials > 0 ? String(stats.testimonials) : "—"}
          pct={null}
        />
        <MetricCard
          icon={<CalendarDays className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
          label="Avg. per Job"
          value={currentJobCount > 0 ? formatCurrency(Math.round(currentRevenue / currentJobCount)) : "—"}
          pct={null}
        />
      </div>

      {/* ═══ Revenue Bar Chart ═══ */}
      {chartData.length > 1 && (
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="alytics-card-title text-sm font-semibold">Revenue Breakdown</h3>
            <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[220px] lg:h-[260px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(214, 20%, 50%, 0.15)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(215, 16%, 55%)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(215, 16%, 55%)" }}
                  tickFormatter={(v) => `$${v}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "hsla(217, 91%, 60%, 0.06)", radius: 6 }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(217, 91%, 60%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                  animationDuration={600}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* ═══ Two-column: Pie Chart + Recent Bookings ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Report Overview — Pie chart */}
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="alytics-card-title text-sm font-semibold">Report Overview</h3>
            <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          {serviceBreakdown.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-[160px] h-[160px] shrink-0">
                <ChartContainer config={{ value: { label: "Revenue", color: "hsl(217 91% 60%)" } }} className="h-full w-full">
                  <PieChart>
                    <Pie
                      data={serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                      animationDuration={600}
                    >
                      {serviceBreakdown.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {serviceBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="alytics-card-title text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="alytics-card-title text-sm font-semibold font-mono">{formatCurrency(item.value)}</span>
                      <span className="alytics-card-sub text-xs w-8 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="alytics-card-sub text-sm">No service data yet</p>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="alytics-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="alytics-card-title text-sm font-semibold">Recent Bookings</h3>
            <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="alytics-divide">
            {currentBookings.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="alytics-card-sub text-sm">No bookings in this period</p>
              </div>
            ) : (
              currentBookings.slice(0, 5).map((b, index) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-5 py-3.5 alytics-row-hover transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                      style={{
                        background: `hsl(${(index * 50 + 200) % 360}, 70%, 95%)`,
                        color: `hsl(${(index * 50 + 200) % 360}, 60%, 40%)`,
                      }}
                    >
                      {(b.customer_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="alytics-card-title text-sm font-medium truncate">{b.customer_name || "—"}</p>
                      <p className="alytics-card-sub text-xs truncate">{b.service_title || "—"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="alytics-card-title text-sm font-semibold font-mono">{formatCurrency(Number(b.service_price) || 0)}</p>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                      b.status === "confirmed" ? "text-emerald-500" :
                      b.status === "completed" ? "text-[hsl(217,91%,60%)]" :
                      b.status === "cancelled" ? "text-red-500" :
                      "text-amber-500"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {currentBookings.length > 0 && (
            <div className="px-5 py-3">
              <button className="alytics-link text-xs font-medium inline-flex items-center gap-1">
                All bookings <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Activity Line Chart ═══ */}
      {chartData.length > 1 && (
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="alytics-card-title text-sm font-semibold">Booking Activity</h3>
          </div>
          <div className="h-[180px] lg:h-[220px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(214, 20%, 50%, 0.15)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(215, 16%, 55%)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(215, 16%, 55%)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2.5}
                  fill="url(#activityGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "hsl(217, 91%, 60%)", stroke: "hsl(0, 0%, 100%)", strokeWidth: 2 }}
                  animationDuration={600}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Live Website Preview — same tabbed view as /dashboard/website */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="alytics-card-title font-semibold text-sm">Your Website Preview</h3>
            <p className="alytics-card-sub text-xs">This is how your live site looks with your current data</p>
          </div>
        </div>
        <WebsitePage chatbotRef={outletContext?.chatbotRef} />
      </div>
    </div>
  );
};

export default HomeDashboard;
