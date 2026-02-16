import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock } from "lucide-react";

interface LeadData {
  businessName?: string;
  firstName?: string;
  email?: string;
  [key: string]: unknown;
}

const FEATURES = [
  "Custom domain",
  "Booking automation",
  "SMS notifications",
  "Payment processing",
  "Mobile app access",
];

const Payment = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}") as LeadData;
      if (!data.businessName || !data.email) { navigate("/"); return; }
      setLeadData(data);
    } catch { navigate("/"); }
  }, [navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...leadData, purchaseComplete: true };
    localStorage.setItem("leadData", JSON.stringify(updated));
    setGlitching(true);
    setTimeout(() => navigate("/success"), 500);
  }, [leadData, navigate]);

  if (!leadData) return null;

  const firstName = leadData.firstName || "";
  const businessName = leadData.businessName || "Your Business";

  const inputStyle: React.CSSProperties = {
    padding: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "16px",
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#0071e3";
    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.1)";
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
        padding: "60px 20px",
        animation: glitching ? "loadingGlitchOut 0.5s ease-out forwards" : "previewGlitchIn 0.6s ease-out forwards",
      }}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{
              background: "#10b981", borderColor: "#10b981", border: "2px solid #10b981", color: "#fff",
            }}>
              <Check className="w-5 h-5" />
            </div>
            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Account</span>
          </div>
          <div className="w-[60px] h-[2px]" style={{ background: "rgba(255,255,255,0.2)" }} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{
              background: "#0071e3", border: "2px solid #0071e3",
            }}>2</div>
            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Payment</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[28px] md:text-[36px] font-bold mb-3" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
            Almost There{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            Add your payment method to start your free trial.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">

          {/* Order Summary */}
          <div className="rounded-[20px] p-8 h-fit lg:sticky lg:top-5" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: "#fff" }}>Order Summary</h2>

            <div className="flex gap-4 p-5 rounded-xl mb-5" style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className="text-[32px]">🌐</span>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold" style={{ color: "#fff" }}>{businessName}</span>
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Complete website with booking system</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {FEATURES.map((f) => (
                <span key={f} className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>✓ {f}</span>
              ))}
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-[15px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                <span>Today</span>
                <span className="text-2xl font-bold" style={{ color: "#10b981" }}>$0.00</span>
              </div>
              <div className="flex justify-between items-center text-[15px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                <span>After 14-day trial</span>
                <span className="text-base font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>$74/month</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-4 rounded-xl text-sm" style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "rgba(255,255,255,0.8)",
            }}>
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="rounded-[20px] p-8" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}>
            <div className="flex items-center gap-2 mb-6">
              <CreditCardIcon />
              <h2 className="text-lg font-bold" style={{ color: "#fff" }}>Payment Method</h2>
            </div>

            <div className="mb-8">
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>Card Number *</label>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" required
                  className="w-full rounded-xl focus:outline-none transition-all duration-300" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>Expiry *</label>
                  <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" required
                    className="w-full rounded-xl focus:outline-none transition-all duration-300" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>CVC *</label>
                  <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" required
                    className="w-full rounded-xl focus:outline-none transition-all duration-300" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>Cardholder Name *</label>
                <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Full name on card" required
                  className="w-full rounded-xl focus:outline-none transition-all duration-300" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl text-lg font-bold flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-[2px]"
              style={{
                padding: "20px 32px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                border: "none",
                boxShadow: "0 8px 30px rgba(16,185,129,0.4)",
                marginBottom: "16px",
              }}
            >
              <span>Start Free Trial - $0 Today</span>
              <Lock className="w-5 h-5" />
            </button>

            <p className="text-center text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              You won't be charged until your 14-day trial ends. Cancel anytime.
            </p>

            <div className="flex justify-center gap-5 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {["SSL Secure", "Powered by Stripe"].map((b) => (
                <span key={b} className="rounded-lg text-xs font-semibold" style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)",
                }}>{b}</span>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

export default Payment;
