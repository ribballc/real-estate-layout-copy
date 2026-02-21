import { useState, useCallback, useRef, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import darkerLogo from "@/assets/darker-logo.png";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";
import {
  toTitleCase,
  formatPhone,
  validateShopName,
  validatePhone,
} from "@/lib/onboarding-validation";
import { Loader2, Check, Sparkles, Store, Scissors, Target } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

/* ── Service data with benefit copy ── */
const SERVICES = [
  { name: "Auto Detailing", benefit: "Books 3x more jobs with online scheduling" },
  { name: "Interior Only", benefit: "Upsell add-ons at checkout automatically" },
  { name: "Exterior Only", benefit: "Package builder for quick quotes" },
  { name: "Paint Correction", benefit: "Showcase before & after galleries" },
  { name: "Ceramic Coating", benefit: "High-ticket booking flows included" },
  { name: "PPF (Paint Protection)", benefit: "Deposit collection built in" },
  { name: "Window Tint", benefit: "Quick-quote calculator included" },
  { name: "Mobile Detailing", benefit: "Route & schedule management" },
  { name: "Fleet / Commercial", benefit: "Multi-vehicle booking support" },
];

const PAIN_POINTS = [
  "No-shows & last-minute cancels",
  "Missing calls while I'm working",
  "No professional website",
  "Losing jobs to competitors online",
  "Too much texting back and forth",
  "Can't collect deposits upfront",
];

const TOTAL_STEPS = 3;

const STEP_META = [
  { icon: Store, label: "Your Shop" },
  { icon: Scissors, label: "Services" },
  { icon: Target, label: "Goals" },
];

const inputBase: React.CSSProperties = {
  background: "hsla(0,0%,100%,0.06)",
  border: "1px solid hsla(0,0%,100%,0.12)",
  borderRadius: 10,
  color: "white",
  padding: "12px 16px",
  outline: "none",
  width: "100%",
  fontSize: 16,
};

const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "hsl(217,91%,60%)";
  e.currentTarget.style.boxShadow = "0 0 0 3px hsla(217,91%,60%,0.2)";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.12)";
  e.currentTarget.style.boxShadow = "none";
};

