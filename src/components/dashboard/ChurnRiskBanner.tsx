import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, ArrowRight, HelpCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChurnRiskBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const key = `churn_risk_dismissed_${user.id}`;
    if (sessionStorage.getItem(key)) return;

    supabase
      .from("profiles")
      .select("churn_risk")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.churn_risk) setShow(true);
      });
  }, [user]);

  const handleDismiss = () => {
    if (user) sessionStorage.setItem(`churn_risk_dismissed_${user.id}`, "1");
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  return (
    <div
      className="rounded-2xl p-4 mb-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500"
      style={{
        background: "linear-gradient(135deg, hsla(45,93%,47%,0.1) 0%, hsla(45,93%,47%,0.04) 100%)",
        border: "1px solid hsla(45,93%,47%,0.25)",
      }}
    >
      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(45,93%,47%)" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">You haven't had any bookings yet — let's fix that.</p>
        <p className="text-xs text-white/50 mt-0.5">A few tweaks can make a big difference in getting your first customers.</p>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => navigate("/dashboard/business")}
            className="dash-btn dash-btn-sm text-xs font-semibold"
            style={{ background: "hsl(45,93%,47%)", color: "hsl(215,50%,10%)" }}
          >
            <ArrowRight className="w-3.5 h-3.5" /> Watch Setup Guide
          </button>
          <button
            onClick={() => navigate("/dashboard/account")}
            className="text-xs font-medium text-white/50 hover:text-white/80 transition-colors inline-flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Get Help
          </button>
        </div>
      </div>
      <button onClick={handleDismiss} className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ChurnRiskBanner;
