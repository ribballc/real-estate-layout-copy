import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, ArrowRight } from "lucide-react";

const REASONS = [
  "Too expensive",
  "Not enough bookings",
  "Missing a feature",
  "Switching to another tool",
  "Just taking a break",
  "Other",
] as const;

type Reason = (typeof REASONS)[number];

interface CancelFlowModalProps {
  open: boolean;
  onClose: () => void;
  onProceedToStripe: () => void;
}

const CancelFlowModal = ({ open, onClose, onProceedToStripe }: CancelFlowModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [reason, setReason] = useState<Reason | null>(null);
  const [featureText, setFeatureText] = useState("");
  const [saving, setSaving] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(false);

  const reset = () => {
    setStep(1);
    setReason(null);
    setFeatureText("");
    setSaving(false);
    setOfferAccepted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleReasonSelect = (r: Reason) => {
    setReason(r);
    setStep(2);
  };

  const logChurnReason = async (accepted: boolean) => {
    if (!user || !reason) return;
    await supabase.from("churn_reasons").insert({
      user_id: user.id,
      reason,
      detail: featureText,
      offer_shown: getOfferType(reason),
      offer_accepted: accepted,
    });
  };

  const handleAcceptOffer = async () => {
    setSaving(true);
    await logChurnReason(true);
    setOfferAccepted(true);
    toast({ title: "Offer applied!", description: "We're glad you're staying. 💙" });
    setSaving(false);
    setTimeout(handleClose, 1500);
  };

  const handleSubmitFeature = async () => {
    if (!user || !featureText.trim()) return;
    setSaving(true);
    await supabase.from("feature_requests").insert({
      user_id: user.id,
      content: featureText.trim(),
    });
    await logChurnReason(false);
    toast({ title: "Thanks for the feedback!", description: "We'll review your suggestion." });
    setSaving(false);
    setTimeout(handleClose, 1500);
  };

  const handleProceedCancel = async () => {
    await logChurnReason(false);
    handleClose();
    onProceedToStripe();
  };

  const getOfferType = (r: Reason): string => {
    switch (r) {
      case "Too expensive": return "40% off 3 months";
      case "Not enough bookings": return "free setup call";
      case "Missing a feature": return "feature request";
      case "Just taking a break": return "pause subscription";
      default: return "none";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto bg-[hsl(215,50%,10%)] border-[hsla(0,0%,100%,0.1)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            {step === 1 ? "Before you go…" : "We'd love to help"}
          </DialogTitle>
          <DialogDescription className="text-white/50 text-sm">
            {step === 1
              ? "What's the main reason you're thinking of canceling?"
              : "Based on your feedback, here's what we can do:"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {REASONS.map((r) => (
              <button
                key={r}
                onClick={() => handleReasonSelect(r)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 hover:border-[hsl(217,91%,60%)] hover:bg-[hsla(217,91%,60%,0.1)]"
                style={{
                  borderColor: "hsla(0,0%,100%,0.15)",
                  color: "hsla(0,0%,100%,0.85)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {step === 2 && reason && (
          <div className="space-y-4 mt-2">
            {/* Targeted offers */}
            {reason === "Too expensive" && (
              <div className="rounded-xl p-4" style={{ background: "hsla(217,91%,60%,0.08)", border: "1px solid hsla(217,91%,60%,0.2)" }}>
                <p className="text-sm font-semibold text-white mb-1">How about 40% off for 3 months?</p>
                <p className="text-xs text-white/50 mb-3">We'll apply the discount to your next 3 invoices.</p>
                <button onClick={handleAcceptOffer} disabled={saving} className="dash-btn dash-btn-primary dash-btn-sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Coupon"}
                </button>
              </div>
            )}

            {reason === "Not enough bookings" && (
              <div className="rounded-xl p-4" style={{ background: "hsla(217,91%,60%,0.08)", border: "1px solid hsla(217,91%,60%,0.2)" }}>
                <p className="text-sm font-semibold text-white mb-1">Let us help — book a free 15-min setup call</p>
                <p className="text-xs text-white/50 mb-3">We'll review your site and optimize it for more bookings.</p>
                <a
                  href="mailto:support@darker.com?subject=Setup Call Request"
                  className="dash-btn dash-btn-primary dash-btn-sm inline-flex"
                  onClick={() => logChurnReason(true)}
                >
                  Book Setup Call
                </a>
              </div>
            )}

            {reason === "Missing a feature" && (
              <div className="rounded-xl p-4" style={{ background: "hsla(217,91%,60%,0.08)", border: "1px solid hsla(217,91%,60%,0.2)" }}>
                <p className="text-sm font-semibold text-white mb-2">Tell us what's missing:</p>
                <textarea
                  value={featureText}
                  onChange={(e) => setFeatureText(e.target.value)}
                  placeholder="I wish Darker could…"
                  className="w-full h-20 rounded-lg bg-white/5 border border-white/10 text-white text-sm p-3 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[hsl(217,91%,60%)] resize-none"
                />
                <button
                  onClick={handleSubmitFeature}
                  disabled={saving || !featureText.trim()}
                  className="dash-btn dash-btn-primary dash-btn-sm mt-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><MessageSquare className="w-3.5 h-3.5" /> Submit Feedback</>}
                </button>
              </div>
            )}

            {reason === "Just taking a break" && (
              <div className="rounded-xl p-4" style={{ background: "hsla(217,91%,60%,0.08)", border: "1px solid hsla(217,91%,60%,0.2)" }}>
                <p className="text-sm font-semibold text-white mb-1">Pause your subscription for 1 month instead?</p>
                <p className="text-xs text-white/50 mb-3">Your site stays live, billing resumes automatically.</p>
                <button onClick={handleAcceptOffer} disabled={saving} className="dash-btn dash-btn-primary dash-btn-sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pause Subscription"}
                </button>
              </div>
            )}

            {(reason === "Switching to another tool" || reason === "Other") && (
              <div className="rounded-xl p-4" style={{ background: "hsla(0,0%,100%,0.04)", border: "1px solid hsla(0,0%,100%,0.1)" }}>
                <p className="text-sm text-white/70">We're sorry to see you go. Click below to proceed.</p>
              </div>
            )}

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(1)} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                ← Back
              </button>
              <button
                onClick={handleProceedCancel}
                className="text-xs text-white/40 hover:text-red-400 transition-colors inline-flex items-center gap-1"
              >
                I still want to cancel <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CancelFlowModal;
