import { useState } from "react";
import { Check, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import SpaceGrid from "@/components/SpaceGrid";

const plan = {
  name: "Pro",
  subtitle: "For full-time detailers doing 15-30 jobs/week",
  monthlyPrice: 99,
  annualPrice: 75,
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
  const oldPrice = annual ? plan.monthlyPrice : null;

  return (
    <section
      id="pricing"
      className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(215, 50%, 8%) 0%, hsl(215, 50%, 10%) 100%)',
      }}
    >
      <SpaceGrid opacity={0.025} />

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <h2
            className="font-heading text-[28px] md:text-[56px] lg:text-[72px] font-bold tracking-[-0.015em] leading-[1.2] text-center mb-3"
            style={{
              background: 'linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Simple Pricing
          </h2>
          <p className="text-base md:text-lg text-center max-w-2xl mx-auto mb-10" style={{ color: 'hsla(0, 0%, 100%, 0.6)' }}>
            Everything you need in one plan. Cancel anytime.
          </p>
        </FadeIn>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="rounded-xl p-1 inline-flex" style={{ background: 'hsla(0, 0%, 100%, 0.06)', border: '1px solid hsla(0, 0%, 100%, 0.1)' }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 min-h-[40px]"
              style={{
                background: !annual ? 'hsla(217, 91%, 60%, 0.15)' : 'transparent',
                color: !annual ? 'hsl(0, 0%, 100%)' : 'hsla(0, 0%, 100%, 0.4)',
                border: !annual ? '1px solid hsla(217, 91%, 60%, 0.3)' : '1px solid transparent',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 min-h-[40px]"
              style={{
                background: annual ? 'hsla(217, 91%, 60%, 0.15)' : 'transparent',
                color: annual ? 'hsl(0, 0%, 100%)' : 'hsla(0, 0%, 100%, 0.4)',
                border: annual ? '1px solid hsla(217, 91%, 60%, 0.3)' : '1px solid transparent',
              }}
            >
              Annual (Save 28%)
            </button>
          </div>
        </div>

        {/* Single Card */}
        <div className="max-w-md mx-auto">
          <FadeIn>
            <div
              className="rounded-2xl p-8 flex flex-col relative transition-all duration-300"
              style={{
                background: 'hsla(215, 50%, 12%, 0.6)',
                border: '1px solid hsla(217, 91%, 60%, 0.2)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 0 1px hsla(217, 91%, 60%, 0.05) inset, 0 20px 60px hsla(0, 0%, 0%, 0.4), 0 0 80px hsla(217, 91%, 60%, 0.08)',
              }}
            >
              <div className="text-[13px] font-semibold tracking-[0.08em] uppercase mb-1" style={{ color: 'hsl(217, 91%, 70%)' }}>One Plan — Everything You Need</div>
              <div className="text-2xl font-bold" style={{ color: 'hsl(0, 0%, 100%)' }}>{plan.name}</div>
              <div className="text-[15px] mt-1" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>{plan.subtitle}</div>

              <div className="mt-6 mb-6">
                {annual && (
                  <div className="text-sm line-through" style={{ color: 'hsla(0, 0%, 100%, 0.3)' }}>${oldPrice}/mo</div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-[56px] font-bold tabular-nums leading-none" style={{ color: 'hsl(0, 0%, 100%)' }}>${price}</span>
                  <span className="text-lg" style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}>/mo</span>
                </div>
              </div>

              <button
                onClick={openFunnel}
                className="w-full rounded-xl font-semibold py-3.5 min-h-[48px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                  color: 'hsl(0, 0%, 100%)',
                  boxShadow: '0 4px 12px hsla(217, 91%, 60%, 0.3)',
                }}
              >
                Activate My System
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="text-[13px] text-center mt-3" style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}>
                14-day free trial · Setup in 48 hours
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {(showAllFeatures ? plan.features : plan.features.slice(0, 5)).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(217, 91%, 70%)' }} />
                    <span style={{ color: 'hsla(0, 0%, 100%, 0.65)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.features.length > 5 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: 'hsl(217, 91%, 70%)' }}
                >
                  {showAllFeatures ? (
                    <>View less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View more <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}

              <div className="mt-4 pt-4 text-xs" style={{ borderTop: '1px solid hsla(0, 0%, 100%, 0.1)', color: 'hsla(0, 0%, 100%, 0.4)' }}>
                {plan.bottomFeature}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}>
            14-day free trial. No credit card required. Cancel in 2 clicks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
