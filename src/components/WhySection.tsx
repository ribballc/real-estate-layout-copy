import { Target, Sparkles, Zap, CreditCard } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "24/7 Smart Booking Calendar",
    description: "Customers book while you're detailing. Capture the <strong>$500-1,000/month</strong> you're losing to missed calls.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection That Actually Works",
    description: "Automated reminders + <strong>$100</strong> deposits = <strong>40%</strong> fewer no-shows. Serious customers only.",
  },
  {
    icon: Zap,
    title: "Professional Website in 48 Hours, Not 48 Days",
    description: "Mobile-optimized website that looks like you paid <strong>$3,000</strong>. Built for you—zero tech skills required.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing Built-In",
    description: "Accept cards, collect deposits, get paid next day. <strong>2.9% + 30¢</strong> per transaction—no monthly fees.",
  },
];

const WhySection = () => {
  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground text-center mb-10 md:mb-14">
            Built to Solve the Problems That Are Bleeding Your Revenue
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 120}>
              <div className="group bg-muted rounded-2xl p-6 md:p-10 border border-border hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                <feature.icon className="w-10 h-10 text-accent mb-5 group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={600}>
          <div className="text-center mt-10">
            <button
              onClick={scrollToPricing}
              className="group inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-xl hover:brightness-105 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 px-8 py-3 text-lg min-h-[48px]"
            >
              See Pricing Below →
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default WhySection;
