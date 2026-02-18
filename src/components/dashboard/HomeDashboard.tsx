import { useEffect, useState, useMemo, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight,
  CalendarDays, Star, MoreHorizontal, Briefcase,
  CheckCircle2, Circle, Store, Wrench, Clock, Users, Sparkles, ChevronDown, X,
  Car, Hash,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfYear, eachDayOfInterval, isWithinInterval, parseISO, getDay } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  sparklineData?: number[];
}

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (data.length < 2) return null;
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div className="h-[32px] w-[80px] mt-1">
      <ChartContainer config={{ v: { label: "val", color } }} className="h-full w-full">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

const MetricCard = ({ icon, label, value, pct, subtext, highlighted, sparklineData }: MetricCardProps) => (
  <div className={`rounded-2xl p-5 transition-all duration-200 ${highlighted ? "dash-card-highlight" : "alytics-card"}`}>
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlighted ? "bg-[hsla(0,0%,100%,0.2)] border border-[hsla(0,0%,100%,0.15)]" : "bg-[hsla(217,91%,60%,0.08)] border border-[hsla(217,91%,60%,0.12)]"}`}
      >
        {icon}
      </div>
      {sparklineData && sparklineData.length > 1 && (
        <MiniSparkline data={sparklineData} color={highlighted ? "hsla(0,0%,100%,0.6)" : "hsl(217,91%,60%)"} />
      )}
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

/* ─── Onboarding Checklist Constants ─── */
const ONBOARDING_DISMISSED_KEY = "dashboard-onboarding-dismissed";

interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  route: string;
  check: (d: OnboardingData) => boolean;
}

interface OnboardingData {
  hasBusinessInfo: boolean;
  servicesCount: number;
  hasHours: boolean;
  customersCount: number;
  bookingsCount: number;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "business", icon: Store, title: "Add your business info", description: "Name, phone, and address", route: "/dashboard/business", check: d => d.hasBusinessInfo },
  { id: "services", icon: Wrench, title: "Add your services", description: "List what you offer with prices", route: "/dashboard/services", check: d => d.servicesCount > 0 },
  { id: "hours", icon: Clock, title: "Set your business hours", description: "So customers can book the right times", route: "/dashboard/hours", check: d => d.hasHours },
  { id: "customer", icon: Users, title: "Add your first customer", description: "Build your customer database", route: "/dashboard/customers", check: d => d.customersCount > 0 },
  { id: "booking", icon: CalendarDays, title: "Create your first booking", description: "Schedule your first job", route: "/dashboard/calendar", check: d => d.bookingsCount > 0 },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Main Dashboard ─── */
const HomeDashboard = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<{ chatbotRef?: any } | null>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ services: 0, photos: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");

  // Onboarding state
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true");
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

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
      supabase.from("profiles").select("business_name, phone").eq("user_id", user.id).single(),
      supabase.from("business_hours").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([b, s, p, t, profile, hours, customers]) => {
      setBookings(b.data || []);
      const servicesCount = s.count || 0;
      setStats({ services: servicesCount, photos: p.count || 0, testimonials: t.count || 0 });
      setBusinessName(profile.data?.business_name || "");

      setOnboardingData({
        hasBusinessInfo: !!(profile.data?.business_name && profile.data?.phone),
        servicesCount,
        hasHours: (hours.count || 0) > 0,
        customersCount: customers.count || 0,
        bookingsCount: (b.data || []).length,
      });

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

  // KPI computations
  const currentRevenue = currentBookings.reduce((sum, b) => sum + (Number(b.service_price) || 0), 0);
  const previousRevenue = previousBookings.reduce((sum, b) => sum + (Number(b.service_price) || 0), 0);
  const revenuePct = pctChange(currentRevenue, previousRevenue);

  const currentCompleted = useMemo(() => currentBookings.filter(b => b.status === "completed"), [currentBookings]);
  const previousCompleted = useMemo(() => previousBookings.filter(b => b.status === "completed"), [previousBookings]);
  const completedPct = pctChange(currentCompleted.length, previousCompleted.length);

  const avgTicket = currentCompleted.length > 0 ? Math.round(currentCompleted.reduce((s, b) => s + (Number(b.service_price) || 0), 0) / currentCompleted.length) : 0;
  const prevAvgTicket = previousCompleted.length > 0 ? Math.round(previousCompleted.reduce((s, b) => s + (Number(b.service_price) || 0), 0) / previousCompleted.length) : 0;
  const avgTicketPct = pctChange(avgTicket, prevAvgTicket);

  // Unique vehicles from notes "Vehicle: ..." or service_title
  const countUniqueVehicles = useCallback((bks: any[]) => {
    const set = new Set<string>();
    bks.forEach(b => {
      if (b.notes && b.notes.startsWith("Vehicle:")) {
        set.add(b.notes.split("\n")[0].replace("Vehicle: ", "").trim().toLowerCase());
      } else if (b.customer_name) {
        set.add(`${b.customer_name}-${b.booking_date}`.toLowerCase());
      }
    });
    return set.size;
  }, []);
  const vehiclesCurrent = countUniqueVehicles(currentBookings);
  const vehiclesPrev = countUniqueVehicles(previousBookings);
  const vehiclesPct = pctChange(vehiclesCurrent, vehiclesPrev);

  const periodLabel = `vs last ${dateRange === "ytd" ? "year" : dateRange.replace("d", " days")}`;

  // Revenue sparkline: daily revenue for sparkline in metric card
  const revenueSparkline = useMemo(() => {
    const days = eachDayOfInterval({ start, end });
    // Downsample to ~14 points max
    const step = Math.max(1, Math.floor(days.length / 14));
    const points: number[] = [];
    for (let i = 0; i < days.length; i += step) {
      const dayStr = format(days[i], "yyyy-MM-dd");
      points.push(currentBookings.filter(b => b.booking_date === dayStr).reduce((s, b) => s + (Number(b.service_price) || 0), 0));
    }
    return points;
  }, [currentBookings, start, end]);

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

  /* Top Services table */
  const topServices = useMemo(() => {
    const map: Record<string, { jobs: number; revenue: number }> = {};
    currentBookings.forEach(b => {
      const title = b.service_title || "Other";
      if (!map[title]) map[title] = { jobs: 0, revenue: 0 };
      map[title].jobs++;
      map[title].revenue += Number(b.service_price) || 0;
    });
    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data, avg: data.jobs > 0 ? Math.round(data.revenue / data.jobs) : 0 }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [currentBookings]);

  /* Busiest Days heatmap — uses ALL bookings historically */
  const busiestDays = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    const dayCount = [0, 0, 0, 0, 0, 0, 0];
    // Count weeks in the range for averaging
    const days = eachDayOfInterval({ start, end });
    days.forEach(d => { dayCount[getDay(d)]++; });
    currentBookings.forEach(b => {
      const d = parseISO(b.booking_date);
      counts[getDay(d)]++;
    });
    const avgs = counts.map((c, i) => dayCount[i] > 0 ? +(c / dayCount[i]).toFixed(1) : 0);
    const maxAvg = Math.max(...avgs, 1);
    return DAY_LABELS.map((label, i) => ({
      label,
      avg: avgs[i],
      intensity: avgs[i] / maxAvg, // 0–1
    }));
  }, [currentBookings, start, end]);

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

  // Onboarding completion logic
  const completedSteps = onboardingData ? ONBOARDING_STEPS.filter(s => s.check(onboardingData)).length : 0;
  const allComplete = completedSteps === ONBOARDING_STEPS.length;
  const showOnboarding = !onboardingDismissed && onboardingData && (
    (onboardingData.servicesCount < 2) || (onboardingData.bookingsCount === 0) ||
    !onboardingData.hasBusinessInfo
  );

  // Auto-dismiss celebration after 5 seconds
  useEffect(() => {
    if (allComplete && showOnboarding && !celebrating) {
      setCelebrating(true);
      const timer = setTimeout(() => {
        localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
        setOnboardingDismissed(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [allComplete, showOnboarding, celebrating]);

  const handleDismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    setOnboardingDismissed(true);
  };

  return (
    <div className="space-y-5">
      {/* ═══ Onboarding Checklist ═══ */}
      {showOnboarding && (
        celebrating && allComplete ? (
          <div className="rounded-2xl p-6 text-center animate-in fade-in duration-500" style={{ background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(200,85%,55%))" }}>
            <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">🎉 You're all set!</h3>
            <p className="text-white/70 text-sm mt-1">Your shop is ready to go. Start booking customers!</p>
          </div>
        ) : !allComplete ? (
          <div className="rounded-2xl overflow-hidden alytics-card" style={{ border: "1px solid hsla(217,91%,60%,0.2)" }}>
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(230,80%,55%))" }}>
              <div>
                <h3 className="text-white font-bold text-sm">Get your shop ready — 5 quick steps</h3>
                <p className="text-white/60 text-xs mt-0.5">{completedSteps}/5 complete</p>
              </div>
              <button onClick={handleDismissOnboarding} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1 w-full" style={{ background: "hsla(217,91%,60%,0.15)" }}>
              <div className="h-full transition-all duration-500" style={{ width: `${(completedSteps / 5) * 100}%`, background: "hsl(160,84%,39%)" }} />
            </div>
            {/* Steps */}
            <Collapsible open={onboardingOpen} onOpenChange={setOnboardingOpen}>
              <CollapsibleTrigger asChild>
                <button className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-medium alytics-card-sub hover:bg-[hsla(217,91%,60%,0.04)] transition-colors">
                  <span>{onboardingOpen ? "Hide steps" : "Show steps"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${onboardingOpen ? "rotate-180" : ""}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-4 space-y-1">
                  {ONBOARDING_STEPS.map(step => {
                    const done = onboardingData ? step.check(onboardingData) : false;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-3 py-2.5 group">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "hsl(160,84%,39%)" }} />
                        ) : (
                          <Circle className="w-5 h-5 shrink-0 alytics-card-sub" />
                        )}
                        <Icon className={`w-4 h-4 shrink-0 ${done ? "alytics-card-sub" : ""}`} style={done ? {} : { color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${done ? "line-through alytics-card-sub" : "alytics-card-title"}`}>{step.title}</p>
                          <p className="text-xs alytics-card-sub">{step.description}</p>
                        </div>
                        {!done && (
                          <button onClick={() => navigate(step.route)} className="text-[11px] font-semibold shrink-0 transition-colors" style={{ color: "hsl(217,91%,60%)" }}>
                            Do it now →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : null
      )}
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

      {/* ═══ KPI Cards — 2x2 mobile, 4-col desktop ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          icon={<DollarSign className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
          label="Revenue"
          value={currentRevenue > 0 ? formatCurrency(currentRevenue) : "—"}
          pct={revenuePct}
          subtext={periodLabel}
          sparklineData={revenueSparkline}
        />
        <MetricCard
          icon={<Briefcase className="w-5 h-5 text-white" strokeWidth={1.5} />}
          label="Jobs Completed"
          value={currentCompleted.length > 0 ? String(currentCompleted.length) : "—"}
          pct={completedPct}
          subtext={periodLabel}
          highlighted
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
          label="Avg. Ticket"
          value={avgTicket > 0 ? formatCurrency(avgTicket) : "—"}
          pct={avgTicketPct}
          subtext={periodLabel}
        />
        <MetricCard
          icon={<Car className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
          label="Vehicles Serviced"
          value={vehiclesCurrent > 0 ? String(vehiclesCurrent) : "—"}
          pct={vehiclesPct}
          subtext={periodLabel}
        />
      </div>

      {/* ═══ Top Services Table ═══ */}
      {topServices.length > 0 && (
        <div className="alytics-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="alytics-card-title text-sm font-semibold">Top Services</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsla(217,91%,60%,0.08)]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider dash-card-label w-8">#</th>
                  <th className="text-left px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wider dash-card-label">Service</th>
                  <th className="text-right px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wider dash-card-label">Jobs</th>
                  <th className="text-right px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wider dash-card-label">Revenue</th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider dash-card-label">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((svc, i) => (
                  <tr
                    key={svc.name}
                    className="border-b border-[hsla(217,91%,60%,0.05)] last:border-b-0 alytics-row-hover transition-colors"
                    style={i === 0 ? { borderLeft: "3px solid hsl(45,93%,47%)" } : undefined}
                  >
                    <td className="px-5 py-3 text-xs font-mono dash-card-label">{i + 1}</td>
                    <td className="px-2 py-3 alytics-card-title font-medium truncate max-w-[200px]">{svc.name}</td>
                    <td className="px-2 py-3 text-right font-mono alytics-card-title">{svc.jobs}</td>
                    <td className="px-2 py-3 text-right font-mono alytics-card-title font-semibold">{formatCurrency(svc.revenue)}</td>
                    <td className="px-5 py-3 text-right font-mono alytics-card-sub">{formatCurrency(svc.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ Revenue Bar Chart ═══ */}
      {chartData.length > 1 && (
        <div className="alytics-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="alytics-card-title text-sm font-semibold">Revenue Breakdown</h3>
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
          </div>
          <div className="alytics-divide">
            {currentBookings.length === 0 ? (
              <div className="px-5 py-10 flex flex-col items-center text-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: "hsla(217,91%,60%,0.1)",
                    border: "1px solid hsla(217,91%,60%,0.15)",
                  }}
                >
                  <CalendarDays className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} />
                </div>
                <div>
                  <p className="alytics-card-title text-sm font-semibold">No bookings yet</p>
                  <p className="alytics-card-sub text-xs mt-0.5">Bookings from customers will appear here</p>
                </div>
                <button
                  onClick={() => navigate("/dashboard/calendar")}
                  className="dash-btn dash-btn-primary dash-btn-sm mt-1"
                >
                  View Calendar
                </button>
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
                      {b.notes && b.notes.startsWith("Vehicle:") && (
                        <p className="text-[11px] alytics-card-sub truncate">{b.notes.split("\n")[0].replace("Vehicle: ", "")}</p>
                      )}
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
              <button onClick={() => navigate("/dashboard/calendar")} className="alytics-link text-xs font-medium inline-flex items-center gap-1">
                All bookings <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Busiest Days Heatmap ═══ */}
      <div className="alytics-card rounded-2xl p-5 lg:p-6">
        <h3 className="alytics-card-title text-sm font-semibold mb-4">Busiest Days</h3>
        <div className="grid grid-cols-7 gap-2 lg:gap-3">
          {busiestDays.map(d => (
            <div key={d.label} className="flex flex-col items-center gap-1.5">
              <div
                className="w-full aspect-square rounded-xl flex items-center justify-center transition-colors"
                style={{
                  background: d.intensity > 0
                    ? `hsla(217, 91%, 60%, ${0.08 + d.intensity * 0.5})`
                    : "hsla(217, 91%, 60%, 0.04)",
                  border: `1px solid hsla(217, 91%, 60%, ${0.05 + d.intensity * 0.25})`,
                }}
              >
                <span
                  className="text-lg lg:text-xl font-bold"
                  style={{ color: d.intensity > 0.5 ? "hsl(217, 91%, 70%)" : "hsla(215, 16%, 55%, 0.8)" }}
                >
                  {d.avg}
                </span>
              </div>
              <span className="text-[11px] font-medium dash-card-label">{d.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] alytics-card-sub mt-3">Average bookings per day of week</p>
      </div>
    </div>
  );
};

export default HomeDashboard;
