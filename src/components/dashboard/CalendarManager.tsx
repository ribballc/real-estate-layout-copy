import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2, ChevronLeft, ChevronRight, Plus, Clock, User, Mail, Phone,
  DollarSign, FileText, X, Calendar as CalendarIcon, Ban, RefreshCw,
  Trash2, ChevronDown, PhoneCall, Play, Car, CheckSquare, Square,
} from "lucide-react";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";

const SERVICE_CHECKLISTS: Record<string, string[]> = {
  detail: ["Exterior Wash", "Clay Bar", "Polish", "Wax/Sealant", "Wheel Detail", "Tire Dressing", "Interior Vacuum", "Wipe Down", "Windows", "Final Inspection"],
  interior: ["Vacuum All Surfaces", "Carpet Shampoo", "Seat Clean", "Dashboard Wipe", "Console Clean", "Door Panels", "Windows", "Deodorize", "Final Check"],
  ceramic: ["Wash & Decon", "Clay Bar", "Paint Correction", "Panel Wipe Down", "Ceramic Application", "Curing", "Final Inspection"],
  tint: ["Window Clean", "Rubber Trim Prep", "Film Cut", "Application", "Heat Gun Cure", "Edge Seal", "Inspection"],
  ppf: ["Wash & Decon", "Surface Prep", "Template/Cut", "Wet Application", "Squeegee", "Edge Wrap", "Cure", "Inspection"],
  vinyl: ["Surface Wash", "Panel Wipe", "Film Alignment", "Heat Application", "Edge Tuck", "Trim Reinstall", "Final Inspection"],
};

function getChecklist(serviceTitle: string): string[] {
  const t = (serviceTitle || "").toLowerCase();
  if (t.includes("full detail") || t.includes("detail")) return SERVICE_CHECKLISTS.detail;
  if (t.includes("interior")) return SERVICE_CHECKLISTS.interior;
  if (t.includes("ceramic")) return SERVICE_CHECKLISTS.ceramic;
  if (t.includes("tint")) return SERVICE_CHECKLISTS.tint;
  if (t.includes("ppf") || t.includes("paint protection")) return SERVICE_CHECKLISTS.ppf;
  if (t.includes("vinyl") || t.includes("wrap")) return SERVICE_CHECKLISTS.vinyl;
  return ["Inspect Vehicle", "Complete Service", "Quality Check", "Customer Walkthrough"];
}

function getChecklistState(bookingId: string): boolean[] {
  try {
    const raw = localStorage.getItem(`checklist_${bookingId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setChecklistState(bookingId: string, state: boolean[]) {
  localStorage.setItem(`checklist_${bookingId}`, JSON.stringify(state));
}

const JobChecklist = ({ bookingId, serviceTitle }: { bookingId: string; serviceTitle: string }) => {
  const items = getChecklist(serviceTitle);
  const [checked, setChecked] = useState<boolean[]>(() => {
    const saved = getChecklistState(bookingId);
    return items.map((_, i) => saved[i] ?? false);
  });

  const toggle = useCallback((index: number) => {
    setChecked(prev => {
      const next = [...prev];
      next[index] = !next[index];
      setChecklistState(bookingId, next);
      return next;
    });
  }, [bookingId]);

  const done = checked.filter(Boolean).length;
  const allDone = done === items.length;

  return (
    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold flex items-center gap-1.5 ${allDone ? "text-emerald-400" : "text-white/60"}`}>
          {allDone ? <><CheckSquare className="w-3.5 h-3.5" /> Job Complete ✓</> : "Job Checklist"}
        </span>
        <span className={`text-[11px] ${allDone ? "text-emerald-400/70" : "text-white/40"}`}>{done}/{items.length} complete</span>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <button
            key={item}
            onClick={() => toggle(i)}
            className={`w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
              checked[i]
                ? "text-white/30 line-through bg-white/[0.02]"
                : "text-white/70 hover:bg-white/[0.05]"
            }`}
          >
            {checked[i]
              ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              : <Square className="w-3.5 h-3.5 text-white/30 shrink-0" />
            }
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameDay } from "date-fns";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_title: string;
  service_price: number;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  notes: string;
}

interface BlockedDay {
  id: string;
  blocked_date: string;
  reason: string;
}

// Gentle pastel-tinted colors for status-coded booking cards
const statusCardColors: Record<string, string> = {
  confirmed: "bg-emerald-500/10 border-emerald-500/25",
  pending: "bg-amber-500/10 border-amber-500/25",
  cancelled: "bg-red-500/10 border-red-500/25",
  completed: "bg-blue-500/10 border-blue-500/25",
};

