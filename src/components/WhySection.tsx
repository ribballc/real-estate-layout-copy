import { Target, Sparkles, Brain, Settings } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "Smart Online Booking",
    description: "Clients book from your site. You set your availability and pricing — they pick a slot and pay. No more back-and-forth texts.",
  },
  {
    icon: Sparkles,
    title: "Automatic No-Show Protection",
    description: "SMS and email reminders before every appointment. Require deposits at booking so tire-kickers don't waste your day.",
  },
  {
    icon: Brain,
    title: "Professional Website in 48 Hours",
    description: "A fast, mobile-optimized site that shows off your work, services, and reviews. Built for you — zero tech skills required.",
  },
  {
    icon: Settings,
    title: "Simple Dashboard, No Learning Curve",
    description: "All your bookings, clients, and revenue in one place. If you can use Instagram, you can run this.",
  },
];

const WhySection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground text-center mb-10 md:mb-12 leading-[1.15]">
            Everything You Need to Fill Your Schedule
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 100}>
              <div className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="w-10 h-10 text-accent mb-5" />
                <h3 className="font-heading text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-full text-lg font-medium hover:brightness-110 hover:shadow-xl transition-all min-h-[48px]"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
