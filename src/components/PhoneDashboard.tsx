import { useState, useEffect, useRef, useCallback } from "react";
import { Check } from "lucide-react";

/* ─── Types ─── */
interface Booking {
  time: string;
  service: string;
  amount: number;
  isNew?: boolean;
}

/* ─── Data ─── */
const EXISTING_BOOKINGS: Booking[] = [
  { time: "9:00 AM", service: "Basic Wash", amount: 49 },
  { time: "11:00 AM", service: "Interior Clean", amount: 89 },
];

const NEW_BOOKINGS: Booking[] = [
  { time: "2:00 PM", service: "Premium Detail", amount: 149, isNew: true },
  { time: "4:00 PM", service: "Full Detail", amount: 199, isNew: true },
  { time: "6:00 PM", service: "Express Wash", amount: 39, isNew: true },
];

const BASE_REVENUE = 1847;
const LOOP_DURATION = 9000;

/* ─── BookingCard ─── */
const BookingCard = ({
  booking,
  visible,
  checked,
  glowing,
}: {
  booking: Booking;
  visible: boolean;
  checked: boolean;
  glowing: boolean;
}) => (
  <div
    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl relative overflow-hidden transition-all duration-600"
    style={{
      background: booking.isNew
        ? "rgba(16, 185, 129, 0.08)"
        : "rgba(255, 255, 255, 0.04)",
      border: `1px solid ${booking.isNew ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
      backdropFilter: "blur(20px)",
      opacity: booking.isNew ? (visible ? 1 : 0) : 0.6,
      transform: booking.isNew
        ? visible
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.95)"
        : "none",
      transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)",
    }}
  >
    {/* Glow overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(circle at center, rgba(16,185,129,0.2) 0%, transparent 70%)",
        opacity: glowing ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    />

    {/* Checkmark */}
    <div
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-[1]"
      style={{
        background: "rgba(16, 185, 129, 0.2)",
        border: "2px solid #10b981",
        opacity: booking.isNew ? (checked ? 1 : 0) : 1,
        transform: booking.isNew
          ? checked
            ? "scale(1) rotate(0deg)"
            : "scale(0) rotate(-90deg)"
          : "none",
        transition: "opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
    </div>

    {/* Info */}
    <div className="flex flex-col gap-0.5 flex-1 relative z-[1]">
      <span
        className="text-[11px] sm:text-[13px] font-semibold tracking-wide"
        style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Courier New', monospace" }}
      >
        {booking.time}
      </span>
      <span className="text-[13px] sm:text-[15px] font-semibold text-white tracking-[-0.2px]">
        {booking.service}
      </span>
    </div>

    {/* Amount */}
    <span
      className="text-base sm:text-lg font-bold whitespace-nowrap relative z-[1]"
      style={{
        color: "#10b981",
        letterSpacing: "-0.5px",
        textShadow: glowing
          ? "0 0 24px rgba(16,185,129,1), 0 0 36px rgba(16,185,129,0.5)"
          : "0 0 12px rgba(16,185,129,0.5)",
        transition: "text-shadow 0.5s ease",
      }}
    >
      {booking.isNew ? "+" : ""}${booking.amount}
    </span>
  </div>
);

/* ─── PhoneDashboard ─── */
const PhoneDashboard = () => {
  const [visibleNewCards, setVisibleNewCards] = useState<number[]>([]);
  const [checkedCards, setCheckedCards] = useState<number[]>([]);
  const [glowingCards, setGlowingCards] = useState<number[]>([]);
  const [revenue, setRevenue] = useState(BASE_REVENUE);
  const [revenueBump, setRevenueBump] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const runSequence = useCallback(() => {
    setVisibleNewCards([]);
    setCheckedCards([]);
    setGlowingCards([]);
    setRevenue(BASE_REVENUE);

    NEW_BOOKINGS.forEach((booking, i) => {
      const baseDelay = 1000 + i * 2000;

      // Slide in
      setTimeout(() => setVisibleNewCards((p) => [...p, i]), baseDelay);
      // Checkmark
      setTimeout(() => setCheckedCards((p) => [...p, i]), baseDelay + 400);
      // Glow
      setTimeout(() => setGlowingCards((p) => [...p, i]), baseDelay + 500);
      // Remove glow
      setTimeout(
        () => setGlowingCards((p) => p.filter((x) => x !== i)),
        baseDelay + 1500
      );
      // Revenue update
      setTimeout(() => {
        setRevenue((prev) => prev + booking.amount);
        setRevenueBump(true);
        setTimeout(() => setRevenueBump(false), 400);
      }, baseDelay + 700);
    });
  }, []);

  useEffect(() => {
    runSequence();
    intervalRef.current = setInterval(runSequence, LOOP_DURATION);
    return () => clearInterval(intervalRef.current);
  }, [runSequence]);

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">
      {/* Glass Screen */}
      <div className="relative flex justify-center items-center">
        <div
          className="relative w-[260px] sm:w-[290px] lg:w-[310px]"
          style={{
            aspectRatio: "360 / 680",
            background: "linear-gradient(135deg, hsla(217,91%,60%,0.08) 0%, hsla(215,50%,10%,0.6) 50%, hsla(217,91%,60%,0.05) 100%)",
            borderRadius: "28px",
            padding: "2px",
            boxShadow:
              "0 0 0 1px hsla(217,91%,60%,0.2), 0 20px 60px rgba(0,0,0,0.4), 0 0 80px hsla(217,91%,60%,0.1), inset 0 1px 0 hsla(0,0%,100%,0.1)",
            animation: "phone-float 6s ease-in-out infinite",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Inner glass screen */}
          <div
            className="w-full h-full flex flex-col gap-3 sm:gap-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsla(215,50%,10%,0.85) 0%, hsla(217,33%,17%,0.9) 100%)",
              borderRadius: "26px",
              padding: "20px 14px 14px 14px",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* Top edge highlight */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, hsla(217,91%,60%,0.4), transparent)",
              }}
            />

            {/* Scan lines overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0px, hsla(217,91%,60%,0.015) 1px, transparent 2px)",
              }}
            />

            {/* Status Bar */}
            <div
              className="flex justify-between items-center px-1.5 text-[11px] sm:text-[12px] font-medium z-[2]"
              style={{ color: "hsla(0,0%,100%,0.5)" }}
            >
              <span>2:47</span>
              <div className="flex gap-2 items-center">
                <span className="text-[8px] sm:text-[9px] tracking-[1px]">●●●</span>
                <span>⚡ 94%</span>
              </div>
            </div>

            {/* App Header */}
            <div
              className="flex justify-between items-start px-1.5 sm:px-2 pb-2.5 sm:pb-3 z-[2]"
              style={{ borderBottom: "1px solid hsla(217,91%,60%,0.1)" }}
            >
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold tracking-[1px] uppercase text-emerald-400">
                  <span className="animate-pulse">●</span> LIVE
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-[-0.5px] m-0">
                  Today's Bookings
                </h3>
              </div>

              {/* Revenue Badge */}
              <div
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
                style={{
                  background: "hsla(160,84%,39%,0.1)",
                  border: "1px solid hsla(160,84%,39%,0.25)",
                  backdropFilter: "blur(10px)",
                  transform: revenueBump ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <span
                  className="text-xs sm:text-sm font-bold text-emerald-400 tracking-[-0.3px]"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  ${revenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bookings List */}
            <div className="flex flex-col gap-1.5 sm:gap-2 overflow-hidden flex-1 z-[2]">
              {EXISTING_BOOKINGS.map((b, i) => (
                <BookingCard
                  key={`existing-${i}`}
                  booking={b}
                  visible={true}
                  checked={true}
                  glowing={false}
                />
              ))}
              {NEW_BOOKINGS.map((b, i) => (
                <BookingCard
                  key={`new-${i}`}
                  booking={b}
                  visible={visibleNewCards.includes(i)}
                  checked={checkedCards.includes(i)}
                  glowing={glowingCards.includes(i)}
                />
              ))}
            </div>

            {/* Bottom edge highlight */}
            <div
              className="absolute bottom-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, hsla(217,91%,60%,0.2), transparent)",
              }}
            />
          </div>
        </div>

        {/* Corner Accents */}
        {[
          { top: -4, left: -4, borderRight: "none", borderBottom: "none" },
          { top: -4, right: -4, borderLeft: "none", borderBottom: "none" },
          { bottom: -4, left: -4, borderRight: "none", borderTop: "none" },
          { bottom: -4, right: -4, borderLeft: "none", borderTop: "none" },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 z-[5]"
            style={{ border: "1.5px solid hsla(217,91%,60%,0.35)", ...s }}
          />
        ))}
      </div>

      {/* Caption */}
      <p
        className="text-center text-xs sm:text-sm font-semibold tracking-[-0.2px]"
        style={{ color: "hsla(0,0%,100%,0.7)" }}
      >
        Bookings while you sleep
      </p>
    </div>
  );
};

export default PhoneDashboard;
