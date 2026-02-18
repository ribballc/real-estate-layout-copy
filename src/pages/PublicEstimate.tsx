import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface LineItem {
  title: string;
  price: number;
  quantity: number;
}

interface EstimateData {
  id: string;
  customer_name: string;
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
  user_id: string;
}

interface BusinessProfile {
  business_name: string;
  logo_url: string | null;
  email: string;
  phone: string;
  address: string;
}

const STATUS_DISPLAY: Record<string, { label: string; icon: any; color: string }> = {
  accepted: { label: "Accepted", icon: CheckCircle2, color: "hsl(142, 71%, 45%)" },
  declined: { label: "Declined", icon: XCircle, color: "hsl(0, 84%, 60%)" },
};

const PublicEstimate = () => {
  const { id } = useParams<{ id: string }>();
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error: err } = await supabase
        .from("estimates")
        .select("*")
        .eq("id", id)
        .single();

      if (err || !data) {
        setError("Estimate not found");
        setLoading(false);
        return;
      }

      const est = { ...data, services: (data.services || []) as unknown as LineItem[] } as EstimateData;
      setEstimate(est);

      // Fetch business profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("business_name, logo_url, email, phone, address")
        .eq("user_id", est.user_id)
        .single();
      if (prof) setProfile(prof as BusinessProfile);
      setLoading(false);
    })();
  }, [id]);

  const updateStatus = async (newStatus: "accepted" | "declined") => {
    if (!id) return;
    setUpdating(true);
    try {
      const res = await supabase.functions.invoke("update-estimate-status", {
        body: { id, status: newStatus },
      });
      if (res.error) throw res.error;
      setEstimate(prev => prev ? { ...prev, status: newStatus } : null);
    } catch {
      setError("Failed to update estimate");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(210, 40%, 98%)" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(217, 91%, 60%)" }} />
      </div>
    );
  }

  if (error || !estimate) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(210, 40%, 98%)" }}>
        <p className="text-lg" style={{ color: "hsl(215, 16%, 47%)" }}>{error || "Not found"}</p>
      </div>
    );
  }

  const responded = estimate.status === "accepted" || estimate.status === "declined";
  const statusInfo = STATUS_DISPLAY[estimate.status];
  const expired = estimate.valid_until && new Date(estimate.valid_until + "T23:59:59") < new Date();
  const discountValue = estimate.discount_type === "percent"
    ? estimate.subtotal * (estimate.discount_amount / 100)
    : estimate.discount_amount;
  const afterDiscount = Math.max(0, estimate.subtotal - discountValue);
  const taxValue = afterDiscount * (estimate.tax_rate / 100);

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "hsl(210, 40%, 98%)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border p-8 mb-6 shadow-sm" style={{ borderColor: "hsl(214, 20%, 90%)" }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              {profile?.logo_url && (
                <img src={profile.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
              )}
              <div>
                <h1 className="font-bold text-xl" style={{ color: "hsl(215, 25%, 12%)" }}>
                  {profile?.business_name || "Estimate"}
                </h1>
                {profile?.address && (
                  <p className="text-xs mt-0.5" style={{ color: "hsl(215, 16%, 55%)" }}>{profile.address}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "hsl(215, 16%, 60%)" }}>Estimate</p>
              <p className="text-xs mt-1" style={{ color: "hsl(215, 16%, 55%)" }}>
                {format(new Date(estimate.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-xl p-4 mb-6" style={{ background: "hsl(210, 40%, 97%)" }}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215, 16%, 55%)" }}>Prepared for</p>
            <p className="font-semibold" style={{ color: "hsl(215, 25%, 12%)" }}>{estimate.customer_name}</p>
            {estimate.vehicle && <p className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>{estimate.vehicle}</p>}
          </div>

          {/* Line items */}
          <table className="w-full mb-6">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ color: "hsl(215, 16%, 55%)" }}>
                <th className="text-left pb-3 font-semibold">Service</th>
                <th className="text-center pb-3 font-semibold w-16">Qty</th>
                <th className="text-right pb-3 font-semibold w-24">Price</th>
                <th className="text-right pb-3 font-semibold w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.services.map((item, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "hsl(214, 20%, 92%)" }}>
                  <td className="py-3 text-sm" style={{ color: "hsl(215, 25%, 12%)" }}>{item.title}</td>
                  <td className="py-3 text-sm text-center" style={{ color: "hsl(215, 16%, 47%)" }}>{item.quantity}</td>
                  <td className="py-3 text-sm text-right" style={{ color: "hsl(215, 16%, 47%)" }}>${item.price.toFixed(2)}</td>
                  <td className="py-3 text-sm text-right font-medium" style={{ color: "hsl(215, 25%, 12%)" }}>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2" style={{ borderColor: "hsl(214, 20%, 92%)" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "hsl(215, 16%, 47%)" }}>Subtotal</span>
              <span style={{ color: "hsl(215, 25%, 12%)" }}>${estimate.subtotal.toFixed(2)}</span>
            </div>
            {estimate.discount_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "hsl(215, 16%, 47%)" }}>
                  Discount {estimate.discount_type === "percent" ? `(${estimate.discount_amount}%)` : ""}
                </span>
                <span style={{ color: "hsl(142, 71%, 45%)" }}>-${discountValue.toFixed(2)}</span>
              </div>
            )}
            {estimate.tax_rate > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "hsl(215, 16%, 47%)" }}>Tax ({estimate.tax_rate}%)</span>
                <span style={{ color: "hsl(215, 25%, 12%)" }}>${taxValue.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: "hsl(214, 20%, 92%)" }}>
              <span className="font-bold text-lg" style={{ color: "hsl(215, 25%, 12%)" }}>Total</span>
              <span className="font-bold text-lg" style={{ color: "hsl(215, 25%, 12%)" }}>${estimate.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {estimate.notes && (
            <div className="mt-6 rounded-xl p-4" style={{ background: "hsl(210, 40%, 97%)" }}>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: "hsl(215, 16%, 55%)" }}>Notes</p>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "hsl(215, 16%, 47%)" }}>{estimate.notes}</p>
            </div>
          )}

          {/* Valid until */}
          {estimate.valid_until && (
            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: expired ? "hsl(0, 84%, 60%)" : "hsl(215, 16%, 55%)" }}>
              <Clock className="w-4 h-4" />
              {expired ? "This estimate has expired" : `Valid until ${format(new Date(estimate.valid_until + "T00:00"), "MMM d, yyyy")}`}
            </div>
          )}
        </div>

        {/* Action buttons or status */}
        {responded ? (
          <div className="bg-white rounded-2xl border p-6 text-center shadow-sm" style={{ borderColor: "hsl(214, 20%, 90%)" }}>
            {statusInfo && (
              <div className="flex items-center justify-center gap-2">
                <statusInfo.icon className="w-6 h-6" style={{ color: statusInfo.color }} />
                <span className="font-bold text-lg" style={{ color: statusInfo.color }}>
                  Estimate {statusInfo.label}
                </span>
              </div>
            )}
          </div>
        ) : expired ? (
          <div className="bg-white rounded-2xl border p-6 text-center shadow-sm" style={{ borderColor: "hsl(214, 20%, 90%)" }}>
            <p className="font-semibold" style={{ color: "hsl(0, 84%, 60%)" }}>This estimate has expired</p>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => updateStatus("accepted")}
              disabled={updating}
              className="flex-1 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
              style={{ background: "hsl(142, 71%, 45%)" }}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Accept Estimate</>}
            </button>
            <button
              onClick={() => updateStatus("declined")}
              disabled={updating}
              className="flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 border transition-all active:scale-[0.97]"
              style={{ borderColor: "hsl(214, 20%, 88%)", color: "hsl(215, 16%, 47%)" }}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-5 h-5" /> Decline</>}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center mt-8 text-xs" style={{ color: "hsl(215, 16%, 70%)" }}>
          Powered by {profile?.business_name || "Darker"}
        </p>
      </div>
    </div>
  );
};

export default PublicEstimate;
