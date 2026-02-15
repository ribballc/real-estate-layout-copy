import { useRef, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const animatedIconStyles = `
@keyframes drawLine {
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
}
@keyframes fillCheck {
  0% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes buildUp {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes calFill {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes stepIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`;

const FormIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ animation: "stepIconFloat 3s ease-in-out infinite" }}>
    <rect x="16" y="12" width="40" height="52" rx="6" stroke="hsl(213, 94%, 68%)" strokeWidth="2.5" fill="hsla(217, 91%, 60%, 0.1)" />
    <rect x="26" y="6" width="20" height="12" rx="4" stroke="hsl(217, 91%, 60%)" strokeWidth="2.5" fill="hsla(217, 91%, 60%, 0.15)" />
    <line x1="26" y1="30" x2="46" y2="30" stroke="hsl(213, 94%, 68%)" strokeWidth="2" strokeLinecap="round"
      strokeDasharray="20" strokeDashoffset="0" style={{ animation: "drawLine 1.5s ease-out infinite", animationDelay: "0s" }} />
    <line x1="26" y1="38" x2="42" y2="38" stroke="hsl(213, 94%, 68%)" strokeWidth="2" strokeLinecap="round"
      strokeDasharray="16" strokeDashoffset="0" style={{ animation: "drawLine 1.5s ease-out infinite", animationDelay: "0.3s" }} />
    <line x1="26" y1="46" x2="38" y2="46" stroke="hsl(213, 94%, 68%)" strokeWidth="2" strokeLinecap="round"
      strokeDasharray="12" strokeDashoffset="0" style={{ animation: "drawLine 1.5s ease-out infinite", animationDelay: "0.6s" }} />
    <circle cx="48" cy="52" r="8" fill="hsl(217, 91%, 60%)" style={{ animation: "fillCheck 2s ease-out infinite", transformOrigin: "48px 52px" }} />
    <path d="M44 52 L47 55 L53 49" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BuildIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ animation: "stepIconFloat 3s ease-in-out infinite", animationDelay: "0.4s" }}>
    <rect x="10" y="14" width="52" height="44" rx="6" stroke="hsl(213, 94%, 68%)" strokeWidth="2.5" fill="hsla(217, 91%, 60%, 0.1)" />
    <rect x="10" y="14" width="52" height="14" rx="6" stroke="hsl(213, 94%, 68%)" strokeWidth="2.5" fill="hsla(217, 91%, 60%, 0.15)" />
    <circle cx="20" cy="21" r="2" fill="hsl(0, 84%, 60%)" />
    <circle cx="27" cy="21" r="2" fill="hsl(45, 93%, 60%)" />
    <circle cx="34" cy="21" r="2" fill="hsl(142, 71%, 45%)" />
    <rect x="16" y="34" width="18" height="8" rx="2" fill="hsl(217, 91%, 60%)" opacity="0.8"
      style={{ animation: "buildUp 2s ease-out infinite", transformOrigin: "bottom", animationDelay: "0s" }} />
    <rect x="16" y="45" width="40" height="4" rx="1.5" fill="hsl(213, 94%, 68%)" opacity="0.5"
      style={{ animation: "buildUp 2s ease-out infinite", transformOrigin: "bottom", animationDelay: "0.3s" }} />
    <rect x="38" y="34" width="18" height="8" rx="2" fill="hsl(213, 94%, 68%)" opacity="0.6"
      style={{ animation: "buildUp 2s ease-out infinite", transformOrigin: "bottom", animationDelay: "0.6s" }} />
    <rect x="18" y="52" width="2" height="4" fill="hsl(217, 91%, 60%)" style={{ animation: "cursorBlink 1s step-end infinite" }} />
  </svg>
);

const CalendarIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ animation: "stepIconFloat 3s ease-in-out infinite", animationDelay: "0.8s" }}>
    <rect x="12" y="18" width="48" height="44" rx="6" stroke="hsl(213, 94%, 68%)" strokeWidth="2.5" fill="hsla(217, 91%, 60%, 0.1)" />
    <rect x="12" y="18" width="48" height="14" rx="6" fill="hsl(217, 91%, 60%)" />
    <line x1="26" y1="12" x2="26" y2="24" stroke="hsl(213, 94%, 68%)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="46" y1="12" x2="46" y2="24" stroke="hsl(213, 94%, 68%)" strokeWidth="2.5" strokeLinecap="round" />
    {[0,1,2,3].map((row) =>
      [0,1,2,3].map((col) => (
        <rect key={`${row}-${col}`} x={18 + col * 10} y={36 + row * 6} width="7" height="4" rx="1"
          fill="hsl(217, 91%, 60%)"
          opacity={0.3 + (row * 4 + col) * 0.04}
          style={{
            animation: "fillCheck 3s ease-out infinite",
            animationDelay: `${(row * 4 + col) * 0.15}s`,
            transformOrigin: `${21.5 + col * 10}px ${38 + row * 6}px`,
          }} />
      ))
    )}
  </svg>
);

const stepIcons = [FormIcon, BuildIcon, CalendarIcon];

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

const ProcessCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const IconComponent = stepIcons[index];

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
    <FadeIn delay={index * 150}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group relative rounded-3xl p-8 md:p-10 overflow-hidden z-10 cursor-pointer"
        style={{
          background: "hsla(0, 0%, 100%, 0.06)",
          border: "1px solid hsla(0, 0%, 100%, 0.12)",
          backdropFilter: "blur(12px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(217, 71%, 53%, 0.12), transparent 40%)",
          }}
        />

        {/* Step number badge */}
        <span
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-105"
          style={{
            background: "hsl(217, 71%, 53%)",
            color: "hsl(0, 0%, 100%)",
          }}
        >
          <span className="relative z-10">{step.step}</span>
        </span>

        {/* Horizontal layout: icon left, text right */}
        <div className="flex items-start gap-6 relative z-10">
          <div className="flex-shrink-0">
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{
                background: "hsla(217, 71%, 53%, 0.15)",
                border: "1px solid hsla(217, 71%, 53%, 0.25)",
              }}
            >
              <IconComponent />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-[22px] font-semibold mb-3 transition-colors duration-300"
              style={{ color: "hsl(0, 0%, 100%)" }}
            >
              {step.title}
            </h3>
            <p
              className="text-[15px] leading-[1.7] transition-colors duration-300"
              style={{ color: "hsla(0, 0%, 100%, 0.55)" }}
            >
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <>
      <style>{animatedIconStyles}</style>
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(215, 50%, 10%) 0%, hsl(217, 33%, 14%) 100%)" }}
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4"
              style={{ color: "hsl(0, 0%, 100%)" }}
            >
              As easy as 1, 2, 3
            </h2>
            <p className="text-lg md:text-xl" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
              Three steps. Zero headaches.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20 max-w-[1200px] mx-auto">
          {steps.map((step, i) => (
            <ProcessCard key={step.step} step={step} index={i} />
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
                  background:
                    "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)",
                }}
              />
            </button>
            <p className="text-sm mt-4" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>
              Free for 14 days · No credit card required
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
    </>
  );
};

export default HowItWorksSection;
