import { Lock, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TrialLockOverlayProps {
  isDark?: boolean;
}

const TrialLockOverlay = ({ isDark = true }: TrialLockOverlayProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: isDark
            ? "linear-gradient(135deg, hsl(215 50% 12%), hsl(217 33% 17%))"
            : "hsl(0 0% 100%)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "hsl(214 20% 90%)"}`,
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "linear-gradient(135deg, hsla(217,91%,60%,0.2), hsla(160,80%,50%,0.1))",
            border: "1px solid hsla(217,91%,60%,0.3)",
          }}
        >
          <Lock className="w-7 h-7" style={{ color: "hsl(217 91% 60%)" }} />
        </div>

        <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Activate Your Free Trial
        </h2>
        <p className={`text-sm mb-6 leading-relaxed ${isDark ? "text-white/50" : "text-gray-500"}`}>
          Your demo site is ready! Start your 14-day free trial to unlock the full dashboard — bookings, calendar, CRM, and more.
        </p>

        <div className="space-y-3 text-left mb-8">
          {["Full booking system & calendar", "Customer management (CRM)", "Automated reminders & deposits"].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: "hsl(160 84% 39%)" }} />
              <span className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate("/dashboard/account")}
          className="w-full h-12 text-sm font-semibold rounded-full"
          style={{
            background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 50%))",
            boxShadow: "0 4px 16px hsla(217,91%,60%,0.4)",
          }}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Start Free Trial
        </Button>

        <p className={`mt-4 text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
          No charge until your trial ends. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default TrialLockOverlay;
