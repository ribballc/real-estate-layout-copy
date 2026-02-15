import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════
   JARVIS-Inspired Holographic Booking Interface
   10s loop: 0-4s customer, 4-5s transition, 5-9s owner, 9-10s transition
   ═══════════════════════════════════════════ */
const LOOP_MS = 10000;

const PremiumBookingDemo = () => {
  const [elapsed, setElapsed] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || reducedMotion) return;
    startRef.current = performance.now() - elapsed;
    const tick = (now: number) => {
      if (pausedRef.current) { rafRef.current = requestAnimationFrame(tick); return; }
      setElapsed((now - startRef.current) % LOOP_MS);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, reducedMotion]);

  useEffect(() => {
    const h = () => {
      pausedRef.current = document.hidden;
      if (!document.hidden) startRef.current = performance.now() - elapsed;
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // View state: customer (0-4s), transitioning (4-5s), owner (5-9s), transitioning (9-10s)
  const isCustomerView = elapsed < 4000 || elapsed >= 9500;
  const isOwnerView = elapsed >= 5000 && elapsed < 9000;
  const customerOpacity = elapsed < 4000 ? 1 : elapsed < 5000 ? Math.max(0, 1 - (elapsed - 4000) / 800) : elapsed >= 9500 ? Math.min(1, (elapsed - 9500) / 500) : 0;
  const ownerOpacity = elapsed >= 5000 && elapsed < 9000 ? 1 : elapsed >= 4200 && elapsed < 5000 ? Math.min(1, (elapsed - 4200) / 800) : elapsed >= 9000 ? Math.max(0, 1 - (elapsed - 9000) / 500) : 0;

  const displayRevenue = useMemo(() => {
    if (elapsed < 5000) return 1698;
    const t = Math.min((elapsed - 5000) / 1200, 1);
    return Math.round(1698 + easeOut(t) * 149);
  }, [elapsed]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="w-full flex items-center justify-center p-4">
        <StaticFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full pointer-events-none"
      aria-label="JARVIS-style holographic booking animation"
    >
      {/* Desktop layout */}
      <div className="hidden lg:grid items-center" style={{ gridTemplateColumns: '120px 1fr 120px', gap: 24 }}>
        <LeftLabel active={isCustomerView} />
        <HoloScreen
          elapsed={elapsed}
          customerOpacity={customerOpacity}
          ownerOpacity={ownerOpacity}
          revenue={displayRevenue}
        />
        <RightLabel active={isOwnerView} />
      </div>

      {/* Mobile layout */}
      <div className="flex lg:hidden flex-col items-center gap-5 px-2">
        <LeftLabel active={isCustomerView} mobile />
        <HoloScreen
          elapsed={elapsed}
          customerOpacity={customerOpacity}
          ownerOpacity={ownerOpacity}
          revenue={displayRevenue}
          mobile
        />
        <RightLabel active={isOwnerView} mobile />
      </div>
    </div>
  );
};

/* ═══════════════════════════ Flow Labels ═══════════════════════════ */
const LeftLabel = ({ active, mobile }: { active: boolean; mobile?: boolean }) => (
  <div className={`flex ${mobile ? 'flex-row' : 'flex-col'} items-center gap-3`}>
    <span className="text-sm font-semibold text-primary-foreground/90 text-center leading-tight">
      Customer books instantly
    </span>
    <div className={`flex items-center gap-2 ${mobile ? '' : 'flex-row-reverse'}`}>
      <div className="w-8 h-0.5 overflow-hidden" style={{
        background: 'linear-gradient(90deg, transparent, hsla(217,91%,60%,0.6))',
      }}>
        <div className="w-full h-full" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          animation: active ? 'jarvisLineFlow 2s ease-in-out infinite' : 'none',
        }} />
      </div>
      <div className="w-2 h-2 rounded-full" style={{
        background: active ? 'hsl(217,91%,60%)' : 'rgba(255,255,255,0.1)',
        boxShadow: active ? '0 0 12px hsl(217,91%,60%), 0 0 24px hsla(217,91%,60%,0.5)' : 'none',
        animation: active ? 'jarvisGlowPulse 2s ease-in-out infinite' : 'none',
      }} />
    </div>
  </div>
);

