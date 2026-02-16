import { useState, useEffect, useRef } from "react";
import { Check, ChevronRight, ChevronDown, ChevronUp, Lock, Unlock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ── Stripe price IDs ── */
const PRICES = {
  monthly: "price_1T1I5SP734Q0ltptMJmmSvok",
  annual: "price_1T1JeMP734Q0ltptDuj5K6Na",
};

const plan = {
  name: "The 'One' Plan",
  subtitle: "One Plan, One Price — Everything You Need",
  monthlyPrice: 79,
  annualPrice: 54,
  features: [
    "Done-for-you website in 48 hours",
    "24/7 smart booking calendar",
    "Automated SMS reminders",
    "$50-100 deposit collection",
    "Mobile-optimized (built for phones)",
    "Custom services & add-ons",
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

/* ── Odometer Digit ── */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const OdometerDigit = ({ digit }: { digit: string }) => {
  const currentNum = parseInt(digit, 10);
  const prevNum = useRef(currentNum);
  const [offset, setOffset] = useState(currentNum);

  useEffect(() => {
    if (currentNum !== prevNum.current) {
      prevNum.current = currentNum;
      setOffset(currentNum);
    }
  }, [currentNum]);

  return (
    <span className="inline-block overflow-hidden relative" style={{ height: "1em", width: "0.6em" }}>
      <span
        className="inline-flex flex-col items-center"
        style={{
          transition: "transform 0.5s cubic-bezier(0.45, 0, 0.15, 1)",
          transform: `translateY(${-offset * 10}%)`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block" style={{ height: "1em", lineHeight: "1em" }}>{d}</span>
        ))}
      </span>
    </span>
  );
};

const OdometerPrice = ({ value }: { value: number }) => {
  const digits = String(value).split("");
  return (
    <span className="inline-flex font-mono text-[56px] font-bold tabular-nums leading-none text-accent" style={{ textShadow: "0 0 20px hsla(217,91%,60%,0.4)" }}>
      $
      {digits.map((d, i) => (
        <OdometerDigit key={i} digit={d} />
      ))}
    </span>
  );
};

/* ── Lock → Unlock animation ── */
const AnimatedLock = () => {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setUnlocked(true), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative w-4 h-4">
      <Lock className="w-4 h-4 text-accent absolute inset-0 transition-all duration-500" style={{ opacity: unlocked ? 0 : 1, transform: unlocked ? "scale(0.5) rotate(-20deg)" : "scale(1)" }} />
      <Unlock className="w-4 h-4 text-accent absolute inset-0 transition-all duration-500" style={{ opacity: unlocked ? 1 : 0, transform: unlocked ? "scale(1)" : "scale(0.5) rotate(20deg)" }} />
    </div>
  );
};

interface TrialLockOverlayProps {
  isDark?: boolean;
}

const TrialLockOverlay = ({ isDark = true }: TrialLockOverlayProps) => {
  const [annual, setAnnual] = useState(true);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const oldPrice = plan.monthlyPrice;
  const savingsAmount = annual ? (plan.monthlyPrice - plan.annualPrice) * 12 : 0;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const priceId = annual ? PRICES.annual : PRICES.monthly;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({ title: "Checkout error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        {/* Toggle */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <span className={`text-sm font-semibold transition-colors ${!annual ? "text-white" : "text-white/50"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{
              background: annual ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.2)",
              boxShadow: annual ? "0 0 16px hsla(217,91%,60%,0.4)" : "none",
            }}
            aria-label="Toggle annual billing"
          >
            <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300" style={{ left: annual ? "calc(100% - 26px)" : "2px" }} />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? "text-white" : "text-white/50"}`}>Annual</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-accent-foreground bg-accent">32% OFF</span>
        </div>

        {/* Pricing Card */}
        <div className="relative rounded-3xl p-[2px]" style={{
          background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(213,94%,68%), hsl(217,91%,60%))",
          boxShadow: "0 0 30px hsla(217,91%,60%,0.25), 0 0 60px hsla(213,94%,68%,0.15), 0 20px 60px hsla(215,50%,10%,0.2)",
        }}>
          <div className="rounded-[22px] overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(215,50%,10%) 0%, hsl(217,33%,8%) 100%)" }}>
            {/* Plan name */}
            <div className="px-6 pt-5">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                {annual && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-accent-foreground bg-accent">32% OFF</span>}
              </div>
              <p className="text-sm text-white/50">{plan.subtitle}</p>
            </div>

            {/* Pricing with odometer */}
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-baseline gap-3">
                {annual && (
                  <span className="text-2xl font-semibold line-through decoration-2 text-white/35" style={{ textDecorationColor: "hsl(217,91%,60%)" }}>${oldPrice}</span>
                )}
                <OdometerPrice value={price} />
                <span className="text-lg text-white/50">/month</span>
              </div>
              {annual && <p className="text-xs text-white/40 mt-1">Billed annually</p>}
            </div>

            {/* Savings callout */}
            {annual && (
              <div className="mx-6 mt-3 rounded-xl py-2.5 text-center text-sm font-semibold border border-accent/25 text-accent bg-accent/10">
                ✓ Save ${savingsAmount}/yr + Free Gifts included
              </div>
            )}

            {/* CTA Button */}
            <div className="px-6 pt-5">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full rounded-xl font-bold py-4 min-h-[52px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base bg-accent text-accent-foreground disabled:opacity-70"
                style={{ boxShadow: "0 4px 20px hsla(217,91%,60%,0.4), 0 0 40px hsla(217,91%,60%,0.15)" }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Opening checkout…</>
                ) : (
                  <>Get Started Free <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
              <div className="text-[13px] text-center mt-3 text-white/40">14-day free trial · No charge today</div>
            </div>

            {/* Features */}
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <AnimatedLock />
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
                <button onClick={() => setShowAllFeatures(!showAllFeatures)} className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors text-accent">
                  {showAllFeatures ? <>View less <ChevronUp className="w-4 h-4" /></> : <>View more <ChevronDown className="w-4 h-4" /></>}
                </button>
              )}
              <div className="mt-5 pt-4 text-xs text-white/30 border-t border-white/[0.08]">{plan.bottomFeature}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-white/30">14-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default TrialLockOverlay;
