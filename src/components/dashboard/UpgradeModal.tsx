import { useEffect, useRef, useState } from "react";
import { X, Check, ChevronRight, ChevronDown, ChevronUp, Lock, Unlock, Loader2 } from "lucide-react";
import { useUpgradeModal } from "@/contexts/UpgradeModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/tracking";

const PRICES = {
  monthly: "price_1T1I5SP734Q0ltptMJmmSvok",
  annual: "price_1T1JeMP734Q0ltptDuj5K6Na",
};

const plan = {
  name: "The 'One' Plan",
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
    <span className="inline-flex font-mono text-[48px] font-bold tabular-nums leading-none" style={{ color: "hsl(217,91%,60%)", textShadow: "0 0 20px hsla(217,91%,60%,0.4)" }}>
      $
      {digits.map((d, i) => (
        <OdometerDigit key={i} digit={d} />
      ))}
    </span>
  );
};

const AnimatedLock = () => {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setUnlocked(true), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative w-4 h-4">
      <Lock className="w-4 h-4 absolute inset-0 transition-all duration-500" style={{ color: "hsl(217,91%,60%)", opacity: unlocked ? 0 : 1, transform: unlocked ? "scale(0.5) rotate(-20deg)" : "scale(1)" }} />
      <Unlock className="w-4 h-4 absolute inset-0 transition-all duration-500" style={{ color: "hsl(217,91%,60%)", opacity: unlocked ? 1 : 0, transform: unlocked ? "scale(1)" : "scale(0.5) rotate(20deg)" }} />
    </div>
  );
};

const UpgradeModal = () => {
  const { upgradeModalOpen, closeUpgradeModal } = useUpgradeModal();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [loading, setLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!upgradeModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUpgradeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [upgradeModalOpen, closeUpgradeModal]);

  // Lock body scroll
  useEffect(() => {
    if (upgradeModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [upgradeModalOpen]);

  if (!upgradeModalOpen) return null;

  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const oldPrice = plan.monthlyPrice;
  const savingsAmount = annual ? (plan.monthlyPrice - plan.annualPrice) * 12 : 0;

  const handleCheckout = async () => {
    if (!user) {
      closeUpgradeModal();
      navigate("/signup");
      return;
    }
    setLoading(true);
    // Event 7: StartTrial — Stripe Checkout Clicked
    trackEvent({
      eventName: 'StartTrial',
      userData: { email: user?.email || undefined, firstName: user?.user_metadata?.first_name },
      customData: { currency: 'USD', value: annual ? 54 : 79, predicted_ltv: annual ? 648 : 948, plan: annual ? 'annual' : 'monthly' },
    });
    try {
      const priceId = annual ? PRICES.annual : PRICES.monthly;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) closeUpgradeModal();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        background: "hsla(0,0%,0%,0.65)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "upgradeBackdropIn 0.25s ease forwards",
      }}
    >
      <div
        className="relative w-full overflow-y-auto"
        style={{
          maxWidth: "min(520px, calc(100vw - 32px))",
          maxHeight: "calc(100dvh - 48px)",
          background: "hsl(222, 47%, 8%)",
          border: "1px solid hsla(217,91%,60%,0.25)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px hsla(0,0%,0%,0.5), 0 0 0 1px hsla(217,91%,60%,0.1)",
          animation: "upgradeCardIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "hsla(0,0%,100%,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "hsla(0,0%,100%,0.4)")}
        >
          <X className="w-[18px] h-[18px]" />
        </button>

        {/* Modal header */}
        <div className="pt-7 pb-2 px-6 text-center">
          <div
            className="inline-flex items-center justify-center mx-auto mb-3"
            style={{
              background: "hsla(217,91%,60%,0.12)",
              color: "hsl(217,91%,70%)",
              border: "1px solid hsla(217,91%,60%,0.25)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              padding: "4px 12px",
              borderRadius: "99px",
            }}
          >
            Start Your Free Trial
          </div>
          <h2 className="text-white font-bold text-xl mb-1">One plan. Everything included.</h2>
          <p style={{ color: "hsla(0,0%,100%,0.5)", fontSize: "13px" }}>Cancel anytime. No contracts.</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center items-center gap-4 py-4 px-6">
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
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "hsl(217,91%,60%)", color: "white" }}>32% OFF</span>
        </div>

        {/* Pricing card inner */}
        <div className="px-6">
          <div className="relative rounded-2xl p-[1.5px]" style={{
            background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(213,94%,68%), hsl(217,91%,60%))",
          }}>
            <div className="rounded-[14px] overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(215,50%,10%) 0%, hsl(217,33%,8%) 100%)" }}>
              {/* Plan name */}
              <div className="px-5 pt-4">
                <div className="flex items-center gap-3 mb-0.5">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {annual && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(217,91%,60%)", color: "white" }}>32% OFF</span>}
                </div>
              </div>

              {/* Price */}
              <div className="px-5 pt-3 pb-1">
                <div className="flex items-baseline gap-3">
                  {annual && (
                    <span className="text-xl font-semibold line-through decoration-2 text-white/35" style={{ textDecorationColor: "hsl(217,91%,60%)" }}>${oldPrice}</span>
                  )}
                  <OdometerPrice value={price} />
                  <span className="text-base text-white/50">/month</span>
                </div>
                {annual && <p className="text-xs text-white/40 mt-0.5">Billed annually</p>}
              </div>

              {/* Savings */}
              {annual && (
                <div className="mx-5 mt-2 rounded-lg py-2 text-center text-sm font-semibold" style={{ border: "1px solid hsla(217,91%,60%,0.25)", color: "hsl(217,91%,60%)", background: "hsla(217,91%,60%,0.1)" }}>
                  ✓ Save ${savingsAmount}/yr + Free Gifts included
                </div>
              )}

              {/* CTA */}
              <div className="px-5 pt-4">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full rounded-xl font-bold py-3.5 min-h-[48px] inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-[15px] text-white disabled:opacity-70"
                  style={{
                    background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,48%) 100%)",
                    boxShadow: "0 4px 20px hsla(217,91%,60%,0.4), 0 0 40px hsla(217,91%,60%,0.15)",
                  }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                  ) : (
                    <>Start My Free Trial <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
                <div className="text-[12px] text-center mt-2.5 text-white/40">14-day free trial · No charge today</div>
              </div>

              {/* Features */}
              <div className="px-5 pt-4 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <AnimatedLock />
                  <span className="text-xs font-bold tracking-wider uppercase text-white/50">What's Included</span>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3.5">
                  <ul className="space-y-2.5">
                    {(showAllFeatures ? plan.features : plan.features.slice(0, 5)).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[14px]">
                        <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "hsla(217,91%,60%,0.15)", border: "1px solid hsla(217,91%,60%,0.3)" }}>
                          <Check className="w-2.5 h-2.5" style={{ color: "hsl(217,91%,60%)" }} />
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.features.length > 5 && (
                  <button onClick={() => setShowAllFeatures(!showAllFeatures)} className="mt-3 inline-flex items-center gap-1 text-sm font-medium transition-colors" style={{ color: "hsl(217,91%,60%)" }}>
                    {showAllFeatures ? <>View less <ChevronUp className="w-4 h-4" /></> : <>View more <ChevronDown className="w-4 h-4" /></>}
                  </button>
                )}
                <div className="mt-4 pt-3 text-xs text-white/30 border-t border-white/[0.08]">{plan.bottomFeature}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="py-4 text-center">
          <p className="text-xs text-white/30">14-day free trial. Cancel anytime.</p>
        </div>
      </div>

      <style>{`
        @keyframes upgradeBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes upgradeCardIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UpgradeModal;
