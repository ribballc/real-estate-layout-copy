import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import { ChevronRight } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Tell Us About Your Shop",
    description: "Name, services, hours, area. Takes 60 seconds—shorter than ordering coffee.",
  },
  {
    step: 2,
    title: "We Build Everything",
    description: "Custom website + booking system with SMS reminders and deposit collection. Done in 48 hours.",
  },
  {
    step: 3,
    title: "Bookings Roll In",
    description: "Customers find you, book online, pay deposits, and get reminders. You stop chasing—you start detailing.",
  },
];

const StepCard = ({ step, i }: { step: typeof steps[0]; i: number }) => {
  const directions = ["left", "up", "right"] as const;
  return (
    <FadeIn delay={i * 150} direction={directions[i]} rotateX={8}>
      <div className="group bg-background rounded-[20px] p-8 md:p-10 text-center border-2 border-border relative z-10 transition-all duration-500 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] hover:-translate-y-3 hover:border-accent"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 min-h-[48px] group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700"
          style={{
            background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
            color: 'hsl(160 50% 8%)',
            boxShadow: '0 8px 20px hsla(82, 65%, 55%, 0.3)',
          }}
        >
          {step.step}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
    </FadeIn>
  );
};

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[54px] font-bold tracking-[-0.02em] leading-[1.1] text-foreground text-center mb-3">
            Live in 48 Hours.{" "}
            <span className="font-serif italic text-[32px] md:text-[60px] text-accent">Not Kidding.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12 md:mb-16 leading-relaxed">
            Three steps between you and bookings on autopilot.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[72px] left-[20%] right-[20%] h-[2px] z-0" style={{
            background: 'linear-gradient(90deg, hsla(82, 65%, 55%, 0.3), hsla(82, 65%, 55%, 0.1))',
            backgroundSize: '12px 2px',
          }} />
          {steps.map((step, i) => (
            <StepCard key={step.step} step={step} i={i} />
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center mt-12">
            <button
              onClick={openFunnel}
              className="group inline-flex items-center gap-2 font-bold rounded-[14px] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 px-10 py-4 text-lg min-h-[48px]"
              style={{
                background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
                color: 'hsl(160 50% 8%)',
                boxShadow: '0 8px 24px hsla(82, 65%, 55%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)',
              }}
            >
              Start Your 48-Hour Setup
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <p className="text-sm text-muted-foreground mt-4">Free for 14 days · Takes 60 seconds to begin</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorksSection;
