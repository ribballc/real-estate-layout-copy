import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Loader2, Plus, X, Trash2, Copy, ExternalLink, CalendarIcon,
  Search, ChevronDown, ArrowRight, FileDown,
} from "lucide-react";
import { format } from "date-fns";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

/* ── Types ───────────────────────────────────────────── */

interface LineItem {
  title: string;
  price: number;
  quantity: number;
}

interface Estimate {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle: string;
  services: LineItem[];
  subtotal: number;
  discount_amount: number;
  discount_type: string;
  tax_rate: number;
  total: number;
  status: string;
  notes: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomerRow {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
}

interface ServiceRow {
  title: string;
  price: number;
}

/* ── Status config ───────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft: { label: "Draft", color: "hsl(215, 16%, 55%)", bg: "hsla(215, 16%, 55%, 0.1)", border: "hsla(215, 16%, 55%, 0.25)" },
  sent: { label: "Sent", color: "hsl(217, 91%, 60%)", bg: "hsla(217, 91%, 60%, 0.1)", border: "hsla(217, 91%, 60%, 0.25)" },
  accepted: { label: "Accepted", color: "hsl(142, 71%, 45%)", bg: "hsla(142, 71%, 45%, 0.1)", border: "hsla(142, 71%, 45%, 0.25)" },
  declined: { label: "Declined", color: "hsl(0, 84%, 60%)", bg: "hsla(0, 84%, 60%, 0.1)", border: "hsla(0, 84%, 60%, 0.25)" },
};

const FILTERS = ["all", "draft", "sent", "accepted", "declined"];

/* ── Helpers ─────────────────────────────────────────── */

function calcTotals(items: LineItem[], discountAmount: number, discountType: string, taxRate: number) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = discountType === "percent" ? subtotal * (discountAmount / 100) : discountAmount;
  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = afterDiscount * (taxRate / 100);
  const total = afterDiscount + tax;
  return { subtotal: Math.round(subtotal * 100) / 100, total: Math.round(total * 100) / 100 };
}

/* ── Component ───────────────────────────────────────── */

const EstimatesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [filter, setFilter] = useState("all");
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Editor state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ title: "", price: 0, quantity: 1 }]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "flat">("percent");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState<Date | undefined>();
  const [saving, setSaving] = useState(false);

  // Autocomplete data
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Convert to booking modal
  const [convertEstimate, setConvertEstimate] = useState<Estimate | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");

  // Business profile for PDF
  const [businessProfile, setBusinessProfile] = useState<{
    business_name: string; phone: string; email: string; address: string; logo_url: string | null;
  }>({ business_name: "", phone: "", email: "", address: "", logo_url: null });

  /* ── Fetch ─────────────────────────────────────────── */

  const fetchData = useCallback(async () => {
    if (!user) return;
    const [estRes, custRes, svcRes, profileRes] = await Promise.all([
      supabase.from("estimates").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("customers").select("name, email, phone, vehicle").eq("user_id", user.id),
      supabase.from("services").select("title, price").eq("user_id", user.id).order("sort_order"),
      supabase.from("profiles").select("business_name, phone, email, address, logo_url").eq("user_id", user.id).single(),
    ]);
    if (estRes.data) setEstimates(estRes.data.map(e => ({ ...e, services: (e.services || []) as unknown as LineItem[] })) as Estimate[]);
    if (custRes.data) setCustomers(custRes.data as CustomerRow[]);
    if (svcRes.data) setServices(svcRes.data as ServiceRow[]);
    if (profileRes.data) setBusinessProfile(profileRes.data as any);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Filtered ──────────────────────────────────────── */

  const filtered = useMemo(() =>
    filter === "all" ? estimates : estimates.filter(e => e.status === filter),
    [estimates, filter]
  );

  /* ── Editor helpers ────────────────────────────────── */

  const resetEditor = () => {
    setEditingId(null);
    setCustomerName(""); setCustomerEmail(""); setCustomerPhone(""); setVehicle("");
    setLineItems([{ title: "", price: 0, quantity: 1 }]);
    setDiscountAmount(0); setDiscountType("percent"); setTaxRate(0);
    setNotes(""); setValidUntil(undefined);
    setCustomerSearch("");
  };

  const openNew = () => { resetEditor(); setShowEditor(true); };

  const openEdit = (e: Estimate) => {
    setEditingId(e.id);
    setCustomerName(e.customer_name); setCustomerEmail(e.customer_email);
    setCustomerPhone(e.customer_phone); setVehicle(e.vehicle);
    setLineItems(e.services.length > 0 ? e.services : [{ title: "", price: 0, quantity: 1 }]);
    setDiscountAmount(e.discount_amount); setDiscountType(e.discount_type as "percent" | "flat");
    setTaxRate(e.tax_rate); setNotes(e.notes);
    setValidUntil(e.valid_until ? new Date(e.valid_until + "T00:00") : undefined);
    setShowEditor(true);
  };

  const selectCustomer = (c: CustomerRow) => {
    setCustomerName(c.name); setCustomerEmail(c.email);
    setCustomerPhone(c.phone); setVehicle(c.vehicle);
    setCustomerSearch(c.name); setShowCustomerDropdown(false);
  };

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 5);
    const q = customerSearch.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 5);
  }, [customerSearch, customers]);

  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addLineItem = () => setLineItems(prev => [...prev, { title: "", price: 0, quantity: 1 }]);
  const removeLineItem = (idx: number) => setLineItems(prev => prev.filter((_, i) => i !== idx));

  const { subtotal, total } = useMemo(() =>
    calcTotals(lineItems, discountAmount, discountType, taxRate),
    [lineItems, discountAmount, discountType, taxRate]
  );

  /* ── Save ──────────────────────────────────────────── */

  const save = async (status: string) => {
    if (!user || !customerName.trim()) {
      toast({ title: "Customer name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      user_id: user.id,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim(),
      vehicle: vehicle.trim(),
      services: lineItems.filter(i => i.title.trim()) as unknown as Json,
      subtotal, discount_amount: discountAmount, discount_type: discountType,
      tax_rate: taxRate, total, status,
      notes: notes.trim(),
      valid_until: validUntil ? format(validUntil, "yyyy-MM-dd") : null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("estimates").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("estimates").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "sent" ? "Estimate shared!" : "Estimate saved!" });
      setShowEditor(false);
      resetEditor();
      fetchData();
    }
  };

  /* ── Delete ────────────────────────────────────────── */

  const deleteEstimate = async (id: string) => {
    const { error } = await supabase.from("estimates").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setEstimates(prev => prev.filter(e => e.id !== id)); toast({ title: "Estimate deleted" }); }
  };

  /* ── Convert to booking ────────────────────────────── */

  const handleConvert = async () => {
    if (!user || !convertEstimate || !bookingDate) return;
    const e = convertEstimate;
    const serviceTitle = e.services.map(s => s.title).join(", ");
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      customer_name: e.customer_name,
      customer_email: e.customer_email,
      customer_phone: e.customer_phone,
      service_title: serviceTitle,
      service_price: e.total,
      booking_date: bookingDate,
      booking_time: bookingTime,
      duration_minutes: 60,
      notes: e.notes,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking created from estimate!" });
      setConvertEstimate(null);
      setBookingDate(""); setBookingTime("10:00");
    }
  };

  /* ── Copy link ─────────────────────────────────────── */

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/estimate/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard!" });
  };

  /* ── Print / PDF Export ────────────────────────────── */

  const handlePrintEstimate = (est: Estimate) => {
    const bp = businessProfile;
    const discountVal = est.discount_type === "percent"
      ? est.subtotal * (est.discount_amount / 100)
      : est.discount_amount;
    const taxVal = (est.subtotal - discountVal) * (est.tax_rate / 100);

    const lineRowsHtml = est.services.map(s => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;">${s.title}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;font-size:14px;">${s.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-size:14px;">$${s.price.toFixed(2)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-size:14px;font-weight:600;">$${(s.price * s.quantity).toFixed(2)}</td>
      </tr>
    `).join("");

    const logoHtml = bp.logo_url
      ? `<img src="${bp.logo_url}" alt="${bp.business_name}" style="max-height:50px;max-width:180px;object-fit:contain;" />`
      : "";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Estimate — ${est.customer_name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2563eb; }
          .header-left h1 { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
          .header-left p { font-size: 12px; color: #666; line-height: 1.6; }
          .estimate-title { font-size: 28px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 2px; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 32px; }
          .meta-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
          .meta-block p { font-size: 14px; color: #333; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          thead th { background: #f8fafc; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #e2e8f0; text-align: left; }
          thead th:nth-child(2) { text-align: center; }
          thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
          .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
          .totals-table { width: 260px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
          .totals-row.total { border-top: 2px solid #1a1a2e; padding-top: 10px; margin-top: 4px; font-size: 18px; font-weight: 700; color: #1a1a2e; }
          .notes { background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 32px; font-size: 13px; color: #555; line-height: 1.6; }
          .notes-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
          .footer { text-align: center; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #999; line-height: 1.8; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            ${logoHtml}
            <h1>${bp.business_name || "Estimate"}</h1>
            ${bp.address ? `<p>${bp.address}</p>` : ""}
            ${bp.phone ? `<p>${bp.phone}</p>` : ""}
            ${bp.email ? `<p>${bp.email}</p>` : ""}
          </div>
          <div class="estimate-title">Estimate</div>
        </div>

        <div class="meta">
          <div class="meta-block">
            <h3>Bill To</h3>
            <p><strong>${est.customer_name}</strong></p>
            ${est.customer_email ? `<p>${est.customer_email}</p>` : ""}
            ${est.customer_phone ? `<p>${est.customer_phone}</p>` : ""}
            ${est.vehicle ? `<p>${est.vehicle}</p>` : ""}
          </div>
          <div class="meta-block" style="text-align:right;">
            <h3>Details</h3>
            <p>Date: ${format(new Date(est.created_at), "MMM d, yyyy")}</p>
            ${est.valid_until ? `<p>Valid Until: ${format(new Date(est.valid_until + "T00:00"), "MMM d, yyyy")}</p>` : ""}
            <p>Status: ${(STATUS_CONFIG[est.status] || STATUS_CONFIG.draft).label}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${lineRowsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-table">
            <div class="totals-row"><span>Subtotal</span><span>$${est.subtotal.toFixed(2)}</span></div>
            ${est.discount_amount > 0 ? `<div class="totals-row"><span>Discount${est.discount_type === "percent" ? ` (${est.discount_amount}%)` : ""}</span><span>-$${discountVal.toFixed(2)}</span></div>` : ""}
            ${est.tax_rate > 0 ? `<div class="totals-row"><span>Tax (${est.tax_rate}%)</span><span>$${taxVal.toFixed(2)}</span></div>` : ""}
            <div class="totals-row total"><span>Total</span><span>$${est.total.toFixed(2)}</span></div>
          </div>
        </div>

        ${est.notes ? `<div class="notes"><div class="notes-label">Notes</div>${est.notes}</div>` : ""}

        <div class="footer">
          ${bp.business_name || ""}${bp.phone ? ` · ${bp.phone}` : ""}${bp.email ? ` · ${bp.email}` : ""}
          <br />Thank you for your business!
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  /* ── Loading ───────────────────────────────────────── */

  if (loading) return <TableSkeleton rows={4} cols={5} />;

  /* ── Editor modal ──────────────────────────────────── */

  if (showEditor) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="dash-page-title text-white">{editingId ? "Edit Estimate" : "New Estimate"}</h2>
          <button onClick={() => { setShowEditor(false); resetEditor(); }} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <h3 className="text-white font-semibold text-sm">Customer</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                value={customerSearch || customerName}
                onChange={e => { setCustomerSearch(e.target.value); setCustomerName(e.target.value); setShowCustomerDropdown(true); }}
                onFocus={() => setShowCustomerDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                placeholder="Search existing or type new customer..."
                className="pl-10"
              />
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 rounded-lg border border-white/10 bg-[hsl(215,50%,10%)] z-50 overflow-hidden shadow-xl">
                  {filteredCustomers.map((c, i) => (
                    <button key={i} onMouseDown={() => selectCustomer(c)} className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] transition-colors">
                      <span className="font-medium text-white">{c.name}</span>
                      {c.email && <span className="text-white/40 ml-2 text-xs">{c.email}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Email</Label>
                <Input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Phone</Label>
                <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Vehicle</Label>
                <Input value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="2024 BMW M4" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Services</h3>
              <button onClick={addLineItem} className="dash-btn dash-btn-ghost dash-btn-sm"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 text-xs text-white/40 uppercase tracking-wider px-1">
              <span>Service</span><span>Qty</span><span>Price</span><span>Total</span><span />
            </div>
            {lineItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_80px_32px] gap-2 items-center">
                <div className="relative">
                  <Input
                    value={item.title}
                    onChange={e => updateLineItem(idx, "title", e.target.value)}
                    placeholder="Service name..."
                    list={`svc-list-${idx}`}
                  />
                  <datalist id={`svc-list-${idx}`}>
                    {services.map((s, i) => <option key={i} value={s.title} />)}
                  </datalist>
                </div>
                <Input type="number" min={1} value={item.quantity} onChange={e => updateLineItem(idx, "quantity", parseInt(e.target.value) || 1)} />
                <Input type="number" min={0} step="0.01" value={item.price} onChange={e => {
                  updateLineItem(idx, "price", parseFloat(e.target.value) || 0);
                }} onFocus={() => {
                  // Auto-fill price from service list
                  if (item.price === 0 && item.title) {
                    const svc = services.find(s => s.title.toLowerCase() === item.title.toLowerCase());
                    if (svc) updateLineItem(idx, "price", svc.price);
                  }
                }} />
                <span className="text-white/60 text-sm font-medium text-center">${(item.price * item.quantity).toFixed(2)}</span>
                {lineItems.length > 1 && (
                  <button onClick={() => removeLineItem(idx)} aria-label="Remove line item" className="text-white/40 hover:text-red-400 transition-colors justify-self-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {/* Discount */}
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm shrink-0">Discount</span>
              <Input type="number" min={0} value={discountAmount} onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)} className="w-24" />
              <button
                onClick={() => setDiscountType(prev => prev === "percent" ? "flat" : "percent")}
                className="dash-btn dash-btn-ghost dash-btn-sm text-xs shrink-0"
              >
                {discountType === "percent" ? "%" : "$"}
              </button>
            </div>
            {/* Tax */}
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm shrink-0">Tax Rate</span>
              <Input type="number" min={0} step="0.1" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="w-24" />
              <span className="text-white/40 text-sm">%</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes + Valid Until */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <div className="space-y-1">
              <Label className="text-white/60 text-xs">Notes</Label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional notes for the customer..."
                rows={3}
                className="w-full resize-none rounded-lg border border-white/10 bg-[hsla(215,50%,8%,0.6)] text-white text-sm p-3 focus:border-[hsl(217,91%,60%)] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-white/60 text-xs">Valid Until</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "w-full h-10 rounded-lg border text-left px-3 text-sm flex items-center gap-2 transition-colors",
                    "border-white/10 bg-[hsla(215,50%,8%,0.6)] text-white/70 hover:border-white/20"
                  )}>
                    <CalendarIcon className="w-4 h-4 text-white/30" />
                    {validUntil ? format(validUntil, "MMM d, yyyy") : "Select date..."}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-white/10 bg-[hsl(215,50%,10%)]" align="start">
                  <Calendar
                    mode="single"
                    selected={validUntil}
                    onSelect={setValidUntil}
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <button onClick={() => save("draft")} disabled={saving} className="dash-btn dash-btn-ghost dash-btn-lg flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
            </button>
            <button onClick={() => save("sent")} disabled={saving} className="dash-btn dash-btn-primary dash-btn-lg flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Share Estimate"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── List view ─────────────────────────────────────── */

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="dash-page-title text-white">Estimates</h2>
          <p className="text-white/40 text-sm mt-1">Create and manage customer estimates</p>
        </div>
        <button onClick={openNew} className="dash-btn dash-btn-primary dash-btn-sm">
          <Plus className="w-4 h-4" /> New Estimate
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {FILTERS.map(f => {
          const count = f === "all" ? estimates.length : estimates.filter(e => e.status === f).length;
          const cfg = f === "all" ? null : STATUS_CONFIG[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border",
                active
                  ? "border-[hsl(217,91%,60%)] bg-[hsla(217,91%,60%,0.12)] text-[hsl(217,91%,60%)]"
                  : "border-white/10 text-white/50 hover:text-white/70 hover:border-white/20"
              )}
            >
              {cfg && <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />}
              {f === "all" ? "All" : cfg?.label}
              <span className={cn("text-[10px] font-bold", active ? "text-[hsl(217,91%,60%)]" : "text-white/30")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Estimate list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/20 text-sm">No estimates found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(est => {
            const cfg = STATUS_CONFIG[est.status] || STATUS_CONFIG.draft;
            return (
              <div
                key={est.id}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors hover:border-white/15"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm truncate">{est.customer_name || "Untitled"}</span>
                    <span
                      className="dash-badge shrink-0"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    {est.vehicle && <span>{est.vehicle}</span>}
                    <span>${est.total.toFixed(2)}</span>
                    <span>{format(new Date(est.created_at), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handlePrintEstimate(est)} className="dash-btn dash-btn-ghost dash-btn-sm text-xs" title="Download PDF">
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                  {est.status === "accepted" && (
                    <button onClick={() => setConvertEstimate(est)} className="dash-btn dash-btn-primary dash-btn-sm text-xs">
                      <ArrowRight className="w-3.5 h-3.5" /> Book
                    </button>
                  )}
                  {(est.status === "sent" || est.status === "accepted") && (
                    <button onClick={() => copyLink(est.id)} className="dash-btn dash-btn-ghost dash-btn-sm text-xs" title="Copy link">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {(est.status === "sent" || est.status === "accepted" || est.status === "declined") && (
                    <a href={`/estimate/${est.id}`} target="_blank" rel="noreferrer" className="dash-btn dash-btn-ghost dash-btn-sm text-xs" title="View">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button onClick={() => openEdit(est)} className="dash-btn dash-btn-ghost dash-btn-sm text-xs">Edit</button>
                  <button onClick={() => deleteEstimate(est.id)} aria-label="Delete estimate" className="text-white/40 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Convert to Booking Modal */}
      {convertEstimate && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm dash-card p-6 space-y-4" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Convert to Booking</h3>
              <button onClick={() => setConvertEstimate(null)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-white/50 text-sm">
              Create a booking for <span className="text-white font-medium">{convertEstimate.customer_name}</span> — {convertEstimate.services.map(s => s.title).join(", ")} (${convertEstimate.total.toFixed(2)})
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Date *</Label>
                <Input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Time</Label>
                <Input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} />
              </div>
            </div>
            <button onClick={handleConvert} disabled={!bookingDate} className="dash-btn dash-btn-primary dash-btn-lg w-full">
              Create Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimatesManager;
