import { useEffect, useState, useMemo } from "react";
import DemoWebsite from "./DemoWebsite";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wrench, Camera, Star, Eye, CalendarDays, DollarSign,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfYear, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";

type DateRange = "7d" | "14d" | "30d" | "90d" | "ytd";
type CompareMode = "previous" | "none";

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "14d", label: "14 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "ytd", label: "YTD" },
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
    bookings.filter(b => { const d = parseISO(b.booking_date); return isWithinInterval(d, { start, end }); }), [bookings, start, end]);

  const previousBookings = useMemo(() =>
    bookings.filter(b => { const d = parseISO(b.booking_date); return isWithinInterval(d, { start: prev.start, end: prev.end }); }), [bookings, prev]);

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
    { label: "Revenue", value: formatCurrency(currentRevenue), change: revenuePct, icon: DollarSign, color: "160 84% 39%", chartKey: "revenue" as const },
    { label: "Bookings", value: currentJobCount, change: jobsPct, icon: CalendarDays, color: "217 91% 60%", chartKey: "bookings" as const },
    { label: "Views", value: "—", change: null, icon: Eye, color: "215 16% 47%", chartKey: null },
    { label: "Reviews", value: stats.testimonials, change: null, icon: Star, color: "45 93% 47%", chartKey: null },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(160 84% 39%)" },
    bookings: { label: "Bookings", color: "hsl(217 91% 60%)" },
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white/90 tracking-tight">Dashboard</h2>
          <p className="text-white/25 text-[11px]">Track your business performance</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="h-7 w-[100px] bg-white/[0.03] border-white/[0.06] text-white/60 text-[11px] rounded-lg hover:bg-white/[0.05] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={compareMode} onValueChange={(v) => setCompareMode(v as CompareMode)}>
            <SelectTrigger className="h-7 w-[120px] bg-white/[0.03] border-white/[0.06] text-white/60 text-[11px] rounded-lg hover:bg-white/[0.05] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous">vs Previous</SelectItem>
              <SelectItem value="none">No compare</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className="group relative rounded-xl p-4 overflow-hidden transition-all duration-300 hover:translate-y-[-1px]"
            style={{
              background: "hsla(215,50%,10%,0.4)",
              border: "1px solid hsla(217,91%,60%,0.06)",
              boxShadow: "0 0 0 0 hsla(217,91%,60%,0)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsla(217,91%,60%,0.15)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px hsla(217,91%,60%,0.06), inset 0 1px 0 hsla(217,91%,60%,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsla(217,91%,60%,0.06)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 hsla(217,91%,60%,0)";
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-white/25 text-[10px] font-medium uppercase tracking-wider">{m.label}</span>
              <m.icon className="w-3 h-3 transition-all duration-300" style={{ color: `hsl(${m.color} / 0.4)` }} strokeWidth={1.5} />
            </div>
            <p className="text-xl font-semibold text-white/90 tracking-tight font-mono">{m.value}</p>
            {m.change !== null && compareMode === "previous" && (
              <div className={`flex items-center gap-0.5 mt-1.5 text-[10px] font-medium ${m.change >= 0 ? "text-emerald-400/70" : "text-red-400/70"}`}>
                {m.change >= 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {m.change >= 0 ? "+" : ""}{m.change}%
              </div>
            )}
            {/* Subtle glow on bottom */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, hsl(${m.color} / 0.3), transparent)` }}
            />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {metricCards.filter(m => m.chartKey).map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl p-4 space-y-3 group relative overflow-hidden"
            style={{
              background: "hsla(215,50%,10%,0.4)",
              border: "1px solid hsla(217,91%,60%,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background: `hsl(${metric.color} / 0.08)`,
                    boxShadow: `0 0 12px hsl(${metric.color} / 0.08)`,
                  }}
                >
                  <metric.icon className="w-3 h-3" style={{ color: `hsl(${metric.color} / 0.6)` }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white/25 text-[10px] font-medium uppercase tracking-wider">{metric.label}</p>
                  <p className="text-lg font-semibold text-white/90 tracking-tight font-mono">{metric.value}</p>
                </div>
              </div>
              {metric.change !== null && compareMode === "previous" && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${metric.change >= 0 ? "bg-emerald-500/8 text-emerald-400/70" : "bg-red-500/8 text-red-400/70"}`}>
                  {metric.change >= 0 ? "+" : ""}{metric.change}%
                </span>
              )}
            </div>

            {metric.chartKey && chartData.length > 1 && (
              <div className="h-[100px] -mx-1">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
                    <defs>
                      <linearGradient id={`g-${metric.chartKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={`hsl(${metric.color})`} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={`hsl(${metric.color})`} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.03)" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "hsla(0,0%,100%,0.15)", fontSize: 9 }} interval="preserveStartEnd" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey={metric.chartKey} stroke={`hsl(${metric.color})`} strokeWidth={1.5} fill={`url(#g-${metric.chartKey})`} />
                  </AreaChart>
                </ChartContainer>
              </div>
            )}

            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, hsl(${metric.color} / 0.25), transparent)` }} />
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "hsla(215,50%,10%,0.4)",
          border: "1px solid hsla(217,91%,60%,0.06)",
        }}
      >
        <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent/60" style={{ boxShadow: "0 0 6px hsla(217,91%,60%,0.4)" }} />
          <h3 className="text-white/70 font-medium text-[12px]">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.03]">
                <th className="text-left text-white/20 text-[9px] font-medium uppercase tracking-widest px-4 py-2.5">Customer</th>
                <th className="text-left text-white/20 text-[9px] font-medium uppercase tracking-widest px-4 py-2.5">Service</th>
                <th className="text-left text-white/20 text-[9px] font-medium uppercase tracking-widest px-4 py-2.5">Date</th>
                <th className="text-right text-white/20 text-[9px] font-medium uppercase tracking-widest px-4 py-2.5">Amount</th>
                <th className="text-right text-white/20 text-[9px] font-medium uppercase tracking-widest px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/20 text-[11px]">No bookings in this period</td>
                </tr>
              ) : (
                currentBookings.slice(0, 8).map((b) => (
                  <tr key={b.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-2.5 text-white/60 font-medium">{b.customer_name || "—"}</td>
                    <td className="px-4 py-2.5 text-white/35">{b.service_title || "—"}</td>
                    <td className="px-4 py-2.5 text-white/25 font-mono text-[10px]">{b.booking_date}</td>
                    <td className="px-4 py-2.5 text-right text-white/80 font-semibold font-mono text-[10px]">{formatCurrency(Number(b.service_price) || 0)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium tracking-wide ${
                        b.status === "confirmed" ? "bg-emerald-500/8 text-emerald-400/70" :
                        b.status === "completed" ? "bg-accent/8 text-accent/70" :
                        b.status === "cancelled" ? "bg-red-500/8 text-red-400/70" :
                        "bg-amber-500/8 text-amber-400/70"
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

      {/* Website Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white/70 font-medium text-[12px]">Website Preview</h3>
            <p className="text-white/20 text-[10px]">Live preview with your current data</p>
          </div>
          <a
            href="#"
            className="text-[10px] font-medium px-3 py-1.5 rounded-lg transition-all duration-300 hover:translate-y-[-1px]"
            style={{
              background: "hsla(217,91%,60%,0.06)",
              border: "1px solid hsla(217,91%,60%,0.12)",
              color: "hsl(217,91%,60%)",
              boxShadow: "0 0 12px hsla(217,91%,60%,0.04)",
            }}
          >
            Open Preview →
          </a>
        </div>
        <DemoWebsite />
      </div>
    </div>
  );
};

export default HomeDashboard;
