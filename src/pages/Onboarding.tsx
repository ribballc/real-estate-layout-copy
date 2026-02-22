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
  validateLocation,
} from "@/lib/onboarding-validation";
import { Loader2, Check, Store, Scissors, Target, MapPin, X } from "lucide-react";
import { trackEvent, generateEventId } from "@/lib/tracking";

/* ── Service options (8 total) ── */
const SERVICES = [
  { name: "Auto Detailing", benefit: "Books 3x more jobs with online scheduling" },
  { name: "Ceramic Coating", benefit: "High-ticket booking flows included" },
  { name: "PPF", benefit: "Deposit collection built in" },
  { name: "Paint Correction", benefit: "Showcase before & after galleries" },
  { name: "Window Tint", benefit: "Quick-quote calculator included" },
  { name: "Interior Only", benefit: "Upsell add-ons at checkout automatically" },
  { name: "Vinyl Wrap", benefit: "Package builder for quick quotes" },
  { name: "Mobile Detailing", benefit: "Route & schedule management" },
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
const SERVICE_AREAS_MAX = 3;

const STEP_META = [
  { icon: Store, label: "Your Shop" },
  { icon: Scissors, label: "Services" },
  { icon: Target, label: "Goals" },
];

const ONBOARDING_IMAGES = [
  "/onboarding/onboarding-1.png",
  "/onboarding/onboarding-2.png",
  "/onboarding/onboarding-3.png",
];

const inputBase: React.CSSProperties = {
  background: "hsla(0,0%,100%,0.06)",
  border: "1px solid hsla(0,0%,100%,0.12)",
  borderRadius: 10,
  color: "white",
  padding: "14px 16px",
  outline: "none",
  width: "100%",
  fontSize: 16,
  minHeight: 48,
  WebkitAppearance: "none",
};

const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "hsl(217,91%,60%)";
  e.currentTarget.style.boxShadow = "0 0 0 3px hsla(217,91%,60%,0.2)";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.12)";
  e.currentTarget.style.boxShadow = "none";
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState("");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("business_name, phone, service_areas")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.business_name) setShopName(data.business_name);
        if (data?.phone) setPhone(formatPhone(data.phone));
        if (Array.isArray((data as any)?.service_areas) && (data as any).service_areas.length) setServiceAreas((data as any).service_areas.slice(0, SERVICE_AREAS_MAX));
      });
  }, [user]);

  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => { setError(null); }, [step]);

  // Preload current + next step image for instant step change
  useEffect(() => {
    const nextStep = step < TOTAL_STEPS ? step : TOTAL_STEPS - 1;
    const src = ONBOARDING_IMAGES[nextStep];
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }, [step]);

  // Preload all step images on mount for smooth step changes and good load performance
  useEffect(() => {
    ONBOARDING_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getStepError = useCallback((): string | null => {
    switch (step) {
      case 1: {
        const nameErr = validateShopName(shopName);
        if (nameErr) return nameErr;
        if (serviceAreas.length === 0) return "Add at least one service area (city or region you serve)";
        return null;
      }
      case 2:
        return selectedServices.length === 0 ? "Select at least one service to continue" : null;
      case 3: return goals.length === 0 ? "Select at least one to continue" : null;
      default: return null;
    }
  }, [step, shopName, serviceAreas, selectedServices, goals]);

  const canContinue = useCallback(() => getStepError() === null, [getStepError]);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 350);
  };

  const toggleGoal = (g: string) => {
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
    setError(null);
  };

  const toggleService = (s: string) => {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
    setError(null);
  };

  const addServiceArea = () => {
    const trimmed = locationInput.trim().slice(0, 80);
    if (!trimmed) return;
    const err = validateLocation(trimmed);
    if (err) { setError(err); return; }
    if (serviceAreas.includes(trimmed)) return;
    if (serviceAreas.length >= SERVICE_AREAS_MAX) return;
    setServiceAreas((prev) => [...prev, trimmed]);
    setLocationInput("");
    setError(null);
  };

  const removeServiceArea = (area: string) => setServiceAreas((prev) => prev.filter((a) => a !== area));

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    const allServices = [...selectedServices];

    const { error: dbErr } = await supabase
      .from("profiles")
      .update({
        business_name: shopName.trim(),
        phone: phone.trim(),
        tagline: null,
        service_areas: serviceAreas.length ? serviceAreas : null,
        onboarding_complete: true,
      })
      .eq("user_id", user.id);

    if (dbErr) {
      toast({ title: "Error saving", description: dbErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const serviceRows = allServices.map((name, i) => ({
      user_id: user.id,
      title: name,
      description: "",
      price: null,
      popular: i === 1,
      sort_order: i,
    }));
    const { error: servicesErr } = await supabase
      .from("services")
      .upsert(serviceRows, { onConflict: "user_id,title" });

    if (servicesErr) {
      toast({ title: "Error saving services", description: servicesErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    trackEvent({
      eventName: "SubmitApplication",
      type: "trackCustom",
      eventId: generateEventId(),
      userData: { email: user.email || undefined, phone },
      customData: {
        shop_name: shopName,
        services: allServices.join(","),
        num_services: allServices.length,
        goals: goals.join(","),
        service_areas: serviceAreas.join(","),
      },
    });
    localStorage.setItem(
      "leadData",
      JSON.stringify({
        businessName: shopName.trim(),
        services: allServices,
        service_areas: serviceAreas,
      })
    );

    setExiting(true);
    setTimeout(() => navigate("/generating"), 450);
  };

  const handleContinue = () => {
    const err = getStepError();
    if (err) { setError(err); triggerShake(); return; }
    setError(null);

    const stepEventMap: Record<number, { name: string; customData?: Record<string, unknown> }> = {
      1: { name: "OnboardingStep1_ShopServiceArea", customData: { shop_name: shopName, service_areas: serviceAreas.join(",") } },
      2: { name: "OnboardingStep2_Services", customData: { services: selectedServices.join(","), num_services: selectedServices.length } },
    };
    const ev = stepEventMap[step];
    if (ev) trackEvent({ eventName: ev.name, type: "trackCustom", eventId: generateEventId(), customData: ev.customData });

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

  // Jobber-style progress: thin bar fill (step 1 = 33%, 2 = 66%, 3 = 100%)
  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row">
      <SEOHead title="Set Up Your Site" noIndex />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      {/* LEFT: Form column — no box on desktop, box only on mobile */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 order-2 md:order-1 md:min-w-0 md:w-1/2">
        <div
          ref={cardRef}
          className="w-full max-h-[85dvh] sm:max-h-[90dvh] overflow-y-auto overflow-x-hidden md:max-w-[520px] rounded-xl md:rounded-none border border-[hsla(0,0%,100%,0.08)] md:border-0 bg-[hsla(215,50%,10%,0.92)] md:bg-transparent shadow-lg md:shadow-none backdrop-blur-xl md:backdrop-blur-none"
          style={{
            padding: "clamp(20px, 5vw, 28px)",
            paddingBottom: "env(safe-area-inset-bottom, 20px)",
            transform: exiting ? "scale(0.98)" : "scale(1)",
            opacity: exiting ? 0 : 1,
            transition: "transform 0.35s ease, opacity 0.35s ease",
          }}
          onKeyDown={handleKeyDown}
        >
          {/* Top: logo larger and off top-left on desktop; time centered above progress bar */}
          <div className="mb-3 md:mb-4 flex justify-start">
            <img
              src={darkerLogo}
              alt="Darker"
              className="h-6 md:h-9 w-auto shrink-0"
              width={112}
              height={28}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="text-center mb-1">
            <span style={{ color: "hsla(0,0%,100%,0.5)", fontSize: "clamp(11px, 2.5vw, 12px)" }}>
              Takes about 60 seconds
            </span>
          </div>

          {/* Progress bar — thin track, green fill */}
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "hsla(0,0%,100%,0.12)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-400 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: "hsl(142, 76%, 45%)",
              }}
            />
          </div>

          {/* Step labels — tight to bar: Your Shop | Services | Goals */}
          <div className="flex items-center justify-between mt-1 mb-5 px-0.5">
            {STEP_META.map((meta, i) => {
              const stepNum = i + 1;
              const completed = step > stepNum;
              const current = step === stepNum;
              return (
                <span
                  key={stepNum}
                  className="text-xs font-medium transition-colors"
                  style={{
                    color: current || completed ? "white" : "hsla(0,0%,100%,0.4)",
                  }}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: "clamp(18px, 4.5vw, 22px)" }}>Business Name</h2>
            <p className="mb-4" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: "clamp(13px, 3vw, 14px)" }}>
              We'll use this to build your website.
            </p>

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
              className={`min-h-[48px] sm:h-12 ${shaking ? "shake-input" : ""}`}
              style={inputBase}
            />

            <h2 className="text-white font-bold mt-5 mb-1" style={{ fontSize: "clamp(18px, 4.5vw, 22px)" }}>Service Area</h2>
            <p className="mb-3" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: "clamp(13px, 3vw, 14px)" }}>
              Add the cities or regions you serve (1–3). e.g. Los Angeles, CA
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => { setLocationInput(e.target.value); setError(null); }}
              onFocus={focusHandler}
              onBlur={blurStyle}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addServiceArea())}
              placeholder="e.g. Dallas, TX"
              maxLength={80}
              autoComplete="address-level2"
              className={`flex-1 min-h-[48px] sm:h-12 ${shaking ? "shake-input" : ""}`}
              style={inputBase}
            />
              <button
                type="button"
                onClick={addServiceArea}
                disabled={serviceAreas.length >= SERVICE_AREAS_MAX || !locationInput.trim()}
                className="shrink-0 min-h-[48px] px-5 rounded-lg font-medium transition-opacity disabled:opacity-40 touch-manipulation"
                style={{ background: "hsl(217,91%,60%)", color: "white" }}
              >
                Add
              </button>
            </div>
            {serviceAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-sm"
                    style={{ background: "hsla(217,91%,60%,0.15)", border: "1px solid hsla(217,91%,60%,0.3)", color: "white" }}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{area}</span>
                    <button type="button" onClick={() => removeServiceArea(area)} className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -m-1 rounded hover:bg-white/20 touch-manipulation" aria-label="Remove">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {serviceAreas.length < SERVICE_AREAS_MAX && (
              <p style={{ color: "hsla(0,0%,100%,0.35)", fontSize: 12, marginTop: 6 }}>
                {SERVICE_AREAS_MAX - serviceAreas.length} more can be added
              </p>
            )}
            {errorEl}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: "clamp(18px, 4.5vw, 22px)" }}>What services do you offer?</h2>
            <p className="mb-4 sm:mb-5" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: "clamp(13px, 3vw, 14px)" }}>
              Select all that apply — we'll add them to your site.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
              {SERVICES.map((svc) => {
                const selected = selectedServices.includes(svc.name);
                return (
                  <button
                    key={svc.name}
                    type="button"
                    onClick={() => toggleService(svc.name)}
                    className="relative flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-left min-h-[48px] sm:min-h-[52px] touch-manipulation border transition-colors duration-150"
                    style={{
                      borderColor: selected ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.1)",
                      background: selected ? "hsla(217,91%,60%,0.1)" : "hsla(0,0%,100%,0.03)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-white font-medium text-sm block">{svc.name}</span>
                      <span className="block truncate" style={{ color: "hsla(0,0%,100%,0.45)", fontSize: 12 }}>{svc.benefit}</span>
                    </div>
                    {selected && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
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

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: "clamp(18px, 4.5vw, 22px)" }}>What's costing you money right now?</h2>
            <p className="mb-4 sm:mb-5" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: "clamp(13px, 3vw, 14px)" }}>
              Select all that apply — we'll build solutions into your site.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
              {PAIN_POINTS.map((p) => {
                const selected = goals.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleGoal(p)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium min-h-[48px] touch-manipulation border transition-colors duration-150"
                    style={{
                      borderColor: selected ? "hsl(217,91%,60%)" : "hsla(0,0%,100%,0.1)",
                      background: selected ? "hsla(217,91%,60%,0.1)" : "hsla(0,0%,100%,0.03)",
                      color: selected ? "white" : "hsla(0,0%,100%,0.6)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0"
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

        {/* Full-bleed CTA: button spans full card width, big tap target on mobile */}
        <div
          className="mt-6 sm:mt-7 rounded-b-xl overflow-hidden md:rounded-none"
          style={{
            marginLeft: "clamp(-28px, -5vw, -20px)",
            marginRight: "clamp(-28px, -5vw, -20px)",
          }}
        >
          <button
            onClick={handleContinue}
            disabled={submitting || exiting}
            className="w-full font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation rounded-b-xl md:rounded-xl"
            style={{
              minHeight: 56,
              paddingLeft: "clamp(20px, 5vw, 28px)",
              paddingRight: "clamp(20px, 5vw, 28px)",
              background: canContinue()
                ? "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)"
                : "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,80%,55%) 100%)",
              color: "white",
              fontSize: "clamp(15px, 3.5vw, 16px)",
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
            ) : step === 3 ? (
              "Start Building"
            ) : (
              "Next"
            )}
          </button>
        </div>

        {!canContinue() && step === 3 && (
          <p className="text-center mt-2" style={{ color: "hsla(0,0%,100%,0.3)", fontSize: 12 }}>
            Select at least one to continue
          </p>
        )}

        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="w-full text-center mt-3 py-3 min-h-[48px] text-sm font-medium transition-colors touch-manipulation rounded-lg"
            style={{ color: "hsla(0,0%,100%,0.5)" }}
          >
            ← Back
          </button>
        )}
        </div>
      </div>

      {/* RIGHT: Photo column — desktop only, half-and-half split */}
      <div className="hidden md:flex md:w-1/2 relative z-10 items-stretch order-1 md:order-2 overflow-hidden bg-[hsl(215,50%,8%)]">
        <img
          src={ONBOARDING_IMAGES[step - 1]}
          alt=""
          aria-hidden
          className="w-full h-[100dvh] object-cover object-center"
          width={800}
          height={900}
          loading="eager"
          decoding="async"
          fetchPriority={step === 1 ? "high" : undefined}
        />
      </div>
    </div>
  );
};

export default Onboarding;
