import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2, ChevronLeft, ChevronRight, Plus, Clock, User, Mail, Phone,
  DollarSign, FileText, X, Calendar as CalendarIcon, Ban, RefreshCw,
} from "lucide-react";
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

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-accent/20 text-accent border-accent/30",
};

const CalendarManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    service_title: "", service_price: 0, booking_date: "",
    booking_time: "10:00", duration_minutes: 60, notes: "",
  });

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
    const { error } = await supabase.from("bookings").insert({ user_id: user.id, ...newBooking });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking added!" });
      setShowAddModal(false);
      setNewBooking({ customer_name: "", customer_email: "", customer_phone: "", service_title: "", service_price: 0, booking_date: "", booking_time: "10:00", duration_minutes: 60, notes: "" });
      fetchBookings();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Calendar</h2>
          <p className="text-white/40 text-sm mt-1">View and manage your bookings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSyncModal(true)} size="sm" variant="outline" className="gap-2 border-white/10 text-white/70 hover:text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4" /> Sync Google Calendar
          </Button>
          <Button onClick={() => { setShowAddModal(true); setNewBooking(prev => ({ ...prev, booking_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") })); }} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
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
                      {dayBookings.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent" />
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
                    <div key={b.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5 space-y-2 hover:border-white/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">{b.service_title || "Booking"}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[b.status] || statusColors.confirmed}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-white/50"><User className="w-3 h-3" /> {b.customer_name}</div>
                        <div className="flex items-center gap-2 text-white/50"><Clock className="w-3 h-3" /> {b.booking_time} · {b.duration_minutes}min</div>
                        {b.customer_email && <div className="flex items-center gap-2 text-white/50"><Mail className="w-3 h-3" /> {b.customer_email}</div>}
                        {b.customer_phone && <div className="flex items-center gap-2 text-white/50"><Phone className="w-3 h-3" /> {b.customer_phone}</div>}
                        {b.service_price > 0 && <div className="flex items-center gap-2 text-white/50"><DollarSign className="w-3 h-3" /> ${b.service_price}</div>}
                        {b.notes && <div className="flex items-start gap-2 text-white/50"><FileText className="w-3 h-3 mt-0.5" /> {b.notes}</div>}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        {["confirmed", "completed", "cancelled"].filter(s => s !== b.status).map(s => (
                          <button key={s} onClick={() => updateStatus(b.id, s)} className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${statusColors[s]}`}>
                            {s}
                          </button>
                        ))}
                      </div>
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
        <a href="mailto:marketing@darker.com?subject=Marketing Help" className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-medium text-white transition-colors" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
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
                <Input value={newBooking.customer_email} onChange={e => setNewBooking({ ...newBooking, customer_email: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="john@email.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Phone</Label>
                <Input value={newBooking.customer_phone} onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="(555) 123-4567" />
              </div>
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
            <Button onClick={handleAdd} className="w-full h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
              Add Booking
            </Button>
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
              <Button disabled className="w-full h-11 gap-2 opacity-50" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
                <RefreshCw className="w-4 h-4" /> Connect Google Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;
