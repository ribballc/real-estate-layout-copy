import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════
   JARVIS Glass Interface — 12s loop
   0-5s customer, 5-6s transition, 6-11s owner, 11-12s transition
   ═══════════════════════════════════════════ */
const LOOP_MS = 12000;

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

  // Opacity calculations for smooth crossfade
  const customerOp = useMemo(() => {
    if (elapsed < 4600) return 1;
    if (elapsed < 5600) return Math.max(0, 1 - (elapsed - 4600) / 800);
    if (elapsed < 11000) return 0;
    if (elapsed < 11800) return Math.min(1, (elapsed - 11000) / 800);
    return 1;
  }, [elapsed]);

  const ownerOp = useMemo(() => {
    if (elapsed < 4800) return 0;
    if (elapsed < 5800) return Math.min(1, (elapsed - 4800) / 800);
    if (elapsed < 10600) return 1;
    if (elapsed < 11400) return Math.max(0, 1 - (elapsed - 10600) / 800);
    return 0;
  }, [elapsed]);

  const revenue = useMemo(() => {
    if (elapsed < 6000) return 1698;
    const t = Math.min((elapsed - 6000) / 1500, 1);
    return Math.round(1698 + easeOut(t) * 149);
  }, [elapsed]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="w-full flex justify-center p-4">
        <StaticFallback />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full pointer-events-none">
      {/* Desktop */}
      <div className="hidden lg:grid items-center" style={{ gridTemplateColumns: '110px 1fr 110px', gap: 20 }}>
        <FlowLabel side="left" active={customerOp > 0.5} />
        <GlassScreen customerOp={customerOp} ownerOp={ownerOp} revenue={revenue} elapsed={elapsed} />
        <FlowLabel side="right" active={ownerOp > 0.5} />
      </div>
      {/* Mobile */}
      <div className="flex lg:hidden flex-col items-center gap-4 px-2">
        <FlowLabel side="left" active={customerOp > 0.5} mobile />
        <GlassScreen customerOp={customerOp} ownerOp={ownerOp} revenue={revenue} elapsed={elapsed} mobile />
        <FlowLabel side="right" active={ownerOp > 0.5} mobile />
      </div>
    </div>
  );
};

/* ═══════════════════ Flow Labels ═══════════════════ */
const FlowLabel = ({ side, active, mobile }: { side: 'left' | 'right'; active: boolean; mobile?: boolean }) => {
  const isLeft = side === 'left';
  const color = isLeft ? 'hsl(217,91%,60%)' : 'hsl(160,84%,39%)';
  const text = isLeft ? 'Customer books instantly' : 'You get paid automatically';

  return (
    <div className={`flex ${mobile ? 'flex-row' : 'flex-col'} items-center gap-3`}>
      {isLeft && <span className="text-[13px] font-semibold text-primary-foreground/80 text-center leading-tight max-w-[100px]">{text}</span>}
      <div className="flex items-center gap-2">
        <div className="w-10 h-0.5 overflow-hidden rounded-full" style={{
          background: `linear-gradient(90deg, transparent, ${active ? color : 'rgba(255,255,255,0.1)'})`,
        }}>
          {active && <div className="w-full h-full" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            animation: 'jarvisLineFlow 2s ease-in-out infinite',
          }} />}
        </div>
        <div className="w-2 h-2 rounded-full transition-all duration-500" style={{
          background: active ? color : 'rgba(255,255,255,0.1)',
          boxShadow: active ? `0 0 12px ${color}, 0 0 24px ${color}40` : 'none',
          animation: active ? 'jarvisGlowPulse 2s ease-in-out infinite' : 'none',
        }} />
      </div>
      {!isLeft && <span className="text-[13px] font-semibold text-primary-foreground/80 text-center leading-tight max-w-[100px]">{text}</span>}
    </div>
  );
};

