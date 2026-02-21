import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Check, Sparkles, ArrowRight, Rocket, Shield, Zap, Star } from "lucide-react";

interface PostPurchaseCelebrationProps {
  firstName: string;
  isDark: boolean;
  onDismiss: () => void;
}

const UNLOCKED_FEATURES = [
  { icon: Zap, label: "Smart Booking Calendar", delay: 0 },
  { icon: Shield, label: "Automated SMS Reminders", delay: 80 },
  { icon: Star, label: "Custom Website & Booking Page", delay: 160 },
  { icon: Rocket, label: "Analytics Dashboard", delay: 240 },
];

const PostPurchaseCelebration = ({ firstName, isDark, onDismiss }: PostPurchaseCelebrationProps) => {
  const [phase, setPhase] = useState<"enter" | "features" | "ready">("enter");
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const firedRef = useRef(false);

  // Fire confetti on mount
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff", "#fbbf24"],
        zIndex: 9999,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff", "#fbbf24"],
        zIndex: 9999,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Big burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff", "#a78bfa", "#fbbf24"],
        zIndex: 9999,
      });
    }, 300);
  }, []);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("features"), 800);
    const t2 = setTimeout(() => setPhase("ready"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Stagger feature reveals
  useEffect(() => {
    if (phase !== "features" && phase !== "ready") return;
    const timers = UNLOCKED_FEATURES.map((_, i) =>
      setTimeout(() => setVisibleFeatures(i + 1), i * 120 + 100)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{
        background: "hsla(0,0%,0%,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "celebrationBackdropIn 0.4s ease forwards",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: "min(480px, calc(100vw - 32px))",
          background: isDark
            ? "linear-gradient(180deg, hsl(222, 47%, 11%) 0%, hsl(215, 50%, 8%) 100%)"
            : "linear-gradient(180deg, hsl(0, 0%, 100%) 0%, hsl(220, 14%, 97%) 100%)",
          border: `1px solid ${isDark ? "hsla(217,91%,60%,0.3)" : "hsl(217,91%,90%)"}`,
          borderRadius: "24px",
          boxShadow: isDark
            ? "0 32px 100px hsla(217,91%,60%,0.15), 0 0 0 1px hsla(217,91%,60%,0.1)"
            : "0 32px 100px hsla(217,91%,60%,0.2), 0 0 0 1px hsl(217,91%,90%)",
          animation: "celebrationCardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(217,91%,60%,0.25) 0%, transparent 70%)",
            animation: "celebrationGlow 3s ease-in-out infinite alternate",
          }}
        />

        <div className="relative px-7 pt-8 pb-7 text-center">
          {/* Animated checkmark */}
          <div
            className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,48%) 100%)",
              boxShadow: "0 8px 32px hsla(217,91%,60%,0.4)",
              animation: "celebrationBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both",
            }}
          >
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>

          {/* Headline */}
          <h2
            className={`text-2xl font-bold mb-1.5 ${isDark ? "text-white" : "text-[hsl(218,24%,18%)]"}`}
            style={{ animation: "celebrationFadeUp 0.5s ease 0.5s both" }}
          >
            You're all set{firstName ? `, ${firstName}` : ""}! 🎉
          </h2>
          <p
            className={`text-sm mb-6 ${isDark ? "text-white/50" : "text-[hsl(215,14%,51%)]"}`}
            style={{ animation: "celebrationFadeUp 0.5s ease 0.65s both" }}
          >
            Your 14-day free trial is active. Everything is unlocked.
          </p>

          {/* Unlocked features */}
          <div className="space-y-2.5 mb-6 text-left">
            {UNLOCKED_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              const visible = i < visibleFeatures;
              return (
                <div
                  key={feat.label}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                  style={{
                    background: isDark ? "hsla(217,91%,60%,0.08)" : "hsl(217,91%,97%)",
                    border: `1px solid ${isDark ? "hsla(217,91%,60%,0.15)" : "hsl(217,91%,92%)"}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isDark ? "hsla(217,91%,60%,0.15)" : "hsl(217,91%,93%)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "hsl(217,91%,60%)" }} />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-[hsl(218,24%,23%)]"}`}>
                    {feat.label}
                  </span>
                  <Check className="w-4 h-4 ml-auto shrink-0" style={{ color: "hsl(142,71%,45%)" }} />
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <button
            onClick={onDismiss}
            className={`w-full rounded-xl font-bold py-3.5 inline-flex items-center justify-center gap-2 transition-all duration-300 text-[15px] text-white ${
              phase === "ready" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,48%) 100%)",
              boxShadow: "0 4px 20px hsla(217,91%,60%,0.4)",
              transitionDelay: "0.2s",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>

          <p
            className={`text-xs mt-3 ${isDark ? "text-white/30" : "text-[hsl(215,14%,51%)]"}`}
            style={{ animation: "celebrationFadeUp 0.5s ease 1.5s both" }}
          >
            No charge for 14 days · Cancel anytime
          </p>
        </div>
      </div>

      <style>{`
        @keyframes celebrationBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes celebrationCardIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes celebrationBounce {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes celebrationFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes celebrationGlow {
          from { opacity: 0.5; transform: translateX(-50%) scale(1); }
          to { opacity: 1; transform: translateX(-50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default PostPurchaseCelebration;
