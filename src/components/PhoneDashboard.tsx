import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

/* ─── Types ─── */
interface Notification {
  label: string;
  amount: number;
  delay: number;
}

/* ─── Data ─── */
const NOTIFICATIONS: Notification[] = [
  { label: "New booking confirmed", amount: 149, delay: 1200 },
  { label: "Deposit collected", amount: 75, delay: 3200 },
  { label: "Full detail completed", amount: 199, delay: 5200 },
  { label: "Express wash booked", amount: 39, delay: 7000 },
];

const BASE_REVENUE = 2_410;
const LOOP_DURATION = 10000;

/* ─── NotificationRow ─── */
const NotificationRow = ({
  n,
  visible,
  glowing,
}: {
  n: Notification;
  visible: boolean;
  glowing: boolean;
}) => (
  <div
    className="flex items-center gap-3 py-3 px-3.5 rounded-xl relative overflow-hidden"
    style={{
      background: visible ? "hsla(217,91%,60%,0.06)" : "transparent",
      border: `1px solid ${visible ? "hsla(217,91%,60%,0.12)" : "transparent"}`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0) scale(1)" : "translateX(-24px) scale(0.97)",
      transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)",
    }}
  >
    {/* Glow sweep */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(90deg, hsla(160,84%,39%,0.12) 0%, transparent 60%)",
        opacity: glowing ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    />

    {/* Icon */}
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 relative z-[1]"
      style={{
        background: "hsla(160,84%,39%,0.12)",
        border: "1px solid hsla(160,84%,39%,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.5)",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.15s",
      }}
    >
      <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "hsl(160,84%,39%)" }} />
    </div>

    {/* Label */}
    <span
      className="text-[12px] sm:text-[13px] font-medium flex-1 relative z-[1]"
      style={{ color: "hsla(0,0%,100%,0.75)" }}
    >
      {n.label}
    </span>

    {/* Amount */}
    <span
      className="text-[13px] sm:text-sm font-bold relative z-[1] tabular-nums"
      style={{
        color: "hsl(160,84%,39%)",
        textShadow: glowing
          ? "0 0 16px hsla(160,84%,39%,0.8)"
          : "0 0 8px hsla(160,84%,39%,0.3)",
        transition: "text-shadow 0.5s ease",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      +${n.amount}
    </span>
  </div>
);

/* ─── PhoneDashboard ─── */
const PhoneDashboard = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [glowingCards, setGlowingCards] = useState<number[]>([]);
  const [revenue, setRevenue] = useState(BASE_REVENUE);
  const [revenueBump, setRevenueBump] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const runSequence = useCallback(() => {
    setVisibleCards([]);
    setGlowingCards([]);
    setRevenue(BASE_REVENUE);

    NOTIFICATIONS.forEach((n, i) => {
      // Slide in
      setTimeout(() => setVisibleCards((p) => [...p, i]), n.delay);
      // Glow
      setTimeout(() => setGlowingCards((p) => [...p, i]), n.delay + 300);
      // Remove glow
      setTimeout(() => setGlowingCards((p) => p.filter((x) => x !== i)), n.delay + 1200);
      // Revenue
      setTimeout(() => {
        setRevenue((prev) => prev + n.amount);
        setRevenueBump(true);
        setTimeout(() => setRevenueBump(false), 400);
      }, n.delay + 500);
    });
  }, []);

  useEffect(() => {
    runSequence();
    intervalRef.current = setInterval(runSequence, LOOP_DURATION);
    return () => clearInterval(intervalRef.current);
  }, [runSequence]);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Floating Glass Panel */}
      <div
        className="relative w-[260px] sm:w-[280px] lg:w-[300px]"
        style={{ animation: "phone-float 6s ease-in-out infinite" }}
      >
        {/* Ambient glow behind panel */}
        <div
          className="absolute -inset-8 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, hsla(217,91%,60%,0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Main glass container */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "hsla(215,50%,12%,0.5)",
            border: "1px solid hsla(217,91%,60%,0.15)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 16px 48px hsla(215,50%,5%,0.5), 0 0 0 1px hsla(217,91%,60%,0.08) inset, 0 1px 0 hsla(0,0%,100%,0.06) inset",
          }}
        >
          {/* Top edge highlight */}
          <div
            className="absolute top-0 left-[15%] right-[15%] h-[1px] pointer-events-none z-10"
            style={{
              background: "linear-gradient(90deg, transparent, hsla(217,91%,60%,0.35), transparent)",
            }}
          />

          {/* Subtle scan lines */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, hsla(217,91%,60%,0.01) 1px, transparent 2px)",
            }}
          />

          {/* Content */}
          <div className="relative z-[2] p-4 sm:p-5 flex flex-col gap-4">
            {/* Header: Revenue total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{
                    background: "hsla(217,91%,60%,0.12)",
                    border: "1px solid hsla(217,91%,60%,0.2)",
                  }}
                >
                  <TrendingUp className="w-3 h-3" style={{ color: "hsl(217,91%,60%)" }} />
                </div>
                <span
                  className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "hsla(0,0%,100%,0.4)" }}
                >
                  Revenue
                </span>
              </div>

              <div
                style={{
                  transform: revenueBump ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <span
                  className="text-lg sm:text-xl font-bold tabular-nums"
                  style={{
                    color: "hsl(0,0%,100%)",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "-0.5px",
                  }}
                >
                  ${revenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, hsla(217,91%,60%,0.12), transparent)",
              }}
            />

            {/* Notifications */}
            <div className="flex flex-col gap-1.5">
              {NOTIFICATIONS.map((n, i) => (
                <NotificationRow
                  key={i}
                  n={n}
                  visible={visibleCards.includes(i)}
                  glowing={glowingCards.includes(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        {[
          { top: -3, left: -3, borderRight: "none", borderBottom: "none" },
          { top: -3, right: -3, borderLeft: "none", borderBottom: "none" },
          { bottom: -3, left: -3, borderRight: "none", borderTop: "none" },
          { bottom: -3, right: -3, borderLeft: "none", borderTop: "none" },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 z-[5]"
            style={{ border: "1.5px solid hsla(217,91%,60%,0.25)", ...s }}
          />
        ))}
      </div>

      {/* Caption */}
      <p
        className="text-center text-xs sm:text-sm font-semibold tracking-[-0.2px]"
        style={{ color: "hsla(0,0%,100%,0.6)" }}
      >
        Bookings while you sleep
      </p>
    </div>
  );
};

export default PhoneDashboard;
