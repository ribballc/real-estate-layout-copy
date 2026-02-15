import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════
   8-second loop, 4 customer scenes + owner phases
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

  // Scene: 0-2s=service, 2-4s=time, 4-6s=payment, 6-8s=success
  const scene = useMemo(() => Math.floor(elapsed / 2000) as 0 | 1 | 2 | 3, [elapsed]);
  const sceneProgress = useMemo(() => (elapsed % 2000) / 2000, [elapsed]);

  // Owner phases: 0-4s=waiting, 4-6s=incoming, 6-8s=confirmed
  const ownerPhase = useMemo((): 'waiting' | 'incoming' | 'confirmed' => {
    if (elapsed < 4000) return 'waiting';
    if (elapsed < 6000) return 'incoming';
    return 'confirmed';
  }, [elapsed]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="p-8">
        <div className="flex gap-8 items-center justify-center">
          <StaticCustomerCard />
          <StaticOwnerCard />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full pointer-events-none overflow-hidden"
      style={{
        aspectRatio: '4 / 3',
        willChange: 'transform',
      }}
      aria-label="Animated demonstration of booking system connecting customer booking to business owner calendar"
    >
      {/* Desktop layout - use a fixed-size container with internal scaling */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'scale(0.55)', transformOrigin: '55% center' }}>
          {/* Customer Side */}
          <div className="flex items-center justify-end pr-4 shrink-0">
            <CustomerView scene={scene} sceneProgress={sceneProgress} elapsed={elapsed} />
          </div>

          {/* Data Flow Line */}
          <DataFlowLine elapsed={elapsed} ownerPhase={ownerPhase} />

          {/* Owner Side */}
          <div className="flex items-center justify-start pl-4 shrink-0">
            <OwnerView ownerPhase={ownerPhase} elapsed={elapsed} />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col items-center justify-center min-h-[400px] gap-4 px-4 py-6">
        {elapsed < 4000 ? (
          <div style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}>
            <CustomerView scene={scene} sceneProgress={sceneProgress} elapsed={elapsed} />
          </div>
        ) : (
          <>
            <VerticalFlowLine elapsed={elapsed} />
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}>
              <OwnerView ownerPhase={ownerPhase} elapsed={elapsed} />
            </div>
          </>
        )}
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <style>{`
        @keyframes ambientDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes particleFloat {
          0% { transform: translateX(-20px) translateY(10px); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.4; }
          100% { transform: translateX(80px) translateY(-40px); opacity: 0; }
        }
        @keyframes dashFlow {
          to { stroke-dashoffset: -20; }
        }
        @keyframes packetGlow {
          0%, 100% { box-shadow: 0 0 12px hsla(217, 91%, 60%, 0.4); }
          50% { box-shadow: 0 0 24px hsla(217, 91%, 60%, 0.7); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes typeChar {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

/* ═══════════════════════════ Glass Card ═══════════════════════════ */
const GlassCard = ({ children, className = "", style = {}, float = true }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; float?: boolean;
}) => (
  <div className={`relative ${className}`} style={{
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 20px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    animation: float ? 'cardFloat 3s ease-in-out infinite' : 'none',
    willChange: 'transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    ...style,
  }}>
    <div className="relative z-10">{children}</div>
  </div>
);

/* ═══════════════════════════ Customer View ═══════════════════════════ */
const CustomerView = ({ scene, sceneProgress, elapsed }: {
  scene: 0 | 1 | 2 | 3; sceneProgress: number; elapsed: number;
}) => {
  const transitionIn = Math.min(sceneProgress / 0.15, 1);
  const transitionOut = scene < 3 ? Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) : 1;
  const opacity = transitionIn * transitionOut;

  return (
    <div className="relative w-[320px] h-[440px]">
      {/* Scene 1: Service Selection */}
      <div className="absolute inset-0" style={{
        opacity: scene === 0 ? opacity : 0,
        transform: scene === 0 ? `translateY(${(1 - transitionIn) * 20}px)` : 'translateY(-20px)',
        transition: scene !== 0 ? 'opacity 0.4s, transform 0.4s' : 'none',
        pointerEvents: scene === 0 ? 'auto' : 'none',
      }}>
        <GlassCard className="h-full p-6" style={{ animationDelay: '0s' }}>
          <h3 className="text-[15px] font-semibold text-white mb-5">Book Your Detail</h3>
          <div className="space-y-3">
            {[
              { name: 'Exterior Detail', price: '$150', selected: false },
              { name: 'Full Detail', price: '$250', selected: true },
              { name: 'Paint Correction', price: '$400', selected: false },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300" style={{
                background: 'transparent',
                border: s.selected ? '1.5px solid hsla(217, 91%, 60%, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: s.selected ? '0 0 20px hsla(217, 91%, 60%, 0.15)' : 'none',
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{
                    borderColor: s.selected ? 'hsl(217, 91%, 60%)' : 'rgba(255,255,255,0.2)',
                    boxShadow: s.selected ? '0 0 8px hsla(217, 91%, 60%, 0.4)' : 'none',
                  }}>
                    {s.selected && <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(217, 91%, 60%)' }} />}
                  </div>
                  <span className="text-[13px] text-white" style={{ opacity: s.selected ? 1 : 0.5 }}>{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-white" style={{ opacity: s.selected ? 1 : 0.5 }}>{s.price}</span>
                  {s.selected && <span className="text-accent text-xs">✓</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <CTAButton text="Select Date & Time →" />
          </div>
        </GlassCard>
      </div>

      {/* Scene 2: Time Selection */}
      <div className="absolute inset-0" style={{
        opacity: scene === 1 ? opacity : 0,
        transform: scene === 1 ? `translateX(${(1 - transitionIn) * 30}px)` : 'translateX(30px)',
        transition: scene !== 1 ? 'opacity 0.4s, transform 0.4s' : 'none',
        pointerEvents: scene === 1 ? 'auto' : 'none',
      }}>
        <GlassCard className="h-full p-6" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-[15px] font-semibold text-white mb-1">Friday, Feb 14</h3>
          <p className="text-[12px] mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Select your preferred time</p>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="text-[11px] font-medium text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Morning</div>
            <div className="text-[11px] font-medium text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Afternoon</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { time: '10:00 AM', selected: false },
              { time: '2:00 PM', selected: true },
              { time: '11:00 AM', selected: false },
              { time: '3:00 PM', selected: false },
            ].map((s) => (
              <div key={s.time} className="px-4 py-3 rounded-xl text-center text-[13px] font-medium transition-all" style={{
                background: s.selected ? 'hsl(217, 91%, 60%)' : 'transparent',
                border: s.selected ? '1px solid hsl(217, 91%, 60%)' : '1px solid rgba(255,255,255,0.08)',
                color: s.selected ? '#fff' : 'rgba(255,255,255,0.5)',
                boxShadow: s.selected ? '0 4px 16px hsla(217, 91%, 60%, 0.3)' : 'none',
                transform: s.selected ? 'scale(1.02)' : 'scale(1)',
              }}>
                {s.time} {s.selected && '✓'}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <CTAButton text="Continue to Payment →" />
          </div>
        </GlassCard>
      </div>

      {/* Scene 3: Payment */}
      <div className="absolute inset-0" style={{
        opacity: scene === 2 ? opacity : 0,
        transform: scene === 2 ? 'translateY(0)' : 'translateY(20px)',
        transition: scene !== 2 ? 'opacity 0.4s, transform 0.4s' : 'none',
        pointerEvents: scene === 2 ? 'auto' : 'none',
      }}>
        <GlassCard className="h-full p-6" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-2 mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsla(217,91%,60%,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <h3 className="text-[15px] font-semibold text-white">Secure Deposit</h3>
          </div>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between"><span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Detail</span><span className="text-[13px] font-semibold text-white">$250</span></div>
            <div className="flex justify-between"><span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Deposit Required</span><span className="text-[13px] font-semibold text-white">$100</span></div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex justify-between"><span className="text-[14px] font-semibold text-white">Due Today</span><span className="text-[14px] font-bold" style={{ color: 'hsl(217, 91%, 60%)' }}>$100</span></div>
          </div>
          <div className="rounded-xl px-4 py-3 mb-5" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-[13px] font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
              •••• •••• •••• <TypeWriter text="4242" duration={800} elapsed={elapsed - 4000} />
            </span>
          </div>
          <div className="mt-auto">
            <CTAButton text="Pay Deposit →" />
          </div>
        </GlassCard>
      </div>

      {/* Scene 4: Success */}
      <div className="absolute inset-0" style={{
        opacity: scene === 3 ? opacity : 0,
        transform: scene === 3 ? 'scale(1)' : 'scale(0.95)',
        transition: scene !== 3 ? 'opacity 0.4s, transform 0.4s' : 'none',
        pointerEvents: scene === 3 ? 'auto' : 'none',
      }}>
        <GlassCard className="h-full p-6 flex flex-col items-center justify-center" style={{ animationDelay: '1.5s' }}>
          <SuccessCheckmark elapsed={elapsed - 6000} />
          <h3 className="text-[18px] font-bold text-white mt-4" style={{ opacity: Math.min(Math.max((elapsed - 6400) / 300, 0), 1) }}>
            Booking Confirmed!
          </h3>
          <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.5)', opacity: Math.min(Math.max((elapsed - 6600) / 300, 0), 1) }}>
            Full Detail • $250
          </p>
          <p className="text-[12px] mt-4 text-center max-w-[220px]" style={{ color: 'rgba(255,255,255,0.35)', opacity: Math.min(Math.max((elapsed - 6800) / 300, 0), 1) }}>
            You'll receive a reminder 1 day before your appointment
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

/* ═══════════════════════════ Owner View ═══════════════════════════ */
const OwnerView = ({ ownerPhase, elapsed }: { ownerPhase: 'waiting' | 'incoming' | 'confirmed'; elapsed: number }) => {
  const bookingCount = ownerPhase === 'confirmed' ? 7 : 6;

  // Animated revenue counter
  const displayRevenue = useMemo(() => {
    if (ownerPhase !== 'confirmed') return 1400;
    const t = Math.min((elapsed - 6000) / 800, 1);
    return Math.round(1400 + easeOut(t) * 250);
  }, [ownerPhase, elapsed]);

  return (
    <GlassCard className="w-[320px] p-5" style={{ animationDelay: '0.3s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-white">Today's Schedule</h3>
        <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Fri, Feb 14</span>
      </div>
      <p className="text-[12px] mb-4" style={{ color: 'hsla(217, 91%, 60%, 0.7)' }}>
        {bookingCount} bookings • ${displayRevenue.toLocaleString()} total
      </p>

      {/* Calendar slots */}
      <div className="space-y-2.5">
        <CalSlot time="9:00 AM" name="Mike R." price="$150" dim />
        <CalSlot time="11:00 AM" name="Sarah K." price="$400" dim />
        <IncomingSlot ownerPhase={ownerPhase} elapsed={elapsed} />
        <CalSlot time="4:00 PM" name="David L." price="$180" dim />
      </div>
    </GlassCard>
  );
};

const CalSlot = ({ time, name, price, dim }: { time: string; name: string; price: string; dim?: boolean }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300" style={{
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    opacity: dim ? 0.5 : 1,
  }}>
    <span className="text-[11px] font-mono w-[60px] shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{time}</span>
    <span className="text-[12px] text-white flex-1">{name}</span>
    <span className="text-[12px] font-semibold text-white">{price}</span>
  </div>
);

const IncomingSlot = ({ ownerPhase, elapsed }: { ownerPhase: 'waiting' | 'incoming' | 'confirmed'; elapsed: number }) => {
  if (ownerPhase === 'waiting') {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{
        background: 'transparent',
        border: '1px dashed rgba(255,255,255,0.1)',
      }}>
        <span className="text-[11px] font-mono w-[60px] shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>2:00 PM</span>
        <span className="text-[12px] italic" style={{ color: 'rgba(255,255,255,0.2)', animation: 'pulse 2s ease-in-out infinite' }}>Available</span>
      </div>
    );
  }

  const isConfirmed = ownerPhase === 'confirmed';
  return (
    <div className="relative px-3 py-2.5 rounded-xl transition-all duration-500 overflow-hidden" style={{
      background: 'transparent',
      border: `${isConfirmed ? '2px' : '1.5px'} solid hsla(217, 91%, 60%, ${isConfirmed ? 0.5 : 0.25})`,
      boxShadow: isConfirmed ? '0 0 20px hsla(217, 91%, 60%, 0.2), 0 0 0 4px hsla(217, 91%, 60%, 0.05)' : 'none',
    }}>
      {/* Ripple on confirm */}
      {isConfirmed && elapsed >= 6000 && elapsed < 6500 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-0 h-0 rounded-full" style={{
            background: 'hsla(217, 91%, 60%, 0.2)',
            animation: 'ripple 0.5s ease-out forwards',
            width: 200, height: 200,
          }} />
        </div>
      )}
      <div className="flex items-center gap-3 relative z-10">
        <span className="text-[11px] font-mono w-[60px] shrink-0" style={{ color: 'hsla(217, 91%, 60%, 0.7)' }}>2:00 PM</span>
        <div className="flex-1 min-w-0">
          {ownerPhase === 'incoming' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{
              background: 'transparent',
              border: '1px solid hsla(217, 91%, 60%, 0.3)',
              animation: 'pulse 1s ease-in-out infinite',
            }}>INCOMING</span>
          )}
          {isConfirmed && (
            <div>
              <div className="text-[12px] font-medium text-white overflow-hidden whitespace-nowrap">
                <span style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: `${Math.min((elapsed - 6000) / 15, 100)}%`,
                  maxWidth: '100%',
                }}>Jason Martinez</span>
              </div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', opacity: Math.min(Math.max((elapsed - 6500) / 300, 0), 1) }}>
                Full Detail
              </div>
            </div>
          )}
        </div>
        {isConfirmed && (
          <div className="flex items-center gap-2" style={{ opacity: Math.min(Math.max((elapsed - 6700) / 300, 0), 1) }}>
            <span className="text-[12px] font-semibold text-white">$250</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide" style={{
              background: 'transparent',
              border: '1px solid hsla(145, 63%, 42%, 0.5)',
              color: 'hsl(145, 63%, 55%)',
              boxShadow: '0 0 12px hsla(145, 63%, 42%, 0.3)',
            }}>PAID</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════ Data Flow Line ═══════════════════════════ */
const DataFlowLine = ({ elapsed, ownerPhase }: { elapsed: number; ownerPhase: string }) => {
  const showLine = elapsed >= 4000 && elapsed < 7000;
  const packetProgress = useMemo(() => {
    if (elapsed < 4200) return 0;
    if (elapsed > 5200) return 1;
    return easeInOut((elapsed - 4200) / 1000);
  }, [elapsed]);

  return (
    <div className="relative w-16 h-[300px] flex items-center justify-center shrink-0">
      {/* Dashed line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 300" fill="none">
        <path
          d="M32 40 C32 120, 32 180, 32 260"
          stroke={showLine ? 'url(#lineGrad)' : 'rgba(255,255,255,0.05)'}
          strokeWidth="2"
          strokeDasharray="6 4"
          style={{ animation: showLine ? 'dashFlow 1s linear infinite' : 'none' }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
            <stop offset="100%" stopColor="hsl(217, 91%, 70%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Data packet */}
      {showLine && elapsed >= 4200 && elapsed <= 5400 && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{
          top: `${14 + packetProgress * 74}%`,
          width: 8, height: 8,
          borderRadius: '50%',
          background: 'hsl(217, 91%, 70%)',
          border: '2px solid white',
          animation: 'packetGlow 0.8s ease-in-out infinite',
          willChange: 'top',
        }} />
      )}
    </div>
  );
};

const VerticalFlowLine = ({ elapsed }: { elapsed: number }) => (
  <div className="w-1 h-8 rounded-full" style={{
    background: elapsed >= 4000 ? 'linear-gradient(180deg, hsl(217, 91%, 60%), hsl(217, 91%, 70%))' : 'rgba(255,255,255,0.05)',
    transition: 'background 0.4s',
  }} />
);

/* ═══════════════════════════ Floating Particles ═══════════════════════════ */
const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="absolute rounded-full" style={{
        width: 2 + Math.random() * 2,
        height: 2 + Math.random() * 2,
        background: `hsla(217, 91%, 60%, ${0.15 + Math.random() * 0.2})`,
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
        animation: `particleFloat ${2 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${i * 0.5}s`,
      }} />
    ))}
  </div>
);

/* ═══════════════════════════ Small Components ═══════════════════════════ */
const CTAButton = ({ text }: { text: string }) => (
  <div className="w-full py-2.5 rounded-xl text-center text-[13px] font-semibold text-white" style={{
    background: 'linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 50%))',
    boxShadow: '0 4px 12px hsla(217, 91%, 60%, 0.3)',
  }}>{text}</div>
);

const TypeWriter = ({ text, duration, elapsed }: { text: string; duration: number; elapsed: number }) => {
  const chars = Math.max(0, Math.min(Math.floor(elapsed / (duration / text.length)), text.length));
  return <>{text.slice(0, chars)}</>;
};

const SuccessCheckmark = ({ elapsed }: { elapsed: number }) => {
  const progress = Math.min(Math.max(elapsed / 600, 0), 1);
  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
      background: 'transparent',
      border: `2px solid hsla(145, 63%, 42%, ${progress * 0.6})`,
      boxShadow: progress > 0 ? '0 0 20px hsla(145, 63%, 42%, 0.3), 0 0 0 8px hsla(145, 63%, 42%, 0.05)' : 'none',
      transition: 'all 0.3s',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke="hsl(145, 63%, 55%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="24"
          strokeDashoffset={24 - progress * 24}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
    </div>
  );
};

/* ═══════════════════════════ Static Fallback ═══════════════════════════ */
const StaticCustomerCard = () => (
  <GlassCard className="w-[280px] p-5" float={false}>
    <h3 className="text-[14px] font-semibold text-white mb-3">Book Your Detail</h3>
    <div className="space-y-2">
      {['Exterior Detail $150', 'Full Detail $250 ✓', 'Paint Correction $400'].map(s => (
        <div key={s} className="text-[12px] px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}>{s}</div>
      ))}
    </div>
  </GlassCard>
);
const StaticOwnerCard = () => (
  <GlassCard className="w-[280px] p-5" float={false}>
    <h3 className="text-[14px] font-semibold text-white mb-3">Today's Schedule</h3>
    <div className="space-y-2">
      {['9:00 AM - Mike R. $150', '11:00 AM - Sarah K. $400', '2:00 PM - Jason M. $250'].map(s => (
        <div key={s} className="text-[12px] px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}>{s}</div>
      ))}
    </div>
  </GlassCard>
);

/* ═══════════════════════════ Utils ═══════════════════════════ */
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
const easeInOut = (t: number) => {
  const c = Math.min(Math.max(t, 0), 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export default PremiumBookingDemo;
