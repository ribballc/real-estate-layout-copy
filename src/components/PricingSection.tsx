import { useState } from "react";
import { Check, ChevronRight, ChevronDown, ChevronUp, Sparkles, Zap } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const plan = {
  name: "Creator",
  subtitle: "For full-time detailers scaling to the max",
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
      className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden"
      style={{ background: "hsl(0, 0%, 100%)" }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <h2
            className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3"
            style={{ color: "hsl(222, 47%, 11%)" }}
          >
            Simple Pricing
          </h2>
          <p className="text-base md:text-lg text-center max-w-2xl mx-auto mb-10" style={{ color: "hsl(215, 16%, 47%)" }}>
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
                ? 'linear-gradient(135deg, hsl(217,91%,60%), hsl(271,91%,60%))'
                : 'hsl(214,20%,85%)',
              boxShadow: annual ? '0 0 16px hsla(217,91%,60%,0.4)' : 'none',
            }}
            aria-label="Toggle annual billing"
          >
            <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
              style={{ left: annual ? 'calc(100% - 26px)' : '2px' }}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
          {annual && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{
              background: 'linear-gradient(135deg, hsl(340,82%,52%), hsl(350,90%,55%))',
              boxShadow: '0 0 12px hsla(340,82%,52%,0.4)',
            }}>
              {savingsPercent}% OFF
            </span>
          )}
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <FadeIn>
            {/* Outer glow wrapper */}
            <div className="relative rounded-3xl p-[2px]" style={{
              background: 'linear-gradient(135deg, hsl(340,82%,52%), hsl(271,91%,60%), hsl(217,91%,60%), hsl(160,84%,39%))',
              boxShadow: '0 0 40px hsla(340,82%,52%,0.2), 0 0 80px hsla(271,91%,60%,0.15), 0 20px 60px rgba(0,0,0,0.1)',
              animation: 'pricingGlowRotate 6s linear infinite',
            }}>
              {/* Inner card */}
              <div className="rounded-[22px] overflow-hidden" style={{
                background: 'linear-gradient(180deg, hsl(260,20%,12%) 0%, hsl(240,15%,8%) 100%)',
              }}>
                {/* Top badges bar */}
                <div className="flex items-center gap-2 px-6 pt-5 pb-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full" style={{
                    background: 'linear-gradient(135deg, hsl(45,100%,50%), hsl(35,100%,45%))',
                    color: 'hsl(0,0%,5%)',
                  }}>
                    <Sparkles className="w-3 h-3" /> BEST VALUE
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border" style={{
                    borderColor: 'hsla(340,82%,52%,0.5)',
                    color: 'hsl(340,82%,60%)',
                    background: 'hsla(340,82%,52%,0.1)',
                  }}>
                    LIMITED OFFER
                  </span>
                </div>

                {/* Plan name and subtitle */}
                <div className="px-6 pt-5">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{
                      background: 'hsla(340,82%,52%,0.15)',
                      color: 'hsl(340,82%,60%)',
                      border: '1px solid hsla(340,82%,52%,0.3)',
                    }}>
                      ✕ LIMITED OFFER
                    </span>
                    {annual && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{
                        background: 'linear-gradient(135deg, hsl(340,82%,52%), hsl(350,90%,50%))',
                      }}>
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
                      <span className="text-2xl font-semibold line-through decoration-2" style={{
                        color: 'hsla(0,0%,100%,0.35)',
                        textDecorationColor: 'hsl(340,82%,52%)',
                      }}>${oldPrice}</span>
                    )}
                    <span className="font-mono text-[56px] font-bold tabular-nums leading-none" style={{
                      color: 'hsl(160,84%,55%)',
                      textShadow: '0 0 20px hsla(160,84%,39%,0.4)',
                    }}>${price}</span>
                    <span className="text-lg text-white/50">/month</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-white/40 mt-1">Billed annually</p>
                  )}
                </div>

                {/* Savings callout */}
                {annual && (
                  <div className="mx-6 mt-3 rounded-xl py-2.5 text-center text-sm font-semibold" style={{
                    background: 'linear-gradient(135deg, hsla(160,84%,39%,0.15), hsla(160,84%,39%,0.08))',
                    border: '1px solid hsla(160,84%,39%,0.25)',
                    color: 'hsl(160,84%,55%)',
                  }}>
                    ✓ Save ${savingsAmount} compared to monthly
                  </div>
                )}

                {/* CTA Button */}
                <div className="px-6 pt-5">
                  <button
                    onClick={openFunnel}
                    className="w-full rounded-xl font-bold py-4 min-h-[52px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base"
                    style={{
                      background: 'linear-gradient(135deg, hsl(340,82%,52%), hsl(350,90%,50%))',
                      color: 'white',
                      boxShadow: '0 4px 20px hsla(340,82%,52%,0.4), 0 0 40px hsla(340,82%,52%,0.15)',
                    }}
                  >
                    Activate My System
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="text-[13px] text-center mt-3 text-white/40">
                    14-day free trial · Setup in 48 hours
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 pt-5 pb-6">
                  <ul className="space-y-3">
                    {(showAllFeatures ? plan.features : plan.features.slice(0, 5)).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{
                          background: 'hsla(160,84%,39%,0.15)',
                          border: '1px solid hsla(160,84%,39%,0.3)',
                        }}>
                          <Check className="w-3 h-3" style={{ color: 'hsl(160,84%,55%)' }} />
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.features.length > 5 && (
                    <button
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: 'hsl(217,91%,60%)' }}
                    >
                      {showAllFeatures ? (
                        <>View less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>View more <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}

                  <div className="mt-5 pt-4 text-xs text-white/30" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {plan.bottomFeature}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: "hsl(215, 16%, 47%)" }}>
            14-day free trial. No credit card required. Cancel in 2 clicks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
