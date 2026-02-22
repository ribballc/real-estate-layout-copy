import { useEffect, useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import {
  Loader2, Plus, Clock, User, Mail, Phone, DollarSign, FileText, X,
  ChevronLeft, ChevronRight, PhoneCall, CheckCircle2, Calendar as CalendarIcon, MessageSquare, MoreHorizontal,
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
    statuses: ["confirmed", "pending"],
    color: "hsl(217, 91%, 60%)",
    bg: "hsla(217, 91%, 60%, 0.08)",
    border: "hsla(217, 91%, 60%, 0.25)",
    strip: "hsl(217, 91%, 60%)",
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
  {
    id: "invoiced",
    label: "Invoiced",
    statuses: ["invoiced"],
    color: "hsl(280, 67%, 55%)",
    bg: "hsla(280, 67%, 55%, 0.08)",
    border: "hsla(280, 67%, 55%, 0.25)",
    strip: "hsl(280, 67%, 55%)",
  },
];

const STATUS_FOR_COLUMN: Record<string, string> = {
  scheduled: "confirmed",
  completed: "completed",
  invoiced: "invoiced",
};

const formatTimeShort = (time: string) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

/* ── Main component ──────────────────────────────────── */

/* ── Light mode design tokens ────────────────────────── */

const LIGHT = {
  cardBg: "hsl(0, 0%, 100%)",
  cardBorder: "hsl(214, 32%, 91%)",
  columnBg: "hsl(210, 40%, 98%)",
  columnBorder: "hsl(214, 32%, 91%)",
  tabBarBg: "hsl(214, 20%, 94%)",
  tabBarBorder: "hsl(214, 32%, 88%)",
  tabInactive: "hsl(215, 14%, 51%)",
  tabInactiveMuted: "hsl(215, 12%, 63%)",
  surfaceBg: "hsl(220, 14%, 97%)",
  sheetGradient: "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(210,40%,98%) 100%)",
  modalBg: "hsl(0, 0%, 100%)",
  text: "hsl(218, 24%, 23%)",
  textMuted: "hsl(215, 14%, 51%)",
  textMuted2: "hsl(215, 16%, 43%)",
} as const;

const DARK = {
  cardBg: "hsla(215, 50%, 8%, 0.5)",
  cardBorder: "hsla(0, 0%, 100%, 0.08)",
  columnBg: "hsla(215, 50%, 8%, 0.3)",
  columnBorder: "hsla(0, 0%, 100%, 0.08)",
  tabBarBg: "hsla(215, 50%, 8%, 0.5)",
  tabBarBorder: "hsla(0, 0%, 100%, 0.08)",
  tabInactive: "hsla(0, 0%, 100%, 0.4)",
  tabInactiveMuted: "hsla(0, 0%, 100%, 0.25)",
  surfaceBg: "hsl(215, 50%, 10%)",
  sheetGradient: "linear-gradient(180deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 12%) 100%)",
  modalBg: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)",
  text: "hsl(0, 0%, 100%)",
  textMuted: "hsla(0, 0%, 100%, 0.6)",
  textMuted2: "hsla(0, 0%, 100%, 0.7)",
} as const;

const JobsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const outletCtx = useOutletContext<{ isDark?: boolean } | null>();
  const isDark = outletCtx?.isDark ?? true;
  const th = isDark ? DARK : LIGHT;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customerMap, setCustomerMap] = useState<Map<string, Customer>>(new Map());
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  const [editingJob, setEditingJob] = useState<Booking | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Lock body scroll when add-job modal is open (prevents mobile scroll leak)
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [showAddModal]);
  const [newBooking, setNewBooking] = useState({
    customer_name: "", customer_email: "", customer_phone: "",
    service_title: "", service_price: 0, booking_date: "",
    booking_time: "10:00", duration_minutes: 60, notes: "",
  });
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

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

  useEffect(() => {
    if (editingJob) setEditForm({ ...editingJob });
  }, [editingJob]);

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

  /* ── dnd-kit sensors & handlers ────────────────── */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const colId = String(over.id);
    const newStatus = STATUS_FOR_COLUMN[colId];
    if (!newStatus) return;
    const booking = bookings.find(b => b.id === active.id);
    if (!booking || booking.status === newStatus) return;
    setBookings(prev => prev.map(b => b.id === active.id ? { ...b, status: newStatus } : b));
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", String(active.id));
    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
      fetchData();
    }
  };

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

  const handleSaveEditJob = async () => {
    if (!editingJob?.id || !user) return;
    const payload = {
      customer_name: editForm.customer_name ?? editingJob.customer_name,
      customer_email: editForm.customer_email ?? editingJob.customer_email,
      customer_phone: editForm.customer_phone ?? editingJob.customer_phone,
      service_title: editForm.service_title ?? editingJob.service_title,
      service_price: editForm.service_price ?? editingJob.service_price,
      booking_date: editForm.booking_date ?? editingJob.booking_date,
      booking_time: editForm.booking_time ?? editingJob.booking_time,
      duration_minutes: editForm.duration_minutes ?? editingJob.duration_minutes,
      notes: editForm.notes ?? editingJob.notes,
      status: editForm.status ?? editingJob.status,
    };
    const { error } = await supabase.from("bookings").update(payload).eq("id", editingJob.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setBookings(prev => prev.map(b => b.id === editingJob.id ? { ...b, ...payload } : b));
    setEditingJob(null);
    toast({ title: "Job updated" });
  };

  /* ── Draggable Job card ───────────────────────────── */

  const DraggableJobCard = ({ booking, column }: { booking: Booking; column: Column }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: booking.id });
    const vehicle = customerMap.get(booking.customer_email)?.vehicle || "";
    const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      opacity: isDragging ? 0.4 : 1,
      background: th.cardBg,
      borderColor: th.cardBorder,
    };
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={() => { if (!isDragging) setSelectedJob(booking); }}
        className="relative rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-[1.01] hover:shadow-lg overflow-hidden touch-none"
        style={style}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ background: column.strip }} />
        <div className="pl-4 pr-3 py-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-sm truncate" style={{ color: th.text }}>{booking.customer_name || "Unknown"}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: column.bg, color: column.color, border: `1px solid ${column.border}` }}
            >
              ${booking.service_price}
            </span>
          </div>
          {vehicle && <p className="text-xs truncate" style={{ color: th.textMuted }}>{vehicle}</p>}
          <p className="text-xs" style={{ color: th.textMuted2 }}>{booking.service_title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs" style={{ color: th.textMuted }}>
              <CalendarIcon className="w-3 h-3" />
              {format(new Date(booking.booking_date + "T00:00"), "MMM d")} · {formatTimeShort(booking.booking_time)}
            </div>
            {booking.customer_phone && (
              <div className="flex items-center gap-1">
                <a
                  href={`tel:${booking.customer_phone}`}
                  onClick={e => e.stopPropagation()}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                  style={{ background: isDark ? "hsla(142, 71%, 45%, 0.12)" : "hsla(142, 71%, 45%, 0.1)", color: "hsl(142, 71%, 45%)" }}
                  title="Call"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`sms:${booking.customer_phone}`}
                  onClick={e => e.stopPropagation()}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                  style={{ background: isDark ? "hsla(217, 91%, 60%, 0.12)" : "hsla(217, 91%, 60%, 0.1)", color: "hsl(217, 91%, 60%)" }}
                  title="SMS"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={e => { e.stopPropagation(); setEditingJob(booking); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors opacity-60 hover:opacity-100"
              style={{ color: th.textMuted }}
              aria-label="Edit job"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Droppable Column ───────────────────────────── */

  const DroppableColumn = ({ col, children, isMobile: mobile }: { col: Column; children: React.ReactNode; isMobile?: boolean }) => {
    const { setNodeRef, isOver } = useDroppable({ id: col.id });
    return (
          <div
        ref={setNodeRef}
        className={`flex flex-col rounded-[14px] border min-h-[400px] transition-colors duration-200 ${
          mobile ? "min-w-[280px] max-w-[280px] shrink-0 snap-center" : "min-w-[240px]"
        }`}
        style={{
          borderColor: isOver ? col.border : th.columnBorder,
          background: isOver ? col.bg : th.columnBg,
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 rounded-t-[14px] border-b"
          style={{ background: col.bg, borderColor: col.border }}
        >
          <span className="font-semibold text-sm" style={{ color: col.color }}>{col.label}</span>
          <span
            className="min-w-[22px] h-[22px] px-1.5 rounded-md text-xs font-bold flex items-center justify-center"
            style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}
          >
            {columnBookings[col.id].length}
          </span>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  /* ── Overlay card for drag ──────────────────────── */

  const activeBooking = activeId ? bookings.find(b => b.id === activeId) : null;
  const activeColumn = activeBooking ? COLUMNS.find(c => c.statuses.includes(activeBooking.status)) || COLUMNS[0] : null;

  /* ── Loading ─────────────────────────────────────── */

  if (loading) return <TableSkeleton rows={5} cols={4} />;

  /* ── Render ──────────────────────────────────────── */

  return (
    <div className={`max-w-[1400px] ${isMobile ? "safe-area-pb" : ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="dash-page-title" style={{ color: th.text }}>Jobs</h2>
          <p className="text-sm mt-1" style={{ color: th.textMuted }}>Manage your work orders</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="dash-btn dash-btn-primary dash-btn-sm min-h-[44px] sm:min-h-0"
        >
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      {/* ── Kanban Board ─────────────────────────────── */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          className={
            isMobile
              ? "flex gap-4 overflow-x-auto overflow-y-visible pb-4 -mx-1 px-1 snap-x snap-mandatory scroll-smooth touch-pan-x"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2 -mx-1 px-1"
          }
        >
          {COLUMNS.map(col => (
            <DroppableColumn
              key={col.id}
              col={col}
              isMobile={isMobile}
            >
              {columnBookings[col.id].length === 0 && (
                <p className="text-xs text-center py-6" style={{ color: th.textMuted }}>No jobs</p>
              )}
              {columnBookings[col.id].map(b => (
                <DraggableJobCard key={b.id} booking={b} column={col} />
              ))}
            </DroppableColumn>
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeBooking && activeColumn && (
            <div
              className="relative rounded-lg border overflow-hidden shadow-2xl"
              style={{ background: th.cardBg, borderColor: activeColumn.border, width: 280 }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ background: activeColumn.strip }} />
              <div className="pl-4 pr-3 py-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm truncate" style={{ color: th.text }}>{activeBooking.customer_name || "Unknown"}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: activeColumn.bg, color: activeColumn.color, border: `1px solid ${activeColumn.border}` }}
                  >
                    ${activeBooking.service_price}
                  </span>
                </div>
                <p className="text-xs" style={{ color: th.textMuted2 }}>{activeBooking.service_title}</p>
                <div className="flex items-center gap-2 text-xs" style={{ color: th.textMuted }}>
                  <CalendarIcon className="w-3 h-3" />
                  {format(new Date(activeBooking.booking_date + "T00:00"), "MMM d")} · {formatTimeShort(activeBooking.booking_time)}
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* ── Job Detail Sheet ───────────────────────── */}
      <Sheet open={!!selectedJob} onOpenChange={open => { if (!open) setSelectedJob(null); }}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="p-0 border-none overflow-y-auto"
          style={{
            background: th.sheetGradient,
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
            return (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: th.text }}>{selectedJob.customer_name || "Job"}</h3>
                    <span
                     className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}
                    >
                      {col.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${isDark ? "text-white/50 hover:text-white" : "text-[hsl(215,14%,51%)] hover:text-[hsl(218,24%,23%)]"}`}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <DetailRow icon={<FileText className="w-3.5 h-3.5" />} label={selectedJob.service_title} textMuted={th.textMuted} textMuted2={th.textMuted2} />
                  {vehicle && <DetailRow icon={<User className="w-3.5 h-3.5" />} label={vehicle} textMuted={th.textMuted} textMuted2={th.textMuted2} />}
                  <DetailRow
                    icon={<CalendarIcon className="w-3.5 h-3.5" />}
                    label={`${format(new Date(selectedJob.booking_date + "T00:00"), "MMM d, yyyy")} · ${formatTimeShort(selectedJob.booking_time)}`}
                    textMuted={th.textMuted}
                    textMuted2={th.textMuted2}
                  />
                  <DetailRow icon={<Clock className="w-3.5 h-3.5" />} label={`${selectedJob.duration_minutes} min`} textMuted={th.textMuted} textMuted2={th.textMuted2} />
                  <DetailRow icon={<DollarSign className="w-3.5 h-3.5" />} label={String(selectedJob.service_price)} textMuted={th.textMuted} textMuted2={th.textMuted2} />
                  {selectedJob.customer_email && <DetailRow icon={<Mail className="w-3.5 h-3.5" />} label={selectedJob.customer_email} textMuted={th.textMuted} textMuted2={th.textMuted2} />}
                  {selectedJob.customer_phone && <DetailRow icon={<Phone className="w-3.5 h-3.5" />} label={selectedJob.customer_phone} textMuted={th.textMuted} textMuted2={th.textMuted2} />}
                  {selectedJob.notes && <DetailRow icon={<FileText className="w-3.5 h-3.5" />} label={selectedJob.notes} textMuted={th.textMuted} textMuted2={th.textMuted2} />}
                </div>

                {/* Contact buttons */}
                <div className="flex flex-wrap gap-2">
                  {selectedJob.customer_phone && (
                    <>
                      <a href={`tel:${selectedJob.customer_phone}`} className="dash-btn dash-btn-sm dash-btn-ghost flex-1 min-w-0">
                        <PhoneCall className="w-3.5 h-3.5" /> Call
                      </a>
                      <a href={`sms:${selectedJob.customer_phone}`} className="dash-btn dash-btn-sm dash-btn-ghost flex-1 min-w-0">
                        <MessageSquare className="w-3.5 h-3.5" /> Text
                      </a>
                    </>
                  )}
                  {selectedJob.customer_email && (
                    <a href={`mailto:${selectedJob.customer_email}`} className="dash-btn dash-btn-sm dash-btn-ghost flex-1 min-w-0">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
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

      {/* ── Edit Job (bottom sheet) ─────────────────── */}
      <Sheet open={!!editingJob} onOpenChange={open => { if (!open) setEditingJob(null); }}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-white/10 p-0 max-h-[85vh] overflow-y-auto"
          style={{ background: th.sheetGradient }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[hsl(215,50%,10%)]">
            <h3 className="text-white font-semibold text-lg">Edit Job</h3>
            <button onClick={() => setEditingJob(null)} className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg ${isDark ? "text-white/50 hover:text-white" : "text-[hsl(215,14%,51%)] hover:text-[hsl(218,24%,23%)]"}`} aria-label="Close"><X className="w-5 h-5" /></button>
          </div>
          {editingJob && (
            <div className="p-4 space-y-4 pb-8">
              <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Customer Name *</Label>
                  <Input value={editForm.customer_name ?? ""} onChange={e => setEditForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="John Doe" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Email</Label>
                  <Input value={editForm.customer_email ?? ""} onChange={e => setEditForm(f => ({ ...f, customer_email: e.target.value }))} placeholder="john@email.com" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Phone</Label>
                  <Input value={editForm.customer_phone ?? ""} onChange={e => setEditForm(f => ({ ...f, customer_phone: e.target.value }))} placeholder="(555) 123-4567" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Service</Label>
                  <Input value={editForm.service_title ?? ""} onChange={e => setEditForm(f => ({ ...f, service_title: e.target.value }))} placeholder="Full Detail" className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Price ($)</Label>
                  <Input type="number" value={editForm.service_price ?? 0} onChange={e => setEditForm(f => ({ ...f, service_price: parseFloat(e.target.value) || 0 }))} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Status</Label>
                  <select value={editForm.status ?? editingJob.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="confirmed" className="bg-[hsl(215,50%,10%)]">Confirmed</option>
                    <option value="pending" className="bg-[hsl(215,50%,10%)]">Pending</option>
                    <option value="completed" className="bg-[hsl(215,50%,10%)]">Completed</option>
                    <option value="invoiced" className="bg-[hsl(215,50%,10%)]">Invoiced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Date *</Label>
                  <Input type="date" value={editForm.booking_date ?? ""} onChange={e => setEditForm(f => ({ ...f, booking_date: e.target.value }))} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Time</Label>
                  <Input type="time" value={editForm.booking_time ?? "10:00"} onChange={e => setEditForm(f => ({ ...f, booking_time: e.target.value }))} className="h-10" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Duration (min)</Label>
                  <Input type="number" value={editForm.duration_minutes ?? 60} onChange={e => setEditForm(f => ({ ...f, duration_minutes: parseInt(e.target.value, 10) || 60 }))} className="h-10" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs" style={{ color: th.textMuted }}>Notes</Label>
                  <Input value={editForm.notes ?? ""} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes..." className="h-10" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditingJob(null)} className="dash-btn dash-btn-ghost flex-1">Exit</button>
                <button onClick={handleSaveEditJob} className="dash-btn dash-btn-primary flex-1">Save changes</button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Add Job Modal ──────────────────────────── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          style={{
            paddingTop: "max(1rem, env(safe-area-inset-top))",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <div
            className="w-full max-w-md dash-card p-6 space-y-4 overflow-y-auto"
            style={{
              background: th.modalBg,
              maxHeight: "min(90vh, calc(100dvh - 2rem))",
              border: `1px solid ${th.cardBorder}`,
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: th.text }}>New Job</h3>
              <button onClick={() => setShowAddModal(false)} className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg ${isDark ? "text-white/30 hover:text-white" : "text-[hsl(215,12%,63%)] hover:text-[hsl(218,24%,23%)]"}`} aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Customer Name *</Label>
                <Input value={newBooking.customer_name} onChange={e => setNewBooking({ ...newBooking, customer_name: e.target.value })} placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Email</Label>
                <Input value={newBooking.customer_email} onChange={e => setNewBooking({ ...newBooking, customer_email: e.target.value })} placeholder="john@email.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Phone</Label>
                <Input value={newBooking.customer_phone} onChange={e => setNewBooking({ ...newBooking, customer_phone: e.target.value })} placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Service</Label>
                <Input value={newBooking.service_title} onChange={e => setNewBooking({ ...newBooking, service_title: e.target.value })} placeholder="Full Detail" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Price ($)</Label>
                <Input type="number" value={newBooking.service_price} onChange={e => setNewBooking({ ...newBooking, service_price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Date *</Label>
                <Input type="date" value={newBooking.booking_date} onChange={e => setNewBooking({ ...newBooking, booking_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Time</Label>
                <Input type="time" value={newBooking.booking_time} onChange={e => setNewBooking({ ...newBooking, booking_time: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs" style={{ color: th.textMuted }}>Notes</Label>
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

const DetailRow = ({ icon, label, textMuted = "hsla(0,0%,100%,0.5)", textMuted2 = "hsla(0,0%,100%,0.3)" }: { icon: React.ReactNode; label: string; textMuted?: string; textMuted2?: string }) => (
  <div className="flex items-center gap-2.5 text-sm" style={{ color: textMuted }}>
    <span style={{ color: textMuted2 }}>{icon}</span>
    {label}
  </div>
);

export default JobsManager;
