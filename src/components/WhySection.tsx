import { useRef, useCallback, useEffect } from "react";
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
    title: "No-Show Protection That Actually Works",
    description: "Automated reminders + <strong class='text-accent font-bold'>$100</strong> deposits = <strong class='text-accent font-bold'>40%</strong> fewer no-shows. Serious customers only.",
  },
  {
    icon: Zap,
    title: "Professional Website in 48 Hours, Not 48 Days",
    description: "Mobile-optimized website that looks like you paid <strong class='text-accent font-bold'>$3,000</strong>. Built for you—zero tech skills required.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing Built-In",
    description: "Accept cards, collect deposits, get paid next day. <strong class='text-accent font-bold'>2.9% + 30¢</strong> per transaction—no monthly fees.",
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
    el.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-8px)`;
  }, []);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease";
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
        className="group bg-background rounded-[24px] p-8 md:p-10 border border-border hover:shadow-[0_16px_32px_rgba(0,0,0,0.1)] hover:border-accent"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'linear-gradient(135deg, hsla(82, 65%, 55%, 0.15), hsla(82, 65%, 55%, 0.05))',
            boxShadow: '0 4px 12px hsla(82, 65%, 55%, 0.15)',
          }}
        >
          <Icon className="w-7 h-7 text-accent group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
        <p
          className="text-muted-foreground leading-[1.7]"
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
    <section className="py-16 md:py-24 px-5 md:px-8" style={{
      background: 'linear-gradient(180deg, hsl(0 0% 98%) 0%, hsl(0 0% 100%) 100%)',
    }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-center text-brass text-xs font-serif italic tracking-[0.15em] mb-4">
            ✦ THE DETAILER'S CHOICE ✦
          </p>
          <h2 className="font-heading text-[28px] md:text-[54px] font-bold tracking-[-0.02em] leading-[1.1] text-foreground text-center mb-12 md:mb-16">
            Built to Solve the Problems{" "}
            <span className="font-serif italic text-[32px] md:text-[60px] text-accent">Bleeding Your Revenue</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <TiltCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        <FadeIn delay={600}>
          <div className="text-center mt-12">
            <button
              onClick={scrollToPricing}
              className="group inline-flex items-center gap-2 font-bold rounded-[14px] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400 px-10 py-4 text-lg min-h-[48px]"
              style={{
                background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
                color: 'hsl(160 50% 8%)',
                boxShadow: '0 8px 24px hsla(82, 65%, 55%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)',
              }}
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
