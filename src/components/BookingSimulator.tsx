import { useState, useEffect, useRef, useCallback } from "react";

const PHASE_DURATIONS = [1000, 2000, 2000, 1000, 1000, 1000, 1000]; // 8s total
const TOTAL_DURATION = PHASE_DURATIONS.reduce((a, b) => a + b, 0);

const BookingSimulator = () => {
  const [phase, setPhase] = useState(0);
  const [moneyCount, setMoneyCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Intersection observer — only animate when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Phase loop
  useEffect(() => {
    if (!isVisible || prefersReducedMotion.current) return;
    let elapsed = 0;
    let currentPhase = 0;
    setPhase(0);
    setMoneyCount(0);

    const interval = setInterval(() => {
      elapsed += 100;
      // Calculate current phase
      let sum = 0;
      for (let i = 0; i < PHASE_DURATIONS.length; i++) {
        sum += PHASE_DURATIONS[i];
        if (elapsed <= sum) { currentPhase = i; break; }
      }
      setPhase(currentPhase);

      // Money counter during phase 4
      const phase4Start = PHASE_DURATIONS.slice(0, 4).reduce((a, b) => a + b, 0);
      if (elapsed >= phase4Start && elapsed <= phase4Start + PHASE_DURATIONS[4]) {
        const progress = (elapsed - phase4Start) / PHASE_DURATIONS[4];
        setMoneyCount(Math.round(250 * Math.min(progress * 1.5, 1)));
      }

      if (elapsed >= TOTAL_DURATION) {
        elapsed = 0;
        setMoneyCount(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  const phoneBase = "rounded-[28px] overflow-hidden relative";
  const screenBg = "bg-[hsla(215,50%,10%,1)]";

  return (
    <div ref={containerRef} className="relative w-full h-[400px] lg:h-[560px]" style={{ perspective: "1200px" }}>
      {/* Reduced motion fallback */}
      {prefersReducedMotion.current ? (
        <div className="flex items-center justify-center h-full">
          <StaticPhoneView />
        </div>
      ) : (
        <>
          {/* Two phones */}
          <div className="flex items-center justify-center gap-3 lg:gap-6 h-full">
            {/* Customer phone (left) */}
            <div
              className={`${phoneBase} w-[42%] max-w-[200px] lg:max-w-[220px] h-[340px] lg:h-[440px] border border-primary-foreground/10 transition-all duration-700`}
              style={{
                background: "hsl(215 50% 10%)",
                transform: `rotateY(-5deg) translateY(${phase === 0 ? "40px" : "0"})`,
                opacity: phase === 0 ? 0 : 1,
                boxShadow: phase >= 3 ? "0 0 30px hsla(217, 91%, 60%, 0.2)" : "0 20px 60px rgba(0,0,0,0.3)",
                transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <PhoneFrame label="Customer's View" />
              <div className={`${screenBg} mx-1.5 mb-1.5 rounded-b-[20px] flex-1 p-3 flex flex-col gap-2 text-[11px] lg:text-xs`}>
                {phase >= 1 && phase < 3 && <ServiceSelection active={phase >= 1} />}
                {phase >= 2 && phase < 3 && <CalendarPick />}
                {phase >= 3 && <BookingConfirmed />}
              </div>
            </div>

            {/* Your phone (right) */}
            <div
              className={`${phoneBase} w-[42%] max-w-[200px] lg:max-w-[220px] h-[340px] lg:h-[440px] border border-primary-foreground/10 transition-all duration-700`}
              style={{
                background: "hsl(215 50% 10%)",
                transform: `rotateY(5deg) translateY(${phase === 0 ? "40px" : "0"})`,
                opacity: phase === 0 ? 0 : 1,
                boxShadow: phase >= 3 ? "0 0 30px hsla(217, 91%, 60%, 0.2)" : "0 20px 60px rgba(0,0,0,0.3)",
                transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <PhoneFrame label="Your View" />
              <div className={`${screenBg} mx-1.5 mb-1.5 rounded-b-[20px] flex-1 p-3 flex flex-col gap-2 text-[11px] lg:text-xs`}>
                {phase < 3 && <WaitingState />}
                {phase >= 3 && <NotificationArrived phase={phase} />}
              </div>
            </div>
          </div>

          {/* Money counter */}
          {phase >= 4 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
              style={{ opacity: 0, animation: "fadeSlideUp 0.4s ease-out forwards" }}
            >
              <span className="font-mono text-3xl lg:text-4xl font-bold" style={{ color: "hsl(160 60% 45%)" }}>
                +${moneyCount}
              </span>
              <p className="text-primary-foreground/40 text-xs mt-1">deposited instantly</p>
            </div>
          )}

          {/* Particle burst on booking */}
          {phase === 3 && <ParticleBurst />}
        </>
      )}
    </div>
  );
};

const PhoneFrame = ({ label }: { label: string }) => (
  <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
    <span className="text-[9px] lg:text-[10px] font-medium text-primary-foreground/40 uppercase tracking-wider">{label}</span>
    <div className="flex gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/20" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/20" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/20" />
    </div>
  </div>
);

const ServiceSelection = ({ active }: { active: boolean }) => (
  <div className="space-y-1.5">
    <p className="text-primary-foreground/50 font-medium mb-1">Select Service</p>
    {["Interior Detail", "Exterior Detail", "Full Detail"].map((s, i) => (
      <div
        key={s}
        className="rounded-lg px-2.5 py-2 flex items-center justify-between transition-all duration-300"
        style={{
          background: i === 1 && active ? "hsla(217, 91%, 60%, 0.15)" : "hsla(0, 0%, 100%, 0.05)",
          border: i === 1 && active ? "1px solid hsla(217, 91%, 60%, 0.3)" : "1px solid transparent",
        }}
      >
        <span className="text-primary-foreground/80">{s}</span>
        <span className="text-primary-foreground/40 font-mono text-[10px]">
          ${i === 0 ? 150 : i === 1 ? 250 : 400}
        </span>
      </div>
    ))}
    {active && (
      <div className="flex items-center gap-1 mt-1">
        <div className="w-3 h-3 rounded-full bg-accent flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span className="text-accent text-[10px]">Exterior Detail selected</span>
      </div>
    )}
  </div>
);

const CalendarPick = () => (
  <div className="mt-1 space-y-1.5" style={{ opacity: 0, animation: "fadeSlideUp 0.3s ease-out 0.2s forwards" }}>
    <p className="text-primary-foreground/50 font-medium">Pick a Time</p>
    <div className="grid grid-cols-3 gap-1">
      {["9 AM", "11 AM", "2 PM"].map((t, i) => (
        <div
          key={t}
          className="rounded-md py-1.5 text-center text-[10px] transition-all duration-200"
          style={{
            background: i === 2 ? "hsla(217, 91%, 60%, 0.2)" : "hsla(0, 0%, 100%, 0.05)",
            color: i === 2 ? "hsl(213 94% 68%)" : "hsla(0, 0%, 100%, 0.5)",
            border: i === 2 ? "1px solid hsla(217, 91%, 60%, 0.3)" : "1px solid transparent",
          }}
        >
          {t}
        </div>
      ))}
    </div>
    <p className="text-primary-foreground/30 text-[9px]">Fri, Feb 14 · 2:00 PM</p>
  </div>
);

const BookingConfirmed = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center gap-2" style={{ opacity: 0, animation: "heroScaleIn 0.5s ease-out forwards" }}>
    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center" style={{ animation: "heroScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s forwards", opacity: 0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="hsl(217 91% 60%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <p className="text-primary-foreground font-semibold text-sm">Booking Confirmed!</p>
    <p className="text-primary-foreground/40 text-[10px]">Deposit: $100 paid</p>
  </div>
);

const WaitingState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-2">
    <div className="w-8 h-8 rounded-full border-2 border-primary-foreground/10 border-t-accent animate-spin" />
    <p className="text-primary-foreground/30 text-[10px]">Waiting for bookings...</p>
  </div>
);

const NotificationArrived = ({ phase }: { phase: number }) => (
  <div className="flex-1 flex flex-col gap-2">
    {/* Notification banner */}
    <div
      className="rounded-lg p-2.5"
      style={{
        background: "hsla(217, 91%, 60%, 0.1)",
        border: "1px solid hsla(217, 91%, 60%, 0.2)",
        opacity: 0,
        animation: "fadeSlideDown 0.4s ease-out forwards",
      }}
    >
      <p className="text-accent font-semibold text-[11px]">🔔 New Booking!</p>
      <div className="mt-1.5 space-y-0.5">
        <p className="text-primary-foreground/80 text-[10px]">Jason Martinez</p>
        <p className="text-primary-foreground/50 text-[10px]">Exterior Detail · $250</p>
        <p className="text-primary-foreground/50 text-[10px]">Feb 14, 2:00 PM</p>
        <p className="text-accent text-[10px] font-medium">Deposit: $100 ✓</p>
      </div>
    </div>

    {/* Calendar update */}
    {phase >= 5 && (
      <div style={{ opacity: 0, animation: "fadeSlideUp 0.3s ease-out 0.2s forwards" }}>
        <p className="text-primary-foreground/40 text-[10px] font-medium mb-1">Today's Schedule</p>
        {[
          { time: "9 AM", name: "Sarah K.", done: true },
          { time: "11 AM", name: "Mike R.", done: true },
          { time: "2 PM", name: "Jason M.", isNew: true },
          { time: "4 PM", name: "Open" },
        ].map((slot) => (
          <div
            key={slot.time}
            className="flex items-center gap-2 py-1 text-[10px]"
            style={{
              color: slot.isNew ? "hsl(213 94% 68%)" : slot.done ? "hsla(0,0%,100%,0.3)" : "hsla(0,0%,100%,0.5)",
            }}
          >
            <span className="font-mono w-8">{slot.time}</span>
            <span className={slot.isNew ? "font-semibold" : ""}>{slot.name}</span>
            {slot.isNew && <span className="text-[8px] bg-accent/20 text-accent px-1 rounded">NEW</span>}
          </div>
        ))}
      </div>
    )}
  </div>
);

const ParticleBurst = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-accent"
        style={{
          left: "50%",
          top: "50%",
          opacity: 0,
          animation: `particleBurst${i % 3} 0.8s ease-out ${i * 0.05}s forwards`,
        }}
      />
    ))}
  </div>
);

const StaticPhoneView = () => (
  <div className="rounded-[28px] w-[200px] h-[400px] border border-primary-foreground/10 overflow-hidden" style={{ background: "hsl(215 50% 10%)" }}>
    <PhoneFrame label="Your View" />
    <div className="bg-[hsla(215,50%,10%,1)] mx-1.5 mb-1.5 rounded-b-[20px] flex-1 p-3">
      <div className="rounded-lg p-2.5" style={{ background: "hsla(217, 91%, 60%, 0.1)", border: "1px solid hsla(217, 91%, 60%, 0.2)" }}>
        <p className="text-accent font-semibold text-[11px]">🔔 New Booking!</p>
        <div className="mt-1.5 space-y-0.5">
          <p className="text-primary-foreground/80 text-[10px]">Jason Martinez</p>
          <p className="text-primary-foreground/50 text-[10px]">Exterior Detail · $250</p>
          <p className="text-accent text-[10px] font-medium">Deposit: $100 ✓</p>
        </div>
      </div>
    </div>
  </div>
);

export default BookingSimulator;
