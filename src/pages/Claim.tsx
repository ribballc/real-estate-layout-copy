import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, Lock, CreditCard } from "lucide-react";

interface LeadData {
  businessName?: string;
  serviceType?: string;
  firstName?: string;
  phone?: string;
  email?: string;
  password?: string;
}

const Claim = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}") as LeadData;
      if (!data.businessName) { navigate("/"); return; }
      setLeadData(data);
    } catch { navigate("/"); }
  }, [navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !email || !password) return;

    const updated = { ...leadData, email, password };
    localStorage.setItem("leadData", JSON.stringify(updated));

    setGlitching(true);
    setTimeout(() => navigate("/payment"), 500);
  }, [leadData, email, password, agreed, navigate]);

  if (!leadData) return null;

  const businessName = leadData.businessName || "Your Business";

  return (
    <div
      className="min-h-screen flex justify-center items-center relative"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
        padding: "60px 20px",
        animation: glitching ? "loadingGlitchOut 0.5s ease-out forwards" : "previewGlitchIn 0.6s ease-out forwards",
      }}
    >
      <div className="max-w-[550px] w-full flex flex-col gap-10">

        {/* Preview Reminder */}
        <div className="flex items-center gap-5 p-5 rounded-2xl" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}>
          <div className="w-20 h-[60px] rounded-lg p-1.5 flex-shrink-0" style={{
            background: "rgba(0,113,227,0.2)",
            border: "1px solid rgba(0,113,227,0.3)",
          }}>
            <div className="w-full h-full rounded" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }} />
          </div>
          <p className="text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
            Your website is ready. Let's set up your account.
          </p>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-[28px] md:text-[36px] font-bold mb-3" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
            Start Your 14-Day Free Trial
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            No card required. Get instant access to your dashboard.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[20px] p-7 md:p-10"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full rounded-xl text-base transition-all duration-300 focus:outline-none"
              style={{
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "16px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0071e3";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
              Create Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              className="w-full rounded-xl text-base transition-all duration-300 focus:outline-none"
              style={{
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "16px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0071e3";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="flex gap-3 mb-8 items-start">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-[18px] h-[18px] flex-shrink-0"
            />
            <label className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              I agree to the{" "}
              <a href="#" style={{ color: "#0071e3" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "#0071e3" }}>Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreed || !email || !password}
            className="w-full rounded-xl text-[17px] font-semibold flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              padding: "18px 32px",
              background: "linear-gradient(135deg, #0071e3, #0077ed)",
              color: "#fff",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,113,227,0.3)",
              marginBottom: "24px",
            }}
          >
            <span>Continue to Payment</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Trial benefits */}
          <div className="flex flex-col gap-3 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {["14 days completely free", "Cancel anytime", "$74/month after trial"].map((b) => (
              <div key={b} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </form>

        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {[
            { icon: <Lock className="w-6 h-6" />, label: "256-bit SSL Encryption" },
            { icon: <CreditCard className="w-6 h-6" />, label: "Powered by Stripe" },
            { icon: <Check className="w-6 h-6" />, label: "Money-back Guarantee" },
          ].map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-2 rounded-xl flex-1 min-w-[140px] text-center text-xs" style={{
              padding: "16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)",
            }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Claim;
