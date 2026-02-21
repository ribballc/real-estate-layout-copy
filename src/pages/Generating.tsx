import { useEffect, useState, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import dashboardPreview from "@/assets/dashboard-preview-bg.jpg";
import { CheckCircle2, Sparkles } from "lucide-react";

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
const MIN_NAV_DELAY = 3000;
const PROGRESS_DURATION = 5400;

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
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <SEOHead title="Generating" noIndex />
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dashboardPreview})` }} />
      <div className="absolute inset-0" style={{ background: "hsla(215,50%,10%,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />

      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          opacity: navigating ? 0 : 1,
          transform: navigating ? 'scale(0.95)' : 'scale(1)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {/* Shop name */}
        <p className="text-white font-bold mb-1" style={{ fontSize: 22 }}>{shopName}</p>
        <p style={{ color: "hsla(0,0%,100%,0.4)", fontSize: 14 }}>
          {complete ? '' : 'is being built'}
        </p>

        {/* Loader / Success */}
        <div className="my-6 relative" style={{ width: 96, height: 96 }}>
          {/* Ring loader */}
          <div
            style={{
              filter: "drop-shadow(0 0 6px hsla(217,91%,60%,0.7))",
              opacity: complete ? 0 : 1,
              transform: complete ? 'scale(0.8)' : 'scale(1)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsla(0,0%,100%,0.07)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(217,91%,40%)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60 244" opacity="0.4" style={{ transformOrigin: "center", animation: "generatingSpinReverse 1.6s linear infinite" }} />
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(217,91%,60%)" strokeWidth="4" strokeLinecap="round" strokeDasharray="164 88" style={{ transformOrigin: "center", animation: "generatingSpin 1s linear infinite" }} />
              <circle cx="48" cy="48" r="4" fill="hsl(217,91%,60%)" style={{ animation: "generatingPulse 1.2s ease-in-out infinite" }} />
            </svg>
          </div>

          {/* Success checkmark */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: complete ? 1 : 0,
              transform: complete ? 'scale(1)' : 'scale(0.5)',
              transition: 'opacity 0.4s ease 0.1s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
            }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
              background: 'hsla(142,71%,45%,0.15)',
              border: '2px solid hsla(142,71%,45%,0.3)',
            }}>
              <CheckCircle2 className="w-10 h-10" style={{ color: 'hsl(142,71%,45%)' }} />
            </div>
          </div>
        </div>

        {/* Status text */}
        <div style={{ minHeight: 24 }}>
          {complete ? (
            <p className="font-semibold flex items-center gap-2" style={{
              color: "hsl(142,71%,55%)",
              fontSize: 16,
              animation: "genCelebrateIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <Sparkles className="w-4 h-4" />
              Your site is live!
            </p>
          ) : (
            <p
              className="font-medium transition-opacity duration-[250ms]"
              style={{ color: "white", fontSize: 15, opacity: msgVisible ? 1 : 0 }}
            >
              {STATUS_MESSAGES[msgIndex]}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-10" style={{ width: 240, height: 3, borderRadius: 2, background: "hsla(0,0%,100%,0.08)" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: complete ? "hsl(142,71%,45%)" : "hsl(217,91%,60%)",
              width: `${progress}%`,
              transition: complete ? "width 0.3s ease, background 0.3s ease" : "none",
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
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes genCelebrateIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Generating;
