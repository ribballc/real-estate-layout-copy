import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const plans = [
  {
    name: "Starter",
    label: "STARTER",
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
    label: "PRO",
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
    label: "ELITE",
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

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);
  const { openFunnel } = useSurveyFunnel();

  return (
    <section id="pricing" className="py-16 md:py-24 px-5 md:px-8" style={{
      background: 'linear-gradient(180deg, hsl(210 40% 98%) 0%, hsl(0 0% 100%) 100%)',
    }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[48px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground text-center mb-3">
            Simple Pricing
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Every plan includes your website + booking system. Cancel anytime.
          </p>
        </FadeIn>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-secondary rounded-xl p-1 inline-flex">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 min-h-[40px] ${
                !annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 min-h-[40px] ${
                annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
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
              <FadeIn key={plan.name} delay={i * 100} className={isPro ? "order-first md:order-none" : ""}>
                <div
                  className={`group rounded-2xl p-8 h-full flex flex-col relative transition-all duration-300 ${
                    isPro
                      ? "bg-card border-2 border-accent shadow-[0_8px_32px_hsla(217,91%,60%,0.15)] md:scale-105"
                      : "bg-card border border-border hover:border-accent"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-[0.05em] bg-accent text-accent-foreground">
                      Most Popular
                    </div>
                  )}

                  <div className="text-[13px] text-accent font-semibold tracking-[0.08em] uppercase mb-1">{plan.label}</div>
                  <div className="text-2xl font-bold text-foreground">{plan.name}</div>
                  <div className="text-[15px] text-muted-foreground mt-1">{plan.subtitle}</div>

                  <div className="mt-6 mb-6">
                    {annual && (
                      <div className="text-sm text-muted-foreground/50 line-through">${oldPrice}/mo</div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-[56px] font-bold text-foreground tabular-nums leading-none">${price}</span>
                      <span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                  </div>

                  <button
                    onClick={openFunnel}
                    className={`w-full rounded-xl font-semibold py-3.5 min-h-[48px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ${
                      isPro ? "text-accent-foreground" : "text-primary-foreground"
                    }`}
                    style={{
                      background: isPro
                        ? 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)'
                        : 'hsl(215 50% 10%)',
                      boxShadow: isPro
                        ? '0 4px 12px hsla(217, 91%, 60%, 0.3)'
                        : '0 4px 12px hsla(215, 50%, 10%, 0.15)',
                    }}
                  >
                    Activate My System
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="text-[13px] text-center mt-3 text-muted-foreground">
                    14-day free trial · Setup in 48 hours
                  </div>

                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    {plan.bottomFeature}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Not sure which plan? Start with Starter — upgrade anytime.
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
