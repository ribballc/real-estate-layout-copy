import { Target, Sparkles, Brain, Settings } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "24/7 Smart Booking Calendar",
    description: "Customers book while you're detailing, eating dinner, or sleeping. No more missed calls, phone tag, or DMs you forget to answer. Capture the $500-1,000/month you're currently losing to missed inquiries.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection That Actually Works",
    description: "Automatic SMS reminders 24 hours before every appointment. Require $50-100 deposits at booking — non-refundable if they cancel last minute. Tire-kickers filtered out. Serious clients only.",
  },
  {
    icon: Brain,
    title: "Professional Website in 48 Hours, Not 48 Days",
    description: "Mobile-optimized, Google-friendly site with your branding, services, before/after gallery, and reviews. Looks like you paid $3,000 for it. Built for you — zero tech skills required.",
  },
  {
    icon: Settings,
    title: "QR Code → Instant Booking",
    description: "Put it on your van wrap, business cards, flyers, and Instagram bio. Customer scans, picks a service, chooses a time, pays deposit. You get a notification. That's it.",
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
          <h2 className="font-heading text-[26px] md:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground text-center mb-10 md:mb-14">
            Built to Solve the Problems That Are Bleeding Your Revenue
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 80}>
              <div className="bg-muted rounded-2xl p-6 md:p-8 border border-border">
                <feature.icon className="w-10 h-10 text-accent mb-5" />
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={scrollToPricing}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 px-8 py-3 text-lg min-h-[48px]"
          >
            See Pricing Below →
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
