import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════
   Premium Split-Screen Booking Animation
   8-second loop with customer phone + owner dashboard
   ═══════════════════════════════════════════ */
const LOOP_MS = 8000;

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
    const h = () => { pausedRef.current = document.hidden; if (!document.hidden) startRef.current = performance.now() - elapsed; };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scenes: 0-2s service, 2-4s datetime, 4-6s book, 6-8s confirmed
  const scene = useMemo(() => Math.floor(elapsed / 2000) as 0 | 1 | 2 | 3, [elapsed]);
  const ownerPhase = useMemo((): 'waiting' | 'incoming' | 'confirmed' => {
    if (elapsed < 4000) return 'waiting';
    if (elapsed < 6000) return 'incoming';
    return 'confirmed';
  }, [elapsed]);

  const displayRevenue = useMemo(() => {
    if (ownerPhase !== 'confirmed') return 1847;
    const t = Math.min((elapsed - 6000) / 800, 1);
    return Math.round(1847 + easeOut(t) * 149);
  }, [ownerPhase, elapsed]);

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
      aria-label="Split-screen booking animation showing customer booking and owner dashboard"
    >
      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid items-center justify-items-center" style={{ gridTemplateColumns: '1fr 80px 1fr', gap: 0 }}>
        <CustomerPhone scene={scene} elapsed={elapsed} />
        <FlowIndicator elapsed={elapsed} ownerPhase={ownerPhase} />
        <OwnerDashboard ownerPhase={ownerPhase} elapsed={elapsed} revenue={displayRevenue} />
      </div>

      {/* Mobile: stacked */}
      <div className="flex md:hidden flex-col items-center gap-6 px-2">
        <CustomerPhone scene={scene} elapsed={elapsed} />
        <MobileFlowIndicator elapsed={elapsed} ownerPhase={ownerPhase} />
        <OwnerDashboard ownerPhase={ownerPhase} elapsed={elapsed} revenue={displayRevenue} />
      </div>


    </div>
  );
};

/* ═══════════════════════════ Customer Phone ═══════════════════════════ */
const CustomerPhone = ({ scene, elapsed }: { scene: 0 | 1 | 2 | 3; elapsed: number }) => {
  const sceneProgress = (elapsed % 2000) / 2000;
  const transIn = Math.min(sceneProgress / 0.15, 1);
  const transOut = scene < 3 ? Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) : 1;
  const op = transIn * transOut;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phone shell */}
      <div
        className="relative"
        style={{
          width: 240, borderRadius: 32, padding: 8,
          background: '#1d1d1f',
          boxShadow: '0 0 0 4px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.4), 0 0 60px hsla(217,91%,60%,0.15)',
          animation: 'floatPhone 5s ease-in-out infinite',
        }}
      >
        {/* Screen */}
        <div className="relative overflow-hidden" style={{
          borderRadius: 26, padding: '24px 16px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          height: 420,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {/* Scene 1: Service select */}
          {scene === 0 && (
            <div className="flex flex-col gap-4 h-full" style={{ opacity: op, transform: `translateY(${(1-transIn)*10}px)` }}>
              <PhoneItem delay={0}>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-[10px] shrink-0" style={{ background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))' }} />
                  <div>
                    <div className="text-sm font-semibold text-[#1d1d1f]">Premium Detail</div>
                    <div className="text-lg font-bold" style={{ color: 'hsl(217,91%,60%)' }}>$149</div>
                  </div>
                </div>
              </PhoneItem>
              <PhoneItem delay={0.2}>
                <div className="flex gap-2">
                  <DateTimeChip label="Tomorrow" active />
                  <DateTimeChip label="2:00 PM" active />
                </div>
              </PhoneItem>
              <div className="mt-auto" style={{ animation: 'slideInPhone 0.6s cubic-bezier(0.4,0,0.2,1) 0.4s both' }}>
                <BookNowButton />
              </div>
            </div>
          )}
          {/* Scene 2: Confirming */}
          {scene === 1 && (
            <div className="flex flex-col items-center justify-center h-full gap-4" style={{ opacity: op }}>
              <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'hsl(217,91%,60%)', borderTopColor: 'transparent' }} />
              <div className="text-sm font-semibold text-[#1d1d1f]">Processing...</div>
            </div>
          )}
          {/* Scene 3: Payment */}
          {scene === 2 && (
            <div className="flex flex-col gap-4 h-full" style={{ opacity: op }}>
              <PhoneItem delay={0}>
                <div className="flex justify-between text-sm">
                  <span className="text-[#86868b]">Premium Detail</span>
                  <span className="font-semibold text-[#1d1d1f]">$149</span>
                </div>
              </PhoneItem>
              <PhoneItem delay={0.2}>
                <div className="flex justify-between text-sm">
                  <span className="text-[#86868b]">Deposit</span>
                  <span className="font-bold" style={{ color: 'hsl(217,91%,60%)' }}>$50</span>
                </div>
              </PhoneItem>
              <div className="mt-auto" style={{ animation: 'slideInPhone 0.6s cubic-bezier(0.4,0,0.2,1) 0.4s both' }}>
                <BookNowButton label="Pay Deposit →" />
              </div>
            </div>
          )}
          {/* Scene 4: Success */}
          {scene === 3 && (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ opacity: op }}>
              <SuccessCheck elapsed={elapsed - 6000} />
              <div className="text-base font-bold text-[#1d1d1f]" style={{ opacity: Math.min(Math.max((elapsed - 6400) / 300, 0), 1) }}>Booking Confirmed!</div>
              <div className="text-xs text-[#86868b]" style={{ opacity: Math.min(Math.max((elapsed - 6600) / 300, 0), 1) }}>Premium Detail • $149</div>
            </div>
          )}
        </div>
      </div>
      <span className="text-sm text-primary-foreground/80 font-medium">Customer books instantly</span>
    </div>
  );
};

