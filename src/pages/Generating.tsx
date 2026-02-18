import { useEffect, useState, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";

const STATUS_MESSAGES = [
  "Setting up your booking calendar...",
  "Writing your website copy with AI...",
  "Building your service pages...",
  "Configuring your location...",
  "Adding your contact info...",
  "Polishing the design...",
  "Almost there...",
];

const CYCLE_MS = 1300;
const NAV_DELAY = 6000; // extended to allow AI call
const PROGRESS_DURATION = 5400;

const Generating = () => {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("Your shop");
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [navigating, setNavigating] = useState(false);
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

    // Fire AI generation
    if (!aiCalledRef.current && leadData.businessName) {
      aiCalledRef.current = true;
      generateCopy(leadData).finally(() => {
        aiDoneRef.current = true;
      });
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
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        setMsgVisible(true);
      }, 250);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  // Progress bar (0→90% over duration)
  useEffect(() => {
    const raf = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / PROGRESS_DURATION) * 90, 90);
      setProgress(pct);
      if (pct < 90) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);

  // Auto-navigate once AI is done or timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigating(true);
      setProgress(100);
      setTimeout(() => navigate("/dashboard/website"), 220);
    }, NAV_DELAY);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <SEOHead title="Generating" noIndex />
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Shop name */}
        <p className="text-white font-bold mb-1" style={{ fontSize: 22 }}>{shopName}</p>
        <p style={{ color: "hsla(0,0%,100%,0.4)", fontSize: 14 }}>is being built</p>

        {/* SVG Ring Loader */}
        <div className="my-6" style={{ width: 96, height: 96, filter: "drop-shadow(0 0 6px hsla(217,91%,60%,0.7))" }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsla(0,0%,100%,0.07)" strokeWidth="4" strokeLinecap="round" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="hsl(217,91%,40%)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="60 244" opacity="0.4"
              style={{ transformOrigin: "center", animation: "generatingSpinReverse 1.6s linear infinite" }}
            />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="hsl(217,91%,60%)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="164 88"
              style={{ transformOrigin: "center", animation: "generatingSpin 1s linear infinite" }}
            />
            <circle cx="48" cy="48" r="4" fill="hsl(217,91%,60%)"
              style={{ animation: "generatingPulse 1.2s ease-in-out infinite" }}
            />
          </svg>
        </div>

        {/* Cycling status */}
        <div style={{ minHeight: 24 }}>
          <p
            className="font-medium transition-opacity duration-[250ms]"
            style={{ color: "white", fontSize: 15, opacity: msgVisible ? 1 : 0 }}
          >
            {STATUS_MESSAGES[msgIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-10" style={{ width: 240, height: 3, borderRadius: 2, background: "hsla(0,0%,100%,0.08)" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: "hsl(217,91%,60%)",
              width: `${progress}%`,
              transition: navigating ? "width 0.2s ease" : "none",
            }}
          />
        </div>
      </div>

      {/* Inline CSS for SVG animations */}
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
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Generating;
