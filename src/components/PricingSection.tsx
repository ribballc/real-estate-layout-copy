import { useState, useRef, useCallback, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const plans = [
  {
    name: "Starter",
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
    subtitle: "For teams of 2-4 doing $15k+/month",
    monthlyPrice: 149,
    annualPrice: 119,
    popular: true,
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

// Fix: Elite is not popular
plans[2].popular = false;

const TiltPricingCard = ({ children, isPro }: { children: React.ReactNode; isPro: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const deg = isPro ? 5 : 4;
    el.style.transform = `perspective(800px) rotateX(${-y * deg}deg) rotateY(${x * deg}deg) translateY(-${isPro ? 12 : 8}px) ${isPro ? "scale(1.03)" : ""}`;
  }, [isPro]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = `perspective(800px) rotateX(0) rotateY(0) translateY(0) ${isPro ? "scale(1.03)" : ""}`;
  }, [isPro]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease";
    el.style.transformStyle = "preserve-3d";
    if (isPro) el.style.transform = "scale(1.03)";
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
    <section id="pricing" className="bg-muted py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[42px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            Simple Pricing. No Surprises. <span className="font-serif italic text-[32px] md:text-[48px] text-accent">Cancel Anytime.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10 md:mb-14">
            Every plan includes your done-for-you website + smart booking calendar. Start free for 14 days.
          </p>
        </FadeIn>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-background rounded-full p-1 border border-border inline-flex">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[48px] ${
                !annual ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[48px] ${
                annual ? "bg-accent text-accent-foreground" : "text-muted-foreground"
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
                    className={`group rounded-2xl p-6 md:p-8 h-full flex flex-col relative transition-all duration-500 ${
                      isPro
                        ? "bg-primary text-primary-foreground shadow-xl ring-2 ring-accent hover:shadow-[0_24px_48px_rgba(0,0,0,0.2)]"
                        : "bg-background border border-border shadow-sm hover:shadow-[0_24px_48px_rgba(0,0,0,0.1)] hover:border-accent/20"
                    }`}
                  >
                    {isPro && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-serif italic font-semibold px-4 py-1.5 rounded-full tracking-wider shadow-md animate-[ctaGlow_3s_ease-in-out_infinite]">
                        ✦ MOST POPULAR ✦
                      </div>
                    )}

                    <div className="text-xl font-bold">{plan.name}</div>
                    <div className={`text-sm mt-1 ${isPro ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {plan.subtitle}
                    </div>

                    <div className="mt-5 mb-6">
                      {annual && (
                        <div className={`text-sm line-through ${isPro ? "text-primary-foreground/40" : "text-muted-foreground/60"}`}>
                          ${oldPrice}/mo
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-5xl font-extrabold tabular-nums transition-all duration-500"
                          key={`${plan.name}-${price}`}
                        >
                          ${price}
                        </span>
                        <span className={`text-base font-normal ${isPro ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/mo</span>
                      </div>
                    </div>

                    <button
                      onClick={openFunnel}
                      className="group/btn w-full rounded-full font-bold py-3.5 shadow-md hover:shadow-[0_12px_32px_rgba(164,214,94,0.35)] hover:brightness-105 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[48px] inline-flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(180deg, hsl(82 80% 60%) 0%, hsl(82 75% 55%) 100%)', color: 'hsl(var(--accent-foreground))' }}
                    >
                      Activate My System
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </button>
                    <div className={`text-xs text-center mt-2 ${isPro ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                      14-day free trial · Setup in 48 hours
                    </div>

                    <ul className="mt-6 space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                          <span className={isPro ? "text-primary-foreground/90" : "text-foreground"}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`mt-4 pt-4 border-t text-xs ${isPro ? "border-primary-foreground/10 text-primary-foreground/50" : "border-border text-muted-foreground"}`}>
                      {plan.bottomFeature}
                    </div>
                  </div>
                </TiltPricingCard>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-10 text-center">
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
