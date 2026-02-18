import { useState, useCallback, useRef, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";
import {
  toTitleCase,
  capitalizeFirst,
  formatPhone,
  validateShopName,
  validateFirstName,
  validatePhone,
  validateLocation,
} from "@/lib/onboarding-validation";
import { MapPin, Loader2 } from "lucide-react";
import { fbqEvent, generateEventId } from "@/lib/pixel";
import { sendCapiEvent } from "@/lib/capiEvent";

const SERVICES = [
  "Full Detail", "Interior Only", "Exterior Only", "Paint Correction",
  "Ceramic Coating", "PPF (Paint Protection Film)", "Window Tint",
  "Mobile Detailing", "Fleet / Commercial",
];
const BUSINESS_TYPES = ["Shop Location", "Mobile Only", "Both"];
const TOTAL_STEPS = 6;

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
const blurHandlerStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.12)";
  e.currentTarget.style.boxShadow = "none";
};

/* ── Location autocomplete via Nominatim ── */
interface NomSuggestion { display_name: string; place_id: number; address?: Record<string, string> }

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Validation
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Location autocomplete
  const [locSuggestions, setLocSuggestions] = useState<NomSuggestion[]>([]);
  const [locDropdown, setLocDropdown] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locContainerRef = useRef<HTMLDivElement>(null);

  // Close location dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locContainerRef.current && !locContainerRef.current.contains(e.target as Node))
        setLocDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Clear error when step changes
  useEffect(() => { setError(null); }, [step]);

  // ── Validation per step ──
  const getStepError = useCallback((): string | null => {
    switch (step) {
      case 1: return validateShopName(shopName);
      case 2: return validateFirstName(firstName);
      case 3: return validatePhone(phone);
      case 4: return validateLocation(location);
      case 5: return services.length === 0 ? "Select at least one service you offer" : null;
      case 6: return businessType.length === 0 ? "Select one option" : null;
      default: return null;
    }
  }, [step, shopName, firstName, phone, location, services, businessType]);

  const canContinue = useCallback(() => getStepError() === null, [getStepError]);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 350);
  };

  // ── Location search via Nominatim ──
  const fetchLocSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setLocSuggestions([]); return; }
    try {
      const params = new URLSearchParams({
        q, format: "json", addressdetails: "1", limit: "6", countrycodes: "us",
        featuretype: "city",
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { "Accept-Language": "en" },
      });
      const data: any[] = await res.json();
      const mapped = data.map((item) => {
        const city = item.address?.city || item.address?.town || item.address?.village || item.display_name.split(",")[0];
        const state = item.address?.state || "";
        const abbr = state.length > 2 ? "" : state; // Use short state if available
        return { display_name: abbr ? `${city}, ${abbr}` : city, place_id: item.place_id, address: item.address };
      });
      // Deduplicate
      const seen = new Set<string>();
      setLocSuggestions(mapped.filter((s) => { if (seen.has(s.display_name)) return false; seen.add(s.display_name); return true; }));
    } catch { setLocSuggestions([]); }
  }, []);

  const handleLocInput = (val: string) => {
    setLocation(val);
    setLocDropdown(true);
    setGeoError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchLocSuggestions(val), 300);
  };

  const selectLocSuggestion = (s: NomSuggestion) => {
    setLocation(s.display_name);
    setLocDropdown(false);
    setLocSuggestions([]);
    setError(null);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Couldn't detect location — type your city above");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const state = data.address?.state || "";
          const short = state.length <= 2 ? state : "";
          setLocation(short ? `${city}, ${short}` : city);
          setError(null);
        } catch {
          setGeoError("Couldn't detect location — type your city above");
        }
        setGeoLoading(false);
      },
      () => {
        setGeoError("Couldn't detect location — type your city above");
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  };

  // ── Blur handlers per step ──
  const handleBlurStep1 = () => {
    setShopName((v) => toTitleCase(v.trim()));
    const err = validateShopName(shopName);
    if (err) setError(err);
  };
  const handleBlurStep2 = () => {
    setFirstName((v) => capitalizeFirst(v.trim()));
    const err = validateFirstName(firstName);
    if (err) setError(err);
  };
  const handleBlurStep3 = () => {
    const err = validatePhone(phone);
    if (err) setError(err);
  };
  const handleBlurStep4 = () => {
    setLocation((v) => toTitleCase(v.trim()));
    const err = validateLocation(location);
    if (err) setError(err);
  };

  // ── Toggle service ──
  const toggleService = (s: string) => {
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setError(null);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({
        business_name: shopName.trim(),
        phone: phone.trim(),
        tagline: services.join(", "),
        address: location.trim(),
        onboarding_complete: true,
      })
      .eq("user_id", user.id);

    if (dbErr) {
      toast({ title: "Error saving", description: dbErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    // Event 5: SubmitApplication — Onboarding Completed
    const submitEventId = generateEventId();
    fbqEvent('trackCustom', 'SubmitApplication', {
      shop_name: shopName,
      city: location,
      services: services.join(','),
      business_type: businessType,
      num_services: services.length,
    }, submitEventId);
    sendCapiEvent({
      eventName: 'SubmitApplication',
      eventId: submitEventId,
      userData: {
        email: user.email || undefined,
        firstName,
        phone,
      },
      customData: { shop_name: shopName, city: location },
    });
    localStorage.setItem("leadData", JSON.stringify({
      businessName: shopName.trim(),
      ownerFirstName: firstName.trim(),
      city: location.trim(),
      services,
      businessType: businessType === "Shop Location" ? "shop" : businessType === "Mobile Only" ? "mobile" : "both",
    }));
    navigate("/generating");
  };

  // ── Continue ──
  const handleContinue = () => {
    const err = getStepError();
    if (err) {
      setError(err);
      triggerShake();
      return;
    }
    setError(null);

    // Event 3: Onboarding step events with CAPI
    const stepEventMap: Record<number, { name: string; customData?: Record<string, unknown>; userData?: { firstName?: string; phone?: string } }> = {
      1: { name: 'OnboardingStep1_ShopName', customData: { shop_name: shopName } },
      2: { name: 'OnboardingStep2_Name', userData: { firstName } },
      3: { name: 'OnboardingStep3_Phone', userData: { firstName, phone } },
      4: { name: 'OnboardingStep4_Location', customData: { city: location } },
      5: { name: 'OnboardingStep5_Services', customData: { services: services.join(','), num_services: services.length } },
    };
    const stepEvent = stepEventMap[step];
    if (stepEvent) {
      const eventId = generateEventId();
      fbqEvent('trackCustom', stepEvent.name, stepEvent.customData || {}, eventId);
      sendCapiEvent({
        eventName: stepEvent.name,
        eventId,
        userData: stepEvent.userData,
        customData: stepEvent.customData,
      });
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      // Mobile: scroll card to top
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } else {
      handleSubmit();
    }
  };

  // ── Enter key ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleContinue(); }
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const errorEl = error && (
    <p className="error-fade-in" style={{ color: "hsl(0,85%,60%)", fontSize: 13, marginTop: 6 }}>
      {error}
    </p>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <SEOHead title="Onboarding" noIndex />
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      <FadeIn key={step}>
        <div
          ref={cardRef}
          className="relative z-10 w-full"
          style={{
            maxWidth: 480,
            background: "hsla(215,50%,10%,0.85)",
            border: "1px solid hsla(0,0%,100%,0.1)",
            borderRadius: 16,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: 40,
          }}
          onKeyDown={handleKeyDown}
        >
          {/* Progress bar */}
          <div className="w-full mb-6" style={{ height: 4, borderRadius: 2, background: "hsla(0,0%,100%,0.08)" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "hsl(217,91%,60%)", width: `${progressPercent}%`, transition: "width 0.3s ease" }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <img src={darkerLogo} alt="Darker" className="h-8" />
            <span style={{ color: "hsla(0,0%,100%,0.4)", fontSize: 12 }}>Step {step} of {TOTAL_STEPS}</span>
          </div>

          {/* ═══ STEP 1 — Shop Name ═══ */}
          {step === 1 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>What's your shop called?</h2>
              <input
                ref={inputRef}
                type="text"
                value={shopName}
                onChange={(e) => { setShopName(toTitleCase(e.target.value)); setError(null); }}
                onBlur={(e) => { blurHandlerStyle(e); handleBlurStep1(); }}
                onFocus={focusHandler}
                placeholder="e.g. Elite Auto Detailing"
                maxLength={60}
                autoFocus
                autoComplete="organization"
                className={`h-12 ${shaking ? "shake-input" : ""}`}
                style={inputBase}
              />
              {errorEl}
            </div>
          )}

          {/* ═══ STEP 2 — First Name ═══ */}
          {step === 2 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>What's your first name?</h2>
              <input
                ref={inputRef}
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError(null); }}
                onBlur={(e) => { blurHandlerStyle(e); handleBlurStep2(); }}
                onFocus={focusHandler}
                placeholder="First name"
                maxLength={40}
                autoFocus
                autoComplete="given-name"
                className={`h-12 ${shaking ? "shake-input" : ""}`}
                style={inputBase}
              />
              {errorEl}
            </div>
          )}

          {/* ═══ STEP 3 — Phone ═══ */}
          {step === 3 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>Best phone number for your shop?</h2>
              <input
                ref={inputRef}
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(null); }}
                onBlur={(e) => { blurHandlerStyle(e); handleBlurStep3(); }}
                onFocus={focusHandler}
                placeholder="(555) 000-0000"
                autoFocus
                autoComplete="tel"
                className={`h-12 ${shaking ? "shake-input" : ""}`}
                style={inputBase}
              />
              {errorEl}
            </div>
          )}

          {/* ═══ STEP 4 — Location ═══ */}
          {step === 4 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>What city or area do you serve?</h2>
              {/* TODO: add Google Places API key for enhanced autocomplete */}
              <div ref={locContainerRef} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={location}
                  onChange={(e) => { handleLocInput(e.target.value); setError(null); }}
                  onBlur={(e) => { blurHandlerStyle(e); handleBlurStep4(); }}
                  onFocus={(e) => { focusHandler(e); if (locSuggestions.length) setLocDropdown(true); }}
                  placeholder="e.g. Miami, FL"
                  maxLength={100}
                  autoFocus
                  autoComplete="address-level2"
                  className={`h-12 ${shaking ? "shake-input" : ""}`}
                  style={inputBase}
                />
                {/* Dropdown */}
                {locDropdown && locSuggestions.length > 0 && (
                  <div
                    className="absolute z-50 top-full mt-1 w-full max-h-48 overflow-y-auto"
                    style={{ background: "hsl(215,50%,12%)", border: "1px solid hsla(0,0%,100%,0.1)", borderRadius: 8 }}
                  >
                    {locSuggestions.map((s) => (
                      <button
                        key={s.place_id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectLocSuggestion(s)}
                        className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                        style={{ background: "transparent" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "hsla(217,91%,60%,0.12)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                        <span className="truncate">{s.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Use my location button */}
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={geoLoading}
                className="mt-3 flex items-center gap-2 text-sm font-medium transition-all"
                style={{
                  color: "hsl(217,91%,60%)",
                  border: "1px solid hsla(217,91%,60%,0.3)",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 13,
                  background: "transparent",
                  opacity: geoLoading ? 0.6 : 1,
                }}
              >
                {geoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                Use my location →
              </button>
              {geoError && (
                <p className="error-fade-in" style={{ color: "hsla(0,0%,100%,0.5)", fontSize: 13, marginTop: 6 }}>
                  {geoError}
                </p>
              )}
              {errorEl}
            </div>
          )}

          {/* ═══ STEP 5 — Services ═══ */}
          {step === 5 && (
            <div>
              <h2 className="text-white font-semibold mb-4" style={{ fontSize: 20 }}>Which services do you offer?</h2>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const selected = services.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      className="px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px]"
                      style={{
                        border: selected ? "1px solid hsl(217,91%,60%)" : "1px solid hsla(0,0%,100%,0.15)",
                        background: selected ? "hsla(217,91%,60%,0.15)" : "transparent",
                        color: selected ? "white" : "hsla(0,0%,100%,0.6)",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {errorEl}
            </div>
          )}

          {/* ═══ STEP 6 — Business Type ═══ */}
          {step === 6 && (
            <div>
              <h2 className="text-white font-semibold mb-4" style={{ fontSize: 20 }}>How do you operate?</h2>
              <div className="flex flex-wrap gap-3">
                {BUSINESS_TYPES.map((t) => {
                  const selected = businessType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setBusinessType(t); setError(null); }}
                      className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[48px]"
                      style={{
                        border: selected ? "1px solid hsl(217,91%,60%)" : "1px solid hsla(0,0%,100%,0.15)",
                        background: selected ? "hsla(217,91%,60%,0.15)" : "transparent",
                        color: selected ? "white" : "hsla(0,0%,100%,0.6)",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              {errorEl}
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={submitting}
            className="w-full font-semibold transition-all duration-200 disabled:opacity-50 mt-8"
            style={{
              height: 48,
              borderRadius: 10,
              background: canContinue()
                ? "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)"
                : "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
              color: "white",
              fontSize: 15,
              opacity: canContinue() && !submitting ? 1 : 0.5,
              cursor: canContinue() && !submitting ? "pointer" : "not-allowed",
            }}
            onMouseEnter={(e) => {
              if (canContinue() && !submitting) {
                e.currentTarget.style.filter = "brightness(1.08)";
                e.currentTarget.style.boxShadow = "0 4px 16px hsla(217,91%,60%,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {submitting ? "Saving..." : step < TOTAL_STEPS ? "Continue →" : "Build My Site →"}
          </button>

          {/* Back link */}
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="w-full text-center mt-4 text-sm font-medium transition-colors"
              style={{ color: "hsla(0,0%,100%,0.4)" }}
            >
              ← Back
            </button>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default Onboarding;
