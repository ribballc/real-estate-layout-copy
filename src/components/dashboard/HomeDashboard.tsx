import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight,
  CalendarDays, Star, MoreHorizontal, Briefcase,
  CheckCircle2, Circle, Store, Wrench, Clock, Users, Sparkles, ChevronDown, X,
  Car, Hash, Camera, ExternalLink, CalendarOff, Copy, Check,
} from "lucide-react";
import WeeklySummaryCard from "./WeeklySummaryCard";
import BookingActivityFeed from "./BookingActivityFeed";
import ChurnRiskBanner from "./ChurnRiskBanner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format, subDays, startOfDay, endOfDay, startOfYear, eachDayOfInterval, isWithinInterval, parseISO, getDay } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "@/components/EmptyState";

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

const MetricCard = ({ icon, label, value, pct, subtext, highlighted, sparklineData }: MetricCardProps) => {
  // Count-up animation for numeric values
  const numericValue = useMemo(() => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  }, [value]);

  const isCountable = value !== "—" && numericValue > 0;
  const prefix = value.startsWith("$") ? "$" : "";
  
  const [displayNum, setDisplayNum] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isCountable || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayNum(Math.round(eased * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isCountable, numericValue]);

  // Reset animation if value changes significantly
  useEffect(() => {
    hasAnimated.current = false;
  }, [value]);

  const displayValue = isCountable
    ? `${prefix}${displayNum.toLocaleString()}`
    : value;

  return (
    <div className={`dash-card min-h-[120px] flex flex-col justify-between transition-all duration-200 ${highlighted ? "dash-card-highlight" : "alytics-card"}`}>
      {/* Row 1: Label + Icon */}
      <div className="flex items-center justify-between">
        <p className={`dash-label ${highlighted ? "text-white/80" : "dash-card-label"}`}>{label}</p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlighted ? "bg-[hsla(0,0%,100%,0.2)] border border-[hsla(0,0%,100%,0.15)]" : "bg-[hsla(217,91%,60%,0.08)] border border-[hsla(217,91%,60%,0.12)]"}`}
        >
          {icon}
        </div>
      </div>

      {/* Row 2: Big number pinned to bottom */}
      <div className="mt-auto pt-3">
        <p className={`dash-metric ${highlighted ? "text-white" : "dash-card-value"}`}>{displayValue}</p>
        {pct !== null && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {pct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(pct)}%
            </span>
            <span className={`text-xs ${highlighted ? "text-white/60" : "dash-card-sublabel"}`}>
              {subtext || "vs last period"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Onboarding Checklist Constants ─── */
const ONBOARDING_DISMISSED_KEY = "dashboard-onboarding-dismissed";

interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  route?: string;
  copyAction?: boolean;
  check: (d: OnboardingData) => boolean;
}

interface OnboardingData {
  hasBusinessInfo: boolean;
  servicesCount: number;
  hasHours: boolean;
  photosCount: number;
  testimonialsCount: number;
  slug: string | null;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "services", icon: Wrench, title: "Add your first service", description: "So customers can see what you offer", route: "/dashboard/services", check: d => d.servicesCount > 0 },
  { id: "photos", icon: Camera, title: "Upload a photo of your work", description: "Show off your best details", route: "/dashboard/photos", check: d => d.photosCount > 0 },
  { id: "hours", icon: Clock, title: "Set your business hours", description: "So customers book the right times", route: "/dashboard/hours", check: d => d.hasHours },
  { id: "link", icon: ExternalLink, title: "Share your booking link", description: "Start getting bookings today", copyAction: true, check: () => false },
  { id: "review", icon: Star, title: "Collect your first review", description: "Build trust with new visitors", route: "/dashboard/testimonials", check: d => d.testimonialsCount > 0 },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Ghost Metrics Intro ─── */
const INTRO_FLAG = "darker_dashboard_intro_seen";

const GHOST_METRICS = {
  revenue: 6840,
  jobsCompleted: 47,
  avgTicket: 145,
  vehiclesServiced: 9,
};

const GHOST_SPARKLINE = [120, 340, 280, 510, 390, 620, 580, 710, 490, 840, 760, 650, 920, 880];

const GHOST_CHART_DATA = [
  { date: "Feb 14", revenue: 420, bookings: 3 },
  { date: "Feb 15", revenue: 650, bookings: 4 },
  { date: "Feb 16", revenue: 180, bookings: 1 },
  { date: "Feb 17", revenue: 890, bookings: 5 },
  { date: "Feb 18", revenue: 340, bookings: 2 },
  { date: "Feb 19", revenue: 1120, bookings: 6 },
  { date: "Feb 20", revenue: 760, bookings: 4 },
  { date: "Feb 21", revenue: 980, bookings: 5 },
  { date: "Feb 22", revenue: 500, bookings: 3 },
  { date: "Feb 23", revenue: 1000, bookings: 6 },
];

const GHOST_PIE = [
  { name: "Full Detail", value: 2400, pct: 35 },
  { name: "Ceramic Coating", value: 1950, pct: 29 },
  { name: "Interior Only", value: 1200, pct: 18 },
  { name: "Paint Correction", value: 850, pct: 12 },
  { name: "Express Wash", value: 440, pct: 6 },
];

const GHOST_TOP_SERVICES = [
  { name: "Full Detail", jobs: 16, revenue: 2400, avg: 150 },
  { name: "Ceramic Coating", jobs: 3, revenue: 1950, avg: 650 },
  { name: "Interior Only", jobs: 10, revenue: 1200, avg: 120 },
  { name: "Paint Correction", jobs: 3, revenue: 850, avg: 283 },
  { name: "Express Wash", jobs: 11, revenue: 440, avg: 40 },
];

const GHOST_BOOKINGS = [
  { id: "g1", customer_name: "Marcus T.", service_title: "Full Detail", booking_date: "2026-02-21", booking_time: "10:00", service_price: 180, status: "confirmed", notes: "" },
  { id: "g2", customer_name: "Sarah K.", service_title: "Ceramic Coating", booking_date: "2026-02-22", booking_time: "09:00", service_price: 650, status: "confirmed", notes: "" },
  { id: "g3", customer_name: "James R.", service_title: "Interior Only", booking_date: "2026-02-23", booking_time: "13:00", service_price: 120, status: "pending", notes: "" },
  { id: "g4", customer_name: "Trey M.", service_title: "Paint Correction", booking_date: "2026-02-24", booking_time: "11:00", service_price: 340, status: "confirmed", notes: "" },
];

const GHOST_HEATMAP = [
  { label: "Sun", avg: 1.2, intensity: 0.24 },
  { label: "Mon", avg: 2.8, intensity: 0.56 },
  { label: "Tue", avg: 3.5, intensity: 0.70 },
  { label: "Wed", avg: 4.1, intensity: 0.82 },
  { label: "Thu", avg: 5.0, intensity: 1.0 },
  { label: "Fri", avg: 4.3, intensity: 0.86 },
  { label: "Sat", avg: 3.9, intensity: 0.78 },
];

type IntroPhase = "hidden" | "fadeIn" | "visible" | "fadeOut" | "done";

function useGhostIntro() {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    localStorage.getItem(INTRO_FLAG) ? "done" : "fadeIn"
  );

  useEffect(() => {
    if (phase === "done") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Phase 1: fade in 0-400ms
    timers.push(setTimeout(() => setPhase("visible"), 400));
    // Phase 2→3: visible until 4500ms then fade out
    timers.push(setTimeout(() => setPhase("fadeOut"), 4500));
    // Phase 4: done at 6000ms
    timers.push(setTimeout(() => {
      setPhase("done");
      localStorage.setItem(INTRO_FLAG, "1");
    }, 6000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const isIntro = phase !== "done";
  const showShimmer = phase === "visible";
  const opacity = phase === "fadeIn" ? 0 : phase === "fadeOut" ? 0.3 : 1;
  return { phase, isIntro, showShimmer, opacity };
}

/* ─── Animated Counter for countdown ─── */
function useCountdown(target: number, active: boolean, duration = 800) {
  const [val, setVal] = useState(target);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) { setVal(target); return; }
    const startTime = performance.now();
    const startVal = target;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setVal(Math.round(startVal * (1 - progress)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);
  return val;
}

/* ─── Main Dashboard ─── */
const HomeDashboard = () => {
  const { user } = useAuth();
  const outletContext = useOutletContext<{ chatbotRef?: any } | null>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ services: 0, photos: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const isDark = (localStorage.getItem("dashboard-theme") || "light") === "dark";
  const [refreshKey, setRefreshKey] = useState(0);
  const ghost = useGhostIntro();

  // Ghost countdown values
  const isFadingOut = ghost.phase === "fadeOut";
  const gRevenue = useCountdown(GHOST_METRICS.revenue, isFadingOut);
  const gJobs = useCountdown(GHOST_METRICS.jobsCompleted, isFadingOut);
  const gAvg = useCountdown(GHOST_METRICS.avgTicket, isFadingOut);
  const gVehicles = useCountdown(GHOST_METRICS.vehiclesServiced, isFadingOut);
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
      supabase.from("bookings").select("id, booking_date, booking_time, customer_name, service_title, service_price, status, notes").eq("user_id", user.id).limit(500),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("photos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("profiles").select("business_name, phone, slug").eq("user_id", user.id).single(),
      supabase.from("business_hours").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("customers").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([b, s, p, t, profile, hours, customers]) => {
      if (b.error) { console.error("Bookings fetch error:", b.error); }
      setBookings(b.data || []);
      const servicesCount = s.count || 0;
      const photosCount = p.count || 0;
      const testimonialsCount = t.count || 0;
      setStats({ services: servicesCount, photos: photosCount, testimonials: testimonialsCount });
      setBusinessName(profile.data?.business_name || "");

      setOnboardingData({
        hasBusinessInfo: !!(profile.data?.business_name && profile.data?.phone),
        servicesCount,
        hasHours: (hours.count || 0) > 0,
        photosCount,
        testimonialsCount,
        slug: (profile.data as any)?.slug || null,
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

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayBookings = useMemo(() => bookings.filter(b => b.booking_date === todayStr), [bookings, todayStr]);
  const todayRevenue = todayBookings.reduce((s, b) => s + (Number(b.service_price) || 0), 0);

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
    (onboardingData.servicesCount === 0) || (onboardingData.photosCount === 0) ||
    !onboardingData.hasHours
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
    <div
      className="space-y-5"
      style={{
        opacity: ghost.phase === "fadeIn" ? 0 : 1,
        transition: "opacity 0.4s ease-out",
      }}
    >
      {/* ═══ Churn Risk Banner ═══ */}
      <ChurnRiskBanner />

      {/* ═══ Weekly Summary Card ═══ */}
      <WeeklySummaryCard />

      {/* ═══ Onboarding Checklist ═══ */}
      {showOnboarding && (
        celebrating && allComplete ? (
          <div className="dash-card p-6 text-center animate-in fade-in duration-500" style={{ background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(200,85%,55%))" }}>
            <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">🎉 You're all set!</h3>
            <p className="text-white/70 text-sm mt-1">Your shop is ready to go. Start booking customers!</p>
          </div>
        ) : !allComplete ? (
          <div className="overflow-hidden alytics-card" style={{ border: "1px solid hsla(217,91%,60%,0.2)" }}>
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(230,80%,55%))" }}>
              <div>
                <h3 className="text-white font-bold text-sm">Get your shop ready — 5 quick steps</h3>
                <p className="text-white/70 text-xs mt-0.5">{completedSteps}/5 complete</p>
              </div>
              <button onClick={handleDismissOnboarding} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors">
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
                        {!done && step.route && (
                          <button onClick={() => navigate(step.route!)} className="text-xs font-semibold shrink-0 transition-colors" style={{ color: "hsl(217,91%,60%)" }}>
                            Do it now →
                          </button>
                        )}
                        {!done && step.copyAction && onboardingData?.slug && (
                          <button
                            onClick={() => {
                              const url = `${onboardingData.slug}.darkerdigital.com/book`;
                              navigator.clipboard.writeText(url);
                              toast({ title: "Booking link copied!", description: url });
                            }}
                            className="text-xs font-semibold shrink-0 transition-colors flex items-center gap-1"
                            style={{ color: "hsl(217,91%,60%)" }}
                          >
                            <Copy className="w-3 h-3" /> Copy link
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
          <h2 className="dash-page-title dash-title">
            {greeting}{businessName ? `, ${businessName}` : ""}
          </h2>
          <p className="dash-subtitle text-xs lg:text-sm mt-0.5">Here's how your business is doing</p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="h-9 w-[150px] dash-select text-xs rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="flex items-center gap-2 flex-wrap -mt-1">
        <button
          onClick={() => navigate("/dashboard/jobs")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
            isDark
              ? "bg-[hsla(217,91%,60%,0.1)] border border-[hsla(217,91%,60%,0.2)] text-[hsl(217,91%,72%)] hover:bg-[hsla(217,91%,60%,0.18)]"
              : "bg-[hsla(217,91%,60%,0.07)] border border-[hsla(217,91%,60%,0.2)] text-[hsl(217,91%,48%)] hover:bg-[hsla(217,91%,60%,0.13)]"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />
          New Job
        </button>
        {onboardingData?.slug && (
          <button
            onClick={() => {
              const url = `${onboardingData.slug}.darkerdigital.com/book`;
              navigator.clipboard.writeText(url);
              toast({ title: "Booking link copied!" });
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              isDark
                ? "bg-[hsla(0,0%,100%,0.05)] border border-[hsla(0,0%,100%,0.1)] text-[hsla(0,0%,100%,0.55)] hover:text-[hsla(0,0%,100%,0.8)] hover:bg-[hsla(0,0%,100%,0.08)]"
                : "bg-[hsl(214,20%,97%)] border border-[hsl(214,20%,90%)] text-[hsl(215,16%,45%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,94%)]"
            }`}
          >
            <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
            Share Link
          </button>
        )}
        <button
          onClick={() => navigate("/dashboard/calendar")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
            isDark
              ? "bg-[hsla(0,0%,100%,0.05)] border border-[hsla(0,0%,100%,0.1)] text-[hsla(0,0%,100%,0.55)] hover:text-[hsla(0,0%,100%,0.8)] hover:bg-[hsla(0,0%,100%,0.08)]"
              : "bg-[hsl(214,20%,97%)] border border-[hsl(214,20%,90%)] text-[hsl(215,16%,45%)] hover:text-[hsl(215,25%,20%)] hover:bg-[hsl(214,20%,94%)]"
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.5} />
          Calendar
        </button>
      </div>

      {/* ═══ Today's at-a-glance ═══ */}
      {!ghost.isIntro && todayBookings.length > 0 && (
        <div className="alytics-card flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "hsla(217,91%,60%,0.1)", border: "1px solid hsla(217,91%,60%,0.15)" }}
            >
              <CalendarDays className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="alytics-card-title text-sm font-semibold">Today — {format(new Date(), "MMMM d")}</p>
              <p className="alytics-card-sub text-xs">
                {todayBookings.length} booking{todayBookings.length !== 1 ? "s" : ""}
                {todayRevenue > 0 ? ` · ${formatCurrency(todayRevenue)}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/calendar")}
            className="alytics-link text-xs font-medium inline-flex items-center gap-1"
          >
            View <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ═══ KPI Cards — 2x2 mobile, 4-col desktop ═══ */}
      <div className="dash-grid-4">
        <div className={ghost.showShimmer ? "ghost-shimmer rounded-[14px]" : ""}>
          <MetricCard
            icon={<DollarSign className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
            label="Revenue"
            value={ghost.isIntro ? formatCurrency(gRevenue) : (currentRevenue > 0 ? formatCurrency(currentRevenue) : "—")}
            pct={ghost.isIntro ? 18 : revenuePct}
            subtext={periodLabel}
            sparklineData={ghost.isIntro ? GHOST_SPARKLINE : revenueSparkline}
          />
        </div>
        <div className={ghost.showShimmer ? "ghost-shimmer rounded-[14px]" : ""}>
          <MetricCard
            icon={<Briefcase className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
            label="Jobs Completed"
            value={ghost.isIntro ? String(gJobs) : (currentCompleted.length > 0 ? String(currentCompleted.length) : "—")}
            pct={ghost.isIntro ? 12 : completedPct}
            subtext={periodLabel}
            highlighted
          />
        </div>
        <div className={ghost.showShimmer ? "ghost-shimmer rounded-[14px]" : ""}>
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
            label="Avg. Ticket"
            value={ghost.isIntro ? formatCurrency(gAvg) : (avgTicket > 0 ? formatCurrency(avgTicket) : "—")}
            pct={ghost.isIntro ? 8 : avgTicketPct}
            subtext={periodLabel}
          />
        </div>
        <div className={ghost.showShimmer ? "ghost-shimmer rounded-[14px]" : ""}>
          <MetricCard
            icon={<Car className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />}
            label="Vehicles Serviced"
            value={ghost.isIntro ? String(gVehicles) : (vehiclesCurrent > 0 ? String(vehiclesCurrent) : "—")}
            pct={ghost.isIntro ? 15 : vehiclesPct}
            subtext={periodLabel}
          />
        </div>
      </div>

      {/* ═══ Top Services Table ═══ */}
      {(ghost.isIntro ? GHOST_TOP_SERVICES : topServices).length > 0 && (
        <div className={`alytics-card overflow-hidden ${ghost.showShimmer ? "ghost-shimmer" : ""}`}>
          <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
            <h3 className="dash-card-title alytics-card-title">Top Services</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsla(217,91%,60%,0.08)]">
                   <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider dash-card-label w-8">#</th>
                   <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider dash-card-label">Service</th>
                   <th className="text-right px-2 py-2.5 text-xs font-semibold uppercase tracking-wider dash-card-label">Jobs</th>
                   <th className="text-right px-2 py-2.5 text-xs font-semibold uppercase tracking-wider dash-card-label">Revenue</th>
                   <th className="text-right px-5 py-2.5 text-xs font-semibold uppercase tracking-wider dash-card-label">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {(ghost.isIntro ? GHOST_TOP_SERVICES : topServices).map((svc, i) => (
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
      {(ghost.isIntro ? GHOST_CHART_DATA : chartData).length > 1 && (
        <div className={`alytics-card p-5 lg:p-6 ${ghost.showShimmer ? "ghost-shimmer" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="dash-card-title alytics-card-title">Revenue Breakdown</h3>
          </div>
          <div className="h-[240px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={ghost.isIntro ? GHOST_CHART_DATA : chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "hsla(214,20%,50%,0.15)" : "hsla(214,20%,40%,0.12)"} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: isDark ? "hsl(215, 16%, 55%)" : "hsl(215, 20%, 45%)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: isDark ? "hsl(215, 16%, 55%)" : "hsl(215, 20%, 45%)" }}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Report Overview — Pie chart */}
        <div className={`alytics-card p-5 lg:p-6 ${ghost.showShimmer ? "ghost-shimmer" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="dash-card-title alytics-card-title">Report Overview</h3>
          </div>
          {(ghost.isIntro ? GHOST_PIE : serviceBreakdown).length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-[200px] w-full max-w-[200px] mx-auto shrink-0">
                <ChartContainer config={{ value: { label: "Revenue", color: "hsl(217 91% 60%)" } }} className="h-full w-full">
                  <PieChart>
                    <Pie
                      data={ghost.isIntro ? GHOST_PIE : serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                      animationDuration={600}
                    >
                      {(ghost.isIntro ? GHOST_PIE : serviceBreakdown).map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {(ghost.isIntro ? GHOST_PIE : serviceBreakdown).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
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

        {/* Recent Bookings / Activity Feed */}
        {(() => {
          const displayBookings = ghost.isIntro ? GHOST_BOOKINGS : currentBookings;
          if (!ghost.isIntro && displayBookings.length === 0) {
            return (
              <div className="alytics-card overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5">
                  <h3 className="dash-card-title alytics-card-title">Recent Activity</h3>
                </div>
                <BookingActivityFeed onNewBooking={() => setRefreshKey(k => k + 1)} />
                <div className="px-5 py-10 flex flex-col items-center text-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{
                      background: "hsla(217,91%,60%,0.1)",
                      border: "1px solid hsla(217,91%,60%,0.15)",
                    }}
                  >
                    <CalendarDays className="w-5 h-5" style={{ color: "hsl(217,91%,60%)" }} />
                  </div>
                  <div>
                    <p className="alytics-card-title text-sm font-semibold">No bookings yet</p>
                    <p className="alytics-card-sub text-xs mt-0.5">Bookings from customers will appear here in real-time</p>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard/calendar")}
                    className="dash-btn dash-btn-primary dash-btn-sm mt-1"
                  >
                    View Calendar
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div className={`alytics-card overflow-hidden ${ghost.showShimmer ? "ghost-shimmer" : ""}`}>
              <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
                <h3 className="dash-card-title alytics-card-title">Recent Bookings</h3>
                {!ghost.isIntro && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live" />}
              </div>
              <div className="alytics-divide">
                {displayBookings.slice(0, 5).map((b: any, index: number) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between px-5 py-3 alytics-row-hover transition-all duration-200 ${ghost.showShimmer ? "ghost-shimmer" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                        style={{
                          background: isDark
                            ? `hsl(${(index * 50 + 200) % 360}, 55%, 22%)`
                            : `hsl(${(index * 50 + 200) % 360}, 70%, 92%)`,
                          color: isDark
                            ? `hsl(${(index * 50 + 200) % 360}, 80%, 70%)`
                            : `hsl(${(index * 50 + 200) % 360}, 60%, 35%)`,
                        }}
                      >
                        {(b.customer_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="alytics-card-title text-sm font-medium truncate">{b.customer_name || "—"}</p>
                        <p className="alytics-card-sub text-xs truncate">{b.service_title || "—"} — {formatCurrency(Number(b.service_price) || 0)}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="alytics-card-title text-sm font-semibold font-mono">{formatCurrency(Number(b.service_price) || 0)}</p>
                      <span className={`text-xs font-semibold uppercase tracking-wide ${
                        b.status === "confirmed" ? "text-emerald-400" :
                        b.status === "completed" ? "text-[hsl(217,91%,60%)]" :
                        b.status === "cancelled" ? "text-rose-400" :
                        "text-amber-400"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {!ghost.isIntro && currentBookings.length > 0 && (
                <div className="px-5 py-3">
                  <button onClick={() => navigate("/dashboard/calendar")} className="alytics-link text-xs font-medium inline-flex items-center gap-1">
                    All bookings <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ═══ Busiest Days Heatmap ═══ */}
      <div className={`alytics-card p-5 lg:p-6 ${ghost.showShimmer ? "ghost-shimmer" : ""}`}>
        <h3 className="dash-card-title alytics-card-title mb-4">Busiest Days</h3>
        <div className="grid grid-cols-7 gap-2 lg:gap-3">
          {(ghost.isIntro ? GHOST_HEATMAP : busiestDays).map(d => (
            <div key={d.label} className="flex flex-col items-center gap-2">
              <div
                className="w-full aspect-square rounded-lg flex items-center justify-center transition-colors"
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
              <span className="text-xs font-medium dash-card-label">{d.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs alytics-card-sub mt-3">Average bookings per day of week</p>
      </div>

      {/* ═══ Ghost Intro Floating Pill ═══ */}
      {ghost.isIntro && ghost.phase !== "fadeIn" && (
        <div
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 px-5 py-2.5"
          style={{
            transform: "translateX(-50%)",
            background: "hsla(217,91%,60%,0.12)",
            border: "1px solid hsla(217,91%,60%,0.3)",
            backdropFilter: "blur(12px)",
            borderRadius: "99px",
            animation: ghost.phase === "fadeOut"
              ? "ghostPillOut 0.4s ease-in forwards"
              : "ghostPillIn 0.4s ease-out forwards",
          }}
        >
          <Sparkles className="w-4 h-4 shrink-0" style={{ color: "hsl(217,91%,60%)" }} />
          <span className="text-white text-[13px] font-medium whitespace-nowrap">
            This is a preview of your future dashboard — activate your trial to see real data
          </span>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