const RightLabel = ({ active, mobile }: { active: boolean; mobile?: boolean }) => (
  <div className={`flex ${mobile ? 'flex-row-reverse' : 'flex-col'} items-center gap-3`}>
    <div className={`flex items-center gap-2`}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center relative" style={{
        border: `2px solid ${active ? 'hsl(160,84%,39%)' : 'rgba(255,255,255,0.15)'}`,
        background: active ? 'hsla(160,84%,39%,0.1)' : 'transparent',
        boxShadow: active ? '0 0 16px hsla(160,84%,39%,0.4)' : 'none',
      }}>
        {active && <div className="absolute inset-0 rounded-full" style={{
          border: '2px solid hsl(160,84%,39%)',
          animation: 'jarvisCircleExpand 2s ease-out infinite',
        }} />}
      </div>
      <div className="w-8 h-0.5" style={{
        background: active ? 'linear-gradient(90deg, hsla(160,84%,39%,0.6), transparent)' : 'rgba(255,255,255,0.05)',
      }} />
    </div>
    <span className="text-sm font-semibold text-primary-foreground/90 text-center leading-tight">
      You get paid automatically
    </span>
  </div>
);

/* ═══════════════════════════ Holographic Screen ═══════════════════════════ */
const HoloScreen = ({ elapsed, customerOpacity, ownerOpacity, revenue, mobile }: {
  elapsed: number; customerOpacity: number; ownerOpacity: number; revenue: number; mobile?: boolean;
}) => (
  <div className="relative flex justify-center items-center">
    {/* Edge glow */}
    <div className="absolute -inset-0.5 rounded-3xl" style={{
      background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(160,84%,39%))',
      opacity: 0.15,
      filter: 'blur(12px)',
      animation: 'jarvisEdgePulse 4s ease-in-out infinite',
    }} />

    {/* Glass frame */}
    <div
      className={`relative overflow-hidden ${mobile ? 'w-full max-w-[400px]' : 'w-[480px]'}`}
      style={{
        height: mobile ? 480 : 560,
        background: 'linear-gradient(135deg, hsla(217,91%,60%,0.05), hsla(217,91%,60%,0.02), hsla(160,84%,39%,0.03))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: mobile ? 20 : 24,
        backdropFilter: 'blur(40px)',
        boxShadow: '0 0 0 1px hsla(217,91%,60%,0.2), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        animation: 'jarvisFrameFloat 6s ease-in-out infinite',
      }}
    >
      {/* Corner brackets */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: 'repeating-linear-gradient(0deg, hsla(217,91%,60%,0.03) 0px, transparent 2px, transparent 4px)',
        animation: 'jarvisScanMove 8s linear infinite',
      }} />

      {/* Particle field */}
      <ParticleField />

      {/* Screen content */}
      <div className="relative w-full h-full z-[2]">
        {/* Customer view */}
        <div className="absolute inset-0 flex flex-col gap-5" style={{
          opacity: customerOpacity,
          transform: `scale(${0.95 + customerOpacity * 0.05}) rotateY(${(1 - customerOpacity) * -10}deg)`,
          transition: 'transform 0.3s',
          pointerEvents: customerOpacity > 0.5 ? 'auto' : 'none',
        }}>
          <CustomerView elapsed={elapsed} />
        </div>

        {/* Owner view */}
        <div className="absolute inset-0 flex flex-col gap-5" style={{
          opacity: ownerOpacity,
          transform: `scale(${0.95 + ownerOpacity * 0.05}) rotateY(${(1 - ownerOpacity) * 10}deg)`,
          transition: 'transform 0.3s',
          pointerEvents: ownerOpacity > 0.5 ? 'auto' : 'none',
        }}>
          <OwnerView elapsed={elapsed} revenue={revenue} />
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════ Corner Brackets ═══════════════════════════ */
const CornerBracket = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const pos: Record<string, React.CSSProperties> = {
    'top-left': { top: 12, left: 12, borderRight: 'none', borderBottom: 'none' },
    'top-right': { top: 12, right: 12, borderLeft: 'none', borderBottom: 'none' },
    'bottom-left': { bottom: 12, left: 12, borderRight: 'none', borderTop: 'none' },
    'bottom-right': { bottom: 12, right: 12, borderLeft: 'none', borderTop: 'none' },
  };
  return (
    <div className="absolute w-6 h-6 z-[3]" style={{
      border: '2px solid hsl(217,91%,60%)',
      opacity: 0.6,
      ...pos[position],
      animation: 'jarvisBracketPulse 3s ease-in-out infinite',
    }} />
  );
};

