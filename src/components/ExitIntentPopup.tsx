import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mascotPenguin from "@/assets/mascot-penguin.png";

const ExitIntentPopup = () => {
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);
  const navigate = useNavigate();

  // Arm the popup after 8s on page — avoids firing on instant bounces
  useEffect(() => {
    if (sessionStorage.getItem("exitShown")) return;
    const t = setTimeout(() => setArmed(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const show = useCallback(() => {
    if (!armed) return;
    if (sessionStorage.getItem("exitShown")) return;
    setVisible(true);
    sessionStorage.setItem("exitShown", "true");
  }, [armed]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 4) show();
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
        style={{ background: "hsla(0, 0%, 0%, 0.85)", backdropFilter: "blur(10px)" }}
        onClick={() => setVisible(false)}
      />

      {/* Modal wrapper */}
      <div className="relative w-[90%] max-w-[520px] flex flex-col items-center animate-scale-in">
        {/* Penguin peek — sits above the card */}
        <img
          src={mascotPenguin}
          alt=""
          aria-hidden="true"
          className="w-16 h-16 object-contain -mb-4 relative z-10 drop-shadow-lg"
        />
      <div
        className="relative w-full rounded-2xl p-8 md:p-10 text-center"
        style={{
          background: "linear-gradient(160deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 15%) 100%)",
          border: "1px solid hsla(217, 91%, 60%, 0.25)",
          boxShadow: "0 24px 80px hsla(0, 0%, 0%, 0.6), 0 0 120px hsla(217, 91%, 60%, 0.15)",
        }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
          style={{
            background: "hsla(0, 0%, 100%, 0.05)",
            border: "1px solid hsla(0, 0%, 100%, 0.08)",
            color: "hsla(0, 0%, 100%, 0.4)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eyebrow */}
        <p
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "hsl(217,91%,60%)" }}
        >
          Hold on
        </p>

        {/* Headline — the slap */}
        <h3
          className="font-bold leading-tight mb-3"
          style={{ color: "white", fontSize: "clamp(1.5rem, 4vw, 2.1rem)", lineHeight: 1.15 }}
        >
          You're really going to leave<br />
          <span style={{ color: "hsl(217,91%,60%)" }}>without claiming your free website?</span>
        </h3>

        <p
          className="text-sm mb-7 max-w-sm mx-auto"
          style={{ color: "hsla(0, 0%, 100%, 0.5)", lineHeight: 1.6 }}
        >
          Every detailer ahead of you in your city already has 24/7 online booking.
          Your phone number alone isn't going to cut it anymore.
        </p>

        {/* Value stack */}
        <div
          className="rounded-xl p-5 mb-6 text-left"
          style={{
            background: "hsla(217, 91%, 60%, 0.06)",
            border: "1px solid hsla(217, 91%, 60%, 0.15)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsla(0,0%,100%,0.35)" }}>
            What you walk away from
          </p>
          {[
            "Your own booking website — live in minutes",
            "24/7 online scheduling (no more missed calls)",
            "AI-written copy tailored to your shop",
            "Your own booking link to put everywhere",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
              <span style={{ color: "hsl(217,91%,60%)", fontSize: 14, lineHeight: "1.6", flexShrink: 0 }}>✓</span>
              <span className="text-sm" style={{ color: "hsla(0,0%,100%,0.7)", lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setVisible(false); navigate('/signup'); }}
            className="w-full py-4 text-base font-semibold rounded-xl text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 50%))",
              boxShadow: "0 4px 24px hsla(217, 91%, 60%, 0.45)",
            }}
          >
            Claim My Free Website →
          </button>
          <button
            onClick={() => setVisible(false)}
            className="w-full py-3 text-xs transition-colors duration-200"
            style={{ color: "hsla(0, 0%, 100%, 0.25)" }}
          >
            No thanks, I'll keep losing bookings to competitors
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