const PhoneItem = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
  <div
    className="rounded-xl p-3.5"
    style={{
      background: '#ffffff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      animation: `slideInPhone 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s both`,
    }}
  >
    {children}
  </div>
);

const DateTimeChip = ({ label, active }: { label: string; active?: boolean }) => (
  <div className="flex-1 text-center text-[13px] font-semibold rounded-lg py-2.5" style={{
    background: active ? 'hsl(217,91%,60%)' : '#f8fafc',
    border: active ? '2px solid hsl(217,91%,60%)' : '2px solid #e5e7eb',
    color: active ? '#fff' : '#1d1d1f',
  }}>
    {label}
  </div>
);

const BookNowButton = ({ label = "Book Now" }: { label?: string }) => (
  <div className="w-full text-center py-3.5 rounded-[10px] text-[15px] font-semibold text-white" style={{
    background: '#10b981',
    boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
  }}>
    {label}
  </div>
);

const SuccessCheck = ({ elapsed }: { elapsed: number }) => {
  const p = Math.min(Math.max(elapsed / 600, 0), 1);
  return (
    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{
      background: 'rgba(16,185,129,0.1)',
      border: `2px solid rgba(16,185,129,${p * 0.6})`,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="24" strokeDashoffset={24 - p * 24} style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
      </svg>
    </div>
  );
};

/* ═══════════════════════════ Flow Indicator ═══════════════════════════ */
const FlowIndicator = ({ elapsed, ownerPhase }: { elapsed: number; ownerPhase: string }) => {
  const active = elapsed >= 4000;
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full">
      <div className="w-0.5 h-10" style={{
        background: active ? 'linear-gradient(180deg, transparent, hsla(217,91%,60%,0.3), transparent)' : 'rgba(255,255,255,0.05)',
        animation: active ? 'lineGlow 2s ease-in-out infinite' : 'none',
      }} />
      <span className="text-[28px] font-bold" style={{
        color: 'hsl(217,91%,60%)',
        animation: active ? 'pulseArrowBounce 2s ease-in-out infinite' : 'none',
      }}>→</span>
      <div className="w-3 h-3 rounded-full" style={{
        background: active ? 'hsl(217,91%,60%)' : 'rgba(255,255,255,0.1)',
        animation: active ? 'pulseDot 2s ease-in-out infinite' : 'none',
      }} />
      <div className="w-0.5 h-10" style={{
        background: active ? 'linear-gradient(180deg, transparent, hsla(217,91%,60%,0.3), transparent)' : 'rgba(255,255,255,0.05)',
        animation: active ? 'lineGlow 2s ease-in-out infinite' : 'none',
      }} />
    </div>
  );
};

const MobileFlowIndicator = ({ elapsed, ownerPhase }: { elapsed: number; ownerPhase: string }) => {
  const active = elapsed >= 4000;
  return (
    <div className="flex items-center justify-center gap-3" style={{ transform: 'rotate(90deg)', height: 60 }}>
      <div className="w-0.5 h-6" style={{
        background: active ? 'linear-gradient(180deg, transparent, hsla(217,91%,60%,0.4), transparent)' : 'rgba(255,255,255,0.05)',
      }} />
      <span className="text-xl font-bold" style={{ color: 'hsl(217,91%,60%)' }}>→</span>
      <div className="w-2.5 h-2.5 rounded-full" style={{
        background: active ? 'hsl(217,91%,60%)' : 'rgba(255,255,255,0.1)',
        animation: active ? 'pulseDot 2s ease-in-out infinite' : 'none',
      }} />
    </div>
  );
};

