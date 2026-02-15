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
        className="group relative rounded-3xl p-10 md:p-12 text-center overflow-hidden z-10 cursor-pointer"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Spotlight follow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(210, 100%, 45%, 0.04), transparent 40%)",
          }}
        />

        {/* Step number badge */}
        <span
          className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold"
          style={{
            background: "#0071e3",
            color: "#ffffff",
          }}
        >
          <span className="relative z-10">{step.step}</span>
        </span>

        {/* Icon container */}
        <div className="flex justify-center mb-7 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{
              background: "hsla(210, 100%, 45%, 0.08)",
            }}
          >
            <Icon className="w-7 h-7" style={{ color: "#0071e3" }} />
          </div>
        </div>

        <h3
          className="text-[19px] md:text-[21px] font-semibold mb-3 relative z-10"
          style={{ color: "#1d1d1f", letterSpacing: "-0.3px" }}
        >
          {step.title}
        </h3>
        <p
          className="text-[15px] md:text-[17px] leading-[1.5] relative z-10"
          style={{ color: "#86868b", letterSpacing: "-0.2px" }}
        >
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
      className="relative py-24 md:py-[100px] px-5 md:px-10 overflow-hidden"
      style={{ background: "#fbfbfd" }}
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-16 md:mb-20">
            <h2
              className="font-heading text-[32px] md:text-[40px] font-semibold leading-[1.15] mb-5"
              style={{ color: "#1d1d1f", letterSpacing: "-0.4px" }}
            >
              As easy as 1, 2, 3
            </h2>
            <p className="text-[19px] md:text-[21px]" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
              Three steps. Zero headaches.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {steps.map((step, i) => (
            <ProcessCard key={step.step} step={step} index={i} />
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center">
            <button
              onClick={openFunnel}
              className="group relative inline-flex items-center gap-2 font-medium rounded-full px-8 py-[17px] text-[17px] min-h-[48px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                color: "#ffffff",
                background: "#0071e3",
                letterSpacing: "-0.2px",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ChevronRight className="w-5 h-5" />
              </span>
            </button>
            <p className="text-[15px] mt-4" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
              Free for 14 days · No credit card required
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorksSection;
