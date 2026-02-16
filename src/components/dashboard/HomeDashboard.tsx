import { useEffect, useState, useMemo } from "react";
import DemoWebsite from "./DemoWebsite";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wrench, Camera, Star, Eye, CalendarDays, DollarSign,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
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
      label: "TOTAL REVENUE",
      value: formatCurrency(currentRevenue),
      change: revenuePct,
      icon: DollarSign,
      iconBg: "hsla(217, 91%, 60%, 0.12)",
      iconColor: "hsl(217, 91%, 60%)",
      highlighted: false,
    },
    {
      label: "BOOKED JOBS",
      value: currentJobCount,
      change: jobsPct,
      icon: CalendarDays,
      iconBg: "hsla(217, 91%, 60%, 1)",
      iconColor: "hsl(0, 0%, 100%)",
      highlighted: true,
    },
    {
      label: "PAGE VIEWS",
      value: "—",
      change: null,
      icon: Eye,
      iconBg: "hsla(217, 91%, 60%, 0.12)",
      iconColor: "hsl(217, 91%, 60%)",
      highlighted: false,
    },
    {
      label: "REVIEWS",
      value: stats.testimonials,
      change: null,
      icon: Star,
      iconBg: "hsla(45, 93%, 47%, 0.12)",
      iconColor: "hsl(45, 93%, 47%)",
      highlighted: false,
    },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(217 91% 60%)" },
    bookings: { label: "Bookings", color: "hsl(217 91% 60%)" },
  };

  return (
    <div className="space-y-6">
      {/* Date controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="dash-title text-2xl font-bold mb-0.5 tracking-tight">Dashboard</h2>
          <p className="dash-subtitle text-sm">Track your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="h-9 w-[160px] dash-select text-sm rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={compareMode} onValueChange={(v) => setCompareMode(v as CompareMode)}>
            <SelectTrigger className="h-9 w-[170px] dash-select text-sm rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">vs Previous period</SelectItem>
              <SelectItem value="none">No comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metric cards row — Exonad style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {metricCards.map((metric) => (
          <div
            key={metric.label}
            className={`dash-card rounded-2xl p-4 lg:p-5 relative group transition-all duration-200 ${
              metric.highlighted ? "dash-card-highlight" : ""
            }`}
          >
            {/* Top row: icon + menu */}
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: metric.iconBg }}
              >
                <metric.icon
                  className="w-5 h-5 lg:w-[18px] lg:h-[18px]"
                  style={{ color: metric.iconColor }}
                  strokeWidth={1.5}
                />
              </div>
              <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Label */}
            <p className="dash-card-label text-[10px] lg:text-[11px] font-semibold uppercase tracking-wider mb-1">
              {metric.label}
            </p>

            {/* Value */}
            <p className="dash-card-value text-xl lg:text-2xl font-bold tracking-tight mb-1">
              {metric.value}
            </p>

            {/* Change indicator */}
            {metric.change !== null && compareMode === "previous" ? (
              <div className="flex items-center gap-1 mt-1">
                {metric.change >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${metric.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {Math.abs(metric.change)}%
                </span>
                <span className="dash-card-sublabel text-[10px]">vs last period</span>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        ))}
      </div>

      {/* Revenue bar chart — Exonad style */}
      {chartData.length > 1 && (
        <div className="dash-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="dash-card-value font-semibold text-base lg:text-lg">Revenue Overview</h3>
            <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[200px] lg:h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" className="dash-grid-stroke" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  className="dash-axis-tick"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="dash-axis-tick"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="hsl(217, 91%, 60%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Bookings activity chart */}
      {chartData.length > 1 && (
        <div className="dash-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="dash-card-value font-semibold text-base lg:text-lg">Booking Activity</h3>
            <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[180px] lg:h-[220px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="dash-grid-stroke" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  className="dash-axis-tick"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="dash-axis-tick"
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  fill="url(#bookingGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Recent bookings list — Exonad style */}
      <div className="dash-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between dash-card-border-b">
          <h3 className="dash-card-value font-semibold text-base">Recent Bookings</h3>
          <button className="dash-menu-btn w-7 h-7 rounded-lg flex items-center justify-center">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y dash-divide">
          {currentBookings.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="dash-card-sublabel text-sm">No bookings in this period</p>
            </div>
          ) : (
            currentBookings.slice(0, 8).map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3.5 dash-row-hover transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsla(217, 91%, 60%, 0.1)" }}>
                    <CalendarDays className="w-4 h-4" style={{ color: "hsl(217, 91%, 60%)" }} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="dash-card-value text-sm font-medium truncate">{b.customer_name || "—"}</p>
                    <p className="dash-card-sublabel text-xs">{b.service_title || "—"} · {b.booking_date}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="dash-card-value text-sm font-semibold font-mono">{formatCurrency(Number(b.service_price) || 0)}</p>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                    b.status === "confirmed" ? "text-emerald-500" :
                    b.status === "completed" ? "text-accent" :
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
      </div>

      {/* Live Demo Website Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="dash-card-value font-semibold text-sm">Your Website Preview</h3>
            <p className="dash-card-sublabel text-xs">This is how your live site looks with your current data</p>
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
