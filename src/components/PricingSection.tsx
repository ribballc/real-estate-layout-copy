import { Check, ChevronRight, Shield } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const features = [
  "Done-for-you website (normally $2,997)",
  "24/7 smart booking calendar",
  "Automated SMS reminders",
  "$50-100 deposit collection",
  "Payment processing (2.9% + 30¢)",
  "Route optimization (saves 45-90 min/day)",
  "Unlimited client database",
  "Automated review requests",
  "Email & SMS marketing suite",
  "Mobile-optimized (built for detailers)",
  "Priority support + account manager",
  "Live in 5 minutes",
  "No tech skills needed",
];

const PricingSection = () => {
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
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            One plan. Everything included. Cancel anytime.
          </p>
        </FadeIn>

        {/* Single Card */}
        <div className="max-w-md mx-auto">
          <FadeIn>
            <div className="group rounded-2xl p-8 flex flex-col relative transition-all duration-300 bg-card border-2 border-accent shadow-[0_8px_32px_hsla(217,91%,60%,0.15)]">
              {/* Most Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-[0.05em] bg-accent text-accent-foreground">
                Most Popular
              </div>

              <div className="text-[13px] text-accent font-semibold tracking-[0.08em] uppercase mb-1 mt-2">One Plan — Everything You Need</div>
              <div className="text-2xl font-bold text-foreground">Pro</div>
              <div className="text-[15px] text-muted-foreground mt-1">Everything you need to run a professional detailing business</div>

              <div className="mt-6 mb-6">
                <div className="text-sm text-muted-foreground/50 line-through">$99/mo</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-[56px] font-bold text-foreground tabular-nums leading-none">$64</span>
                  <span className="text-lg text-muted-foreground">/mo</span>
                </div>
              </div>

              <button
                onClick={openFunnel}
                className="w-full rounded-xl font-semibold py-4 min-h-[52px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-accent-foreground text-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                  boxShadow: '0 4px 12px hsla(217, 91%, 60%, 0.3)',
                }}
              >
                Start Free 14-Day Trial
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="text-[13px] text-center mt-3 text-muted-foreground">
                Free for 14 days • No credit card until trial ends • Cancel anytime
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[15px]">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                Payment processing: 2.9% + 30¢ per transaction
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Trust badges */}
        <FadeIn delay={200}>
          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">🔒 Secure payments (Stripe)</span>
            <span className="flex items-center gap-1.5">⭐ 4.9/5 rating (200+ reviews)</span>
            <span className="flex items-center gap-1.5">✓ No credit card required</span>
          </div>
        </FadeIn>

        {/* Guarantee */}
        <FadeIn delay={300}>
          <div className="max-w-md mx-auto mt-8 rounded-2xl p-6 text-center border border-accent/20" style={{
            background: 'hsla(217, 91%, 60%, 0.04)',
          }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground text-lg">First Booking Guarantee</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you don't get your first booking in 30 days, we'll refund everything. Zero risk.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PricingSection;
