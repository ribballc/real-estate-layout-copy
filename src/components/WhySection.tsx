import { Target, Sparkles, Brain, Settings } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const features = [
  {
    icon: Target,
    title: "Online Booking That Works",
    description: "Clients book from your site, pick a service, choose a time, and pay a deposit. Zero back-and-forth.",
  },
  {
    icon: Sparkles,
    title: "No-Show Protection Built In",
    description: "Auto SMS and email reminders before every job. Require deposits so flaky clients don't waste your day.",
  },
  {
    icon: Brain,
    title: "Professional Website, Zero Effort",
    description: "Mobile-optimized site that makes your shop look legit. Showcases your work, services, prices, and reviews.",
  },
  {
    icon: Settings,
    title: "Dashboard a 5th Grader Could Use",
    description: "See all bookings, clients, and revenue in one place. If you can use Instagram, you can use this.",
  },
];

const WhySection = () => {
  const scrollToForm = () => {
    const el = document.getElementById("form-funnel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-secondary py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center text-foreground mb-10 md:mb-12">
            Everything You Need to Fill Your Schedule
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 80}>
              <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="w-10 h-10 text-accent mb-5" />
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 px-8 py-3 text-lg min-h-[48px]"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
