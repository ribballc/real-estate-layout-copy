import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const ExitIntentPopup = () => {
  const [visible, setVisible] = useState(false);
  const [bookings, setBookings] = useState(15);
  const { openFunnel } = useSurveyFunnel();

  const loss = Math.round(bookings * 150 * 0.25);

  const show = useCallback(() => {
    if (sessionStorage.getItem("exitShown")) return;
    setVisible(true);
    sessionStorage.setItem("exitShown", "true");
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [show]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) setVisible(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: "hsla(0, 0%, 0%, 0.8)", backdropFilter: "blur(8px)" }}
        onClick={() => setVisible(false)}
      />

      {/* Modal */}
      <div
        className="relative w-[90%] max-w-[560px] rounded-3xl p-8 md:p-12 text-center animate-scale-in"
        style={{
          background: "linear-gradient(135deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 17%) 100%)",
          border: "1px solid hsla(217, 91%, 60%, 0.3)",
          boxShadow: "0 20px 60px hsla(0, 0%, 0%, 0.5), 0 0 100px hsla(217, 91%, 60%, 0.2)",
        }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
          style={{
            background: "hsla(0, 0%, 100%, 0.05)",
            border: "1px solid hsla(0, 0%, 100%, 0.1)",
            color: "hsla(0, 0%, 100%, 0.6)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-6xl mb-4">⏸️</div>
        <h3 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Wait!</h3>
        <p className="text-lg md:text-xl mb-8" style={{ color: "hsla(0, 0%, 100%, 0.7)" }}>Before You Go...</p>

        {/* Calculator */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "hsla(217, 91%, 60%, 0.05)",
            border: "1px solid hsla(217, 91%, 60%, 0.2)",
          }}
        >
          <p className="text-sm mb-4" style={{ color: "hsla(0, 0%, 100%, 0.8)" }}>
            See how much you're actually losing to missed calls:
          </p>
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-xs" style={{ color: "hsla(0, 0%, 100%, 0.7)" }}>Your monthly bookings:</span>
            <input
              type="number"
              value={bookings}
              onChange={(e) => setBookings(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-3 rounded-lg text-center text-lg font-semibold text-primary-foreground min-h-[52px]"
              style={{
                background: "hsla(0, 0%, 100%, 0.05)",
                border: "1px solid hsla(0, 0%, 100%, 0.1)",
              }}
            />
          </label>

          <div
            className="flex items-center justify-center gap-3 p-4 rounded-xl"
            style={{
              background: "hsla(0, 84%, 60%, 0.1)",
              border: "1px solid hsla(0, 84%, 60%, 0.3)",
            }}
          >
            <span className="text-2xl">💸</span>
            <span className="text-base font-semibold text-primary-foreground">
              You're losing <span className="text-destructive text-xl font-bold">${loss.toLocaleString()}/month</span>
            </span>
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
          Join 200+ detailers who recovered this money
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setVisible(false); openFunnel(); }}
            className="w-full py-4 text-lg font-semibold rounded-xl text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 min-h-[48px]"
            style={{
              background: "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 50%))",
              boxShadow: "0 4px 20px hsla(217, 91%, 60%, 0.4)",
            }}
          >
            Start Free Trial →
          </button>
          <button
            onClick={() => setVisible(false)}
            className="w-full py-3 text-sm transition-colors duration-200"
            style={{ color: "hsla(0, 0%, 100%, 0.5)" }}
          >
            No thanks, I'll stay disorganized
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
