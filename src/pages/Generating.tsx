import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";

const STATUS_MESSAGES = [
  "Setting up your booking calendar...",
  "Building your service pages...",
  "Configuring your location...",
  "Adding your contact info...",
  "Polishing the design...",
  "Almost there...",
];

const CYCLE_MS = 1300;
const NAV_DELAY = 4000;
const PROGRESS_DURATION = 3600;

const Generating = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("Your shop");
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const startRef = useRef(Date.now());

  // Load shop name
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}");
      if (data.businessName) setShopName(data.businessName);
    } catch {}
  }, []);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        setMsgVisible(true);
      }, 250);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  // Progress bar (0→90% over 3.6s)
  useEffect(() => {
    const raf = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / PROGRESS_DURATION) * 90, 90);
      setProgress(pct);
      if (pct < 90) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);

  // Auto-navigate at 4s
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigating(true);
      setProgress(100);
      setTimeout(() => navigate("/dashboard/website"), 220);
    }, NAV_DELAY);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Shop name */}
        <p className="text-white font-bold mb-1" style={{ fontSize: 22 }}>{shopName}</p>
        <p style={{ color: "hsla(0,0%,100%,0.4)", fontSize: 14 }}>is being built</p>

        {/* SVG Ring Loader */}
        <div className="my-6" style={{ width: 96, height: 96, filter: "drop-shadow(0 0 6px hsla(217,91%,60%,0.7))" }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            {/* Base ring */}
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsla(0,0%,100%,0.07)" strokeWidth="4" strokeLinecap="round" />
            {/* Trailing ghost arc */}
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="hsl(217,91%,40%)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="60 244" opacity="0.4"
              style={{ transformOrigin: "center", animation: "generatingSpinReverse 1.6s linear infinite" }}
            />
            {/* Main spinning arc */}
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="hsl(217,91%,60%)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="164 88"
              style={{ transformOrigin: "center", animation: "generatingSpin 1s linear infinite" }}
            />
            {/* Center dot */}
            <circle cx="48" cy="48" r="4" fill="hsl(217,91%,60%)"
              style={{ animation: "generatingPulse 1.2s ease-in-out infinite" }}
            />
          </svg>
        </div>

        {/* Cycling status */}
        <div style={{ minHeight: 24 }}>
          <p
            className="font-medium transition-opacity duration-[250ms]"
            style={{ color: "white", fontSize: 15, opacity: msgVisible ? 1 : 0 }}
          >
            {STATUS_MESSAGES[msgIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-10" style={{ width: 240, height: 3, borderRadius: 2, background: "hsla(0,0%,100%,0.08)" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: "hsl(217,91%,60%)",
              width: `${progress}%`,
              transition: navigating ? "width 0.2s ease" : "none",
            }}
          />
        </div>
      </div>

      {/* Inline CSS for SVG animations */}
      <style>{`
        @keyframes generatingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes generatingSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes generatingPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Generating;
