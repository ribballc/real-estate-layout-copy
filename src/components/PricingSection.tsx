import { useState } from "react";
import { Check, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

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
      className="relative py-20 md:py-[100px] px-5 md:px-8 overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <h2
            className="font-heading text-[28px] md:text-[40px] font-semibold leading-[1.15] text-center mb-4"
            style={{ color: "#1d1d1f", letterSpacing: "-0.4px" }}
          >
            Simple Pricing
          </h2>
          <p className="text-[17px] md:text-[19px] text-center max-w-2xl mx-auto mb-10" style={{ color: "#86868b", letterSpacing: "-0.2px" }}>
            Everything you need in one plan. Cancel anytime.
          </p>
        </FadeIn>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="rounded-full p-1 inline-flex" style={{ background: "#f5f5f7" }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 min-h-[40px]"
              style={{
                background: !annual ? "#0071e3" : "transparent",
                color: !annual ? "#ffffff" : "#86868b",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 min-h-[40px]"
              style={{
                background: annual ? "#0071e3" : "transparent",
                color: annual ? "#ffffff" : "#86868b",
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
              className="rounded-3xl p-8 flex flex-col relative"
              style={{
                background: "#1d1d1f",
              }}
            >
              <div className="text-[13px] font-medium tracking-[1.5px] uppercase mb-1" style={{ color: "hsla(0, 0%, 100%, 0.6)", letterSpacing: "1.5px" }}>One Plan — Everything You Need</div>
              <div className="text-[21px] font-semibold" style={{ color: "#ffffff", letterSpacing: "-0.3px" }}>{plan.name}</div>
              <div className="text-[15px] mt-1" style={{ color: "hsla(0, 0%, 100%, 0.5)", letterSpacing: "-0.2px" }}>{plan.subtitle}</div>

              <div className="mt-6 mb-6">
                {annual && (
                  <div className="text-sm line-through" style={{ color: "hsla(0, 0%, 100%, 0.4)" }}>${oldPrice}/mo</div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-[56px] font-semibold tabular-nums leading-none" style={{ color: "#ffffff" }}>${price}</span>
                  <span className="text-[17px]" style={{ color: "hsla(0, 0%, 100%, 0.5)" }}>/mo</span>
                </div>
              </div>

              <button
                onClick={openFunnel}
                className="w-full rounded-full font-medium py-[14px] min-h-[48px] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: "#0071e3",
                  color: "#ffffff",
                  fontSize: "17px",
                  letterSpacing: "-0.2px",
                }}
              >
                Activate My System
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="text-[13px] text-center mt-3" style={{ color: "hsla(0, 0%, 100%, 0.5)" }}>
                14-day free trial · Setup in 48 hours
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {(showAllFeatures ? plan.features : plan.features.slice(0, 5)).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#0071e3" }} />
                    <span style={{ color: "hsla(0, 0%, 100%, 0.8)", letterSpacing: "-0.2px" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.features.length > 5 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-3 inline-flex items-center gap-1 text-[15px] font-medium transition-colors"
                  style={{ color: "#0071e3" }}
                >
                  {showAllFeatures ? (
                    <>View less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View more <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}

              <div className="mt-4 pt-4 text-[13px]" style={{ borderTop: "1px solid hsla(0, 0%, 100%, 0.1)", color: "hsla(0, 0%, 100%, 0.4)" }}>
                {plan.bottomFeature}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[15px]" style={{ color: "#86868b" }}>
            14-day free trial. No credit card required. Cancel in 2 clicks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
