import { useEffect, useState, useMemo } from "react";
import DemoWebsite from "./DemoWebsite";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wrench, Camera, Star, Eye, CalendarDays, DollarSign,
  TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
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

      {/* Metric cards — Alytics clean style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <h3 className="alytics-card-title text-sm font-semibold mb-3">Revenues</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="alytics-card-big text-3xl lg:text-4xl font-bold tracking-tight">
              {currentRevenue > 0 ? formatCurrency(currentRevenue) : "—"}
            </span>
            {revenuePct !== null && compareMode === "previous" && (
              <span className={`inline-flex items-center gap-0.5 text-sm font-semibold ${revenuePct >= 0 ? "text-[hsl(217,91%,60%)]" : "text-red-500"}`}>
                {revenuePct >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            )}
          </div>
          {revenuePct !== null && compareMode === "previous" && (
            <p className="alytics-card-sub text-xs">
              {revenuePct >= 0 ? `${Math.abs(revenuePct)}% increase` : `${Math.abs(revenuePct)}% decrease`} compared to last period
            </p>
          )}
          <button className="alytics-link mt-4 text-xs font-medium inline-flex items-center gap-1 transition-colors">
            Revenues report <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Booked Jobs */}
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <h3 className="alytics-card-title text-sm font-semibold mb-3">Booked Jobs</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="alytics-card-big text-3xl lg:text-4xl font-bold tracking-tight">
              {currentJobCount || "—"}
            </span>
            {jobsPct !== null && compareMode === "previous" && (
              <span className={`inline-flex items-center gap-0.5 text-sm font-semibold ${jobsPct >= 0 ? "text-[hsl(217,91%,60%)]" : "text-red-500"}`}>
                {jobsPct >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            )}
          </div>
          {jobsPct !== null && compareMode === "previous" && (
            <p className="alytics-card-sub text-xs">
              {currentJobCount} out of {currentJobCount + previousJobCount} total
            </p>
          )}
          <button className="alytics-link mt-4 text-xs font-medium inline-flex items-center gap-1 transition-colors">
            All bookings <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Page Views */}
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <h3 className="alytics-card-title text-sm font-semibold mb-3">Page Views</h3>
          <span className="alytics-card-big text-3xl lg:text-4xl font-bold tracking-tight">—</span>
          <p className="alytics-card-sub text-xs mt-1.5">Coming soon</p>
          <button className="alytics-link mt-4 text-xs font-medium inline-flex items-center gap-1 transition-colors">
            All views <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Reviews */}
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <h3 className="alytics-card-title text-sm font-semibold mb-3">Reviews</h3>
          <span className="alytics-card-big text-3xl lg:text-4xl font-bold tracking-tight">{stats.testimonials || "—"}</span>
          <p className="alytics-card-sub text-xs mt-1.5">{stats.testimonials} customer review{stats.testimonials !== 1 ? "s" : ""}</p>
          <button className="alytics-link mt-4 text-xs font-medium inline-flex items-center gap-1 transition-colors">
            All reviews <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Two-column layout for Recent Bookings + Growth chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent bookings list — Alytics style */}
        <div className="alytics-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="alytics-card-title text-sm font-semibold">Recent Bookings</h3>
            <Select defaultValue="newest">
              <SelectTrigger className="h-7 w-[130px] dash-select text-xs rounded-lg border-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by Newest</SelectItem>
                <SelectItem value="oldest">Sort by Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="alytics-divide">
            {currentBookings.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="alytics-card-sub text-sm">No bookings in this period</p>
              </div>
            ) : (
              currentBookings.slice(0, 6).map((b, index) => (
                <div
                  key={b.id}
                  className={`flex items-center justify-between px-5 py-3.5 alytics-row-hover transition-all duration-200 ${
                    index === 0 ? "alytics-row-active" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
                      style={{
                        background: `hsl(${(index * 40 + 200) % 360}, 70%, 95%)`,
                        color: `hsl(${(index * 40 + 200) % 360}, 60%, 45%)`,
                      }}
                    >
                      {(b.customer_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="alytics-card-title text-sm font-medium truncate">{b.customer_name || "—"}</p>
                      <p className="alytics-card-sub text-xs">{b.service_title || "—"}</p>
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

        {/* Growth / Revenue Chart — Alytics style */}
        {chartData.length > 1 && (
          <div className="alytics-card rounded-2xl p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="alytics-card-title text-sm font-semibold">Growth</h3>
              <Select defaultValue="monthly">
                <SelectTrigger className="h-7 w-[100px] dash-select text-xs rounded-lg border-0 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[220px] lg:h-[260px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="revenueGradientAlytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 93%)" vertical={false} />
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
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2.5}
                    fill="url(#revenueGradientAlytics)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        )}
      </div>

      {/* Booking Activity bar chart — full width */}
      {chartData.length > 1 && (
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="alytics-card-title text-sm font-semibold">Booking Activity</h3>
          </div>
          <div className="h-[200px] lg:h-[240px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 93%)" vertical={false} />
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
                <Bar
                  dataKey="bookings"
                  fill="hsl(217, 91%, 60%)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Live Demo Website Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="alytics-card-title font-semibold text-sm">Your Website Preview</h3>
            <p className="alytics-card-sub text-xs">This is how your live site looks with your current data</p>
          </div>
          <a
            href="#"
            className="alytics-link text-xs font-medium inline-flex items-center gap-1"
          >
            Open Full Preview <ArrowRight className="w-3 h-3" />
          </a>
        </div>
        <DemoWebsite />
      </div>
    </div>
  );
};

export default HomeDashboard;
