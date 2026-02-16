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
    { label: "Services", value: stats.services, icon: Wrench },
    { label: "Photos", value: stats.photos, icon: Camera },
    { label: "Reviews", value: stats.testimonials, icon: Star },
    { label: "Page Views", value: "—", icon: Eye },
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
          <h2 className="text-2xl font-bold text-white mb-0.5">Dashboard</h2>
          <p className="text-white/40 text-sm">Track your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="h-9 w-[160px] bg-white/5 border-white/10 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={compareMode} onValueChange={(v) => setCompareMode(v as CompareMode)}>
            <SelectTrigger className="h-9 w-[170px] bg-white/5 border-white/10 text-white text-sm">
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
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/35 text-[11px] font-medium uppercase tracking-wider">{s.label}</span>
              <s.icon className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors duration-200" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-semibold text-white tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Metric cards with sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metricCards.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-4 transition-all duration-200 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04]">
                  <metric.icon className="w-[18px] h-[18px] text-white/30" strokeWidth={1.5} />
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
              <div className="h-[120px] -mx-2">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                    <defs>
                      <linearGradient id={`gradient-${metric.chartKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={metric.color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.05)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "hsla(0,0%,100%,0.3)", fontSize: 11 }}
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
        ))}
      </div>

      {/* Recent bookings table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <h3 className="text-white font-semibold text-sm">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">Service</th>
                <th className="text-left text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-right text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-right text-white/30 text-xs font-medium uppercase tracking-wider px-5 py-3">Status</th>
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
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-white/80">{b.customer_name || "—"}</td>
                    <td className="px-5 py-3 text-white/60">{b.service_title || "—"}</td>
                    <td className="px-5 py-3 text-white/50">{b.booking_date}</td>
                    <td className="px-5 py-3 text-right text-white font-medium">{formatCurrency(Number(b.service_price) || 0)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" :
                        b.status === "completed" ? "bg-blue-500/10 text-blue-400" :
                        b.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                        "bg-amber-500/10 text-amber-400"
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
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}
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
