import { useEffect, useState, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";
import { CheckCircle2 } from "lucide-react";

const STATUS_MESSAGES = [
  "Setting up your booking calendar...",
  "Writing your website copy...",
  "Building your service pages...",
  "Configuring your location...",
  "Adding your contact info...",
  "Polishing the design...",
  "Almost there...",
];

const CYCLE_MS = 1400;
const MIN_NAV_DELAY = 3200;
const PROGRESS_DURATION = 5000;

const Generating = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("Your shop");
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [complete, setComplete] = useState(false);
  const startRef = useRef(Date.now());
  const aiCalledRef = useRef(false);
  const aiDoneRef = useRef(false);

  // Load lead data and trigger AI copy generation
  useEffect(() => {
    let leadData: any = {};
    try {
      leadData = JSON.parse(localStorage.getItem("leadData") || "{}");
      if (leadData.businessName) setShopName(leadData.businessName);
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

  const generateCopy = async (data: any) => {
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

  const saveFallbackCopy = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const services = data.services || [];
      const fallback = {
        user_id: user.id,
        hero_headline: `Professional Auto Detailing in ${data.city || "Your Area"}`,
        hero_subheadline: `${data.businessName} delivers premium detailing services. Book your appointment online anytime.`,
        about_paragraph: `${data.businessName} is proudly operated by ${data.ownerFirstName || "our team"} in ${data.city || "your area"}. We specialize in ${services.slice(0, 3).join(", ") || "auto detailing"} with an uncompromising focus on quality. Every vehicle we touch leaves looking its absolute best.`,
        services_descriptions: services.map((s: string) => ({
          service: s,
          description: `Professional ${s.toLowerCase()} service delivering results that speak for themselves.`,
        })),
        seo_meta_description: `${data.businessName} — professional auto detailing in ${data.city || "your area"}. ${services[0] || "Full detail"}, ${services[1] || "interior"} & more. Book online today.`.slice(0, 155),
        cta_tagline: "Reserve Your Detail Online",
        generated_at: new Date().toISOString(),
      };
      await supabase.from("website_copy").upsert(fallback, { onConflict: "user_id" });
    } catch {}
  };

  // Cycle status messages
  useEffect(() => {
    if (complete) return;
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        setMsgVisible(true);
      }, 250);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [complete]);

  // Progress bar
  useEffect(() => {
    const raf = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / PROGRESS_DURATION) * 90, 90);
      setProgress(pct);
      if (pct < 90) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);

  // Auto-navigate with celebration moment
  useEffect(() => {
    const check = () => {
      const elapsed = Date.now() - startRef.current;
      if (elapsed >= MIN_NAV_DELAY && aiDoneRef.current) {
        setComplete(true);
        setProgress(100);
        // Show celebration for a beat before navigating
        setTimeout(() => {
          setNavigating(true);
          setTimeout(() => navigate("/dashboard/website"), 400);
        }, 1200);
        return true;
      }
      return false;
    };
    const id = setInterval(() => {
      if (check()) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <div
      className="min-h-screen min-h-[100dvh] relative flex items-center justify-center px-5 sm:px-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}
    >
      <SEOHead title="Building Your Site" noIndex />
      {/* Background — matches onboarding */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }} />

      <div
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
        style={{
          opacity: navigating ? 0 : 1,
          transform: navigating ? "scale(0.96)" : "scale(1)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* Shop name */}
        <h1 className="text-white font-bold mb-0.5" style={{ fontSize: "clamp(20px, 5vw, 24px)" }}>
          {shopName}
        </h1>
        <p style={{ color: "hsla(0,0%,100%,0.45)", fontSize: "clamp(13px, 3vw, 15px)" }}>
          {complete ? "" : "is being built"}
        </p>

        {/* Loader / Success */}
        <div className="my-8 sm:my-10 relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
          {/* Ring loader */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              filter: "drop-shadow(0 0 12px hsla(217,91%,60%,0.4))",
              opacity: complete ? 0 : 1,
              transform: complete ? "scale(0.85)" : "scale(1)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            <svg width="112" height="112" viewBox="0 0 96 96" className="scale-[1.17]">
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsla(0,0%,100%,0.06)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(217,91%,35%)" strokeWidth="3" strokeLinecap="round" strokeDasharray="55 249" opacity="0.5" style={{ transformOrigin: "center", animation: "generatingSpinReverse 1.8s linear infinite" }} />
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="4" strokeLinecap="round" strokeDasharray="164 88" style={{ transformOrigin: "center", animation: "generatingSpin 1.1s linear infinite" }} />
              <circle cx="48" cy="48" r="5" fill="hsl(217,91%,60%)" style={{ animation: "generatingPulse 1.2s ease-in-out infinite" }} />
            </svg>
          </div>

          {/* Success checkmark */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: complete ? 1 : 0,
              transform: complete ? "scale(1)" : "scale(0.6)",
              transition: "opacity 0.4s ease 0.08s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s",
            }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "hsla(142,71%,45%,0.18)",
                border: "2px solid hsla(142,71%,45%,0.4)",
                boxShadow: "0 0 24px hsla(142,71%,45%,0.2)",
              }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: "hsl(142,71%,48%)" }} />
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className="min-h-[3rem] flex items-center justify-center">
          {complete ? (
            <p
              className="font-semibold"
              style={{
                color: "hsl(142,71%,52%)",
                fontSize: "clamp(15px, 3.5vw, 17px)",
                animation: "genCelebrateIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Your site is live!
            </p>
          ) : (
            <p
              className="font-medium transition-opacity duration-300"
              style={{
                color: "hsla(0,0%,100%,0.95)",
                fontSize: "clamp(14px, 3.2vw, 16px)",
                opacity: msgVisible ? 1 : 0,
                minHeight: "2.5rem",
              }}
            >
              {STATUS_MESSAGES[msgIndex]}
            </p>
          )}
        </div>

        {/* Progress bar — full width on mobile, capped on desktop */}
        <div
          className="mt-8 sm:mt-10 w-full max-w-[280px] h-1.5 rounded-full overflow-hidden"
          style={{ background: "hsla(0,0%,100%,0.1)" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: complete ? "hsl(142,71%,45%)" : "linear-gradient(90deg, hsl(217,91%,60%), hsl(230,80%,55%))",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes generatingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes generatingSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes generatingPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes genCelebrateIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Generating;
