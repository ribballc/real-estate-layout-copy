import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Loader2, Plus, Clock, User, Mail, Phone, DollarSign, FileText, X,
  ChevronLeft, ChevronRight, PhoneCall, CheckCircle2, Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";

/* ── Types ───────────────────────────────────────────── */

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

interface Customer {
  email: string;
  vehicle: string;
}

/* ── Column config ───────────────────────────────────── */

interface Column {
  id: string;
  label: string;
  statuses: string[];
  color: string;
  bg: string;
  border: string;
  strip: string;
}

const COLUMNS: Column[] = [
  {
    id: "scheduled",
    label: "Scheduled",
    statuses: ["confirmed"],
    color: "hsl(217, 91%, 60%)",
    bg: "hsla(217, 91%, 60%, 0.08)",
    border: "hsla(217, 91%, 60%, 0.25)",
    strip: "hsl(217, 91%, 60%)",
  },
  {
    id: "in_progress",
    label: "In Progress",
    statuses: ["pending"],
    color: "hsl(38, 92%, 50%)",
    bg: "hsla(38, 92%, 50%, 0.08)",
    border: "hsla(38, 92%, 50%, 0.25)",
    strip: "hsl(38, 92%, 50%)",
  },
  {
    id: "ready",
    label: "Ready for Pickup",
    statuses: ["ready"],
    color: "hsl(142, 71%, 45%)",
    bg: "hsla(142, 71%, 45%, 0.08)",
    border: "hsla(142, 71%, 45%, 0.25)",
    strip: "hsl(142, 71%, 45%)",
  },
  {
    id: "completed",
    label: "Completed",
    statuses: ["completed"],
    color: "hsl(160, 84%, 39%)",
    bg: "hsla(160, 84%, 39%, 0.08)",
    border: "hsla(160, 84%, 39%, 0.25)",
    strip: "hsl(160, 84%, 39%)",
  },
];

const STATUS_FOR_COLUMN: Record<string, string> = {
  scheduled: "confirmed",
  in_progress: "pending",
  ready: "ready",
  completed: "completed",
};

/* ── Service step checklists ─────────────────────────── */

const SERVICE_STEPS: Record<string, string[]> = {
  "Full Detail": ["Wash", "Clay Bar", "Polish", "Wax", "Interior Clean", "Final Inspection"],
  "Interior Detail": ["Vacuum", "Shampoo Carpets", "Clean Dashboard", "Condition Leather", "Final Inspection"],
  "Exterior Detail": ["Pre-Wash", "Hand Wash", "Clay Bar", "Polish", "Wax", "Final Inspection"],
  "Paint Correction": ["Wash", "Decontamination", "Compound", "Polish", "Sealant", "Final Inspection"],
  "Ceramic Coating": ["Wash", "Clay Bar", "Paint Correction", "IPA Wipe", "Coating Application", "Cure Time", "Final Inspection"],
  default: ["Prep", "Service", "Quality Check", "Final Inspection"],
};

function getSteps(serviceTitle: string): string[] {
  for (const [key, steps] of Object.entries(SERVICE_STEPS)) {
    if (key === "default") continue;
    if (serviceTitle.toLowerCase().includes(key.toLowerCase())) return steps;
  }
  return SERVICE_STEPS.default;
}

const formatTimeShort = (time: string) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

/* ── Main component ──────────────────────────────────── */

const JobsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customerMap, setCustomerMap] = useState<Map<string, Customer>>(new Map());
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [mobileCol, setMobileCol] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    service_title: "", service_price: 0, booking_date: "",
    booking_time: "10:00", duration_minutes: 60, notes: "",
  });

  /* ── Data fetch ──────────────────────────────────── */

  const fetchData = useCallback(async () => {
    if (!user) return;
    const [bookingsRes, customersRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("user_id", user.id).order("booking_date", { ascending: false }),
      supabase.from("customers").select("email, vehicle").eq("user_id", user.id),
    ]);
    if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
    if (customersRes.data) {
      const map = new Map<string, Customer>();
      (customersRes.data as Customer[]).forEach(c => { if (c.email) map.set(c.email, c); });
      setCustomerMap(map);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Columns data ────────────────────────────────── */

  const columnBookings = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    COLUMNS.forEach(c => { map[c.id] = []; });
    bookings.forEach(b => {
      const col = COLUMNS.find(c => c.statuses.includes(b.status));
      if (col) map[col.id].push(b);
    });
    return map;
  }, [bookings]);

  /* ── Drag handlers ───────────────────────────────── */

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (!draggedId) return;
    const newStatus = STATUS_FOR_COLUMN[colId];
    if (!newStatus) return;
    const booking = bookings.find(b => b.id === draggedId);
    if (!booking || booking.status === newStatus) { setDraggedId(null); return; }
    setBookings(prev => prev.map(b => b.id === draggedId ? { ...b, status: newStatus } : b));
    setDraggedId(null);
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", draggedId);
    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
      fetchData();
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };

  /* ── Add booking ─────────────────────────────────── */

  const handleAdd = async () => {
    if (!user || !newBooking.customer_name || !newBooking.booking_date) return;
    const { error } = await supabase.from("bookings").insert({ user_id: user.id, ...newBooking });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job added!" });
      setShowAddModal(false);
      setNewBooking({ customer_name: "", customer_email: "", customer_phone: "", service_title: "", service_price: 0, booking_date: "", booking_time: "10:00", duration_minutes: 60, notes: "" });
      fetchData();
    }
  };

  /* ── Mark complete ───────────────────────────────── */

  const markComplete = async (booking: Booking) => {
    const { error } = await supabase.from("bookings").update({ status: "completed" }).eq("id", booking.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: "completed" } : b));
      setSelectedJob(null);
      toast({ title: "Job marked as completed" });
    }
  };

  /* ── Mobile swipe ────────────────────────────────── */

  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 60) {
      setMobileCol(prev => diff > 0 ? Math.max(0, prev - 1) : Math.min(COLUMNS.length - 1, prev + 1));
    }
  };

  /* ── Job card ────────────────────────────────────── */

  const JobCard = ({ booking, column }: { booking: Booking; column: Column }) => {
    const vehicle = customerMap.get(booking.customer_email)?.vehicle || "";
    return (
      <div
        draggable={!isMobile}
        onDragStart={e => handleDragStart(e, booking.id)}
        onClick={() => { setSelectedJob(booking); setCheckedSteps(new Set()); }}
        className="relative rounded-lg border cursor-pointer transition-all duration-150 hover:scale-[1.01] hover:shadow-lg overflow-hidden"
        style={{
          background: "hsla(215, 50%, 8%, 0.5)",
          borderColor: "hsla(0, 0%, 100%, 0.08)",
        }}
      >
        {/* Color strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ background: column.strip }} />
        <div className="pl-4 pr-3 py-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-white font-semibold text-sm truncate">{booking.customer_name || "Unknown"}</span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: column.bg, color: column.color, border: `1px solid ${column.border}` }}
            >
              ${booking.service_price}
            </span>
          </div>
          {vehicle && <p className="text-white/40 text-xs truncate">{vehicle}</p>}
          <p className="text-white/60 text-xs">{booking.service_title}</p>
          <div className="flex items-center gap-2 text-white/35 text-[11px]">
            <CalendarIcon className="w-3 h-3" />
            {format(new Date(booking.booking_date + "T00:00"), "MMM d")} · {formatTimeShort(booking.booking_time)}
          </div>
        </div>
      </div>
    );
  };

  /* ── Loading ─────────────────────────────────────── */

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[hsl(217,91%,60%)]" /></div>;

  /* ── Render ──────────────────────────────────────── */

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Jobs</h2>
          <p className="text-white/40 text-sm mt-1">Manage your work orders</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="dash-btn dash-btn-primary dash-btn-sm">
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      {/* ── Desktop: Kanban columns ─────────────────── */}
      {!isMobile ? (
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, col.id)}
              className="flex flex-col rounded-xl border min-h-[400px]"
              style={{ borderColor: "hsla(0, 0%, 100%, 0.08)", background: "hsla(215, 50%, 8%, 0.3)" }}
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-xl border-b"
                style={{ background: col.bg, borderColor: col.border }}
              >
                <span className="font-semibold text-sm" style={{ color: col.color }}>{col.label}</span>
                <span
                  className="min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center"
                  style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}
                >
                  {columnBookings[col.id].length}
                </span>
              </div>
              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {columnBookings[col.id].length === 0 && (
                  <p className="text-white/20 text-xs text-center py-6">No jobs</p>
                )}
                {columnBookings[col.id].map(b => (
                  <JobCard key={b.id} booking={b} column={col} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Mobile: single column + swipe ──────────── */
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {/* Column selector */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setMobileCol(prev => Math.max(0, prev - 1))}
              disabled={mobileCol === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="font-semibold text-sm" style={{ color: COLUMNS[mobileCol].color }}>
                {COLUMNS[mobileCol].label}
              </span>
              <span
                className="ml-2 inline-flex min-w-[20px] h-[20px] px-1 rounded-md text-[11px] font-bold items-center justify-center"
                style={{ background: COLUMNS[mobileCol].bg, color: COLUMNS[mobileCol].color }}
              >
                {columnBookings[COLUMNS[mobileCol].id].length}
              </span>
              {/* Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {COLUMNS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMobileCol(i)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: i === mobileCol ? COLUMNS[mobileCol].color : "hsla(0, 0%, 100%, 0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => setMobileCol(prev => Math.min(COLUMNS.length - 1, prev + 1))}
              disabled={mobileCol === COLUMNS.length - 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {/* Cards */}
          <div className="space-y-3 min-h-[300px]">
            {columnBookings[COLUMNS[mobileCol].id].length === 0 && (
              <p className="text-white/20 text-xs text-center py-10">No jobs</p>
            )}
            {columnBookings[COLUMNS[mobileCol].id].map(b => (
              <JobCard key={b.id} booking={b} column={COLUMNS[mobileCol]} />
            ))}
          </div>
        </div>
      )}

      {/* ── Job Detail Sheet ───────────────────────── */}
      <Sheet open={!!selectedJob} onOpenChange={open => { if (!open) setSelectedJob(null); }}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="p-0 border-none overflow-y-auto"
          style={{
            background: "linear-gradient(180deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 12%) 100%)",
            maxHeight: isMobile ? "85vh" : undefined,
            width: isMobile ? undefined : "420px",
          }}
        >
          <VisuallyHidden>
            <SheetTitle>Job Details</SheetTitle>
            <SheetDescription>View and manage job details</SheetDescription>
          </VisuallyHidden>
          {selectedJob && (() => {
            const col = COLUMNS.find(c => c.statuses.includes(selectedJob.status)) || COLUMNS[0];
            const vehicle = customerMap.get(selectedJob.customer_email)?.vehicle || "";
            const steps = getSteps(selectedJob.service_title);
            return (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedJob.customer_name || "Job"}</h3>
                    <span
                      className="inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}
                    >
                      {col.label}
                    </span>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="text-white/30 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-2.5">
                  <DetailRow icon={<FileText className="w-3.5 h-3.5" />} label={selectedJob.service_title} />
                  {vehicle && <DetailRow icon={<User className="w-3.5 h-3.5" />} label={vehicle} />}
                  <DetailRow
                    icon={<CalendarIcon className="w-3.5 h-3.5" />}
                    label={`${format(new Date(selectedJob.booking_date + "T00:00"), "MMM d, yyyy")} · ${formatTimeShort(selectedJob.booking_time)}`}
                  />
                  <DetailRow icon={<Clock className="w-3.5 h-3.5" />} label={`${selectedJob.duration_minutes} min`} />
                  <DetailRow icon={<DollarSign className="w-3.5 h-3.5" />} label={`$${selectedJob.service_price}`} />
                  {selectedJob.customer_email && <DetailRow icon={<Mail className="w-3.5 h-3.5" />} label={selectedJob.customer_email} />}
                  {selectedJob.customer_phone && <DetailRow icon={<Phone className="w-3.5 h-3.5" />} label={selectedJob.customer_phone} />}
                  {selectedJob.notes && <DetailRow icon={<FileText className="w-3.5 h-3.5" />} label={selectedJob.notes} />}
                </div>

                {/* Contact buttons */}
                <div className="flex gap-2">
                  {selectedJob.customer_phone && (
                    <a href={`tel:${selectedJob.customer_phone}`} className="dash-btn dash-btn-sm dash-btn-ghost flex-1">
                      <PhoneCall className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                  {selectedJob.customer_email && (
                    <a href={`mailto:${selectedJob.customer_email}`} className="dash-btn dash-btn-sm dash-btn-ghost flex-1">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
                </div>

                {/* Checklist */}
                <div>
                  <h4 className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">Service Steps</h4>
                  <div className="space-y-2">
                    {steps.map(step => {
                      const checked = checkedSteps.has(step);
                      return (
                        <label key={step} className="flex items-center gap-3 cursor-pointer group">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => {
                              setCheckedSteps(prev => {
                                const next = new Set(prev);
                                checked ? next.delete(step) : next.add(step);
                                return next;
                              });
                            }}
                          />
                          <span className={`text-sm transition-colors ${checked ? "text-white/30 line-through" : "text-white/70"}`}>
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Mark Complete */}
                {selectedJob.status !== "completed" && (
                  <button
                    onClick={() => markComplete(selectedJob)}
                    className="dash-btn dash-btn-primary dash-btn-lg w-full"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                  </button>
                )}
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ── Add Job Modal ──────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">New Job</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-white/60 text-xs">Customer Name *</Label>
                <Input value={newBooking.customer_name} onChange={e => setNewBooking({ ...newBooking, customer_name: e.target.value })} placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Email</Label>
                <Input value={newBooking.customer_email} onChange={e => setNewBooking({ ...newBooking, customer_email: e.target.value })} placeholder="john@email.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Phone</Label>
                <Input value={newBooking.customer_phone} onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })} placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Service</Label>
                <Input value={newBooking.service_title} onChange={e => setNewBooking({ ...newBooking, service_title: e.target.value })} placeholder="Full Detail" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Price ($)</Label>
                <Input type="number" value={newBooking.service_price} onChange={e => setNewBooking({ ...newBooking, service_price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Date *</Label>
                <Input type="date" value={newBooking.booking_date} onChange={e => setNewBooking({ ...newBooking, booking_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Time</Label>
                <Input type="time" value={newBooking.booking_time} onChange={e => setNewBooking({ ...newBooking, booking_time: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-white/60 text-xs">Notes</Label>
                <Input value={newBooking.notes} onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} placeholder="Any additional notes..." />
              </div>
            </div>
            <button onClick={handleAdd} className="dash-btn dash-btn-primary dash-btn-lg w-full">
              Add Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Detail row helper ─────────────────────────────── */

const DetailRow = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2.5 text-white/50 text-sm">
    <span className="text-white/30">{icon}</span>
    {label}
  </div>
);

export default JobsManager;