/* ═══════════════════════════ Owner Dashboard ═══════════════════════════ */
const OwnerDashboard = ({ ownerPhase, elapsed, revenue }: { ownerPhase: 'waiting' | 'incoming' | 'confirmed'; elapsed: number; revenue: number }) => (
  <div className="flex flex-col items-center gap-4">
    {/* Dashboard shell */}
    <div
      style={{
        width: 300, borderRadius: 20, padding: 6,
        background: '#1d1d1f',
        boxShadow: '0 0 0 4px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.4), 0 0 60px hsla(160,84%,39%,0.15)',
        animation: 'floatDash 5s ease-in-out infinite 0.5s',
      }}
    >
      <div className="overflow-hidden flex flex-col gap-4" style={{
        borderRadius: 16, padding: 20,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        height: 420,
      }}>
        {/* Notification */}
        <NotificationPopup ownerPhase={ownerPhase} elapsed={elapsed} />

        {/* Schedule slots */}
        <div className="flex flex-col gap-2.5">
          <ScheduleSlot time="9:00 AM" style={{ animation: 'fadeSlot 0.5s ease 0.2s both' }} />
          <ScheduleSlot time="11:00 AM" style={{ animation: 'fadeSlot 0.5s ease 0.4s both' }} filled />
          <ScheduleSlot
            time="2:00 PM ⚡"
            isNew={ownerPhase === 'confirmed'}
            isIncoming={ownerPhase === 'incoming'}
            style={{ animation: 'fadeSlot 0.5s ease 0.8s both' }}
          />
          <ScheduleSlot time="4:00 PM" empty style={{ animation: 'fadeSlot 0.5s ease 1s both' }} />
        </div>

        {/* Revenue */}
        <div className="mt-auto flex flex-col items-center gap-1 rounded-xl py-4" style={{
          background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))',
          animation: 'slideInPhone 0.6s ease 1s both',
        }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Today</span>
          <span className="text-[32px] font-bold text-white tracking-tight font-mono">${revenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <span className="text-sm text-primary-foreground/80 font-medium">You get paid automatically</span>
  </div>
);

const NotificationPopup = ({ ownerPhase, elapsed }: { ownerPhase: string; elapsed: number }) => {
  if (ownerPhase === 'waiting') return null;
  return (
    <div className="flex items-center gap-3 rounded-xl p-3" style={{
      background: 'linear-gradient(135deg, #10b981, #059669)',
      boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
      animation: 'popNotif 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
    }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
        <span className="text-base">✓</span>
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="text-[13px] font-bold text-white">New Booking!</span>
        <span className="text-xl font-bold text-white">+$149</span>
      </div>
    </div>
  );
};

const ScheduleSlot = ({ time, filled, isNew, isIncoming, empty, style }: {
  time: string; filled?: boolean; isNew?: boolean; isIncoming?: boolean; empty?: boolean; style?: React.CSSProperties;
}) => {
  let border = '2px solid #e5e7eb';
  let bg = '#ffffff';
  let opacity = 1;

  if (filled) { border = '2px solid hsl(217,91%,60%)'; bg = 'rgba(0,113,227,0.05)'; }
  if (isNew) { border = '2px solid #10b981'; bg = 'rgba(16,185,129,0.1)'; }
  if (isIncoming) { border = '2px solid hsl(217,91%,60%)'; bg = 'rgba(0,113,227,0.05)'; }
  if (empty) { opacity = 0.4; }

  return (
    <div className="px-4 py-3 rounded-[10px] text-sm font-semibold text-[#1d1d1f]" style={{
      background: bg, border, opacity, ...style,
      animation: isNew ? `highlightPulse 1s ease 0.8s forwards, ${(style?.animation || '')}` : style?.animation,
    }}>
      {time}
    </div>
  );
};

/* ═══════════════════════════ Static Fallback ═══════════════════════════ */
const StaticFallback = () => (
  <div className="flex gap-8 items-center">
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-sm font-semibold text-white mb-2">Premium Detail – $149</div>
      <div className="text-xs text-white/50">Tomorrow • 2:00 PM</div>
    </div>
    <span className="text-xl text-sky font-bold">→</span>
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-sm font-semibold text-white mb-2">New Booking! +$149</div>
      <div className="text-xs text-white/50">Today: $1,996</div>
    </div>
  </div>
);

/* ═══════════════════════════ Utils ═══════════════════════════ */
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

export default PremiumBookingDemo;