/* ── Slug generation ── */
const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 30);

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Slug preview
  const [showSlug, setShowSlug] = useState(false);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (slugTimer.current) clearTimeout(slugTimer.current);
    if (shopName.trim().length >= 3) {
      slugTimer.current = setTimeout(() => setShowSlug(true), 300);
    } else {
      setShowSlug(false);
    }
    return () => { if (slugTimer.current) clearTimeout(slugTimer.current); };
  }, [shopName]);

  // Pre-populate from existing profile on return visits
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("business_name, phone")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.business_name) setShopName(data.business_name);
        if (data?.phone) setPhone(formatPhone(data.phone));
      });
  }, [user]);

  // Validation
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => { setError(null); }, [step]);

  const getStepError = useCallback((): string | null => {
    switch (step) {
      case 1: {
        const nameErr = validateShopName(shopName);
        if (nameErr) return nameErr;
        return validatePhone(phone);
      }
      case 2: return selectedServices.length === 0 ? "Select at least one service to continue" : null;
      case 3: return goals.length === 0 ? "Select at least one to continue" : null;
      default: return null;
    }
  }, [step, shopName, phone, selectedServices, goals]);

  const canContinue = useCallback(() => getStepError() === null, [getStepError]);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 350);
  };

  // ── Toggle helpers ──
  const toggleGoal = (g: string) => {
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
    setError(null);
  };

  const toggleService = (s: string) => {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
    setError(null);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    const allServices = [...selectedServices];

    const { error: dbErr } = await supabase
      .from("profiles")
      .update({
        business_name: shopName.trim(),
        phone: phone.trim(),
        tagline: allServices.join(", "),
        onboarding_complete: true,
      })
      .eq("user_id", user.id);

    if (dbErr) {
      toast({ title: "Error saving", description: dbErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    trackEvent({
      eventName: "SubmitApplication",
      type: "trackCustom",
      userData: { email: user.email || undefined, phone },
      customData: {
        shop_name: shopName,
        services: allServices.join(","),
        num_services: allServices.length,
        goals: goals.join(","),
      },
    });
    localStorage.setItem(
      "leadData",
      JSON.stringify({
        businessName: shopName.trim(),
        services: allServices,
      })
    );

    // Exit transition
    setExiting(true);
    setTimeout(() => navigate("/generating"), 450);
  };

  // ── Continue ──
  const handleContinue = () => {
    const err = getStepError();
    if (err) { setError(err); triggerShake(); return; }
    setError(null);

    const stepEventMap: Record<number, { name: string; customData?: Record<string, unknown> }> = {
      1: { name: "OnboardingStep1_ShopPhone", customData: { shop_name: shopName } },
      2: { name: "OnboardingStep2_Services", customData: { services: selectedServices.join(","), num_services: selectedServices.length } },
    };
    const ev = stepEventMap[step];
    if (ev) trackEvent({ eventName: ev.name, type: "trackCustom", customData: ev.customData });

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } else {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleContinue(); }
  };

  const errorEl = error && (
    <p className="error-fade-in" style={{ color: "hsl(0,85%,60%)", fontSize: 13, marginTop: 6 }}>
      {error}
    </p>
  );

  const slug = toSlug(shopName);

  const CTA_TEXT: Record<number, string> = {
    1: "Build My Site →",
    2: "Add These Services →",
    3: "Build My Website Now →",
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <SEOHead title="Set Up Your Site" noIndex />
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      <div
        ref={cardRef}
        className="relative z-10 w-full"
        style={{
          maxWidth: 520,
          background: "hsla(215,50%,10%,0.85)",
          border: "1px solid hsla(0,0%,100%,0.1)",
          borderRadius: 16,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "36px 36px 32px",
          transform: exiting ? "scale(0.95)" : "scale(1)",
          opacity: exiting ? 0 : 1,
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-5">
          <img src={darkerLogo} alt="Darker" className="h-7" />
          <span style={{ color: "hsla(0,0%,100%,0.45)", fontSize: 12 }}>Takes about 60 seconds</span>
        </div>

        {/* ── Progress indicator: labeled dots ── */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEP_META.map((meta, i) => {
            const stepNum = i + 1;
            const completed = step > stepNum;
            const current = step === stepNum;
            const Icon = meta.icon;
            return (
              <div key={stepNum} className="flex flex-col items-center gap-1.5 flex-1 relative">
                {/* Connector line */}
                {i < STEP_META.length - 1 && (
                  <div
                    className="absolute top-[14px] left-[calc(50%+14px)] h-[2px]"
                    style={{
                      width: "calc(100% - 28px)",
                      background: completed ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.1)",
                      transition: "background 0.3s ease",
                    }}
                  />
                )}
                {/* Dot/icon */}
                <div
                  className="relative z-10 flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: 28,
                    height: 28,
                    background: completed
                      ? "hsl(217,91%,60%)"
                      : current
                        ? "hsla(217,91%,60%,0.2)"
                        : "hsla(0,0%,100%,0.06)",
                    border: current ? "2px solid hsl(217,91%,60%)" : "2px solid transparent",
                    boxShadow: current ? "0 0 12px hsla(217,91%,60%,0.4)" : "none",
                  }}
                >
                  {completed ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Icon
                      className="w-3.5 h-3.5 transition-colors"
                      style={{ color: current ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.3)" }}
                    />
                  )}
                </div>
                <span
                  className="text-xs font-medium transition-colors"
                  style={{ color: current || completed ? "white" : "hsla(0,0%,100%,0.35)" }}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ═══ STEP 1 — Shop Name + Phone ═══ */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: 22 }}>What's your shop called?</h2>
            <p className="mb-5" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 14 }}>
              We'll use this to build your website right now.
            </p>

            {/* Business name */}
            <input
              type="text"
              value={shopName}
              onChange={(e) => { setShopName(toTitleCase(e.target.value)); setError(null); }}
              onFocus={focusHandler}
              onBlur={(e) => { blurStyle(e); }}
              placeholder="e.g. King's Detail Co."
              maxLength={60}
              autoFocus
              autoComplete="organization"
              className={`h-12 ${shaking ? "shake-input" : ""}`}
              style={inputBase}
            />

            {/* Live slug preview */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: showSlug && slug.length >= 3 ? 52 : 0,
                opacity: showSlug && slug.length >= 3 ? 1 : 0,
                marginTop: showSlug && slug.length >= 3 ? 8 : 0,
              }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                style={{ background: "hsla(217,91%,60%,0.08)", border: "1px solid hsla(217,91%,60%,0.15)" }}
              >
                <span style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 13 }}>Your site will be:</span>
                <span className="font-medium" style={{ color: "hsl(217,91%,60%)", fontSize: 13 }}>
                  ✦ {slug}.darker.digital
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(null); }}
                onFocus={focusHandler}
                onBlur={blurStyle}
                placeholder="(555) 123-4567"
                autoComplete="tel"
                className={`h-12 ${shaking ? "shake-input" : ""}`}
                style={inputBase}
              />
              <p style={{ color: "hsla(0,0%,100%,0.35)", fontSize: 12, marginTop: 6 }}>
                For booking notifications — never shared
              </p>
            </div>
            {errorEl}
          </div>
        )}

        {/* ═══ STEP 2 — Services (multi-select) ═══ */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: 22 }}>What services do you offer?</h2>
            <p className="mb-5" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 14 }}>
              Select all that apply — we'll add them to your site.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {SERVICES.map((svc) => {
                const selected = selectedServices.includes(svc.name);
                return (
                  <button
                    key={svc.name}
                    type="button"
                    onClick={() => toggleService(svc.name)}
                    className="relative flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 min-h-[52px]"
                    style={{
                      border: selected ? "1.5px solid hsl(217,91%,60%)" : "1px solid hsla(0,0%,100%,0.1)",
                      background: selected ? "hsla(217,91%,60%,0.1)" : "hsla(0,0%,100%,0.03)",
                      transform: selected ? "scale(1.01)" : "scale(1)",
                    }}
                  >
                    <div className="flex-1">
                      <span className="text-white font-medium text-sm block">{svc.name}</span>
                      <span style={{ color: "hsla(0,0%,100%,0.45)", fontSize: 12 }}>{svc.benefit}</span>
                    </div>
                    {selected && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "hsl(217,91%,60%)" }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errorEl}
          </div>
        )}

        {/* ═══ STEP 3 — Pain Points / Goals ═══ */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: 22 }}>What's costing you money right now?</h2>
            <p className="mb-5" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 14 }}>
              Select everything that applies — we'll build solutions for each one into your site.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {PAIN_POINTS.map((p) => {
                const selected = goals.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleGoal(p)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 min-h-[48px]"
                    style={{
                      border: selected ? "1.5px solid hsl(217,91%,60%)" : "1px solid hsla(0,0%,100%,0.1)",
                      background: selected ? "hsla(217,91%,60%,0.1)" : "hsla(0,0%,100%,0.03)",
                      color: selected ? "white" : "hsla(0,0%,100%,0.6)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: selected ? "hsl(217,91%,60%)" : "transparent",
                        border: selected ? "none" : "1.5px solid hsla(0,0%,100%,0.2)",
                      }}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Running tally */}
            {goals.length > 0 && (
              <div
                className="mt-4 text-center animate-fade-in"
                style={{ color: "hsl(217,91%,60%)", fontSize: 14, fontWeight: 600 }}
              >
                We'll set up {goals.length} {goals.length === 1 ? "fix" : "fixes"} for you →
              </div>
            )}
            {errorEl}
          </div>
        )}

        {/* ── Continue button ── */}
        <button
          onClick={handleContinue}
          disabled={submitting || exiting}
          className="w-full font-semibold transition-all duration-200 disabled:opacity-50 mt-7 flex items-center justify-center gap-2"
          style={{
            height: 50,
            borderRadius: 12,
            background: canContinue()
              ? "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)"
              : "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
            color: "white",
            fontSize: 15,
            opacity: canContinue() && !submitting ? 1 : 0.4,
            cursor: canContinue() && !submitting ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (canContinue() && !submitting) {
              e.currentTarget.style.filter = "brightness(1.08)";
              e.currentTarget.style.boxShadow = "0 4px 20px hsla(217,91%,60%,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Building {shopName.trim()}'s site...
            </>
          ) : (
            <>
              {step === 3 && goals.length > 0 && <Sparkles className="w-4 h-4" />}
              {step === 2
                ? selectedServices.length > 0
                  ? `Add ${selectedServices.length} Service${selectedServices.length > 1 ? "s" : ""} →`
                  : "Select Services →"
                : CTA_TEXT[step]}
            </>
          )}
        </button>

        {/* Disabled tooltip */}
        {!canContinue() && step === 3 && (
          <p className="text-center mt-2" style={{ color: "hsla(0,0%,100%,0.3)", fontSize: 12 }}>
            Select at least one to continue
          </p>
        )}

        {/* Back link */}
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="w-full text-center mt-3 text-sm font-medium transition-colors"
            style={{ color: "hsla(0,0%,100%,0.4)" }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
