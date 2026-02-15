import { useState, useEffect, useRef, useCallback } from "react";

const PHASE_DURATIONS = [1000, 2000, 2000, 1000, 1000, 1000, 1000]; // 8s total
const TOTAL_DURATION = PHASE_DURATIONS.reduce((a, b) => a + b, 0);

const BookingSimulator = () => {
  const [phase, setPhase] = useState(0);
  const [moneyCount, setMoneyCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isVisible || reducedMotion) return;

    let elapsed = 0;
    let currentPhase = 0;

    const tick = () => {
      elapsed += 100;
      let sum = 0;
      for (let i = 0; i < PHASE_DURATIONS.length; i++) {
        sum += PHASE_DURATIONS[i];
        if (elapsed <= sum) { currentPhase = i; break; }
      }
      setPhase(currentPhase);

      // Money counter in phase 4 (index 4)
      const phase4Start = PHASE_DURATIONS.slice(0, 4).reduce((a, b) => a + b, 0);
      if (elapsed >= phase4Start && elapsed <= phase4Start + PHASE_DURATIONS[4]) {
        const progress = Math.min((elapsed - phase4Start) / 800, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setMoneyCount(Math.round(eased * 250));
      }

      if (elapsed >= TOTAL_DURATION) {
        elapsed = 0;
        setMoneyCount(0);
        setPhase(0);
      }

      timerRef.current = setTimeout(tick, 100);
    };

    timerRef.current = setTimeout(tick, 100);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isVisible, reducedMotion]);

  // Pause when tab hidden
  useEffect(() => {
    const handler = () => {
      if (document.hidden && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="flex items-center justify-center" aria-label="Demonstration showing customer booking on left and notification arriving on right">
        <StaticPhones />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ height: 600 }}
      aria-label="Animated demonstration showing customer booking on left and notification arriving on right"
    >
      {/* Desktop: two phones */}
      <div className="hidden md:flex items-center justify-center relative" style={{ gap: 0 }}>
        <LeftPhone phase={phase} isVisible={isVisible} />
        <RightPhone phase={phase} isVisible={isVisible} />
        {/* Money counter */}
        <MoneyCounter phase={phase} count={moneyCount} />
        {/* Money animation */}
        {phase === 4 && <MoneyArc />}
      </div>

      {/* Mobile: single phone */}
      <div className="flex md:hidden items-center justify-center relative">
        <MobilePhone phase={phase} isVisible={isVisible} />
        {phase >= 3 && phase <= 5 && (
          <div className="absolute -bottom-4 px-4 py-2 rounded-xl font-mono font-bold text-[28px]"
            style={{
              color: 'hsl(160, 84%, 39%)',
              background: 'hsla(160, 84%, 39%, 0.1)',
              border: '1px solid hsla(160, 84%, 39%, 0.3)',
              backdropFilter: 'blur(10px)',
            }}>
            +${moneyCount}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Phone Frame ─── */
const PhoneFrame = ({ children, dark, style, className = "" }: {
  children: React.ReactNode; dark?: boolean; style?: React.CSSProperties; className?: string;
}) => (
  <div
    className={`relative overflow-hidden flex-shrink-0 ${className}`}
    style={{
      width: 260, height: 540,
      borderRadius: 36,
      border: '7px solid hsl(217, 33%, 17%)',
      background: dark ? 'hsl(222, 47%, 11%)' : 'hsl(0, 0%, 100%)',
      boxShadow: `0 20px 60px hsla(0, 0%, 0%, 0.4)${dark ? ', 0 0 40px hsla(217, 91%, 60%, 0.15)' : ''}`,
      ...style,
    }}
  >
    {/* Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[26px] rounded-b-2xl z-10"
      style={{ background: 'hsl(217, 33%, 17%)' }} />
    <div className="pt-8 px-3 pb-3 h-full flex flex-col overflow-hidden">
      {children}
    </div>
  </div>
);

/* ─── Service Card ─── */
const ServiceCard = ({ name, price, selected, phase }: {
  name: string; price: number; selected?: boolean; phase: number;
}) => (
  <div className="rounded-xl px-3 py-3 mb-2 flex items-center justify-between transition-all duration-500"
    style={{
      background: selected && phase >= 1 ? 'hsla(217, 91%, 60%, 0.1)' : 'hsl(210, 40%, 96%)',
      border: selected && phase >= 1 ? '1.5px solid hsla(217, 91%, 60%, 0.4)' : '1.5px solid transparent',
    }}>
    <div>
      <div className="text-[13px] font-semibold" style={{ color: 'hsl(215, 25%, 12%)' }}>{name}</div>
      <div className="text-[11px] font-mono" style={{ color: 'hsl(215, 16%, 47%)' }}>${price}</div>
    </div>
    {selected && phase >= 1 && (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-all duration-300">
        <circle cx="9" cy="9" r="9" fill="hsl(217, 91%, 60%)" />
        <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 20, strokeDashoffset: phase >= 1 ? 0 : 20, transition: 'stroke-dashoffset 0.4s ease' }} />
      </svg>
    )}
  </div>
);

/* ─── Left Phone (Customer View) ─── */
const LeftPhone = ({ phase, isVisible }: { phase: number; isVisible: boolean }) => (
  <div className="animate-[heroFloat_4s_ease-in-out_infinite]" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
  <PhoneFrame
    style={{
      transform: `perspective(1200px) rotateY(-8deg) translateX(20px)`,
      zIndex: 1,
    }}
  >
    {/* Screen content transitions */}
    <div className="relative flex-1 overflow-hidden">
      {/* Phase 0-1: Service Selection */}
      <div className="absolute inset-0 transition-all duration-500"
        style={{
          opacity: phase <= 1 ? 1 : 0,
          transform: phase <= 1 ? 'translateX(0)' : 'translateX(-100%)',
        }}>
        <div className="text-[15px] font-bold mb-3" style={{ color: 'hsl(215, 25%, 12%)' }}>Select Service</div>
        <ServiceCard name="Interior Detail" price={180} phase={phase} />
        <ServiceCard name="Exterior Detail" price={250} selected phase={phase} />
        <ServiceCard name="Full Detail" price={400} phase={phase} />
        <div className="mt-auto pt-3">
          <div className="rounded-xl py-2.5 text-center text-[13px] font-semibold text-primary-foreground transition-all duration-300"
            style={{
              background: phase >= 1 ? 'hsl(217, 91%, 60%)' : 'hsl(215, 16%, 47%)',
              transform: phase === 1 ? 'scale(0.98)' : 'scale(1)',
            }}>
            Next →
          </div>
        </div>
      </div>

      {/* Phase 2: Calendar */}
      <div className="absolute inset-0 transition-all duration-500"
        style={{
          opacity: phase === 2 ? 1 : 0,
          transform: phase === 2 ? 'translateX(0)' : phase < 2 ? 'translateX(100%)' : 'translateX(-100%)',
        }}>
        <div className="text-[15px] font-bold mb-3" style={{ color: 'hsl(215, 25%, 12%)' }}>Pick a Time</div>
        <div className="text-[12px] font-medium mb-2" style={{ color: 'hsl(215, 16%, 47%)' }}>Friday, Feb 14</div>
        <div className="grid grid-cols-2 gap-2">
          {['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM'].map((t) => (
            <div key={t} className="rounded-lg py-2 text-center text-[12px] font-medium transition-all duration-300"
              style={{
                background: t === '2:00 PM' ? 'hsla(217, 91%, 60%, 0.1)' : 'hsl(210, 40%, 96%)',
                border: t === '2:00 PM' ? '1.5px solid hsl(217, 91%, 60%)' : '1.5px solid transparent',
                color: 'hsl(215, 25%, 12%)',
              }}>
              {t}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl py-2.5 text-center text-[13px] font-semibold text-primary-foreground"
          style={{ background: 'hsl(217, 91%, 60%)' }}>
          Book Now
        </div>
      </div>

      {/* Phase 3+: Confirmation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'scale(1)' : 'scale(0.9)',
        }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mb-3">
          <circle cx="28" cy="28" r="28" fill="hsl(142, 76%, 36%)" opacity="0.15" />
          <circle cx="28" cy="28" r="20" fill="hsl(142, 76%, 36%)" />
          <path d="M20 28l6 6 10-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 30, strokeDashoffset: phase >= 3 ? 0 : 30, transition: 'stroke-dashoffset 0.5s ease 0.2s' }} />
        </svg>
        <div className="text-[16px] font-bold" style={{ color: 'hsl(215, 25%, 12%)' }}>Booking Confirmed!</div>
        <div className="text-[12px] mt-1" style={{ color: 'hsl(215, 16%, 47%)' }}>Exterior Detail · $250</div>
        {/* Confetti */}
        {phase === 3 && <Confetti />}
      </div>
    </div>
  </PhoneFrame>
  </div>
);

/* ─── Right Phone (Owner View) ─── */
const RightPhone = ({ phase, isVisible }: { phase: number; isVisible: boolean }) => (
  <div className="animate-[heroFloat_4.5s_ease-in-out_infinite]" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
  <PhoneFrame
    dark
    style={{
      transform: `perspective(1200px) rotateY(8deg) translateX(-20px)`,
      zIndex: 2,
    }}
  >
    <div className="relative flex-1 overflow-hidden">
      {/* Header */}
      <div className="text-[15px] font-bold text-primary-foreground mb-3">Today's Schedule</div>

      {/* Empty state (phase < 3) */}
      <div className="transition-all duration-500"
        style={{ opacity: phase < 3 ? 1 : 0, position: phase >= 5 ? 'absolute' : 'relative' }}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
            style={{ background: 'hsla(217, 91%, 60%, 0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="14" rx="2" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" />
              <line x1="2" y1="8" x2="18" y2="8" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" />
              <line x1="6" y1="2" x2="6" y2="6" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="2" x2="14" y2="6" stroke="hsl(217, 91%, 60%)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-[13px]" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>No bookings yet</div>
        </div>
      </div>

      {/* Notification (phase 3-4) */}
      <div className="absolute top-0 left-0 right-0 rounded-xl px-3 py-2.5 transition-all duration-500 z-20"
        style={{
          background: 'hsl(217, 91%, 60%)',
          transform: phase >= 3 && phase <= 4 ? 'translateY(0)' : 'translateY(-80px)',
          opacity: phase >= 3 && phase <= 4 ? 1 : 0,
        }}>
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🔔</span>
          <div>
            <div className="text-[12px] font-bold text-primary-foreground">New Booking!</div>
            <div className="text-[11px]" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>Jason Martinez</div>
          </div>
        </div>
      </div>

      {/* Calendar with booking (phase 5+) */}
      <div className="transition-all duration-500"
        style={{ opacity: phase >= 5 ? 1 : 0, transform: phase >= 5 ? 'translateY(0)' : 'translateY(20px)' }}>
        {/* Time slots */}
        {[
          { time: '10:00 AM', name: 'Mike R.', dim: true },
          { time: '11:30 AM', name: 'Sarah K.', dim: true },
          { time: '2:00 PM', name: 'Jason Martinez', highlight: true },
          { time: '3:30 PM', name: 'David L.', dim: true },
        ].map((slot) => (
          <div key={slot.time} className="rounded-xl px-3 py-2.5 mb-2 transition-all duration-500"
            style={{
              background: slot.highlight ? 'hsla(217, 91%, 60%, 0.12)' : 'hsla(0, 0%, 100%, 0.05)',
              border: slot.highlight ? '1px solid hsla(217, 91%, 60%, 0.3)' : '1px solid transparent',
              opacity: slot.dim ? 0.5 : 1,
              animation: slot.highlight ? 'subtlePulse 2s ease-in-out 1' : undefined,
            }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>{slot.time}</div>
                <div className="text-[13px] font-semibold text-primary-foreground">{slot.name}</div>
                {slot.highlight && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>Exterior Detail</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: 'hsla(142, 76%, 36%, 0.15)', color: 'hsl(142, 76%, 36%)' }}>
                      $250 Paid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </PhoneFrame>
  </div>
);

/* ─── Mobile Single Phone ─── */
const MobilePhone = ({ phase, isVisible }: { phase: number; isVisible: boolean }) => (
  <PhoneFrame
    dark
    className="md:hidden"
    style={{
      width: 240, height: 500,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.6s ease',
    }}
  >
    <div className="relative flex-1 overflow-hidden">
      <div className="text-[14px] font-bold text-primary-foreground mb-3">Today's Schedule</div>

      {/* Notification */}
      <div className="absolute top-0 left-0 right-0 rounded-xl px-3 py-2.5 transition-all duration-500 z-20"
        style={{
          background: 'hsl(217, 91%, 60%)',
          transform: phase >= 3 && phase <= 4 ? 'translateY(0)' : 'translateY(-80px)',
          opacity: phase >= 3 && phase <= 4 ? 1 : 0,
        }}>
        <div className="flex items-center gap-2">
          <span className="text-[14px]">🔔</span>
          <div>
            <div className="text-[12px] font-bold text-primary-foreground">New Booking!</div>
            <div className="text-[11px]" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>Jason Martinez · $250</div>
          </div>
        </div>
      </div>

      {/* Calendar slots */}
      <div className="transition-all duration-500"
        style={{ opacity: phase >= 5 ? 1 : 0.3, transform: phase >= 5 ? 'translateY(0)' : 'translateY(10px)' }}>
        {[
          { time: '10:00 AM', name: 'Mike R.', dim: true },
          { time: '2:00 PM', name: 'Jason Martinez', highlight: phase >= 5 },
          { time: '3:30 PM', name: 'David L.', dim: true },
        ].map((slot) => (
          <div key={slot.time} className="rounded-xl px-3 py-2.5 mb-2"
            style={{
              background: slot.highlight ? 'hsla(217, 91%, 60%, 0.12)' : 'hsla(0, 0%, 100%, 0.05)',
              border: slot.highlight ? '1px solid hsla(217, 91%, 60%, 0.3)' : '1px solid transparent',
              opacity: slot.dim ? 0.4 : 1,
            }}>
            <div className="text-[11px] font-mono" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>{slot.time}</div>
            <div className="text-[12px] font-semibold text-primary-foreground">{slot.name}</div>
            {slot.highlight && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium mt-1 inline-block"
                style={{ background: 'hsla(142, 76%, 36%, 0.15)', color: 'hsl(142, 76%, 36%)' }}>
                $250 Paid
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </PhoneFrame>
);

/* ─── Static Phones (reduced motion) ─── */
const StaticPhones = () => (
  <div className="flex items-center justify-center gap-4 py-8">
    <PhoneFrame dark style={{ width: 220, height: 440 }}>
      <div className="text-[14px] font-bold text-primary-foreground mb-2">Today's Schedule</div>
      <div className="rounded-xl px-3 py-2.5 mb-2"
        style={{ background: 'hsla(217, 91%, 60%, 0.12)', border: '1px solid hsla(217, 91%, 60%, 0.3)' }}>
        <div className="text-[11px] font-mono" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>2:00 PM</div>
        <div className="text-[12px] font-semibold text-primary-foreground">Jason Martinez</div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium mt-1 inline-block"
          style={{ background: 'hsla(142, 76%, 36%, 0.15)', color: 'hsl(142, 76%, 36%)' }}>
          $250 Paid
        </span>
      </div>
    </PhoneFrame>
  </div>
);

/* ─── Money Arc Animation ─── */
const MoneyArc = () => (
  <div className="absolute z-30 pointer-events-none" style={{
    animation: 'moneyArc 1s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards',
  }}>
    <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[14px]"
      style={{ background: 'hsl(217, 91%, 60%)', color: 'white', boxShadow: '0 0 20px hsla(217, 91%, 60%, 0.5)' }}>
      $
    </div>
  </div>
);

/* ─── Money Counter ─── */
const MoneyCounter = ({ phase, count }: { phase: number; count: number }) => (
  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 transition-all duration-500"
    style={{
      opacity: phase >= 4 && phase <= 5 ? 1 : 0,
      transform: `translateX(-50%) ${phase >= 4 ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)'}`,
    }}>
    <div className="px-5 py-3 rounded-xl font-mono font-bold text-[32px]"
      style={{
        color: 'hsl(160, 84%, 39%)',
        background: 'hsla(160, 84%, 39%, 0.1)',
        border: '1px solid hsla(160, 84%, 39%, 0.3)',
        backdropFilter: 'blur(10px)',
      }}>
      +${count}
    </div>
  </div>
);

/* ─── Confetti ─── */
const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="absolute w-2 h-2 rounded-full"
        style={{
          left: '50%', top: '40%',
          background: [
            'hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(45, 93%, 58%)',
            'hsl(280, 67%, 60%)', 'hsl(0, 84%, 60%)', 'hsl(180, 70%, 50%)',
          ][i],
          animation: `confetti${i} 0.8s ease-out forwards`,
        }} />
    ))}
  </div>
);

export default BookingSimulator;
