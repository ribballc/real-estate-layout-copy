import { useState } from "react";
import { Check, ChevronRight, ChevronDown, ChevronUp, Unlock } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const plan = {
  name: "Pro Plan",
  subtitle: "One Plan, One Price — Everything You Need",
  monthlyPrice: 79,
  annualPrice: 54,
  features: [
    "Done-for-you website in 48 hours",
    "24/7 smart booking calendar",
    "Automated SMS reminders",
    "$50-100 deposit collection",
    "Mobile-optimized (built for phones)",
    "Route optimization (save 45-90 min/day)",
    "Unlimited client database",
    "Automated review requests",
    "Email & SMS marketing suite",
    "Team management (3 technician accounts)",
    "Advanced analytics dashboard",
    "Subscription/membership builder",
    "Priority support + account manager",
  ],
  bottomFeature: "Payment processing: 2.9% + 30¢",
};

const PricingSection = () => {
  const [annual, setAnnual] = useState(true);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const { openFunnel } = useSurveyFunnel();

  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const oldPrice = plan.monthlyPrice;
  const savingsPercent = annual ? Math.round((1 - plan.annualPrice / plan.monthlyPrice) * 100) : 0;
  const savingsAmount = annual ? (plan.monthlyPrice - plan.annualPrice) * 12 : 0;

  return (
    <section
      id="pricing"
      className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden bg-background"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <h2 className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3 text-foreground">
            Simple Pricing
          </h2>
          <p className="text-base md:text-lg text-center max-w-2xl mx-auto mb-10 text-muted-foreground">
            Everything you need in one plan. Cancel anytime.
          </p>
        </FadeIn>

        {/* Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-semibold transition-colors ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{
              background: annual
                ? 'hsl(var(--accent))'
                : 'hsl(var(--border))',
              boxShadow: annual ? '0 0 16px hsla(217,91%,60%,0.4)' : 'none',
            }}
            aria-label="Toggle annual billing"
          >
            <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
              style={{ left: annual ? 'calc(100% - 26px)' : '2px' }}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-accent-foreground bg-accent">
            32% OFF
          </span>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <FadeIn>
            {/* Outer glow wrapper - static brand blue glow */}
            <div className="relative rounded-3xl p-[2px]" style={{
              background: 'linear-gradient(135deg, hsl(217,91%,60%), hsl(213,94%,68%), hsl(217,91%,60%))',
              boxShadow: '0 0 30px hsla(217,91%,60%,0.25), 0 0 60px hsla(213,94%,68%,0.15), 0 20px 60px hsla(215,50%,10%,0.2)',
            }}>
              {/* Inner card */}
              <div className="rounded-[22px] overflow-hidden" style={{
                background: 'linear-gradient(180deg, hsl(215,50%,10%) 0%, hsl(217,33%,8%) 100%)',
              }}>
                {/* Plan name and subtitle */}
                <div className="px-6 pt-5">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    {annual && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-accent-foreground bg-accent">
                        {savingsPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50">{plan.subtitle}</p>
                </div>

                {/* Pricing */}
                <div className="px-6 pt-5 pb-2">
                  <div className="flex items-baseline gap-3">
                    {annual && (
                      <span className="text-2xl font-semibold line-through decoration-2 text-white/35" style={{
                        textDecorationColor: 'hsl(217,91%,60%)',
                      }}>${oldPrice}</span>
                    )}
                    <span className="font-mono text-[56px] font-bold tabular-nums leading-none text-accent" style={{
                      textShadow: '0 0 20px hsla(217,91%,60%,0.4)',
                    }}>${price}</span>
                    <span className="text-lg text-white/50">/month</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-white/40 mt-1">Billed annually</p>
                  )}
                </div>

                {/* Savings callout */}
                {annual && (
                  <div className="mx-6 mt-3 rounded-xl py-2.5 text-center text-sm font-semibold border border-accent/25 text-accent bg-accent/10">
                    ✓ Save ${savingsAmount} compared to monthly
                  </div>
                )}

                {/* CTA Button */}
                <div className="px-6 pt-5">
                  <button
                    onClick={openFunnel}
                    className="w-full rounded-xl font-bold py-4 min-h-[52px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base bg-accent text-accent-foreground"
                    style={{
                      boxShadow: '0 4px 20px hsla(217,91%,60%,0.4), 0 0 40px hsla(217,91%,60%,0.15)',
                    }}
                  >
                    Get Started Free
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="text-[13px] text-center mt-3 text-white/40">
                    14-day free trial · Setup in 5 mins
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 pt-5 pb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Unlock className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold tracking-wider uppercase text-white/50">What's Included</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <ul className="space-y-3">
                      {(showAllFeatures ? plan.features : plan.features.slice(0, 5)).map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-accent/15 border border-accent/30">
                            <Check className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.features.length > 5 && (
                    <button
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors text-accent"
                    >
                      {showAllFeatures ? (
                        <>View less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>View more <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}

                  <div className="mt-5 pt-4 text-xs text-white/30 border-t border-white/[0.08]">
                    {plan.bottomFeature}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            14-day free trial. No credit card required. Cancel in 2 clicks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
