import { useState, useRef, useCallback, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const plans = [
  {
    name: "Starter",
    badge: "FOUNDATION",
    subtitle: "For solo detailers doing 10-20 jobs/week",
    monthlyPrice: 49,
    annualPrice: 35,
    popular: false,
    features: [
      "Done-for-you website in 48 hours",
      "24/7 smart booking calendar",
      "Automated SMS reminders",
      "$50-100 deposit collection",
      "Mobile-optimized (built for phones)",
    ],
    bottomFeature: "Payment processing: 2.9% + 30¢",
  },
  {
    name: "Pro",
    badge: "THE STANDARD",
    subtitle: "For full-time detailers doing 15-30 jobs/week",
    monthlyPrice: 99,
    annualPrice: 75,
    popular: true,
    features: [
      "Everything in Starter, plus:",
      "Route optimization (save 45-90 min/day)",
      "Unlimited client database",
      "Automated review requests",
      "Email & SMS marketing suite",
    ],
    bottomFeature: "Payment processing: 2.9% + 30¢",
  },
  {
    name: "Elite",
    badge: "EXCELLENCE",
    subtitle: "For teams of 2-4 doing $15k+/month",
    monthlyPrice: 149,
    annualPrice: 119,
    popular: false,
    features: [
      "Everything in Pro, plus:",
      "Team management (3 technician accounts)",
      "Advanced analytics dashboard",
      "Subscription/membership builder",
      "Priority support + account manager",
    ],
    bottomFeature: "Payment processing: 2.9% + 30¢",
  },
];

const TiltPricingCard = ({ children, isPro }: { children: React.ReactNode; isPro: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const deg = isPro ? 5 : 4;
    el.style.transform = `perspective(800px) rotateX(${-y * deg}deg) rotateY(${x * deg}deg) translateY(-${isPro ? 12 : 8}px) ${isPro ? "scale(1.05)" : ""}`;
  }, [isPro]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = `perspective(800px) rotateX(0) rotateY(0) translateY(0) ${isPro ? "scale(1.05)" : ""}`;
  }, [isPro]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease";
    el.style.transformStyle = "preserve-3d";
    if (isPro) el.style.transform = "scale(1.05)";
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [handleMove, handleLeave, isPro]);

  return <div ref={ref}>{children}</div>;
};

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);
  const { openFunnel } = useSurveyFunnel();

  return (
    <section id="pricing" className="py-16 md:py-24 px-5 md:px-8" style={{
      background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 97.5%) 100%)',
    }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[54px] font-bold tracking-[-0.02em] leading-[1.1] text-foreground text-center mb-3">
            Simple Pricing. No Surprises.{" "}
            <span className="font-serif italic text-[32px] md:text-[60px] text-accent">Cancel Anytime.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 md:mb-16">
            Every plan includes your done-for-you website + smart booking calendar. Start free for 14 days.
          </p>
        </FadeIn>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-secondary rounded-full p-1 border border-border inline-flex">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 min-h-[48px] ${
                !annual ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 min-h-[48px] ${
                annual ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              Annual (Save 28%)
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const oldPrice = annual ? plan.monthlyPrice : null;
            const isPro = plan.popular;

            return (
              <FadeIn
                key={plan.name}
                delay={i * 120}
                className={isPro ? "order-first md:order-none" : ""}
                rotateX={8}
              >
                <TiltPricingCard isPro={isPro}>
                  <div
                    className={`group rounded-[24px] p-8 md:p-10 h-full flex flex-col relative transition-all duration-500 min-h-[650px] ${
                      isPro ? "text-primary-foreground" : "bg-background border-2 border-border hover:border-accent"
                    }`}
                    style={isPro ? {
                      background: 'linear-gradient(135deg, hsl(160 50% 8%) 0%, hsl(160 40% 14%) 100%)',
                      boxShadow: '0 0 60px hsla(82, 65%, 55%, 0.15)',
                    } : {
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {isPro && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-serif italic font-semibold px-5 py-1.5 rounded-full tracking-[0.15em]"
                        style={{
                          background: 'linear-gradient(135deg, hsl(37 40% 60%) 0%, hsl(37 35% 50%) 100%)',
                          color: 'hsl(160 50% 8%)',
                          boxShadow: '0 4px 16px hsla(37, 40%, 60%, 0.4)',
                        }}
                      >
                        ✦ {plan.badge} ✦
                      </div>
                    )}

                    <div className="text-xs text-accent font-heading font-semibold tracking-[0.12em] uppercase mb-1">{plan.badge}</div>
                    <div className="text-xl font-bold">{plan.name}</div>
                    <div className={`text-sm mt-1 ${isPro ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {plan.subtitle}
                    </div>

                    <div className="mt-6 mb-8">
                      {annual && (
                        <div className={`text-sm line-through ${isPro ? "text-primary-foreground/30" : "text-muted-foreground/50"}`}>
                          ${oldPrice}/mo
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-6xl font-bold tabular-nums" key={`${plan.name}-${price}`}>
                          ${price}
                        </span>
                        <span className={`text-base font-normal ${isPro ? "text-primary-foreground/60" : "text-muted-foreground"}`}>/mo</span>
                      </div>
                    </div>

                    <button
                      onClick={openFunnel}
                      className="group/btn w-full rounded-[14px] font-bold py-4 min-h-[48px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400"
                      style={{
                        background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
                        color: 'hsl(160 50% 8%)',
                        boxShadow: '0 8px 24px hsla(82, 65%, 55%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)',
                      }}
                    >
                      Activate My System
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </button>
                    <div className={`text-xs text-center mt-3 ${isPro ? "text-primary-foreground/40" : "text-muted-foreground"}`}>
                      14-day free trial · Setup in 48 hours
                    </div>

                    <ul className="mt-6 space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                          <span className={isPro ? "text-primary-foreground/85" : "text-foreground"}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`mt-4 pt-4 border-t text-xs ${isPro ? "border-primary-foreground/10 text-primary-foreground/40" : "border-border text-muted-foreground"}`}>
                      {plan.bottomFeature}
                    </div>
                  </div>
                </TiltPricingCard>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Not sure which plan? Start with Starter — you can upgrade anytime.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            All plans include a 14-day free trial. No credit card required. Cancel in 2 clicks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