/* ═══════════════════════════ Particle Field ═══════════════════════════ */
const ParticleField = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {[
      { top: '20%', left: '15%', delay: '0s' },
      { top: '40%', left: '80%', delay: '1.2s' },
      { top: '60%', left: '30%', delay: '2.4s' },
      { top: '75%', left: '70%', delay: '3.6s' },
      { top: '85%', left: '45%', delay: '4.8s' },
    ].map((p, i) => (
      <div key={i} className="absolute w-[3px] h-[3px] rounded-full" style={{
        top: p.top, left: p.left,
        background: 'hsl(217,91%,60%)',
        animation: `jarvisParticleFloat 6s ease-in-out infinite`,
        animationDelay: p.delay,
        opacity: 0,
      }} />
    ))}
  </div>
);

/* ═══════════════════════════ HUD Header ═══════════════════════════ */
const HudHeader = ({ status, statusColor }: { status: string; statusColor: string }) => (
  <div className="flex justify-between items-center px-2 pb-3" style={{
    borderBottom: '1px solid hsla(217,91%,60%,0.2)',
  }}>
    <span className="text-[11px] font-semibold tracking-wider font-mono" style={{ color: 'hsl(215,16%,47%)' }}>
      14:32
    </span>
    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: statusColor }}>
      ● {status}
    </span>
  </div>
);

/* ═══════════════════════════ Customer View ═══════════════════════════ */
const CustomerView = ({ elapsed }: { elapsed: number }) => (
  <>
    <HudHeader status="LIVE" statusColor="hsl(160,84%,39%)" />

    {/* Service card */}
    <HoloCard>
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-xl shrink-0 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))',
        }}>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            animation: 'jarvisIconShine 3s ease-in-out infinite',
          }} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-primary-foreground tracking-tight">Premium Detail</span>
          <span className="text-[22px] font-bold tracking-tight" style={{
            color: 'hsl(217,91%,60%)',
            textShadow: '0 0 12px hsla(217,91%,60%,0.5)',
          }}>$149.00</span>
        </div>
      </div>
    </HoloCard>

    {/* DateTime */}
    <HoloCard>
      <div className="flex gap-3">
        <DateTimeChip label="Tomorrow" active />
        <DateTimeChip label="2:00 PM" active />
      </div>
    </HoloCard>

    {/* CTA Button */}
    <div className="mt-auto relative">
      <div className="absolute inset-0 rounded-xl" style={{
        background: 'hsl(160,84%,39%)',
        filter: 'blur(20px)',
        opacity: 0.3,
      }} />
      <div className="relative w-full py-4 px-6 rounded-xl flex justify-between items-center overflow-hidden" style={{
        background: 'linear-gradient(135deg, hsl(160,84%,39%), hsl(160,84%,30%))',
        border: '1px solid hsla(160,84%,39%,0.3)',
        boxShadow: '0 4px 20px hsla(160,84%,39%,0.3)',
      }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          animation: 'jarvisButtonSweep 2s ease-in-out infinite',
        }} />
        <span className="text-sm font-bold text-white tracking-wider relative z-10">CONFIRM BOOKING</span>
        <span className="text-lg text-white relative z-10" style={{
          animation: 'jarvisArrowSlide 1.5s ease-in-out infinite',
        }}>→</span>
      </div>
    </div>
  </>
);

/* ═══════════════════════════ Owner View ═══════════════════════════ */
const OwnerView = ({ elapsed, revenue }: { elapsed: number; revenue: number }) => (
  <>
    <HudHeader status="PROCESSING" statusColor="hsl(160,84%,39%)" />

    {/* Payment notification */}
    <div className="flex items-center gap-4 rounded-2xl p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsl(160,84%,39%), hsl(160,84%,30%))',
      border: '1px solid hsla(160,84%,39%,0.3)',
      boxShadow: '0 4px 24px hsla(160,84%,39%,0.4)',
    }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
        background: 'rgba(255,255,255,0.2)',
      }}>
        <span className="text-xl">✓</span>
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="text-xs font-bold text-white/80 tracking-wider uppercase">PAYMENT RECEIVED</span>
        <span className="text-2xl font-bold text-white tracking-tight">+$149.00</span>
      </div>
      {/* Ripple */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full" style={{
        border: '2px solid rgba(255,255,255,0.3)',
        animation: 'jarvisRippleExpand 1.5s ease-out infinite',
      }} />
    </div>

    {/* Schedule */}
    <HoloCard>
      <div className="flex flex-col gap-3">
        <ScheduleItem time="09:00" filled />
        <ScheduleItem time="11:00" filled />
        <ScheduleItem time="14:00" isNew />
        <ScheduleItem time="16:00" />
      </div>
    </HoloCard>

    {/* Revenue HUD */}
    <div className="mt-auto flex flex-col items-center gap-2 rounded-2xl py-5 px-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, hsla(217,91%,60%,0.2), hsla(217,91%,60%,0.1))',
      border: '1px solid hsla(217,91%,60%,0.3)',
    }}>
      <span className="text-[10px] font-bold tracking-[1.5px] uppercase" style={{ color: 'hsl(215,16%,47%)' }}>
        TODAY'S REVENUE
      </span>
      <span className="text-4xl font-bold font-mono tracking-tight" style={{
        color: 'hsl(217,91%,60%)',
        textShadow: '0 0 20px hsla(217,91%,60%,0.5)',
      }}>
        ${revenue.toLocaleString()}.00
      </span>
      {/* Mini graph bars */}
      <div className="flex gap-2 items-end h-10 mt-2">
        {[16, 24, 28, 36].map((h, i) => (
          <div key={i} className="w-5 rounded" style={{
            height: h,
            background: i === 3 ? 'hsl(160,84%,39%)' : 'hsla(217,91%,60%,0.3)',
            boxShadow: i === 3 ? '0 0 12px hsla(160,84%,39%,0.5)' : 'none',
            borderRadius: 4,
          }} />
        ))}
      </div>
    </div>
  </>
);

