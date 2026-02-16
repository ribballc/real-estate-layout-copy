import { useEffect, useState, useMemo } from "react";
import DemoWebsite from "./DemoWebsite";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wrench, Camera, Star, Eye, CalendarDays, DollarSign,
  TrendingUp, TrendingDown, ChevronDown, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfYear, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";

type DateRange = "7d" | "14d" | "30d" | "90d" | "ytd";
type CompareMode = "previous" | "none";

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

const HomeDashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [compareMode, setCompareMode] = useState<CompareMode>("previous");
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ services: 0, photos: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("bookings").select("*").eq("user_id", user.id),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("photos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([b, s, p, t]) => {
      setBookings(b.data || []);
      setStats({ services: s.count || 0, photos: p.count || 0, testimonials: t.count || 0 });
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

  // Chart data
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

  const revenuePct = pctChange(currentRevenue, previousRevenue);
  const jobsPct = pctChange(currentJobCount, previousJobCount);

  const metricCards = [
    {
      label: "Revenue",
      value: formatCurrency(currentRevenue),
      change: revenuePct,
      icon: DollarSign,
      color: "hsl(160 84% 39%)",
      chartKey: "revenue" as const,
    },
    {
      label: "Booked Jobs",
      value: currentJobCount,
      change: jobsPct,
      icon: CalendarDays,
      color: "hsl(217 91% 60%)",
      chartKey: "bookings" as const,
    },
    {
      label: "Page Views",
      value: "—",
      change: null,
      icon: Eye,
      color: "hsl(215 16% 47%)",
      chartKey: null,
    },
    {
      label: "Reviews",
      value: stats.testimonials,
      change: null,
      icon: Star,
      color: "hsl(45 93% 47%)",
      chartKey: null,
    },
  ];

  const quickStats = [
    { label: "Services", value: stats.services, icon: Wrench, accent: "hsla(217,91%,60%,0.15)" },
    { label: "Photos", value: stats.photos, icon: Camera, accent: "hsla(213,94%,68%,0.15)" },
    { label: "Reviews", value: stats.testimonials, icon: Star, accent: "hsla(45,93%,47%,0.12)" },
    { label: "Page Views", value: "—", icon: Eye, accent: "hsla(215,16%,47%,0.12)" },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(160 84% 39%)" },
    bookings: { label: "Bookings", color: "hsl(217 91% 60%)" },
  };

  return (
    <div className="space-y-6">
      {/* Date controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white mb-0.5 tracking-tight">Dashboard</h2>
          <p className="text-white/40 text-sm">Track your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="h-9 w-[160px] bg-white/[0.04] border-white/[0.08] text-white text-sm rounded-xl backdrop-blur-sm hover:bg-white/[0.06] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={compareMode} onValueChange={(v) => setCompareMode(v as CompareMode)}>
            <SelectTrigger className="h-9 w-[170px] bg-white/[0.04] border-white/[0.08] text-white text-sm rounded-xl backdrop-blur-sm hover:bg-white/[0.06] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">vs Previous period</SelectItem>
              <SelectItem value="none">No comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s) => (
          <div
            key={s.label}
            className="dash-card rounded-2xl border border-white/[0.06] p-4 group relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsla(215,50%,12%,0.5) 0%, hsla(217,33%,14%,0.3) 100%)" }}
          >
            {/* Subtle accent glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.accent}, transparent 70%)` }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/35 text-[11px] font-medium uppercase tracking-wider">{s.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: s.accent }}>
                  <s.icon className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors duration-300" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-white tracking-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Metric cards with sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metricCards.map((metric) => (
          <div
            key={metric.label}
            className="dash-card rounded-2xl border border-white/[0.06] p-5 space-y-4 relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg, hsla(215,50%,12%,0.5) 0%, hsla(217,33%,14%,0.3) 100%)" }}
          >
            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px hsla(217,91%,60%,0.15), 0 0 30px hsla(217,91%,60%,0.06)` }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}08)`,
                      border: `1px solid ${metric.color}25`,
                    }}
                  >
                    <metric.icon className="w-[18px] h-[18px] transition-all duration-300" style={{ color: metric.color }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-white/35 text-[11px] font-medium uppercase tracking-wider">{metric.label}</p>
                    <p className="text-2xl font-semibold text-white mt-0.5 tracking-tight">{metric.value}</p>
                  </div>
                </div>
                {metric.change !== null && compareMode === "previous" && (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold ${
                    metric.change >= 0
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {metric.change >= 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {metric.change >= 0 ? "+" : ""}{metric.change}%
                  </div>
                )}
              </div>

              {metric.chartKey && chartData.length > 1 && (
                <div className="h-[120px] -mx-2 mt-4">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                      <defs>
                        <linearGradient id={`gradient-${metric.chartKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={metric.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.04)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "hsla(0,0%,100%,0.25)", fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey={metric.chartKey}
                        stroke={metric.color}
                        strokeWidth={2}
                        fill={`url(#gradient-${metric.chartKey})`}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings table */}
      <div
        className="dash-card rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsla(215,50%,12%,0.5) 0%, hsla(217,33%,14%,0.3) 100%)" }}
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h3 className="text-white font-semibold text-sm">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left text-white/25 text-[10px] font-medium uppercase tracking-widest px-5 py-3">Customer</th>
                <th className="text-left text-white/25 text-[10px] font-medium uppercase tracking-widest px-5 py-3">Service</th>
                <th className="text-left text-white/25 text-[10px] font-medium uppercase tracking-widest px-5 py-3">Date</th>
                <th className="text-right text-white/25 text-[10px] font-medium uppercase tracking-widest px-5 py-3">Amount</th>
                <th className="text-right text-white/25 text-[10px] font-medium uppercase tracking-widest px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/30 text-sm">
                    No bookings in this period
                  </td>
                </tr>
              ) : (
                currentBookings.slice(0, 10).map((b) => (
                  <tr key={b.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group/row">
                    <td className="px-5 py-3.5 text-white/80 font-medium">{b.customer_name || "—"}</td>
                    <td className="px-5 py-3.5 text-white/50">{b.service_title || "—"}</td>
                    <td className="px-5 py-3.5 text-white/40 font-mono text-xs">{b.booking_date}</td>
                    <td className="px-5 py-3.5 text-right text-white font-semibold font-mono text-xs">{formatCurrency(Number(b.service_price) || 0)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                        b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        b.status === "completed" ? "bg-accent/10 text-accent border border-accent/20" :
                        b.status === "cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Demo Website Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">Your Website Preview</h3>
            <p className="text-white/40 text-xs">This is how your live site looks with your current data</p>
          </div>
          <a
            href="#"
            className="text-xs font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsla(217,91%,60%,0.1), hsla(213,94%,68%,0.05))",
              border: "1px solid hsla(217,91%,60%,0.2)",
              color: "hsl(217,91%,60%)",
            }}
          >
            Open Full Preview →
          </a>
        </div>
        <DemoWebsite />
      </div>
    </div>
  );
};

export default HomeDashboard;