const statusBadgeColors: Record<string, string> = {
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

// Dot colors for calendar grid
const statusDotColors: Record<string, string> = {
  confirmed: "bg-emerald-400",
  pending: "bg-amber-400",
  cancelled: "bg-red-400",
  completed: "bg-blue-400",
};

const formatTimeShort = (time: string) => {
  // Remove seconds: "10:00:00" -> "10:00", then format to 12h
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

const CalendarManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);
  const [todayOpen, setTodayOpen] = useState(true);
  const [newBooking, setNewBooking] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    service_title: "", service_price: 0, booking_date: "",
    booking_time: "10:00", duration_minutes: 60, notes: "",
  });
  const [customerVehicles, setCustomerVehicles] = useState<{year:string;make:string;model:string;color:string;plate:string}[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const fetchBookings = async () => {
    if (!user) return;
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    const [bookingsRes, blockedRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("user_id", user.id).gte("booking_date", start).lte("booking_date", end).order("booking_time"),
      supabase.from("blocked_days").select("*").eq("user_id", user.id).gte("blocked_date", start).lte("blocked_date", end),
    ]);
    if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
    if (blockedRes.data) setBlockedDays(blockedRes.data as BlockedDay[]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [user, currentMonth]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    const startPad = getDay(start);
    return { days: allDays, startPad };
  }, [currentMonth]);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach(b => {
      const key = b.booking_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    return map;
  }, [bookings]);

  const blockedDatesSet = useMemo(() => {
    return new Set(blockedDays.map(b => b.blocked_date));
  }, [blockedDays]);

  const selectedBookings = selectedDate
    ? bookingsByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : [];

  const isSelectedBlocked = selectedDate
    ? blockedDatesSet.has(format(selectedDate, "yyyy-MM-dd"))
    : false;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayBookings = useMemo(() => bookings.filter(b => b.booking_date === todayStr), [bookings, todayStr]);
  const todayRevenue = useMemo(() => todayBookings.filter(b => b.status === "confirmed" || b.status === "pending").reduce((s, b) => s + (b.service_price || 0), 0), [todayBookings]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0]?.[0] || "?").toUpperCase();
  };

  const handleStartDay = () => {
    if (todayBookings.length > 0) {
      const sorted = [...todayBookings].sort((a, b) => a.booking_time.localeCompare(b.booking_time));
      setCurrentMonth(new Date());
      setSelectedDate(new Date());
    }
  };

  const toggleBlockDay = async () => {
    if (!user || !selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    if (isSelectedBlocked) {
      const blocked = blockedDays.find(b => b.blocked_date === dateStr);
      if (blocked) {
        await supabase.from("blocked_days").delete().eq("id", blocked.id);
        setBlockedDays(prev => prev.filter(b => b.id !== blocked.id));
        toast({ title: "Day unblocked", description: `${format(selectedDate, "MMM d")} is now available for bookings.` });
      }
    } else {
      const { data, error } = await supabase.from("blocked_days").insert({
        user_id: user.id, blocked_date: dateStr, reason: "Out of Work",
      }).select().single();
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else if (data) {
        setBlockedDays(prev => [...prev, data as BlockedDay]);
        toast({ title: "Day blocked", description: `${format(selectedDate, "MMM d")} marked as Out of Work.` });
      }
    }
  };

  const handleAdd = async () => {
    if (!user || !newBooking.customer_name || !newBooking.booking_date) return;
    const notesWithVehicle = selectedVehicle
      ? `Vehicle: ${selectedVehicle}${newBooking.notes ? "\n" + newBooking.notes : ""}`
      : newBooking.notes;
    const { error } = await supabase.from("bookings").insert({ user_id: user.id, ...newBooking, notes: notesWithVehicle });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking added!" });
      setShowAddModal(false);
      setNewBooking({ customer_name: "", customer_email: "", customer_phone: "", service_title: "", service_price: 0, booking_date: "", booking_time: "10:00", duration_minutes: 60, notes: "" });
      setCustomerVehicles([]);
      setSelectedVehicle("");
      fetchBookings();
    }
  };

  // Lookup customer vehicles by email
  const lookupCustomerVehicles = async (email: string) => {
    if (!user || !email) { setCustomerVehicles([]); return; }
    const { data } = await supabase.from("customers").select("vehicle").eq("user_id", user.id).eq("email", email).limit(1);
    if (data && data[0]?.vehicle) {
      try {
        const parsed = JSON.parse(data[0].vehicle);
        if (Array.isArray(parsed)) { setCustomerVehicles(parsed); return; }
      } catch {}
    }
    setCustomerVehicles([]);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setOpenStatusDropdown(null);
  };

  const handleDeleteBooking = async () => {
    if (!deleteBookingId) return;
    const { error } = await supabase.from("bookings").delete().eq("id", deleteBookingId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBookings(prev => prev.filter(b => b.id !== deleteBookingId));
      toast({ title: "Booking deleted" });
    }
    setDeleteBookingId(null);
  };

  // Close status dropdown when clicking outside
  useEffect(() => {
    if (!openStatusDropdown) return;
    const handler = () => setOpenStatusDropdown(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [openStatusDropdown]);

  if (loading) return <CalendarSkeleton />;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Calendar</h2>
          <p className="text-white/40 text-sm mt-1">View and manage your bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSyncModal(true)} className="text-sm text-accent underline underline-offset-2 hover:text-accent/80 transition-colors whitespace-nowrap flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Sync Google Calendar
          </button>
          <button onClick={() => { setShowAddModal(true); setNewBooking(prev => ({ ...prev, booking_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") })); }} className="dash-btn dash-btn-primary dash-btn-sm hidden sm:flex">
            <Plus className="w-4 h-4" /> Add Booking
          </button>
        </div>
      </div>

      {/* Today's Schedule Summary */}
      <Collapsible open={todayOpen} onOpenChange={setTodayOpen} className="mb-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <CollapsibleTrigger className="w-full">
            {isMobile && !todayOpen ? (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/80 text-sm font-medium">
                  {todayBookings.length} job{todayBookings.length !== 1 ? "s" : ""} today · <span className="text-emerald-400">${todayRevenue.toFixed(0)} expected</span>
                </span>
                <ChevronDown className="w-4 h-4 text-white/40" />
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 md:px-5 py-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-4 h-4 text-accent" />
                  <h3 className="text-white font-semibold text-sm">{format(new Date(), "EEEE, MMMM d")}</h3>
                  <span className="text-white/40 text-xs">·</span>
                  <span className="text-white/60 text-sm">{todayBookings.length} job{todayBookings.length !== 1 ? "s" : ""} today</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${todayOpen ? "rotate-180" : ""}`} />
              </div>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 md:px-5 pb-4 space-y-3">
              {/* Booking chips row */}
              {todayBookings.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {[...todayBookings].sort((a, b) => a.booking_time.localeCompare(b.booking_time)).map(b => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedDate(new Date()); setCurrentMonth(new Date()); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${statusDotColors[b.status] || "bg-accent"}`} />
                      <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-[10px] font-bold">{getInitials(b.customer_name || "?")}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-white text-xs font-medium whitespace-nowrap">{formatTimeShort(b.booking_time)}</div>
                        <div className="text-white/40 text-[10px] whitespace-nowrap">{b.service_title || "Service"}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CalendarIcon className="w-6 h-6 mx-auto mb-2" style={{ color: "hsla(0,0%,100%,0.15)" }} />
                  <p className="text-white/50 text-sm font-medium">Nothing scheduled today</p>
                  <p className="text-white/30 text-xs mt-0.5">Open days are an opportunity — share your link</p>
                </div>
              )}

              {/* Revenue + Start Day */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">{todayRevenue.toFixed(0)}</span>
                  <span className="text-white/40 text-xs">expected revenue</span>
                </div>
                {todayBookings.length > 0 && (
                  <button
                    onClick={handleStartDay}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
                  >
                    <Play className="w-3 h-3" /> Start Day
                  </button>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Calendar grid */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-white font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Today button */}
          <div className="flex justify-center mb-3">
            <button
              onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}
              className="text-xs text-accent hover:text-accent/80 transition-colors underline underline-offset-2"
            >
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-white/30 text-xs font-medium py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: days.startPad }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {days.days.map(day => {
              const key = format(day, "yyyy-MM-dd");
              const dayBookings = bookingsByDate.get(key) || [];
              const selected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);
              const blocked = blockedDatesSet.has(key);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-start transition-all text-xs relative group
                    ${selected ? "bg-accent/20 border border-accent/40 ring-1 ring-accent/20" : "hover:bg-white/5 border border-transparent"}
                    ${today && !selected ? "bg-white/5" : ""}
                    ${blocked && !selected ? "bg-red-500/10 border-red-500/20" : ""}
                  `}
                >
                  <span className={`font-medium ${today ? "text-accent" : blocked ? "text-red-400/70" : "text-white/70"} ${selected ? "text-accent font-bold" : ""}`}>
                    {format(day, "d")}
                  </span>
                  {blocked && (
                    <Ban className="w-2.5 h-2.5 text-red-400/60 mt-0.5" />
                  )}
                  {dayBookings.length > 0 && !blocked && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayBookings.slice(0, 3).map((b, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${statusDotColors[b.status] || "bg-accent"}`} />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-[8px] text-accent">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-accent" />
                  <h4 className="text-white font-semibold text-sm">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h4>
                </div>
                {selectedBookings.length > 0 && (
                  <span className="text-white/30 text-xs">{selectedBookings.length} booking{selectedBookings.length > 1 ? "s" : ""}</span>
                )}
              </div>

              {/* Out of Work toggle */}
              <button
                onClick={toggleBlockDay}
                className={`w-full mb-4 flex items-center justify-center gap-2 h-10 rounded-lg border text-sm font-medium transition-all ${
                  isSelectedBlocked
                    ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Ban className="w-4 h-4" />
                {isSelectedBlocked ? "Remove Out of Work" : "Mark as Out of Work"}
              </button>

              {isSelectedBlocked && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-4 text-center">
                  <p className="text-red-400 text-xs font-medium">🚫 This day is blocked — no bookings allowed</p>
                </div>
              )}

              {selectedBookings.length === 0 && !isSelectedBlocked ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No bookings this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedBookings.map(b => (
                    <div key={b.id} className={`rounded-lg border p-3.5 space-y-2.5 transition-colors ${statusCardColors[b.status] || statusCardColors.confirmed}`}>
                      {/* Header: Name - Time, status dropdown, X */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-white font-semibold text-sm">
                            {b.customer_name || "Booking"} — {formatTimeShort(b.booking_time)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Status dropdown */}
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setOpenStatusDropdown(openStatusDropdown === b.id ? null : b.id)}
                              className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusBadgeColors[b.status] || statusBadgeColors.confirmed}`}
                            >
                              {b.status} <ChevronDown className="w-2.5 h-2.5" />
                            </button>
                            {openStatusDropdown === b.id && (
                              <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-white/10 bg-[hsl(215,50%,12%)] p-1 min-w-[110px] shadow-xl">
                                {["confirmed", "pending", "completed", "cancelled"].filter(s => s !== b.status).map(s => (
                                  <button key={s} onClick={() => updateStatus(b.id, s)} className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-md transition-colors hover:bg-white/10 ${statusBadgeColors[s]}`}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button onClick={() => setDeleteBookingId(b.id)} className="text-white/20 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Details */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-white/50"><Clock className="w-3 h-3" /> {formatTimeShort(b.booking_time)} · {b.duration_minutes}min{b.service_title && <> · {b.service_title}</>}</div>
                        {b.notes && b.notes.startsWith("Vehicle:") && (
                          <div className="flex items-center gap-2 text-accent/70"><Car className="w-3 h-3" /> {b.notes.split("\n")[0].replace("Vehicle: ", "")}</div>
                        )}
                        {b.customer_email && <div className="flex items-center gap-2 text-white/50"><Mail className="w-3 h-3" /> {b.customer_email}</div>}
                        {b.customer_phone && <div className="flex items-center gap-2 text-white/50"><Phone className="w-3 h-3" /> {b.customer_phone}</div>}
                        {b.service_price > 0 && <div className="flex items-center gap-2 text-white/50"><DollarSign className="w-3 h-3" /> ${b.service_price}</div>}
                        {b.notes && <div className="flex items-start gap-2 text-white/40"><FileText className="w-3 h-3 mt-0.5" /> {b.notes.startsWith("Vehicle:") ? b.notes.split("\n").slice(1).join("\n") : b.notes}</div>}
                      </div>
                      {/* Contact buttons */}
                      <div className="flex gap-2 pt-0.5">
                        {b.customer_phone && (
                          <a href={`tel:${b.customer_phone}`} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
                            <PhoneCall className="w-3 h-3" /> Call
                          </a>
                        )}
                        {b.customer_email && (
                          <a href={`mailto:${b.customer_email}`} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors">
                            <Mail className="w-3 h-3" /> Email
                          </a>
                        )}
                      </div>
                      {/* Job Checklist — only for confirmed/pending */}
                      {(b.status === "confirmed" || b.status === "pending") && (
                        <JobChecklist bookingId={b.id} serviceTitle={b.service_title} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Select a day to view bookings</p>
            </div>
          )}
        </div>
      </div>

      {/* Marketing CTA */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Need Help Getting Bookings?</h3>
        <p className="text-white/40 text-sm mb-4">Let our team help you attract more customers and fill your calendar.</p>
        <a href="mailto:marketing@darker.com?subject=Marketing Help" className="dash-btn dash-btn-primary dash-btn-lg">
          Contact Our Marketing Team
        </a>
      </div>

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Add Booking</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-white/60 text-xs">Customer Name *</Label>
                <Input value={newBooking.customer_name} onChange={e => setNewBooking({ ...newBooking, customer_name: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Email</Label>
                <Input value={newBooking.customer_email} onChange={e => { setNewBooking({ ...newBooking, customer_email: e.target.value }); lookupCustomerVehicles(e.target.value); }} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="john@email.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Phone</Label>
                <Input value={newBooking.customer_phone} onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="(555) 123-4567" />
              </div>
              {/* Vehicle dropdown */}
              {customerVehicles.length > 0 && (
                <div className="col-span-2 space-y-1">
                  <Label className="text-white/60 text-xs flex items-center gap-1"><Car className="w-3 h-3" /> Vehicle</Label>
                  <select
                    value={selectedVehicle}
                    onChange={e => setSelectedVehicle(e.target.value)}
                    className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="" className="bg-[hsl(215,50%,10%)]">Select a vehicle</option>
                    {customerVehicles.map((v, i) => {
                      const label = [v.year, v.make, v.model].filter(Boolean).join(" ");
                      return <option key={i} value={label + (v.color ? ` · ${v.color}` : "")} className="bg-[hsl(215,50%,10%)]">{label}{v.color ? ` · ${v.color}` : ""}</option>;
                    })}
                  </select>
                  {selectedVehicle && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent">
                      <Car className="w-3 h-3" /> {selectedVehicle}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Service</Label>
                <Input value={newBooking.service_title} onChange={e => setNewBooking({ ...newBooking, service_title: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="Full Detail" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Price ($)</Label>
                <Input type="number" value={newBooking.service_price} onChange={e => setNewBooking({ ...newBooking, service_price: parseFloat(e.target.value) || 0 })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Date *</Label>
                <Input type="date" value={newBooking.booking_date} onChange={e => setNewBooking({ ...newBooking, booking_date: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Time</Label>
                <Input type="time" value={newBooking.booking_time} onChange={e => setNewBooking({ ...newBooking, booking_time: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-white/60 text-xs">Notes</Label>
                <Input value={newBooking.notes} onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="Any additional notes..." />
              </div>
            </div>
            <button onClick={handleAdd} className="dash-btn dash-btn-primary dash-btn-lg w-full">
              Add Booking
            </button>
          </div>
        </div>
      )}

      {/* Google Calendar Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Sync Google Calendar</h3>
              <button onClick={() => setShowSyncModal(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <p className="text-white/50 text-sm">Connect your Google Calendar to automatically sync your bookings and blocked days.</p>
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-amber-400 text-xs">⚠️ Google Calendar integration requires API credentials to be configured. Please contact support to enable this feature.</p>
              </div>
              <button disabled className="dash-btn dash-btn-primary dash-btn-lg w-full opacity-50">
                <RefreshCw className="w-4 h-4" /> Connect Google Calendar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Booking Confirmation */}
      <AlertDialog open={!!deleteBookingId} onOpenChange={(open) => !open && setDeleteBookingId(null)}>
        <AlertDialogContent className="bg-[hsl(215,50%,12%)] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} className="dash-btn dash-btn-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Floating Action Button */}
      <button
        onClick={() => { setShowAddModal(true); setNewBooking(prev => ({ ...prev, booking_date: format(new Date(), "yyyy-MM-dd") })); }}
        className="fixed z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[hsl(217,91%,60%)]/30 hover:shadow-xl hover:shadow-[hsl(217,91%,60%)]/40 hover:scale-105 active:scale-95 transition-all"
        style={{ background: "hsl(217, 91%, 60%)", bottom: isMobile ? "5rem" : "2rem", right: "1.5rem" }}
        aria-label="Add Booking"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default CalendarManager;
