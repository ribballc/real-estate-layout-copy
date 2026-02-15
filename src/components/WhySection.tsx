import { Target, Sparkles, Zap, CreditCard } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "24/7 Smart Booking Calendar",
    description: "Customers book while you're detailing. Capture the <strong class='text-accent font-bold'>$500-1,000/month</strong> you're losing to missed calls.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection That Works",
    description: "Automated reminders + <strong class='text-accent font-bold'>$100</strong> deposits = <strong class='text-accent font-bold'>40%</strong> fewer no-shows.",
  },
  {
    icon: Zap,
    title: "Professional Website in 48 Hours",
    description: "Mobile-optimized website that looks like you paid <strong class='text-accent font-bold'>$3,000</strong>. Zero tech skills required.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing Built-In",
    description: "Accept cards, collect deposits, get paid next day. <strong class='text-accent font-bold'>2.9% + 30¢</strong> per transaction.",
  },
];

const WhySection = () => {
  return (
    <section className="py-16 md:py-24 px-5 md:px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            Built to Solve Your Problems
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12 md:mb-16">
            Stop cobbling together apps. Get everything in one system.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={i * 100}>
                <div className="group bg-background rounded-2xl p-8 md:p-10 border border-border hover:border-accent hover:shadow-[0_12px_32px_hsla(217,91%,60%,0.1)] transition-all duration-300 hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: 'hsla(217, 91%, 60%, 0.1)',
                    }}
                  >
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