/* ═══════════════════ Glass Screen ═══════════════════ */
const GlassScreen = ({ customerOp, ownerOp, revenue, elapsed, mobile }: {
  customerOp: number; ownerOp: number; revenue: number; elapsed: number; mobile?: boolean;
}) => (
  <div className="relative flex justify-center items-center">
    {/* Edge glow */}
    <div className="absolute -inset-1 rounded-[22px]" style={{
      background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(160,84%,39%))',
      opacity: 0.12,
      filter: 'blur(16px)',
      animation: 'jarvisEdgePulse 4s ease-in-out infinite',
    }} />

    <div
      className={`relative overflow-hidden ${mobile ? 'w-full max-w-[400px]' : 'w-[420px]'}`}
      style={{
        height: mobile ? 500 : 560,
        background: 'hsla(215, 50%, 8%, 0.75)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        backdropFilter: 'blur(30px)',
        boxShadow: '0 0 0 1px hsla(217,91%,60%,0.25), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        animation: 'jarvisFrameFloat 6s ease-in-out infinite',
      }}
    >
      {/* Corner brackets */}
      {(['top-left','top-right','bottom-left','bottom-right'] as const).map(pos => (
        <Corner key={pos} position={pos} />
      ))}

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none z-[5]" style={{
        background: 'repeating-linear-gradient(0deg, transparent 0px, hsla(217,91%,60%,0.025) 1px, transparent 2px)',
        animation: 'jarvisScanMove 6s linear infinite',
      }} />

      {/* Inner padding */}
      <div className="relative w-full h-full z-[2]" style={{ padding: mobile ? '24px 20px' : '32px 28px' }}>
        {/* Customer View */}
        <div className="absolute flex flex-col gap-5" style={{
          inset: mobile ? '24px 20px' : '32px 28px',
          opacity: customerOp,
          transform: `translateX(${(1 - customerOp) * -20}px)`,
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          visibility: customerOp > 0.01 ? 'visible' : 'hidden',
        }}>
          <ViewHeader label="BOOKING SYSTEM" color="hsl(217,91%,60%)" />
          <ContentCard>
            <div className="w-14 h-14 rounded-xl shrink-0 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))',
              boxShadow: '0 4px 16px hsla(217,91%,60%,0.4)',
            }}>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                animation: 'jarvisIconShine 3s ease-in-out infinite',
              }} />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-[15px] font-semibold text-white/90">Premium Detail</span>
              <span className="text-[22px] font-bold" style={{ color: 'hsl(217,91%,60%)', textShadow: '0 0 12px hsla(217,91%,60%,0.5)' }}>$149.00</span>
            </div>
          </ContentCard>

          <div className="flex gap-3">
            <Pill label="Tomorrow" active />
            <Pill label="2:00 PM" active />
          </div>

          <div className="mt-auto relative">
            <div className="absolute inset-0 rounded-xl" style={{ background: 'hsl(160,84%,39%)', filter: 'blur(20px)', opacity: 0.25 }} />
            <div className="relative w-full py-4 px-5 rounded-xl flex justify-between items-center overflow-hidden" style={{
              background: 'linear-gradient(135deg, hsl(160,84%,39%), hsl(160,84%,30%))',
              border: '1px solid hsla(160,84%,39%,0.3)',
              boxShadow: '0 4px 20px hsla(160,84%,39%,0.3)',
            }}>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'jarvisButtonSweep 2.5s ease-in-out infinite',
              }} />
              <span className="text-[13px] font-bold text-white tracking-wider relative z-10">CONFIRM BOOKING</span>
              <span className="text-lg text-white relative z-10" style={{ animation: 'jarvisArrowSlide 1.5s ease-in-out infinite' }}>→</span>
            </div>
          </div>
        </div>

        {/* Owner View */}
        <div className="absolute flex flex-col gap-5" style={{
          inset: mobile ? '24px 20px' : '32px 28px',
          opacity: ownerOp,
          transform: `translateX(${(1 - ownerOp) * 20}px)`,
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          visibility: ownerOp > 0.01 ? 'visible' : 'hidden',
        }}>
          <ViewHeader label="PAYMENT RECEIVED" color="hsl(160,84%,39%)" />

          <ContentCard variant="success">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
              background: 'hsl(160,84%,39%)',
              boxShadow: '0 4px 16px hsla(160,84%,39%,0.4)',
            }}>
              <span className="text-xl text-white">✓</span>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-sm font-semibold text-white/80">New Booking</span>
              <span className="text-[22px] font-bold" style={{ color: 'hsl(160,84%,39%)', textShadow: '0 0 12px hsla(160,84%,39%,0.5)' }}>+$149.00</span>
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex flex-col gap-3 w-full">
              <ScheduleRow time="09:00" filled />
              <ScheduleRow time="11:00" filled />
              <ScheduleRow time="14:00" isNew />
              <ScheduleRow time="16:00" />
            </div>
          </ContentCard>

          <div className="mt-auto flex flex-col items-center gap-2 rounded-2xl py-5 px-4" style={{
            background: 'hsla(217,91%,60%,0.12)',
            border: '1px solid hsla(217,91%,60%,0.25)',
          }}>
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/50">TODAY'S REVENUE</span>
            <span className="text-4xl font-bold font-mono tracking-tight" style={{
              color: 'hsl(217,91%,60%)',
              textShadow: '0 0 16px hsla(217,91%,60%,0.5)',
            }}>${revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════ Sub-components ═══════════════════ */
const Corner = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const styles: Record<string, React.CSSProperties> = {
    'top-left': { top: 16, left: 16, borderRight: 'none', borderBottom: 'none' },
    'top-right': { top: 16, right: 16, borderLeft: 'none', borderBottom: 'none' },
    'bottom-left': { bottom: 16, left: 16, borderRight: 'none', borderTop: 'none' },
    'bottom-right': { bottom: 16, right: 16, borderLeft: 'none', borderTop: 'none' },
  };
  return <div className="absolute w-5 h-5 z-10" style={{ border: '2px solid hsl(217,91%,60%)', opacity: 0.5, animation: 'jarvisBracketPulse 3s ease-in-out infinite', ...styles[position] }} />;
};

