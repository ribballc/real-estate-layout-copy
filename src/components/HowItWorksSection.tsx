import { useRef, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

/* ── Large Card Animations ── */

const FormAnimation = () => (
  <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
    {/* Floating form elements */}
    <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="relative z-10">
      {/* Main clipboard */}
      <rect x="50" y="20" width="120" height="140" rx="12" fill="hsl(0,0%,100%)" stroke="hsl(214,20%,88%)" strokeWidth="1.5" />
      <rect x="75" y="10" width="70" height="20" rx="8" fill="hsl(217,91%,96%)" stroke="hsl(217,91%,80%)" strokeWidth="1.5" />

      {/* Form lines animating in */}
      <rect x="68" y="50" width="84" height="10" rx="5" fill="hsl(214,20%,94%)">
        <animate attributeName="width" values="0;84" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x="68" y="70" width="65" height="10" rx="5" fill="hsl(214,20%,92%)">
        <animate attributeName="width" values="0;65" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      </rect>
      <rect x="68" y="90" width="74" height="10" rx="5" fill="hsl(214,20%,94%)">
        <animate attributeName="width" values="0;74" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
      </rect>

      {/* Check circle */}
      <circle cx="110" cy="130" r="14" fill="hsl(217,91%,60%)">
        <animate attributeName="r" values="0;14" dur="0.5s" begin="1.2s" fill="freeze" repeatCount="indefinite" />
      </circle>
      <path d="M103 130 L108 135 L118 125" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0">
        <animate attributeName="opacity" values="0;0;1" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      </path>

      {/* Floating icons */}
      <circle cx="28" cy="60" r="16" fill="hsl(217,91%,96%)" stroke="hsl(217,91%,85%)" strokeWidth="1.5">
        <animate attributeName="cy" values="60;52;60" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M23 60 L28 55 L33 60" stroke="hsl(217,91%,60%)" strokeWidth="2" strokeLinecap="round" fill="none" />

      <circle cx="192" cy="80" r="14" fill="hsl(160,84%,95%)" stroke="hsl(160,84%,70%)" strokeWidth="1.5">
        <animate attributeName="cy" values="80;74;80" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <path d="M187 80 L190 83 L197 77" stroke="hsl(160,84%,39%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <circle cx="38" cy="120" r="12" fill="hsl(45,93%,95%)" stroke="hsl(45,93%,70%)" strokeWidth="1.5">
        <animate attributeName="cy" values="120;115;120" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <text x="34" y="124" fontSize="12" fill="hsl(45,93%,47%)">✦</text>
    </svg>
  </div>
);

const BuildAnimation = () => (
  <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
    <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="relative z-10">
      {/* Browser frame */}
      <rect x="20" y="15" width="180" height="150" rx="12" fill="hsl(0,0%,100%)" stroke="hsl(214,20%,88%)" strokeWidth="1.5" />
      <rect x="20" y="15" width="180" height="28" rx="12" fill="hsl(214,20%,96%)" stroke="hsl(214,20%,88%)" strokeWidth="1.5" />
      <circle cx="36" cy="29" r="4" fill="hsl(0,84%,70%)" />
      <circle cx="48" cy="29" r="4" fill="hsl(45,93%,65%)" />
      <circle cx="60" cy="29" r="4" fill="hsl(142,71%,55%)" />
      <rect x="80" y="25" width="80" height="8" rx="4" fill="hsl(214,20%,90%)" />

      {/* Content blocks building up */}
      <rect x="32" y="52" width="70" height="18" rx="4" fill="hsl(217,91%,60%)" opacity="0.9">
        <animate attributeName="width" values="0;70" dur="1s" fill="freeze" repeatCount="indefinite" />
      </rect>
      <rect x="32" y="76" width="156" height="6" rx="3" fill="hsl(214,20%,92%)">
        <animate attributeName="width" values="0;156" dur="1s" begin="0.3s" fill="freeze" repeatCount="indefinite" />
      </rect>
      <rect x="32" y="88" width="120" height="6" rx="3" fill="hsl(214,20%,94%)">
        <animate attributeName="width" values="0;120" dur="1s" begin="0.5s" fill="freeze" repeatCount="indefinite" />
      </rect>

      {/* Image placeholder */}
      <rect x="32" y="102" width="72" height="48" rx="6" fill="hsl(217,91%,96%)" stroke="hsl(217,91%,85%)" strokeWidth="1" strokeDasharray="4 2">
        <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.7s" fill="freeze" repeatCount="indefinite" />
      </rect>
      <rect x="112" y="102" width="76" height="22" rx="6" fill="hsl(217,91%,60%)" opacity="0.15">
        <animate attributeName="opacity" values="0;0.15" dur="0.5s" begin="0.9s" fill="freeze" repeatCount="indefinite" />
      </rect>
      <rect x="112" y="130" width="76" height="20" rx="6" fill="hsl(160,84%,39%)" opacity="0.12">
        <animate attributeName="opacity" values="0;0.12" dur="0.5s" begin="1.1s" fill="freeze" repeatCount="indefinite" />
      </rect>

      {/* Sparkle */}
      <circle cx="200" cy="50" r="6" fill="hsl(217,91%,96%)" stroke="hsl(217,91%,80%)" strokeWidth="1">
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

const CalendarAnimation = () => (
  <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden">
    <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="relative z-10">
      {/* Calendar card */}
      <rect x="30" y="15" width="160" height="135" rx="12" fill="hsl(0,0%,100%)" stroke="hsl(214,20%,88%)" strokeWidth="1.5" />
      <rect x="30" y="15" width="160" height="32" rx="12" fill="hsl(217,91%,60%)" />
      <text x="110" y="36" textAnchor="middle" fontSize="13" fontWeight="600" fill="white">February 2026</text>

      {/* Calendar pegs */}
      <line x1="70" y1="8" x2="70" y2="22" stroke="hsl(214,20%,80%)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="150" y1="8" x2="150" y2="22" stroke="hsl(214,20%,80%)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Day headers */}
      {["S","M","T","W","T","F","S"].map((d, i) => (
        <text key={i} x={48 + i * 20} y="62" textAnchor="middle" fontSize="9" fontWeight="600" fill="hsl(215,16%,55%)">{d}</text>
      ))}

      {/* Date grid - animated highlights */}
      {[0,1,2,3].map(r => [0,1,2,3,4,5,6].map(c => {
        const day = r * 7 + c + 1;
        if (day > 28) return null;
        const isHighlighted = [5, 12, 18, 23].includes(day);
        return (
          <g key={`${r}-${c}`}>
            {isHighlighted && (
              <rect x={39 + c * 20} y={68 + r * 18} width="18" height="16" rx="6" fill="hsl(217,91%,60%)" opacity="0.12">
                <animate attributeName="opacity" values="0;0.12" dur="0.4s" begin={`${day * 0.05}s`} fill="freeze" repeatCount="indefinite" />
              </rect>
            )}
            <text
              x={48 + c * 20} y={80 + r * 18}
              textAnchor="middle" fontSize="10"
              fontWeight={isHighlighted ? "700" : "400"}
              fill={isHighlighted ? "hsl(217,91%,55%)" : "hsl(215,16%,45%)"}
            >
              {day}
            </text>
          </g>
        );
      }))}

      {/* Notification badge */}
      <circle cx="186" cy="22" r="10" fill="hsl(160,84%,39%)">
        <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="186" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">3</text>

      {/* Floating notification */}
      <g>
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
        <rect x="135" y="155" width="80" height="24" rx="8" fill="hsl(217,91%,60%)" />
        <text x="175" y="170" textAnchor="middle" fontSize="9" fontWeight="500" fill="white">New Booking!</text>
      </g>
    </svg>
  </div>
);

const stepAnimations = [FormAnimation, BuildAnimation, CalendarAnimation];

const steps = [
  {
    step: 1,
    title: "Tell Us About Your Shop",
    description: "Name, services, hours, location. Takes 60 seconds.",
  },
  {
    step: 2,
    title: "We Build Everything",
    description: "Custom website + booking system with SMS reminders and deposits. Done for you automatically.",
  },
  {
    step: 3,
    title: "Bookings on Autopilot",
    description: "Customers find you, book online, pay deposits, and get reminders. You detail.",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Animation = stepAnimations[index];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      style={{
        background: "hsl(0, 0%, 100%)",
        border: "1px solid hsl(214, 20%, 90%)",
        boxShadow: "0 1px 3px hsla(0, 0%, 0%, 0.04)",
      }}
    >
      {/* Spotlight follow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(217, 71%, 53%, 0.04), transparent 40%)",
        }}
      />

      {/* Text content */}
      <div className="relative z-10 p-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(215, 16%, 65%)" }}>
          Step {step.step}
        </p>
        <h3
          className="text-lg font-bold mb-2 transition-colors duration-300"
          style={{ color: "hsl(222, 47%, 11%)" }}
        >
          {step.title}
        </h3>
        <p
          className="text-[13px] leading-[1.6] transition-colors duration-300"
          style={{ color: "hsl(215, 16%, 47%)" }}
        >
          {step.description}
        </p>
      </div>

      {/* Large animation area */}
      <div
        className="relative z-10"
        style={{ background: "hsl(210, 40%, 98%)", borderTop: "1px solid hsl(214, 20%, 93%)" }}
      >
        <Animation />
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "hsl(210, 40%, 98%)" }}
    >
      <div className="max-w-[1100px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-14 md:mb-18">
            {/* Blue pill tag */}
            <div className="flex justify-center mb-5">
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                style={{
                  background: "hsl(217, 91%, 96%)",
                  color: "hsl(217, 91%, 50%)",
                  border: "1px solid hsl(217, 91%, 88%)",
                }}
              >
                How It Works
              </span>
            </div>
            <h2
              className="font-heading text-[32px] md:text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.15] mb-4"
              style={{ color: "hsl(222, 47%, 11%)" }}
            >
              <span className="relative inline-block">
                Get Started In{" "}
                <br className="hidden md:block" />
                3 Simple Steps
                <svg className="absolute -bottom-2 left-0 w-full h-3 overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ opacity: 0, animation: 'blueUnderlineIn 0.8s ease-out 0.6s forwards' }}>
                  <path d="M0 9 Q100 2, 200 7" fill="none" stroke="url(#blueGlow)" strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'underlineDraw 0.8s ease-out 0.6s forwards' }} />
                  <path d="M0 9 Q100 2, 200 7" fill="none" stroke="#3273DC" strokeWidth="3" strokeLinecap="round" style={{ filter: 'blur(6px)', opacity: 0.5, strokeDasharray: 220, strokeDashoffset: 220, animation: 'underlineDraw 0.8s ease-out 0.6s forwards' }} />
                  <defs>
                    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3273DC" />
                      <stop offset="50%" stopColor="#5A9BF6" />
                      <stop offset="100%" stopColor="#3273DC" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
            <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: "hsl(215, 16%, 47%)" }}>
              yeah... its pretty darn simple.
            </p>
          </div>
        </FadeIn>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 md:mb-18">
          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 150}>
              <StepCard step={step} index={i} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center">
            <button
              onClick={openFunnel}
              className="group relative inline-flex items-center gap-2 font-semibold rounded-xl px-12 py-5 text-lg min-h-[48px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                color: "hsl(0, 0%, 100%)",
                background: "linear-gradient(135deg, hsl(217, 71%, 53%) 0%, hsl(217, 71%, 43%) 100%)",
                boxShadow: "0 4px 16px hsla(217, 71%, 53%, 0.3)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free →
              </span>
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)",
                }}
              />
            </button>
            <p className="text-sm mt-4" style={{ color: "hsl(215, 16%, 47%)" }}>
              Free for 14 days · No credit card required
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorksSection;
