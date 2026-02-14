import { useRef, useCallback, useEffect } from "react";
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

const TiltCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-12px)`;
  }, []);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease";
    el.style.transformStyle = "preserve-3d";
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [handleMove, handleLeave]);

  const Icon = feature.icon;

  return (
    <FadeIn delay={index * 150} rotateX={10}>
      <div
        ref={cardRef}
        className="group bg-muted rounded-2xl p-6 md:p-10 border border-border hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] hover:border-accent/30"
      >
        <Icon className="w-10 h-10 text-accent mb-5 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700" />
        <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
        <p
          className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: feature.description }}
        />
      </div>
    </FadeIn>
  );
};

const WhySection = () => {
  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-background py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-10 md:mb-14">
            Built to Solve the Problems That Are{" "}
            <span className="font-serif italic text-[32px] md:text-[48px] text-accent">Bleeding Your Revenue</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <TiltCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        <FadeIn delay={600}>
          <div className="text-center mt-10">
            <button
              onClick={scrollToPricing}
              className="group inline-flex items-center gap-2 font-bold rounded-full shadow-md hover:shadow-[0_12px_32px_rgba(164,214,94,0.35)] hover:brightness-105 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 px-8 py-3 text-lg min-h-[48px]"
              style={{ background: 'linear-gradient(180deg, hsl(82 80% 60%) 0%, hsl(82 75% 55%) 100%)', color: 'hsl(var(--accent-foreground))' }}
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
