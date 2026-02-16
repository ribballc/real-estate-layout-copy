import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";

interface LeadData {
  businessName?: string;
  serviceType?: string;
  firstName?: string;
  email?: string;
}

const FEATURES = [
  "Booking system included",
  "Mobile optimized",
  "SMS automation ready",
  "Payment processing setup",
];

const generateMockHTML = (businessName: string, serviceType: string) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff}
header{padding:20px 40px;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
.logo{font-size:24px;font-weight:700}
nav{display:flex;gap:30px}
nav a{color:white;text-decoration:none;font-weight:500;transition:opacity 0.3s}
nav a:hover{opacity:0.7}
.hero{padding:100px 40px;text-align:center;max-width:1000px;margin:0 auto}
h1{font-size:56px;margin-bottom:20px;line-height:1.2}
.subtitle{font-size:20px;margin-bottom:40px;opacity:0.9}
.cta-button{padding:18px 48px;background:#10b981;border:none;border-radius:12px;color:white;font-size:18px;font-weight:600;cursor:pointer;box-shadow:0 8px 30px rgba(16,185,129,0.4);transition:all 0.3s}
.cta-button:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(16,185,129,0.6)}
.services{padding:80px 40px;background:rgba(0,0,0,0.2)}
.services-title{text-align:center;font-size:40px;margin-bottom:60px}
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:30px;max-width:1200px;margin:0 auto}
.service-card{padding:40px;background:rgba(255,255,255,0.1);border-radius:16px;backdrop-filter:blur(10px);text-align:center;transition:transform 0.3s}
.service-card:hover{transform:translateY(-5px)}
.service-card h3{font-size:24px;margin-bottom:10px}
.service-card p{opacity:0.8;margin-bottom:20px}
.price{font-size:32px;font-weight:700;color:#10b981}
footer{padding:40px;text-align:center;background:rgba(0,0,0,0.3);margin-top:80px}
</style></head><body>
<header><div class="logo">${businessName}</div><nav><a href="#services">Services</a><a href="#booking">Book Now</a><a href="#contact">Contact</a></nav></header>
<section class="hero"><h1>Premium ${serviceType} Services</h1><p class="subtitle">Professional quality, delivered with care. Book online in seconds.</p><button class="cta-button">Book Your Appointment →</button></section>
<section class="services" id="services"><h2 class="services-title">Our Services</h2><div class="services-grid">
<div class="service-card"><h3>Basic Detail</h3><p>Exterior wash and interior vacuum</p><div class="price">$49</div></div>
<div class="service-card"><h3>Premium Detail</h3><p>Full interior and exterior detail</p><div class="price">$149</div></div>
<div class="service-card"><h3>Ultimate Package</h3><p>Complete detail with ceramic coating</p><div class="price">$299</div></div>
</div></section>
<footer><p>© 2026 ${businessName}. All rights reserved.</p></footer>
</body></html>`;

const Preview = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [liveCount, setLiveCount] = useState(127);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}") as LeadData;
      if (!data.businessName && !data.email) { navigate("/"); return; }
      setLeadData(data);
    } catch { navigate("/"); }
  }, [navigate]);

  // Animate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => c + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = useCallback(() => {
    setGlitching(true);
    setTimeout(() => navigate("/claim"), 500);
  }, [navigate]);

  if (!leadData) return null;

  const businessName = leadData.businessName || "Your Business";
  const firstName = leadData.firstName || "";
  const serviceType = (leadData.serviceType || "Auto Detailing").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "").concat(".darkerdigital.com");

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
        padding: "60px 20px",
        animation: glitching ? "loadingGlitchOut 0.5s ease-out forwards" : "previewGlitchIn 0.6s ease-out forwards",
      }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent 0px, rgba(0,113,227,0.02) 1px, transparent 2px)",
      }} />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12 md:gap-16 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-[800px]">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4 tracking-tight leading-[1.2]" style={{ color: "#fff", letterSpacing: "-1px" }}>
            Here's{" "}
            <span style={{ color: "#0071e3", textShadow: "0 0 20px rgba(0,113,227,0.5)" }}>
              {businessName}
            </span>
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-base md:text-xl" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.2px" }}>
            Built in 7 seconds. Ready to take bookings today.
          </p>
        </div>

        {/* ── Browser Device ── */}
        <div className="w-full flex flex-col items-center gap-8">
          <div
            className="w-full max-w-[1000px] rounded-2xl overflow-hidden relative"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 0 0 1px rgba(0,113,227,0.2), 0 30px 80px rgba(0,0,0,0.6)",
              animation: "previewDeviceFloat 6s ease-in-out infinite",
            }}
          >
            {/* Browser chrome */}
            <div className="flex items-center justify-between px-4 py-3" style={{
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
              </div>
              <div className="flex-1 mx-5 flex items-center gap-2 rounded-lg px-4 py-2" style={{
                background: "rgba(0,0,0,0.3)",
              }}>
                <span className="text-xs">🔒</span>
                <span className="text-[13px] font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {slug}
                </span>
              </div>
              <div className="w-[60px]" />
            </div>

            {/* Iframe */}
            <iframe
              srcDoc={generateMockHTML(businessName, serviceType)}
              className="w-full border-none block"
              style={{ height: "700px", background: "#fff" }}
              title="Website preview"
              sandbox="allow-scripts"
            />

            {/* Glow under device */}
            <div className="absolute -bottom-[50px] left-1/2 -translate-x-1/2 w-4/5 h-[100px] pointer-events-none" style={{
              background: "radial-gradient(ellipse, rgba(0,113,227,0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
            }} />
          </div>

          {/* Feature badges */}
          <div className="w-full max-w-[1000px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-3 rounded-xl px-5 py-4" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}>
                <Check className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "#10b981" }} />
                <span className="text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Social proof ── */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full px-6 py-3" style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
            backdropFilter: "blur(10px)",
          }}>
            <span className="w-2 h-2 rounded-full" style={{
              background: "#10b981",
              animation: "previewLivePulse 2s ease-in-out infinite",
              boxShadow: "0 0 8px rgba(16,185,129,0.8)",
            }} />
            <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {liveCount} businesses built their website today
            </span>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[600px]">
          <button
            onClick={handleClaim}
            className="group w-full rounded-2xl px-8 md:px-10 py-5 text-base md:text-lg font-bold flex items-center justify-between cursor-pointer relative overflow-hidden hover:-translate-y-[3px] active:translate-y-0 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              boxShadow: "0 8px 30px rgba(16,185,129,0.4)",
            }}
          >
            {/* Shimmer */}
            <span className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              animation: "previewCtaShimmer 2.5s ease-in-out infinite",
            }} />
            <span className="relative z-10">Claim My Website + 14-Day Free Trial</span>
            <ChevronRight className="w-6 h-6 relative z-10" style={{
              animation: "previewArrowPulse 1.5s ease-in-out infinite",
            }} />
          </button>
          <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
            Takes 1 minute • No card required for trial • $74/mo after 14 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preview;
