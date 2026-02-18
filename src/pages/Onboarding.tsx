import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/FadeIn";
import darkerLogo from "@/assets/darker-logo.png";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";

// TODO: replace YOUR_PIXEL_ID with your Meta Pixel ID
// Inject Meta Pixel: <script> !function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init','YOUR_PIXEL_ID'); </script>

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const firePixel = (...args: unknown[]) => {
  try {
    window.fbq?.(...args);
  } catch {}
};

const SERVICES = [
  "Full Detail",
  "Interior Only",
  "Exterior Only",
  "Paint Correction",
  "Ceramic Coating",
  "PPF (Paint Protection Film)",
  "Window Tint",
  "Mobile Detailing",
  "Fleet / Commercial",
];

const BUSINESS_TYPES = ["Shop Location", "Mobile Only", "Both"];

const TOTAL_STEPS = 6;

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const inputStyle: React.CSSProperties = {
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

const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "hsla(0,0%,100%,0.12)";
  e.currentTarget.style.boxShadow = "none";
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState("");
  const [yourName, setYourName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canContinue = useCallback(() => {
    switch (step) {
      case 1: return shopName.trim().length > 0;
      case 2: return yourName.trim().length > 0;
      case 3: return phone.replace(/\D/g, "").length >= 7;
      case 4: return location.trim().length > 0;
      case 5: return services.length > 0;
      case 6: return businessType.length > 0;
      default: return false;
    }
  }, [step, shopName, yourName, phone, location, services, businessType]);

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: shopName.trim(),
        phone: phone.trim(),
        tagline: services.join(", "),
        address: location.trim(),
        onboarding_complete: true,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    firePixel("track", "CompleteRegistration");
    localStorage.setItem("leadData", JSON.stringify({ businessName: shopName.trim() }));
    navigate("/generating");
  };

  const handleContinue = () => {
    if (!canContinue()) return;

    // Fire pixel for current step
    const pixelEvents: Record<number, string> = {
      1: "OnboardingStep1_ShopName",
      2: "OnboardingStep2_Name",
      3: "OnboardingStep3_Phone",
      4: "OnboardingStep4_Location",
      5: "OnboardingStep5_Services",
    };

    if (pixelEvents[step]) {
      firePixel("trackCustom", pixelEvents[step]);
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${dashboardPreview})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "hsla(215,50%,10%,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      <FadeIn key={step}>
        <div
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
        >
          {/* Progress bar */}
          <div
            className="w-full mb-6"
            style={{ height: 4, borderRadius: 2, background: "hsla(0,0%,100%,0.08)" }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: "hsl(217,91%,60%)",
                width: `${progressPercent}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Step counter */}
          <div className="flex items-center justify-between mb-6">
            <img src={darkerLogo} alt="Darker" className="h-8" />
            <span style={{ color: "hsla(0,0%,100%,0.4)", fontSize: 12 }}>
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          {/* Step 1 — Shop Name */}
          {step === 1 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>
                What's your shop called?
              </h2>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Elite Auto Detailing"
                maxLength={100}
                autoFocus
                className="h-12"
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          )}

          {/* Step 2 — Your Name */}
          {step === 2 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>
                What's your name?
              </h2>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="First name is fine"
                maxLength={60}
                autoFocus
                className="h-12"
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          )}

          {/* Step 3 — Phone */}
          {step === 3 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>
                Best phone number for your shop?
              </h2>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(555) 000-0000"
                autoFocus
                className="h-12"
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          )}

          {/* Step 4 — Location */}
          {step === 4 && (
            <div>
              <h2 className="text-white font-semibold mb-2" style={{ fontSize: 20 }}>
                What city or area do you serve?
              </h2>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Miami, FL"
                maxLength={100}
                autoFocus
                className="h-12"
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          )}

          {/* Step 5 — Services (multi-select pills) */}
          {step === 5 && (
            <div>
              <h2 className="text-white font-semibold mb-4" style={{ fontSize: 20 }}>
                Which services do you offer?
              </h2>
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
                        border: selected
                          ? "1px solid hsl(217,91%,60%)"
                          : "1px solid hsla(0,0%,100%,0.15)",
                        background: selected ? "hsla(217,91%,60%,0.15)" : "transparent",
                        color: selected ? "white" : "hsla(0,0%,100%,0.6)",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6 — Business Type (single-select pills) */}
          {step === 6 && (
            <div>
              <h2 className="text-white font-semibold mb-4" style={{ fontSize: 20 }}>
                How do you operate?
              </h2>
              <div className="flex flex-wrap gap-3">
                {BUSINESS_TYPES.map((t) => {
                  const selected = businessType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBusinessType(t)}
                      className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 min-h-[48px]"
                      style={{
                        border: selected
                          ? "1px solid hsl(217,91%,60%)"
                          : "1px solid hsla(0,0%,100%,0.15)",
                        background: selected ? "hsla(217,91%,60%,0.15)" : "transparent",
                        color: selected ? "white" : "hsla(0,0%,100%,0.6)",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!canContinue() || submitting}
            className="w-full font-semibold transition-all duration-200 disabled:opacity-50 mt-8"
            style={{
              height: 48,
              borderRadius: 10,
              background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
              color: "white",
              fontSize: 15,
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
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
