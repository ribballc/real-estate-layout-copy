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
    description: "Custom website + booking system with SMS reminders and deposits. Done in 48 hours.",
  },
  {
    step: 3,
    icon: CalendarCheck,
    title: "Bookings on Autopilot",
    description: "Customers find you, book online, pay deposits, and get reminders. You detail.",
  },
];

const HowItWorksSection = () => {
  const { openFunnel } = useSurveyFunnel();

  return (
    <section className="py-16 md:py-24 px-5 md:px-8" style={{
      background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 40% 98%) 100%)',
    }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            Three Simple Steps
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12 md:mb-16 leading-relaxed">
            In under 5 minutes
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[56px] left-[20%] right-[20%] h-[2px] z-0" style={{
            background: 'linear-gradient(90deg, hsla(217, 91%, 60%, 0.3), hsla(217, 91%, 60%, 0.1))',
            backgroundSize: '12px 2px',
          }} />
          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 150}>
              <div className="group bg-card rounded-2xl p-8 md:p-10 text-center border border-border relative z-10 transition-all duration-300 hover:shadow-[0_12px_32px_hsla(217,91%,60%,0.15)] hover:-translate-y-2 hover:border-accent">
                <span className="absolute top-4 left-5 text-xs font-bold text-muted-foreground/50">{step.step}</span>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'hsla(217, 91%, 60%, 0.1)',
                  }}
                >
                  <step.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={500}>
          <div className="text-center mt-12">
            <button
              onClick={openFunnel}
              className="group inline-flex items-center gap-2 font-semibold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-10 py-4 text-base min-h-[48px] text-primary-foreground"
              style={{
                background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                boxShadow: '0 8px 24px hsla(217, 91%, 60%, 0.35)',
              }}
            >
              Start Your 48-Hour Setup
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-sm text-muted-foreground mt-4">Free for 14 days · No credit card required</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowItWorksSection;
