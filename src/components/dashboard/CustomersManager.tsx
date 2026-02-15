import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Plus, Phone, Mail, Search, User, Car, DollarSign,
  FileText, X, ChevronDown, Filter, MoreHorizontal, Calendar,
} from "lucide-react";
import { format } from "date-fns";

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

const CustomersManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicle: "", notes: "", status: "lead" });

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
    if (editingId) {
      const { error } = await supabase.from("customers").update(form).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Customer updated!" });
    } else {
      const { error } = await supabase.from("customers").insert({ user_id: user.id, ...form });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Customer added!" });
    }
    resetForm();
    fetchCustomers();
  };

  const resetForm = () => {
    setShowAdd(false);
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", vehicle: "", notes: "", status: "lead" });
  };

  const startEdit = (c: Customer) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, vehicle: c.vehicle, notes: c.notes, status: c.status });
    setEditingId(c.id);
    setShowAdd(true);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("customers").update({ status }).eq("id", id);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("customers").delete().eq("id", id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    toast({ title: "Customer removed" });
  };

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    vip: customers.filter(c => c.status === "vip").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
  }), [customers]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="max-w-5xl">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Customers", value: stats.total, color: "hsl(217 91% 60%)" },
          { label: "Active", value: stats.active, color: "hsl(160 84% 39%)" },
          { label: "VIP", value: stats.vip, color: "hsl(271 91% 65%)" },
          { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, color: "hsl(45 93% 47%)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{s.label}</span>
            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-10 h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[hsl(215,50%,10%)]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <Button onClick={() => { resetForm(); setShowAdd(true); }} size="sm" className="gap-2 h-10 px-4" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <User className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">{search ? "No customers match your search" : "No customers yet. Add your first customer or they'll appear here when someone books."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Avatar & info */}
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
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      {c.vehicle && (
                        <span className="text-white/40 text-xs flex items-center gap-1"><Car className="w-3 h-3" /> {c.vehicle}</span>
                      )}
                      {c.total_bookings > 0 && (
                        <span className="text-white/40 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.total_bookings} bookings</span>
                      )}
                      {c.total_spent > 0 && (
                        <span className="text-white/40 text-xs flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${c.total_spent}</span>
                      )}
                      {c.last_service_date && (
                        <span className="text-white/40 text-xs">Last: {format(new Date(c.last_service_date), "MMM d, yyyy")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
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
                  {/* Status quick-change */}
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
                  <button onClick={() => handleDelete(c.id)} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors" title="Delete">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Notes preview */}
              {c.notes && (
                <p className="text-white/30 text-xs mt-2 pl-[52px] line-clamp-1">{c.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
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
                <Label className="text-white/60 text-xs">Vehicle</Label>
                <Input value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="2024 BMW X5" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Status</Label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-accent">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[hsl(215,50%,10%)]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-white/60 text-xs">Notes</Label>
                <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="h-10 bg-white/5 border-white/10 text-white focus-visible:ring-accent" placeholder="Prefers weekday mornings..." />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
              {editingId ? "Update Customer" : "Add Customer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManager;