/* ═══════════════════════════ Shared Components ═══════════════════════════ */
const HoloCard = ({ children }: { children: React.ReactNode }) => (
  <div className="relative rounded-2xl p-5 overflow-hidden" style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
  }}>
    {/* Top glow */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(circle at 50% 0%, hsla(217,91%,60%,0.15), transparent 70%)',
      opacity: 0.5,
    }} />
    {/* Shimmer */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(90deg, transparent, hsla(217,91%,60%,0.1), transparent)',
      animation: 'jarvisCardShimmer 3s ease-in-out infinite',
    }} />
    <div className="relative z-10">{children}</div>
  </div>
);

const DateTimeChip = ({ label, active }: { label: string; active?: boolean }) => (
  <div className="flex-1 text-center text-sm font-semibold py-3.5 rounded-xl relative overflow-hidden" style={{
    background: active ? 'hsla(217,91%,60%,0.2)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${active ? 'hsl(217,91%,60%)' : 'rgba(255,255,255,0.1)'}`,
    color: active ? 'hsl(217,91%,60%)' : 'hsl(215,16%,47%)',
    boxShadow: active ? '0 0 20px hsla(217,91%,60%,0.3)' : 'none',
  }}>
    {active && <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, hsla(217,91%,60%,0.2), transparent)',
    }} />}
    <span className="relative z-10">{label}</span>
  </div>
);

const ScheduleItem = ({ time, filled, isNew }: { time: string; filled?: boolean; isNew?: boolean }) => (
  <div className="flex items-center gap-3">
    <span className="text-[13px] font-semibold font-mono min-w-[50px]" style={{ color: 'hsl(215,16%,47%)' }}>
      {time}
    </span>
    <div className="flex-1 h-2 rounded relative overflow-hidden" style={{
      background: isNew ? 'hsla(160,84%,39%,0.2)' : filled ? 'hsla(217,91%,60%,0.2)' : 'rgba(255,255,255,0.1)',
      border: `1px solid ${isNew ? 'hsl(160,84%,39%)' : filled ? 'hsl(217,91%,60%)' : 'rgba(255,255,255,0.15)'}`,
      animation: isNew ? 'jarvisBarGlow 1.5s ease-in-out infinite' : 'none',
    }}>
      {isNew && <div className="absolute inset-0" style={{
        background: 'linear-gradient(90deg, transparent, hsla(160,84%,39%,0.5), transparent)',
        animation: 'jarvisBarFill 1.5s ease-in-out',
      }} />}
    </div>
    {isNew && <div className="w-3 h-3 rounded-full" style={{
      background: 'hsl(160,84%,39%)',
      animation: 'jarvisDotPulse 1.5s ease-in-out infinite',
      boxShadow: '0 0 8px hsla(160,84%,39%,0.7)',
    }} />}
  </div>
);

/* ═══════════════════════════ Static Fallback ═══════════════════════════ */
const StaticFallback = () => (
  <div className="rounded-2xl p-6" style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
  }}>
    <div className="text-sm font-semibold text-primary-foreground mb-2">Premium Detail – $149</div>
    <div className="text-xs text-primary-foreground/50">Holographic booking interface</div>
  </div>
);

/* ═══════════════════════════ Utils ═══════════════════════════ */
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

export default PremiumBookingDemo;
