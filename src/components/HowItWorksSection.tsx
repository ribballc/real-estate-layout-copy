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

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section className="bg-muted py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground text-center mb-3">
            Live in 48 Hours. Not Kidding.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10 md:mb-14">
            Three steps between you and a professional online presence that books jobs while you sleep.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-accent/20 z-0" />

          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 150}>
              <div className="group bg-background rounded-2xl p-6 md:p-8 text-center shadow-sm border border-border relative z-10 hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mx-auto mb-5 min-h-[48px] group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center mt-10">
            <button
              onClick={openFunnel}
              className="group inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-xl hover:brightness-105 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 px-8 py-3.5 text-lg min-h-[48px]"
            >
              Start Your 48-Hour Setup
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-sm text-muted-foreground mt-3">Free for 14 days • Takes 60 seconds to begin</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorksSection;
