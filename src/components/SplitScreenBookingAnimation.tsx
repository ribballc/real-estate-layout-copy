import { useEffect, useRef, useState, useMemo } from "react";

const LOOP_MS = 10000;

const SplitScreenBookingAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cycle, setCycle] = useState(0);

  // Intersection observer for visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Loop every 10s
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => setCycle(c => c + 1), LOOP_MS);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="w-full max-w-[1400px] mx-auto px-6 md:px-10 my-10 md:my-16">
      {/* Split screen wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_1fr] gap-10 lg:gap-0 items-center min-h-0 lg:min-h-[700px]">
        {/* Customer Side */}
        <CustomerSide cycle={cycle} />

        {/* Center Flow */}
        <CenterFlow />

        {/* Owner Side */}
        <OwnerSide cycle={cycle} />
      </div>
    </div>
  );
};

/* ═══════════════ Customer Side ═══════════════ */
const CustomerSide = ({ cycle }: { cycle: number }) => {
  const [activeDate, setActiveDate] = useState(1);
  const [activeTime, setActiveTime] = useState(2);

  // Reset selections on cycle
  useEffect(() => {
    setActiveDate(1);
    setActiveTime(2);
    const t1 = setTimeout(() => setActiveDate(0), 2000);
    const t2 = setTimeout(() => setActiveTime(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cycle]);

  const dates = ["Today", "Tomorrow", "Fri 21"];
  const times = ["9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phone Frame */}
      <div
        className="w-[300px] md:w-[340px] h-[600px] md:h-[680px] rounded-[48px] p-3 relative overflow-hidden"
        style={{
          background: "#1d1d1f",
          boxShadow: "0 0 0 8px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5), 0 0 100px hsla(217,91%,60%,0.2)",
          animation: "heroFloat 6s ease-in-out infinite",
        }}
      >
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-black rounded-b-[20px] z-10" />

        {/* Phone Content */}
        <div
          className="w-full h-full rounded-[40px] pt-12 px-5 pb-5 overflow-y-auto"
          style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl" style={{ color: "#0071e3" }}>←</span>
            <h4 className="text-xl font-semibold" style={{ color: "#1d1d1f", margin: 0 }}>Book Detailing</h4>
          </div>

          {/* Service Card */}
          <div
            className="flex gap-4 items-center p-4 rounded-2xl mb-6"
            style={{ background: "#ffffff", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
          >
            <div
              className="w-20 h-20 rounded-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0071e3 0%, #0077ed 100%)" }}
            />
            <div>
              <h5 className="text-lg font-semibold" style={{ color: "#1d1d1f", margin: "0 0 4px 0" }}>Premium Detail</h5>
              <p className="text-2xl font-bold" style={{ color: "#0071e3", margin: 0 }}>$149</p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#1d1d1f" }}>Select Date</p>
            <div className="flex gap-2">
              {dates.map((d, i) => (
                <button
                  key={d}
                  className="px-5 py-3 rounded-xl text-[15px] font-medium transition-all duration-300"
                  style={{
                    background: activeDate === i ? "#0071e3" : "#f8fafc",
                    border: `2px solid ${activeDate === i ? "#0071e3" : "#e5e7eb"}`,
                    color: activeDate === i ? "#ffffff" : "#1d1d1f",
                    transform: activeDate === i ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#1d1d1f" }}>Select Time</p>
            <div className="grid grid-cols-2 gap-2">
              {times.map((t, i) => (
                <button
                  key={t}
                  className="py-4 rounded-xl text-[15px] font-medium text-center transition-all duration-300"
                  style={{
                    background: activeTime === i ? "#0071e3" : "#f8fafc",
                    border: `2px solid ${activeTime === i ? "#0071e3" : "#e5e7eb"}`,
                    color: activeTime === i ? "#ffffff" : "#1d1d1f",
                    transform: activeTime === i ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full py-[18px] rounded-2xl text-[17px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "#10b981",
              border: "none",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
            }}
          >
            Book Now - $149
          </button>
        </div>
      </div>

      {/* Label */}
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-full"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span className="text-2xl">👤</span>
        <p className="text-base font-medium" style={{ color: "#f5f5f7", margin: 0 }}>Customer books in seconds</p>
      </div>
    </div>
  );
};

/* ═══════════════ Center Flow ═══════════════ */
const CenterFlow = () => (
  <div className="hidden lg:flex flex-col items-center justify-center gap-5 h-full relative">
    {/* Arrow */}
    <div className="flex items-center gap-2">
      <div
        className="w-[30px] h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(217,91%,60%) 50%, transparent 100%)",
          animation: "pulseSlow 2s ease-in-out infinite",
        }}
      />
      <span
        className="text-[32px] font-bold"
        style={{ color: "#0071e3", animation: "splitArrowPulse 2s ease-in-out infinite" }}
      >
        →
      </span>
    </div>

    {/* Particles */}
    <div className="flex flex-col gap-4 absolute">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: "#0071e3",
            animation: `splitParticleFlow 3s ease-in-out infinite ${i}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  </div>
);

/* ═══════════════ Owner Side ═══════════════ */
const OwnerSide = ({ cycle }: { cycle: number }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [revenue, setRevenue] = useState(1698);

  useEffect(() => {
    setShowAlert(false);
    setRevenue(1698);
    const t1 = setTimeout(() => setShowAlert(true), 1500);
    const t2 = setTimeout(() => setRevenue(1847), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cycle]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Desktop Frame */}
      <div
        className="w-full max-w-[540px] h-[540px] md:h-[620px] rounded-3xl p-2"
        style={{
          background: "#1d1d1f",
          boxShadow: "0 0 0 6px rgba(255,255,255,0.1), 0 30px 80px rgba(0,0,0,0.5), 0 0 100px rgba(16,185,129,0.2)",
          animation: "splitFloatReverse 6s ease-in-out infinite",
        }}
      >
        <div
          className="w-full h-full rounded-[18px] p-5 md:p-8 overflow-y-auto"
          style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}
        >
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: "2px solid #e5e7eb" }}>
            <h4 className="text-xl md:text-2xl font-bold" style={{ color: "#1d1d1f", margin: 0 }}>Today's Schedule</h4>
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-[28px] font-bold" style={{ color: "#0071e3" }}>12</span>
                <span className="text-[12px] font-medium uppercase" style={{ color: "#86868b" }}>Bookings</span>
              </div>
            </div>
          </div>

          {/* New Booking Alert */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl mb-6 transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              opacity: showAlert ? 1 : 0,
              transform: showAlert ? "translateY(0)" : "translateY(-10px)",
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
              <span className="text-xl">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-white" style={{ margin: "0 0 4px 0" }}>New Booking!</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>Premium Detail - Tomorrow 2:00 PM</p>
            </div>
            <span className="text-2xl font-bold text-white">+$149</span>
          </div>

          {/* Calendar Grid */}
          <div className="flex flex-col gap-3 mb-6">
            <AppointmentSlot time="9:00 AM" service="Basic Wash" variant="filled" />
            <AppointmentSlot time="11:00 AM" service="Interior Detail" variant="filled" />
            <AppointmentSlot time="2:00 PM" service="Premium Detail" variant="new" badge="NEW" />
            <AppointmentSlot time="4:00 PM" service="Available" variant="empty" />
          </div>

          {/* Revenue Counter */}
          <div
            className="p-6 rounded-2xl text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0071e3 0%, #0077ed 100%)" }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                animation: "splitShimmer 4s ease-in-out infinite",
              }}
            />
            <p className="text-sm font-semibold uppercase tracking-wider relative z-10" style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 8px 0" }}>
              Today's Revenue
            </p>
            <p className="text-4xl font-bold text-white relative z-10" style={{ margin: 0 }}>
              ${revenue.toLocaleString()}
              <span
                className="inline-block ml-3 px-3 py-1.5 rounded-lg text-lg font-bold transition-all duration-500"
                style={{
                  background: "rgba(16,185,129,0.2)",
                  color: "#10b981",
                  opacity: showAlert ? 1 : 0,
                  transform: showAlert ? "scale(1)" : "scale(0)",
                }}
              >
                +$149
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-full"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span className="text-2xl">💰</span>
        <p className="text-base font-medium" style={{ color: "#f5f5f7", margin: 0 }}>You get paid automatically</p>
      </div>
    </div>
  );
};

/* ═══════════════ Appointment Slot ═══════════════ */
const AppointmentSlot = ({ time, service, variant, badge }: {
  time: string; service: string; variant: "filled" | "new" | "empty"; badge?: string;
}) => {
  const borderColor = variant === "new" ? "#10b981" : variant === "filled" ? "#0071e3" : "#e5e7eb";
  const bg = variant === "new"
    ? "rgba(16,185,129,0.1)"
    : variant === "filled"
      ? "rgba(0,113,227,0.05)"
      : "#ffffff";

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300"
      style={{
        background: bg,
        border: `2px solid ${borderColor}`,
        opacity: variant === "empty" ? 0.5 : 1,
      }}
    >
      <span className="text-[15px] font-semibold min-w-[80px]" style={{ color: "#1d1d1f" }}>{time}</span>
      <span
        className={`text-[15px] flex-1 ${variant === "empty" ? "italic" : "font-medium"}`}
        style={{ color: variant === "empty" ? "#86868b" : "#1d1d1f" }}
      >
        {service}
      </span>
      {badge && (
        <span
          className="px-3 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider text-white"
          style={{
            background: "#10b981",
            animation: "splitBadgePulse 2s ease-in-out infinite",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default SplitScreenBookingAnimation;
