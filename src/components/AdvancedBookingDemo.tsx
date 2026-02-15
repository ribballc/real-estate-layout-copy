import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════
   PHASE TIMING (12s total loop)
   ═══════════════════════════════════════════ */
const PHASES = [
  { id: 0, start: 0, end: 1500 },      // entrance
  { id: 1, start: 1500, end: 3500 },    // service select
  { id: 2, start: 3500, end: 5500 },    // time select
  { id: 3, start: 5500, end: 7500 },    // confirm + notification
  { id: 4, start: 7500, end: 9000 },    // money transfer
  { id: 5, start: 9000, end: 11000 },   // calendar update
  { id: 6, start: 11000, end: 12000 },  // reset
];
const LOOP_MS = 12000;

const AdvancedBookingDemo = () => {
  const [elapsed, setElapsed] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const pausedRef = useRef(false);

  // Reduced motion check
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Animation loop via rAF
  useEffect(() => {
    if (!isVisible || reducedMotion) return;
    startRef.current = performance.now() - elapsed;

    const tick = (now: number) => {
      if (pausedRef.current) { rafRef.current = requestAnimationFrame(tick); return; }
      const t = (now - startRef.current) % LOOP_MS;
      setElapsed(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, reducedMotion]);

  // Pause on tab hidden
  useEffect(() => {
    const h = () => { pausedRef.current = document.hidden; if (!document.hidden) startRef.current = performance.now() - elapsed; };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mouse parallax (desktop only, debounced)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseX(x);
    setMouseY(y);
  }, []);

  const phase = useMemo(() => PHASES.find(p => elapsed >= p.start && elapsed < p.end)?.id ?? 0, [elapsed]);

  // Money counter
  const moneyCount = useMemo(() => {
    if (phase !== 4) return phase > 4 ? 250 : 0;
    const progress = Math.min((elapsed - 7500) / 1000, 1);
    return Math.round((1 - Math.pow(1 - progress, 3)) * 250);
  }, [phase, elapsed]);

  // Entrance progress (0→1 over phase 0)
  const entrance = useMemo(() => {
    if (phase > 0) return 1;
    return Math.min(elapsed / 1200, 1);
  }, [phase, elapsed]);

  // Reset fade
  const resetFade = useMemo(() => {
    if (phase !== 6) return 1;
    return Math.max(1 - (elapsed - 11000) / 800, 0);
  }, [phase, elapsed]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="flex items-center justify-center py-8"
        aria-label="Booking system demonstration showing customer booking and business calendar">
        <StaticView />
      </div>
    );
  }

  const parallaxX = mouseX * 3;
  const parallaxY = mouseY * 2;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ height: 580, perspective: 2000 }}
      onMouseMove={handleMouseMove}
      aria-label="Animated demonstration of booking system - customer books service on left, notification arrives for business owner on right, booking populates calendar automatically"
    >
      {/* Background particles */}
      <Particles visible={entrance > 0.5} />

      {/* Desktop: Two displays */}
      <div className="hidden lg:flex items-center justify-center relative" style={{ transformStyle: 'preserve-3d', transform: 'scale(0.62)', transformOrigin: 'center center' }}>
        {/* Left Display (Customer) */}
        <div style={{
          transform: `perspective(2000px) rotateY(${-10 + parallaxX * 0.5}deg) rotateX(${2 + parallaxY * 0.3}deg) translateZ(20px) translateX(-10px)`,
          opacity: easeOut(entrance) * resetFade,
          filter: `blur(${(1 - entrance) * 20}px)`,
          transition: 'transform 0.3s ease-out',
          willChange: 'transform, opacity',
        }}>
          <GlassDisplay variant="light" phase={phase} elapsed={elapsed}>
            <CustomerScreen phase={phase} elapsed={elapsed} />
          </GlassDisplay>
        </div>

        {/* Connecting beam */}
        <ConnectingBeam phase={phase} entrance={entrance} resetFade={resetFade} />

        {/* Right Display (Owner) */}
        <div style={{
          transform: `perspective(2000px) rotateY(${10 + parallaxX * 0.5}deg) rotateX(${2 + parallaxY * 0.3}deg) translateZ(40px) translateX(10px)`,
          opacity: easeOut(Math.max(entrance - 0.15, 0) / 0.85) * resetFade,
          filter: `blur(${Math.max((1 - entrance) * 20 - 3, 0)}px)`,
          transition: 'transform 0.3s ease-out',
          willChange: 'transform, opacity',
        }}>
          <GlassDisplay variant="dark" phase={phase} elapsed={elapsed}>
            <OwnerScreen phase={phase} elapsed={elapsed} moneyCount={moneyCount} />
          </GlassDisplay>
        </div>

        {/* Money counter */}
        <RevenueCounter phase={phase} count={moneyCount} resetFade={resetFade} />

        {/* Money arc */}
        {phase === 4 && <MoneyTransfer elapsed={elapsed} />}
      </div>

      {/* Mobile: Single display */}
      <div className="flex lg:hidden items-center justify-center relative">
        <div style={{
          opacity: easeOut(entrance) * resetFade,
          filter: `blur(${(1 - entrance) * 15}px)`,
          willChange: 'opacity',
        }}>
          <GlassDisplay variant="dark" phase={phase} elapsed={elapsed} mobile>
            <OwnerScreen phase={phase} elapsed={elapsed} moneyCount={moneyCount} />
          </GlassDisplay>
        </div>
        {phase >= 4 && phase <= 5 && (
          <div className="absolute -bottom-6 z-20 px-4 py-2 rounded-xl font-mono font-bold text-[28px]"
            style={{
              color: 'hsl(160, 84%, 39%)',
              background: 'hsla(160, 84%, 39%, 0.1)',
              border: '1px solid hsla(160, 84%, 39%, 0.3)',
              backdropFilter: 'blur(10px)',
              opacity: resetFade,
            }}>
            +${moneyCount}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════ Utilities ═══════════════════════════ */
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

/* ═══════════════════════════ Glass Display ═══════════════════════════ */
const GlassDisplay = ({ children, variant, phase, elapsed, mobile }: {
  children: React.ReactNode; variant: 'light' | 'dark'; phase: number; elapsed: number; mobile?: boolean;
}) => {
  const isDark = variant === 'dark';
  const breathe = 1 + Math.sin(elapsed / 2000 * Math.PI) * 0.003;
  const glowIntensity = isDark ? 0.15 + Math.sin(elapsed / 1500 * Math.PI) * 0.1 : 0;

  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        width: mobile ? 300 : 320,
        height: mobile ? 580 : 620,
        borderRadius: 24,
        background: isDark
          ? 'hsla(220, 60%, 10%, 0.95)'
          : 'hsla(0, 0%, 100%, 0.98)',
        border: isDark
          ? '1px solid hsla(217, 91%, 60%, 0.3)'
          : '1px solid hsla(0, 0%, 100%, 0.3)',
        backdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: isDark
          ? `0 50px 100px hsla(0, 0%, 0%, 0.4), 0 0 ${60 + glowIntensity * 80}px hsla(217, 91%, 60%, ${glowIntensity}), inset 0 1px 0 hsla(217, 91%, 60%, 0.3)`
          : `0 50px 100px hsla(0, 0%, 0%, 0.2), 0 20px 40px hsla(217, 91%, 60%, 0.08), inset 0 1px 0 hsla(0, 0%, 100%, 0.5)`,
        transform: `scale(${breathe})`,
        willChange: 'transform, box-shadow',
      }}
    >
      {/* Top highlight gradient */}
      <div className="absolute inset-0 rounded-[24px] pointer-events-none" style={{
        background: isDark
          ? 'linear-gradient(180deg, hsla(217, 91%, 60%, 0.08) 0%, transparent 30%)'
          : 'linear-gradient(135deg, hsla(0, 0%, 100%, 0.6) 0%, transparent 50%)',
      }} />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-5 pt-6 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

/* ═══════════════════════════ Customer Screen ═══════════════════════════ */
const CustomerScreen = ({ phase, elapsed }: { phase: number; elapsed: number }) => (
  <div className="relative flex-1 overflow-hidden">
    {/* Phase 0-1: Services */}
    <ScreenSlide active={phase <= 1} direction="left" phase={phase} target={1}>
      <ScreenHeader title="Book Detailing" time="2:34 PM" dark={false} />
      <div className="mt-4 space-y-3">
        <ServiceCard name="Interior Detail" desc="Deep clean, vacuum, protection" price={180} duration="2-3 hrs" selected={false} phase={phase} />
        <ServiceCard name="Exterior Detail" desc="Wash, clay bar, polish, wax" price={250} duration="3-4 hrs" selected phase={phase} />
        <ServiceCard name="Full Detail" desc="Complete interior + exterior" price={400} duration="5-6 hrs" selected={false} phase={phase} />
      </div>
      <div className="mt-auto pt-4">
        <ActionButton text="Continue →" active={phase >= 1} pressed={phase >= 1 && elapsed > 2800} />
      </div>
    </ScreenSlide>

    {/* Phase 2: Time picker */}
    <ScreenSlide active={phase === 2} direction="right" phase={phase} target={2}>
      <ScreenHeader title="Select Time" time="2:34 PM" dark={false} />
      <div className="mt-3 text-[13px] font-semibold" style={{ color: 'hsl(215, 25%, 12%)' }}>Friday, Feb 14</div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'].map(t => (
          <TimeSlot key={t} time={t} selected={t === '2:00 PM'} phase={phase} elapsed={elapsed} />
        ))}
      </div>
      <div className="mt-auto pt-4">
        <ActionButton text="Continue to Payment" active={phase >= 2} pressed={phase >= 2 && elapsed > 5000} />
      </div>
    </ScreenSlide>

    {/* Phase 3+: Confirmation */}
    <ScreenSlide active={phase >= 3 && phase <= 5} direction="right" phase={phase} target={3}>
      {phase < 3 || (phase >= 3 && elapsed < 6500) ? (
        /* Summary view */
        <div>
          <ScreenHeader title="Confirm Booking" time="2:35 PM" dark={false} />
          <div className="mt-4 rounded-2xl p-4" style={{ background: 'hsl(210, 40%, 97%)', border: '1px solid hsl(214, 20%, 92%)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-medium" style={{ color: 'hsl(215, 16%, 47%)' }}>Service</span>
              <span className="text-[14px] font-semibold" style={{ color: 'hsl(215, 25%, 12%)' }}>Exterior Detail</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-medium" style={{ color: 'hsl(215, 16%, 47%)' }}>Date</span>
              <span className="text-[14px] font-semibold" style={{ color: 'hsl(215, 25%, 12%)' }}>Feb 14, 2:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium" style={{ color: 'hsl(215, 16%, 47%)' }}>Deposit</span>
              <span className="text-[14px] font-bold" style={{ color: 'hsl(217, 91%, 60%)' }}>$100</span>
            </div>
          </div>
          <div className="mt-3">
            <ActionButton text="Confirm & Pay $100" active pressed={elapsed > 6200} />
          </div>
        </div>
      ) : (
        /* Success view */
        <div className="flex-1 flex flex-col items-center justify-center">
          <SuccessCheck visible={phase >= 3 && elapsed >= 6500} />
          <div className="text-[18px] font-bold mt-3" style={{ color: 'hsl(215, 25%, 12%)', opacity: elapsed >= 6800 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            Booking Confirmed!
          </div>
          <div className="text-[14px] mt-1" style={{ color: 'hsl(215, 16%, 47%)', opacity: elapsed >= 7000 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            Exterior Detail · $250
          </div>
          {phase === 3 && elapsed >= 6500 && <ConfettiBurst />}
        </div>
      )}
    </ScreenSlide>
  </div>
);

/* ═══════════════════════════ Owner Screen ═══════════════════════════ */
const OwnerScreen = ({ phase, elapsed, moneyCount }: { phase: number; elapsed: number; moneyCount: number }) => (
  <div className="relative flex-1 overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div className="text-[16px] font-bold text-primary-foreground">Today's Schedule</div>
      <div className="text-[12px] font-medium" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>Fri, Feb 14</div>
    </div>
    {phase >= 5 && (
      <div className="text-[12px] font-medium mb-3" style={{ color: 'hsla(217, 91%, 60%, 0.8)', opacity: elapsed >= 9300 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        6 bookings · $1,450 total
      </div>
    )}

    {/* Notification overlay */}
    <NotificationBanner phase={phase} elapsed={elapsed} />

    {/* Empty state */}
    <div className="transition-all duration-500" style={{ opacity: phase < 3 ? 1 : 0, height: phase >= 5 ? 0 : 'auto', overflow: 'hidden' }}>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-2xl mb-3 flex items-center justify-center" style={{ background: 'hsla(217, 91%, 60%, 0.1)' }}>
          <CalendarIcon />
        </div>
        <div className="text-[14px] font-medium" style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}>No bookings yet</div>
        <div className="text-[12px] mt-1" style={{ color: 'hsla(0, 0%, 100%, 0.25)' }}>Waiting for customers...</div>
      </div>
    </div>

    {/* Calendar slots */}
    <div className="transition-all duration-700 space-y-2" style={{ opacity: phase >= 5 ? 1 : 0, transform: phase >= 5 ? 'translateY(0)' : 'translateY(20px)' }}>
      {[
        { time: '9:00 AM', name: 'Mike R.', service: 'Interior', amount: '$180', dim: true },
        { time: '11:00 AM', name: 'Sarah K.', service: 'Full Detail', amount: '$400', dim: true },
        { time: '2:00 PM', name: 'Jason Martinez', service: 'Exterior Detail', amount: '$250', highlight: true },
        { time: '4:00 PM', name: 'David L.', service: 'Interior', amount: '$180', dim: true },
      ].map((slot, i) => (
        <CalendarSlot key={slot.time} {...slot} phase={phase} elapsed={elapsed} index={i} />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════ Sub-Components ═══════════════════════════ */

const ScreenHeader = ({ title, time, dark }: { title: string; time: string; dark: boolean }) => (
  <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${dark ? 'hsla(0,0%,100%,0.1)' : 'hsl(214, 20%, 92%)'}` }}>
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke={dark ? 'rgba(255,255,255,0.6)' : '#64748B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="text-[15px] font-semibold" style={{ color: dark ? '#fff' : 'hsl(215, 25%, 12%)' }}>{title}</span>
    </div>
    <span className="text-[12px] font-mono" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94A3B8' }}>{time}</span>
  </div>
);

const ServiceCard = ({ name, desc, price, duration, selected, phase }: {
  name: string; desc: string; price: number; duration: string; selected?: boolean; phase: number;
}) => {
  const isActive = selected && phase >= 1;
  return (
    <div className="rounded-2xl p-4 transition-all duration-500" style={{
      background: isActive ? 'hsla(217, 91%, 60%, 0.06)' : 'hsl(210, 40%, 97%)',
      border: isActive ? '2px solid hsl(217, 91%, 60%)' : '1px solid hsl(214, 20%, 92%)',
      boxShadow: isActive ? '0 4px 20px hsla(217, 91%, 60%, 0.12)' : 'none',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
    }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-[14px] font-semibold" style={{ color: 'hsl(215, 25%, 12%)' }}>{name}</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'hsl(215, 16%, 47%)' }}>{desc}</div>
          <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ background: 'hsl(214, 20%, 92%)', color: 'hsl(215, 16%, 47%)' }}>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold font-mono" style={{ color: isActive ? 'hsl(217, 91%, 60%)' : 'hsl(215, 25%, 12%)' }}>${price}</span>
          {isActive && (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="11" fill="hsl(217, 91%, 60%)" />
              <path d="M7 11l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray: 20, strokeDashoffset: 0, transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

const TimeSlot = ({ time, selected, phase, elapsed }: { time: string; selected: boolean; phase: number; elapsed: number }) => {
  const isActive = selected && phase >= 2 && elapsed > 4000;
  return (
    <div className="rounded-xl py-3 text-center transition-all duration-400" style={{
      background: isActive ? 'hsla(217, 91%, 60%, 0.1)' : 'hsl(210, 40%, 97%)',
      border: isActive ? '2px solid hsl(217, 91%, 60%)' : '1px solid hsl(214, 20%, 92%)',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isActive ? '0 4px 16px hsla(217, 91%, 60%, 0.15)' : 'none',
    }}>
      <div className="text-[14px] font-semibold" style={{ color: isActive ? 'hsl(217, 91%, 60%)' : 'hsl(215, 25%, 12%)' }}>{time}</div>
    </div>
  );
};

const ActionButton = ({ text, active, pressed }: { text: string; active: boolean; pressed?: boolean }) => (
  <div className="rounded-xl py-3.5 text-center text-[14px] font-semibold transition-all duration-300" style={{
    background: active ? 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 50%) 100%)' : 'hsl(214, 20%, 90%)',
    color: active ? 'white' : 'hsl(215, 16%, 47%)',
    boxShadow: active ? '0 4px 16px hsla(217, 91%, 60%, 0.35)' : 'none',
    transform: pressed ? 'scale(0.97)' : 'scale(1)',
  }}>
    {text}
  </div>
);

const ScreenSlide = ({ children, active, direction, phase, target }: {
  children: React.ReactNode; active: boolean; direction: 'left' | 'right'; phase: number; target: number;
}) => {
  const offset = direction === 'right' ? '100%' : '-100%';
  return (
    <div className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{
      opacity: active ? 1 : 0,
      transform: active ? 'translateX(0)' : phase < target ? `translateX(${offset})` : `translateX(${direction === 'right' ? '-100%' : '100%'})`,
      pointerEvents: active ? 'auto' : 'none',
    }}>
      {children}
    </div>
  );
};

const SuccessCheck = ({ visible }: { visible: boolean }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.5)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
    <circle cx="32" cy="32" r="32" fill="hsl(142, 76%, 36%)" opacity="0.12" />
    <circle cx="32" cy="32" r="24" fill="hsl(142, 76%, 36%)" />
    <path d="M22 32l7 7 13-13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ strokeDasharray: 40, strokeDashoffset: visible ? 0 : 40, transition: 'stroke-dashoffset 0.6s ease 0.2s' }} />
  </svg>
);

const ConfettiBurst = () => {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      angle: (i / 15) * 360 + Math.random() * 20,
      distance: 40 + Math.random() * 60,
      size: 3 + Math.random() * 4,
      color: ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(45, 93%, 58%)', 'hsl(280, 67%, 60%)', 'hsl(0, 84%, 60%)', 'hsl(180, 70%, 50%)'][i % 6],
      delay: Math.random() * 0.1,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <div key={p.id} className="absolute rounded-full" style={{
            width: p.size, height: p.size, background: p.color,
            animation: `confettiParticle 0.9s ease-out ${p.delay}s forwards`,
            '--tx': `${tx}px`, '--ty': `${ty}px`,
          } as React.CSSProperties} />
        );
      })}
    </div>
  );
};

const NotificationBanner = ({ phase, elapsed }: { phase: number; elapsed: number }) => {
  const show = phase >= 3 && phase <= 4 && elapsed < 8500;
  return (
    <div className="absolute top-0 left-0 right-0 z-20 rounded-2xl px-4 py-3 transition-all duration-500" style={{
      background: 'hsla(217, 91%, 60%, 0.95)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px hsla(217, 91%, 60%, 0.4)',
      transform: show ? 'translateY(0) scale(1)' : 'translateY(-80px) scale(0.95)',
      opacity: show ? 1 : 0,
    }}>
      <div className="flex items-center gap-3">
        <span className="text-[16px]" style={{ animation: show ? 'bellRing 0.6s ease-in-out' : 'none' }}>🔔</span>
        <div className="flex-1">
          <div className="text-[13px] font-bold text-white">New Booking!</div>
          <div className="text-[12px]" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>Jason Martinez</div>
        </div>
        <div className="text-[16px] font-bold font-mono" style={{ color: 'hsl(160, 84%, 60%)' }}>$250</div>
      </div>
    </div>
  );
};

const CalendarSlot = ({ time, name, service, amount, highlight, dim, phase, elapsed, index }: {
  time: string; name: string; service: string; amount: string; highlight?: boolean; dim?: boolean; phase: number; elapsed: number; index: number;
}) => (
  <div className="rounded-xl px-3 py-2.5 transition-all duration-600" style={{
    background: highlight ? 'hsla(217, 91%, 60%, 0.1)' : 'hsla(0, 0%, 100%, 0.04)',
    border: highlight ? '1.5px solid hsla(217, 91%, 60%, 0.4)' : '1px solid hsla(0, 0%, 100%, 0.06)',
    opacity: dim ? 0.45 : elapsed >= 9200 + index * 100 ? 1 : 0,
    transform: elapsed >= 9200 + index * 100 ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
    boxShadow: highlight ? '0 0 20px hsla(217, 91%, 60%, 0.1)' : 'none',
  }}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[11px] font-mono" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>{time}</div>
        <div className="text-[13px] font-semibold text-primary-foreground">{name}</div>
        {highlight && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px]" style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}>{service}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'hsla(142, 76%, 36%, 0.15)', color: 'hsl(142, 76%, 50%)' }}>
              DEPOSIT PAID
            </span>
          </div>
        )}
      </div>
      <div className="text-[13px] font-mono font-semibold" style={{ color: highlight ? 'hsl(217, 91%, 60%)' : 'hsla(0, 0%, 100%, 0.4)' }}>{amount}</div>
    </div>
  </div>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="4" width="18" height="16" rx="3" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" />
    <line x1="2" y1="9" x2="20" y2="9" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" />
    <line x1="7" y1="2" x2="7" y2="6" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="15" y1="2" x2="15" y2="6" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ═══════════════════════════ Connecting Beam ═══════════════════════════ */
const ConnectingBeam = ({ phase, entrance, resetFade }: { phase: number; entrance: number; resetFade: number }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" style={{ width: 100, height: 4 }}>
    <div className="w-full h-[2px] rounded-full relative overflow-hidden" style={{
      background: 'hsla(217, 91%, 60%, 0.15)',
      opacity: entrance * resetFade,
    }}>
      <div className="absolute inset-y-0 left-0 rounded-full" style={{
        width: phase >= 4 ? '100%' : '0%',
        background: 'linear-gradient(90deg, hsl(217, 91%, 60%), hsl(190, 80%, 60%))',
        boxShadow: '0 0 12px hsla(217, 91%, 60%, 0.6)',
        transition: 'width 0.6s ease',
      }} />
    </div>
    {/* Data particles */}
    {phase === 4 && Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="absolute top-1/2 -translate-y-1/2 rounded-full" style={{
        width: 5, height: 5,
        background: 'hsl(217, 91%, 60%)',
        boxShadow: '0 0 8px hsla(217, 91%, 60%, 0.8)',
        left: 0,
        animation: `beamParticle 1s ease-in-out ${i * 0.15}s infinite`,
        opacity: resetFade,
      }} />
    ))}
  </div>
);

/* ═══════════════════════════ Money Transfer ═══════════════════════════ */
const MoneyTransfer = ({ elapsed }: { elapsed: number }) => {
  const progress = Math.min((elapsed - 7500) / 1200, 1);
  if (progress >= 1) return null;
  const eased = easeOut(progress);
  const x = -80 + eased * 160;
  const y = -Math.sin(eased * Math.PI) * 50;
  const rotation = eased * 720;
  const scale = 1 + Math.sin(eased * Math.PI) * 0.3;

  return (
    <div className="absolute z-30 pointer-events-none" style={{
      left: '50%', top: '45%',
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
      willChange: 'transform',
    }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-[16px]" style={{
        background: 'linear-gradient(135deg, hsl(160, 84%, 39%), hsl(160, 84%, 30%))',
        color: 'white',
        boxShadow: '0 0 30px hsla(160, 84%, 39%, 0.6)',
      }}>$</div>
    </div>
  );
};

/* ═══════════════════════════ Revenue Counter ═══════════════════════════ */
const RevenueCounter = ({ phase, count, resetFade }: { phase: number; count: number; resetFade: number }) => {
  const show = phase >= 4 && phase <= 5;
  return (
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-500" style={{
      opacity: show ? resetFade : 0,
      transform: `translateX(-50%) ${show ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)'}`,
    }}>
      <div className="px-6 py-3 rounded-2xl" style={{
        background: 'hsla(160, 84%, 39%, 0.08)',
        border: '2px solid hsla(160, 84%, 39%, 0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px hsla(160, 84%, 39%, 0.15)',
      }}>
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-center mb-1" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>Booking Revenue</div>
        <div className="text-[40px] font-mono font-extrabold text-center" style={{ color: 'hsl(160, 84%, 50%)', textShadow: '0 0 20px hsla(160, 84%, 50%, 0.4)' }}>
          +${count}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════ Particles ═══════════════════════════ */
const Particles = ({ visible }: { visible: boolean }) => {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.08 + Math.random() * 0.15,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease' }}>
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          background: `hsla(217, 91%, 70%, ${p.opacity})`,
          animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          willChange: 'transform',
        }} />
      ))}
    </div>
  );
};

/* ═══════════════════════════ Static View ═══════════════════════════ */
const StaticView = () => (
  <div className="flex gap-6 items-center">
    <GlassDisplay variant="dark" phase={5} elapsed={10000}>
      <div className="text-[15px] font-bold text-primary-foreground mb-3">Today's Schedule</div>
      <div className="text-[12px] font-medium mb-3" style={{ color: 'hsla(217, 91%, 60%, 0.8)' }}>6 bookings · $1,450 total</div>
      <div className="space-y-2">
        <CalendarSlot time="2:00 PM" name="Jason Martinez" service="Exterior Detail" amount="$250" highlight phase={5} elapsed={10000} index={0} />
        <CalendarSlot time="4:00 PM" name="David L." service="Interior" amount="$180" dim phase={5} elapsed={10000} index={1} />
      </div>
    </GlassDisplay>
  </div>
);

export default AdvancedBookingDemo;
