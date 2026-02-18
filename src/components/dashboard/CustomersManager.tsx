import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2, Plus, Phone, Mail, Search, User, Car, DollarSign,
  FileText, X, ChevronDown, MoreHorizontal, Calendar, Upload, Building2,
  Users, TrendingUp, Crown, Trash2,
} from "lucide-react";
import { format } from "date-fns";
import CsvImportModal from "./CsvImportModal";
import { CustomerListSkeleton } from "@/components/skeletons/CustomerRowSkeleton";
import EmptyState from "@/components/EmptyState";

interface VehicleEntry {
  year: string;
  make: string;
  model: string;
  color: string;
  plate: string;
}

const emptyVehicle = (): VehicleEntry => ({ year: "", make: "", model: "", color: "", plate: "" });

function parseVehicles(raw: string): VehicleEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* legacy plain text */ }
  // Legacy: plain text like "2024 BMW X5"
  return raw ? [{ year: "", make: "", model: raw, color: "", plate: "" }] : [];
}

function serializeVehicles(vehicles: VehicleEntry[]): string {
  const valid = vehicles.filter(v => v.make || v.model || v.year);
  return valid.length > 0 ? JSON.stringify(valid) : "";
}

function formatVehicleShort(v: VehicleEntry): string {
  const parts = [v.year, v.make, v.model].filter(Boolean);
  const label = parts.join(" ") || "Unknown";
  return v.color ? `${label} · ${v.color}` : label;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  vehicle: string;
  notes: string;
  total_spent: number;
  total_bookings: number;
  last_service_date: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ["lead", "active", "vip", "inactive"] as const;

const statusStyles: Record<string, string> = {
  lead: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  vip: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  inactive: "bg-white/10 text-white/40 border-white/10",
};

const CUSTOMER_FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "vehicle", label: "Vehicle" },
  { key: "notes", label: "Notes" },
  { key: "status", label: "Status" },
  { key: "total_spent", label: "Total Spent" },
  { key: "total_bookings", label: "Total Bookings" },
];

const ImportDropdown = ({ onCsv, onGmb }: { onCsv: () => void; onGmb: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-accent underline underline-offset-2 hover:text-accent/80 transition-colors whitespace-nowrap flex items-center gap-1"
      >
        Import <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-white/10 bg-[hsl(215,50%,12%)] p-1 min-w-[160px] shadow-xl">
          <button onClick={() => { onCsv(); setOpen(false); }} className="w-full text-left text-sm px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
          <button onClick={() => { onGmb(); setOpen(false); }} className="w-full text-left text-sm px-3 py-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> Import GMB
          </button>
        </div>
      )}
    </div>
  );
};

const CustomersManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [showGmbImport, setShowGmbImport] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", status: "lead" });
  const [formVehicles, setFormVehicles] = useState<VehicleEntry[]>([emptyVehicle()]);

  const fetchCustomers = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setCustomers(data as Customer[]);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, [user]);

  const filtered = useMemo(() => {
    let list = customers;
    if (filterStatus !== "all") list = list.filter(c => c.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.vehicle.toLowerCase().includes(q)
      );
    }
    return list;
  }, [customers, search, filterStatus]);

  const handleSave = async () => {
    if (!user || !form.name) return;
    const vehicleStr = serializeVehicles(formVehicles);
    const payload = { ...form, vehicle: vehicleStr };
    if (editingId) {
      const { error } = await supabase.from("customers").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Customer updated!" });
    } else {
      const { error } = await supabase.from("customers").insert({ user_id: user.id, ...payload });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Customer added!" });
    }
    resetForm();
    fetchCustomers();
  };

  const resetForm = () => {
    setShowAdd(false);
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", notes: "", status: "lead" });
    setFormVehicles([emptyVehicle()]);
  };

  const startEdit = (c: Customer) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, notes: c.notes, status: c.status });
    const vehicles = parseVehicles(c.vehicle);
    setFormVehicles(vehicles.length > 0 ? vehicles : [emptyVehicle()]);
    setEditingId(c.id);
    setShowAdd(true);
  };

  const updateVehicle = (index: number, field: keyof VehicleEntry, value: string) => {
    setFormVehicles(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const removeVehicle = (index: number) => {
    setFormVehicles(prev => prev.length <= 1 ? [emptyVehicle()] : prev.filter((_, i) => i !== index));
  };

  const updateStatus = async (id: string, status: string) => {
    // Optimistic update
    const prev = customers.find(c => c.id === id);
    setCustomers(all => all.map(c => c.id === id ? { ...c, status } : c));
    const { error } = await supabase.from("customers").update({ status }).eq("id", id);
    if (error) {
      if (prev) setCustomers(all => all.map(c => c.id === id ? prev : c));
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from("customers").delete().eq("id", deleteId);
    setCustomers(prev => prev.filter(c => c.id !== deleteId));
    toast({ title: "Customer removed" });
    setDeleteId(null);
  };

  const handleCsvImport = async (rows: Record<string, string>[]) => {
    if (!user) return;
    const records = rows.map(row => ({
      user_id: user.id,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      vehicle: row.vehicle || "",
      notes: row.notes || "",
      status: row.status && STATUS_OPTIONS.includes(row.status.toLowerCase() as any) ? row.status.toLowerCase() : "lead",
      total_spent: parseFloat(row.total_spent) || 0,
      total_bookings: parseInt(row.total_bookings) || 0,
    }));
    const { error } = await supabase.from("customers").insert(records);
    if (error) throw error;
    fetchCustomers();
  };

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    vip: customers.filter(c => c.status === "vip").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
  }), [customers]);

  if (loading) return <CustomerListSkeleton />;

  return (
    <div className="max-w-5xl">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Customers", value: stats.total, color: "hsl(217,91%,60%)", icon: Users },
          { label: "Active", value: stats.active, color: "hsl(160,84%,39%)", icon: TrendingUp },
          { label: "VIP", value: stats.vip, color: "hsl(271,91%,65%)", icon: Crown },
          { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, color: "hsl(45,93%,47%)", icon: DollarSign },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color.replace(")", ",0.1)")}`, border: `1px solid ${s.color.replace(")", ",0.2)")}` }}
              >
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{s.label}</span>
                <p className="text-2xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent"
            />
          </div>
          <ImportDropdown onCsv={() => setShowCsvImport(true)} onGmb={() => setShowGmbImport(true)} />
          <button onClick={() => { resetForm(); setShowAdd(true); }} className="dash-btn dash-btn-primary dash-btn-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Status filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {([
            { value: "all", label: "All", dot: "hsl(217,91%,60%)", activeBg: "hsla(217,91%,60%,0.12)", activeBorder: "hsla(217,91%,60%,0.3)" },
            { value: "lead", label: "Lead", dot: "hsl(45,93%,47%)", activeBg: "hsla(45,93%,47%,0.12)", activeBorder: "hsla(45,93%,47%,0.3)" },
            { value: "active", label: "Active", dot: "hsl(160,84%,39%)", activeBg: "hsla(160,84%,39%,0.12)", activeBorder: "hsla(160,84%,39%,0.3)" },
            { value: "vip", label: "VIP", dot: "hsl(271,91%,65%)", activeBg: "hsla(271,91%,65%,0.12)", activeBorder: "hsla(271,91%,65%,0.3)" },
            { value: "inactive", label: "Inactive", dot: "hsl(215,16%,55%)", activeBg: "hsla(215,16%,55%,0.12)", activeBorder: "hsla(215,16%,55%,0.3)" },
          ] as const).map(chip => {
            const isActive = filterStatus === chip.value;
            const count = chip.value === "all" ? customers.length : customers.filter(c => c.status === chip.value).length;
            return (
              <button
                key={chip.value}
                onClick={() => setFilterStatus(chip.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all duration-200 shrink-0"
                style={{
                  background: isActive ? chip.activeBg : "transparent",
                  borderColor: isActive ? chip.activeBorder : "hsla(0,0%,100%,0.1)",
                  color: isActive ? chip.dot : "hsla(0,0%,100%,0.5)",
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: chip.dot }} />
                {chip.label} {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        search ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <User className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No customers match your search</p>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Your customers will appear here"
            description="When someone books through your site, they're automatically added. You can also import existing customers from a CSV or Google My Business."
            action={{ label: "Import Customers", onClick: () => setShowCsvImport(true) }}
            secondaryAction={{ label: "Add Manually", onClick: () => { resetForm(); setShowAdd(true); } }}
          />
        )
      ) : (
        <div className="space-y-2">
          {filtered.map(c => {
            const vehicles = parseVehicles(c.vehicle);
            return (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-accent font-semibold text-sm">{c.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm truncate">{c.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusStyles[c.status] || statusStyles.lead}`}>
                          {c.status}
                        </span>
                      </div>
                      {/* Vehicle pills */}
                      {vehicles.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {vehicles.length <= 2 ? (
                            vehicles.map((v, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white/50">
                                <Car className="w-3 h-3" /> {formatVehicleShort(v)}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white/50">
                              <Car className="w-3 h-3" /> {vehicles.length} vehicles
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        {c.total_bookings > 0 && <span className="text-white/40 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.total_bookings} bookings</span>}
                        {c.total_spent > 0 && <span className="text-white/40 text-xs flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${c.total_spent}</span>}
                        {c.last_service_date && <span className="text-white/40 text-xs">Last: {format(new Date(c.last_service_date), "MMM d, yyyy")}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="w-9 h-9 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition-colors" title="Call">
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="w-9 h-9 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center text-accent transition-colors" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    <select
                      value={c.status}
                      onChange={e => updateStatus(c.id, e.target.value)}
                      className="h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs px-2 focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[hsl(215,50%,10%)]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <button onClick={() => startEdit(c)} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="Edit">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors" title="Delete">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {c.notes && <p className="text-white/30 text-xs mt-2 pl-[52px] line-clamp-1">{c.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{editingId ? "Edit Customer" : "Add Customer"}</h3>
              <button onClick={resetForm} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-white/60 text-xs">Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Email</Label>
                <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="john@email.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Status</Label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-accent">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[hsl(215,50%,10%)]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Notes</Label>
                <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="Prefers weekday mornings..." />
              </div>
            </div>

            {/* Vehicles section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> Vehicles
                </Label>
              </div>
              {formVehicles.map((v, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-[11px] font-medium">Vehicle {i + 1}</span>
                    {formVehicles.length > 1 && (
                      <button onClick={() => removeVehicle(i)} aria-label="Remove vehicle" className="text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-white/40 text-[10px]">Year</Label>
                      <Input type="number" value={v.year} onChange={e => updateVehicle(i, "year", e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="2024" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/40 text-[10px]">Make</Label>
                      <Input value={v.make} onChange={e => updateVehicle(i, "make", e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="BMW" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/40 text-[10px]">Model</Label>
                      <Input value={v.model} onChange={e => updateVehicle(i, "model", e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="X5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-white/40 text-[10px]">Color (optional)</Label>
                      <Input value={v.color} onChange={e => updateVehicle(i, "color", e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="Black" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/40 text-[10px]">License Plate (optional)</Label>
                      <Input value={v.plate} onChange={e => updateVehicle(i, "plate", e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="ABC-1234" />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setFormVehicles(prev => [...prev, emptyVehicle()])}
                className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add another vehicle
              </button>
            </div>

            <button onClick={handleSave} className="dash-btn dash-btn-primary dash-btn-lg w-full">
              {editingId ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </div>
      )}

      {/* CSV Import */}
      <CsvImportModal
        open={showCsvImport}
        onClose={() => setShowCsvImport(false)}
        onImport={handleCsvImport}
        targetFields={CUSTOMER_FIELDS}
        title="Import Customers from CSV"
      />

      {/* GMB Import Modal */}
      {showGmbImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Import from Google My Business</h3>
              <button onClick={() => setShowGmbImport(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-white/50 text-sm">Import your customer list directly from Google My Business.</p>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-amber-400 text-xs">⚠️ Google My Business integration requires API credentials to be configured. Please contact support to enable this feature.</p>
            </div>
            <button disabled className="dash-btn dash-btn-primary dash-btn-lg w-full opacity-50">
              <Building2 className="w-4 h-4" /> Connect Google My Business
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="border-white/10" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remove Customer</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to remove this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="dash-btn dash-btn-destructive">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomersManager;
