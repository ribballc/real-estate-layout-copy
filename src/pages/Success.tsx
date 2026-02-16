import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, Copy } from "lucide-react";

interface LeadData {
  businessName?: string;
  firstName?: string;
  email?: string;
  purchaseComplete?: boolean;
  [key: string]: unknown;
}

const STEPS = [
  { title: "Check your email", descKey: "email" },
  { title: "Access your dashboard", desc: "Customize your website and set your availability" },
  { title: "Start taking bookings", desc: "Share your link and watch bookings roll in" },
];

const Success = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}") as LeadData;
      if (!data.businessName || !data.purchaseComplete) { navigate("/"); return; }
      setLeadData(data);
    } catch { navigate("/"); }
  }, [navigate]);

  const trialEndDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }, []);

  const handleCopy = useCallback(() => {
    if (!leadData) return;
    const url = `${(leadData.businessName || "").toLowerCase().replace(/[^a-z0-9]+/g, "")}.darkerdigital.com`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [leadData]);

  if (!leadData) return null;

  const firstName = leadData.firstName || "there";
  const businessName = leadData.businessName || "Your Business";
  const email = leadData.email || "your email";
  const websiteUrl = `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.darkerdigital.com`;

  return (
    <div
      className="min-h-screen flex justify-center items-center relative"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
        padding: "60px 20px",
        animation: "previewGlitchIn 0.6s ease-out forwards",
      }}
    >
      <div className="max-w-[800px] w-full flex flex-col items-center gap-10">

        {/* Checkmark Animation */}
        <div className="relative w-[120px] h-[120px]">
          <div
            className="w-[120px] h-[120px] rounded-full flex items-center justify-center text-white"
            style={{
              background: "#10b981",
              fontSize: "60px",
              boxShadow: "0 0 40px rgba(16,185,129,0.6)",
              animation: "successCheckmarkPop 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <Check className="w-14 h-14" />
          </div>
          <div className="absolute inset-0 rounded-full" style={{
            border: "3px solid #10b981",
            animation: "successRingExpand 2s ease-out infinite",
          }} />
          <div className="absolute inset-0 rounded-full" style={{
            border: "3px solid #10b981",
            animation: "successRingExpand 2s ease-out 1s infinite",
          }} />
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-[28px] md:text-[40px] font-bold mb-3 leading-tight" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
            Welcome to Darker Digital,{" "}
            <span style={{ color: "#10b981" }}>{firstName}</span>!
          </h1>
          <p className="text-base md:text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
            Your website is live and ready to take bookings.
          </p>
        </div>

        {/* Website Info Card */}
        <div className="w-full p-8 rounded-[20px] text-center" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
        }}>
          <p className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
            Your website is live at:
          </p>
          <p className="text-lg md:text-2xl font-bold font-mono mb-5 break-all" style={{ color: "#0071e3" }}>
            {websiteUrl}
          </p>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-[2px]"
            style={{
              padding: "12px 24px",
              background: "rgba(0,113,227,0.2)",
              border: "1px solid rgba(0,113,227,0.3)",
              color: "#0071e3",
            }}
          >
            <span>{copied ? "Copied!" : "Copy URL"}</span>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Next Steps */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: "#fff" }}>
            What happens next:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <div key={i} className="rounded-2xl text-center p-7" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
              }}>
                <div className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg text-white" style={{
                  background: "linear-gradient(135deg, #0071e3, #0077ed)",
                }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#fff" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {step.descKey === "email" ? `We sent login details to ${email}` : step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="w-full flex flex-col items-center gap-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full max-w-[400px] rounded-2xl text-base md:text-lg font-bold flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-[3px]"
            style={{
              padding: "20px 40px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              boxShadow: "0 8px 30px rgba(16,185,129,0.4)",
            }}
          >
            <span>Go to My Dashboard</span>
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>Need help?</span>
            <span>•</span>
            <a href="#" style={{ color: "#0071e3" }}>Contact support</a>
          </div>
        </div>

        {/* Trial Reminder */}
        <div className="w-full flex gap-4 p-5 rounded-2xl" style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.2)",
          backdropFilter: "blur(20px)",
        }}>
          <span className="text-[32px] flex-shrink-0">📅</span>
          <div className="flex-1">
            <p className="text-base font-semibold mb-1" style={{ color: "#fff" }}>
              Your free trial started today
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              You won't be charged until {trialEndDate}. Cancel anytime before then.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