const ViewHeader = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-2 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
    <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}`, animation: 'jarvisBlink 2s ease-in-out infinite' }} />
    <span className="text-[10px] font-bold text-white/50 tracking-[1.5px]">{label}</span>
  </div>
);

const ContentCard = ({ children, variant }: { children: React.ReactNode; variant?: 'success' }) => (
  <div className="flex items-center gap-4 rounded-2xl p-5 relative overflow-hidden" style={{
    background: variant === 'success' ? 'hsla(160,84%,39%,0.12)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${variant === 'success' ? 'hsla(160,84%,39%,0.25)' : 'rgba(255,255,255,0.08)'}`,
    backdropFilter: 'blur(10px)',
  }}>
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
      animation: 'jarvisCardShimmer 3s ease-in-out infinite',
    }} />
    <div className="relative z-10 flex items-center gap-4 w-full">{children}</div>
  </div>
);

const Pill = ({ label, active }: { label: string; active?: boolean }) => (
  <div className="flex-1 text-center text-sm font-semibold py-3.5 rounded-xl" style={{
    background: active ? 'hsla(217,91%,60%,0.15)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? 'hsla(217,91%,60%,0.4)' : 'rgba(255,255,255,0.08)'}`,
    color: active ? 'hsl(217,91%,60%)' : 'rgba(255,255,255,0.4)',
    boxShadow: active ? '0 0 16px hsla(217,91%,60%,0.2)' : 'none',
  }}>{label}</div>
);

const ScheduleRow = ({ time, filled, isNew }: { time: string; filled?: boolean; isNew?: boolean }) => (
  <div className="flex items-center gap-3">
    <span className="text-[13px] font-semibold font-mono min-w-[45px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{time}</span>
    <div className="flex-1 h-2.5 rounded-full relative overflow-hidden" style={{
      background: isNew ? 'hsla(160,84%,39%,0.25)' : filled ? 'hsla(217,91%,60%,0.2)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${isNew ? 'hsla(160,84%,39%,0.5)' : filled ? 'hsla(217,91%,60%,0.3)' : 'rgba(255,255,255,0.08)'}`,
      animation: isNew ? 'jarvisBarGlow 1.5s ease-in-out infinite' : 'none',
    }}>
      {isNew && <div className="absolute inset-0" style={{
        background: 'linear-gradient(90deg, transparent, hsla(160,84%,39%,0.5), transparent)',
        animation: 'jarvisBarFill 1.5s ease-out',
      }} />}
    </div>
    {isNew && <span className="text-[9px] font-bold text-white tracking-wide px-2 py-1 rounded-md" style={{
      background: 'hsl(160,84%,39%)',
    }}>NEW</span>}
  </div>
);

/* ═══════════════════ Fallback ═══════════════════ */
const StaticFallback = () => (
  <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
    <div className="text-sm font-semibold text-primary-foreground mb-2">Premium Detail – $149</div>
    <div className="text-xs text-primary-foreground/50">JARVIS Booking Interface</div>
  </div>
);

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

export default PremiumBookingDemo;
