import { useRef, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import { ChevronRight, ClipboardList, Wrench, CalendarCheck } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Tell Us About Your Shop",
    description: "Name, services, hours, location. Takes 60 seconds.",
  },
  {
    step: 2,
    icon: Wrench,
    title: "We Build Everything",
    description: "Custom website + booking system with SMS reminders and deposits. Done for you automatically.",
  },
  {
    step: 3,
    icon: CalendarCheck,
    title: "Bookings on Autopilot",
    description: "Customers find you, book online, pay deposits, and get reminders. You detail.",
  },
];

const ProcessCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const Icon = step.icon;

  return (
    <FadeIn delay={index * 150}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="process-card group relative rounded-3xl p-10 md:p-12 text-center overflow-hidden z-10 cursor-pointer"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(214, 20%, 90%)",
          boxShadow: "0 4px 24px hsla(215, 25%, 12%, 0.06)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Spotlight follow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(217, 91%, 60%, 0.05), transparent 40%)",
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at center, hsla(217, 91%, 60%, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Step number badge */}
        <span
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300 group-hover:scale-105"
          style={{
            background: "hsla(217, 91%, 60%, 0.1)",
            border: "1px solid hsla(217, 91%, 60%, 0.3)",
            color: "hsl(217, 91%, 70%)",
            boxShadow: "none",
          }}
        >
          <span className="relative z-10">{step.step}</span>
        </span>

        {/* Icon container with float + pulse */}
        <div className="flex justify-center mb-7 relative z-10">
          <div
            className="process-icon-container w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-all duration-400"
            style={{
              background:
                "linear-gradient(135deg, hsla(217, 91%, 60%, 0.15) 0%, hsla(217, 91%, 70%, 0.1) 100%)",
              border: "1px solid hsla(217, 91%, 60%, 0.2)",
            }}
          >
            <Icon className="w-8 h-8 transition-all duration-300" style={{ color: "hsl(217, 91%, 70%)" }} />
          </div>
        </div>

        <h3 className="text-[22px] font-semibold mb-3 relative z-10 transition-colors duration-300 text-foreground">
          {step.title}
        </h3>
        <p className="text-[15px] leading-relaxed relative z-10 transition-colors duration-300 text-muted-foreground">
          {step.description}
        </p>
      </div>
    </FadeIn>
  );
};

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(0, 0%, 100%) 0%, hsl(210, 40%, 98%) 100%)",
      }}
    >

      <div className="max-w-[1400px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
             <h2
              className="font-heading text-[32px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[1.2] mb-4 text-foreground"
            >
              As easy as 1, 2, 3
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Three steps. Zero headaches.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 relative">
          {/* Connecting lines (desktop) */}
          <div
            className="hidden md:block absolute top-[100px] left-[18%] w-[18%] h-[2px] z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsla(217, 91%, 60%, 0.3) 20%, hsla(217, 91%, 70%, 0.5) 50%, hsla(217, 91%, 60%, 0.3) 80%, transparent 100%)",
            }}
          />
          <div
            className="hidden md:block absolute top-[100px] right-[18%] w-[18%] h-[2px] z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsla(217, 91%, 60%, 0.3) 20%, hsla(217, 91%, 70%, 0.5) 50%, hsla(217, 91%, 60%, 0.3) 80%, transparent 100%)",
            }}
          />

          {steps.map((step, i) => (
            <ProcessCard key={step.step} step={step} index={i} />
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center">
            <button
              onClick={openFunnel}
              className="process-cta-btn group relative inline-flex items-center gap-2 font-semibold rounded-xl px-12 py-5 text-lg min-h-[48px] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                color: "hsl(0, 0%, 100%)",
                background: "linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 45%) 100%)",
                boxShadow:
                  "0 4px 16px hsla(217, 91%, 60%, 0.3), 0 8px 32px hsla(217, 91%, 60%, 0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free →
              </span>
              {/* Shine sweep */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.2) 50%, transparent 100%)",
                }}
              />
            </button>
            <p className="text-sm mt-4 text-muted-foreground">
              Free for 14 days · No credit card required
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorksSection;
