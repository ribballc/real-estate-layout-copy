import { useEffect, useState, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";
import { Check } from "lucide-react";

const BUILD_STEPS = [
  "Setting up your domain...",
  "Building your homepage...",
  "Adding your services...",
  "Configuring booking...",
  "Almost ready!",
];

const STEP_DURATION_MS = 1750;
const TOTAL_STEPS_MS = BUILD_STEPS.length * STEP_DURATION_MS;
const MIN_NAV_DELAY_MS = Math.max(TOTAL_STEPS_MS, 3200);
const CELEBRATION_MS = 1400;

const Generating = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("Your shop");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const startRef = useRef(Date.now());
  const aiCalledRef = useRef(false);
  const aiDoneRef = useRef(false);

  // Load lead data and trigger AI copy generation
  useEffect(() => {
    let leadData: Record<string, unknown> = {};
    try {
      leadData = JSON.parse(localStorage.getItem("leadData") || "{}") as Record<string, unknown>;
      const name = leadData.businessName as string | undefined;
      if (name) setBusinessName(name);
    } catch {}

    if (!aiCalledRef.current) {
      aiCalledRef.current = true;
      if (leadData.businessName) {
        generateCopy(leadData).finally(() => { aiDoneRef.current = true; });
      } else {
        aiDoneRef.current = true;
      }
    }
  }, []);

  const generateCopy = async (data: Record<string, unknown>) => {
    try {
      const { error } = await supabase.functions.invoke("generate-website-copy", {
        body: {
          businessName: data.businessName || "",
          ownerFirstName: data.ownerFirstName || "",
          city: data.city || "",
          services: data.services || [],
          businessType: data.businessType || "shop",
        },
      });
      if (error) {
        console.warn("AI copy generation failed, using fallback:", error);
        await saveFallbackCopy(data);
      }
    } catch (e) {
      console.warn("AI copy generation error, using fallback:", e);
      await saveFallbackCopy(data);
    }
  };

  const saveFallbackCopy = async (data: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const services = (data.services as string[]) || [];
      const city = (data.city as string) || "Your Area";
      const name = (data.businessName as string) || "Your shop";
      const ownerFirstName = (data.ownerFirstName as string) || "our team";
      const fallback = {
        user_id: user.id,
        hero_headline: `Professional Auto Detailing in ${city}`,
        hero_subheadline: `${name} delivers premium detailing services. Book your appointment online anytime.`,
        about_paragraph: `${name} is proudly operated by ${ownerFirstName} in ${city}. We specialize in ${services.slice(0, 3).join(", ") || "auto detailing"} with an uncompromising focus on quality. Every vehicle we touch leaves looking its absolute best.`,
        services_descriptions: services.map((s: string) => ({
          service: s,
          description: `Professional ${s.toLowerCase()} service delivering results that speak for themselves.`,
        })),
        seo_meta_description: `${name} — professional auto detailing in ${city}. ${services[0] || "Full detail"}, ${services[1] || "interior"} & more. Book online today.`.slice(0, 155),
        cta_tagline: "Reserve Your Detail Online",
        generated_at: new Date().toISOString(),
      };
      await supabase.from("website_copy").upsert(fallback, { onConflict: "user_id" });
    } catch {}
  };

  // Advance steps every STEP_DURATION_MS; drive progress bar
  useEffect(() => {
    const start = startRef.current;
    const tick = () => {
      const elapsed = Date.now() - start;
      const stepIndex = Math.min(
        Math.floor(elapsed / STEP_DURATION_MS),
        BUILD_STEPS.length - 1
      );
      const withinStep = elapsed % STEP_DURATION_MS;
      const stepPct = Math.min(withinStep / STEP_DURATION_MS, 1);

      setCurrentStep(stepIndex);
      setStepProgress(stepPct);

      const totalProgress = (stepIndex + stepPct) / BUILD_STEPS.length;
      if (totalProgress >= 1) {
        setStepProgress(1);
        setCurrentStep(BUILD_STEPS.length - 1);
      }
    };

    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, []);

  // When steps complete + AI done → show "Your site is live!" then navigate
  useEffect(() => {
    const start = startRef.current;
    const check = () => {
      const elapsed = Date.now() - start;
      const stepsDone = elapsed >= TOTAL_STEPS_MS;
      if (stepsDone && elapsed >= MIN_NAV_DELAY_MS && aiDoneRef.current) {
        setComplete(true);
        setTimeout(() => {
          setNavigating(true);
          setTimeout(() => navigate("/dashboard/website"), 400);
        }, CELEBRATION_MS);
        return true;
      }
      return false;
    };
    const id = setInterval(() => {
      if (check()) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  }, [navigate]);

  const progressPct = Math.min(
    100,
    ((currentStep + stepProgress) / BUILD_STEPS.length) * 100
  );

  const displayName = businessName.trim() || "Your shop";
  const displayNamePossessive = displayName.endsWith("s")
    ? `${displayName}'`
    : `${displayName}'s`;

  return (
    <div
      className="min-h-screen min-h-[100dvh] relative flex items-center justify-center px-5 sm:px-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}
    >
      <SEOHead title="Building Your Site" noIndex />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }} />

      <div
        className="relative z-10 flex flex-col w-full max-w-md"
        style={{
          opacity: navigating ? 0 : 1,
          transform: navigating ? "scale(0.96)" : "scale(1)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* Headline */}
        <h1
          className="text-white font-bold text-center mb-8 sm:mb-10"
          style={{ fontSize: "clamp(20px, 5vw, 26px)" }}
        >
          Building {displayNamePossessive} website...
        </h1>

        {/* Animated steps with checkmarks */}
        <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          {BUILD_STEPS.map((label, i) => {
            const done = i < currentStep || (i === currentStep && complete);
            const active = i === currentStep && !complete;
            return (
              <li
                key={i}
                className="flex items-center gap-3 transition-all duration-300"
                style={{
                  opacity: done || active ? 1 : 0.4,
                }}
              >
                <span
                  className="flex shrink-0 w-6 h-6 rounded-full items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    background: done
                      ? "hsl(142,71%,45%)"
                      : active
                        ? "hsl(217,91%,60%)"
                        : "hsla(0,0%,100%,0.12)",
                    color: "white",
                    boxShadow: active ? "0 0 12px hsla(217,91%,60%,0.4)" : "none",
                  }}
                >
                  {done ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : null}
                </span>
                <span
                  className="font-medium transition-colors duration-300"
                  style={{
                    color: done || active ? "white" : "hsla(0,0%,100%,0.5)",
                    fontSize: "clamp(14px, 3.2vw, 16px)",
                  }}
                >
                  {done ? `✓ ${label}` : label}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Completion message */}
        {complete && (
          <p
            className="text-center font-semibold mb-6 animate-in fade-in duration-300"
            style={{
              color: "hsl(142,71%,52%)",
              fontSize: "clamp(16px, 4vw, 18px)",
            }}
          >
            Your site is live!
          </p>
        )}

        {/* Progress bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: "hsla(0,0%,100%,0.1)" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${complete ? 100 : progressPct}%`,
              background: complete
                ? "hsl(142,71%,45%)"
                : "linear-gradient(90deg, hsl(217,91%,60%), hsl(230,80%,55%))",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Generating;
