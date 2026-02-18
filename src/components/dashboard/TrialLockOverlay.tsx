import { useUpgradeModal } from "@/contexts/UpgradeModalContext";
import { Lock, ChevronRight } from "lucide-react";

interface TrialLockOverlayProps {
  isDark?: boolean;
}

const TrialLockOverlay = ({ isDark = true }: TrialLockOverlayProps) => {
  const { openUpgradeModal } = useUpgradeModal();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "hsla(217,91%,60%,0.1)",
          border: "1px solid hsla(217,91%,60%,0.25)",
        }}
      >
        <Lock className="w-7 h-7" style={{ color: "hsl(217,91%,60%)" }} strokeWidth={1.5} />
      </div>
      <h2 className="font-bold text-xl mb-2" style={{ color: isDark ? "white" : "hsl(222,47%,11%)" }}>
        Unlock Everything
      </h2>
      <p className="text-sm mb-6" style={{ color: isDark ? "hsla(0,0%,100%,0.5)" : "hsl(215,16%,55%)", maxWidth: "320px" }}>
        Start your 14-day free trial to access all features.
      </p>
      <button
        onClick={openUpgradeModal}
        className="font-semibold inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
        style={{
          height: "48px",
          borderRadius: "10px",
          padding: "0 28px",
          background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,48%) 100%)",
          color: "white",
          fontSize: "15px",
          boxShadow: "0 4px 20px hsla(217,91%,60%,0.3)",
        }}
      >
        Activate Free Trial
        <ChevronRight className="w-4 h-4" />
      </button>
      <p className="mt-3 text-xs" style={{ color: isDark ? "hsla(0,0%,100%,0.3)" : "hsl(215,16%,65%)" }}>
        14-day free trial · No charge today
      </p>
    </div>
  );
};

export default TrialLockOverlay;
