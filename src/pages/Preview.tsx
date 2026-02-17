import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Globe, Calendar, Bell, Shield, Star, ChevronDown, Phone, Mail, Clock, Instagram, Facebook, Award, Sparkles, ThumbsUp, Car, Check, Flame, Zap, MapPin, Menu } from "lucide-react";
import previewHeroBg from "@/assets/preview-hero-bg.jpg";

interface LeadData {
  businessName: string;
  serviceType: string;
  firstName: string;
  phone: string;
}

const OUTER_FEATURES = [
  { icon: Globe, label: "Custom Domain Ready" },
  { icon: Calendar, label: "Online Booking" },
  { icon: Bell, label: "Auto Reminders" },
  { icon: Shield, label: "Deposit Collection" },
];

const Preview = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}") as LeadData;
      if (!data.businessName) { navigate("/"); return; }
      setLeadData(data);
    } catch { navigate("/"); return; }
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!leadData) return null;

  const biz = leadData.businessName;
  const svc = leadData.serviceType || "Auto Detailing";
  const slug = biz.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #000 0%, #0a0a0a 100%)" }}>
      {/* Outer header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div>
          <h1 className="text-lg font-bold text-white">Your site is ready, {leadData.firstName}!</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Preview your custom website below</p>
        </div>
        <button
          onClick={() => navigate("/claim")}
          className="group h-12 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}
        >
          Claim My Website
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </header>

      {/* Feature badges */}
      <div className="flex items-center justify-center gap-3 flex-wrap py-4 px-4">
        {OUTER_FEATURES.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
            <Icon className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
            {label}
          </span>
        ))}
      </div>

      {/* Browser chrome + mockup */}
      <div className="flex-1 px-4 md:px-8 lg:px-16 pb-8">
        <div
          className="max-w-6xl mx-auto rounded-2xl overflow-hidden transition-all duration-700"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: revealed ? "0 0 60px hsla(45,95%,52%,0.08)" : "none",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
          }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <div className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-mono" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
              <Globe className="w-3 h-3 mr-2" style={{ color: "hsl(45 95% 52%)" }} />
              {slug}.realize.pro
            </div>
          </div>

          {/* ═══ MOCKUP WEBSITE ═══ */}
          <MockupSite biz={biz} svc={svc} slug={slug} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span style={{ color: "#f59e0b" }}>★★★★★</span>{" "}Trusted by 200+ auto pros
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>$2.4M+ in bookings captured</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   THE INNER MOCKUP WEBSITE
   Mirrors the Deluxe Detailing reference
   ═══════════════════════════════════════ */

const gold = "hsl(45 95% 52%)";
const goldLight = "hsl(47 94% 63%)";
const goldDark = "hsl(41 87% 46%)";
const goldGrad = `linear-gradient(135deg, ${goldLight} 0%, ${goldDark} 100%)`;
const bg = "#000";
const cardBg = "hsl(0 0% 5%)";
const secBg = "hsl(0 0% 10%)";
const mutedFg = "hsl(0 0% 65%)";
const borderClr = "hsl(0 0% 20%)";

const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span style={{ background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
    {children}
  </span>
);

const MockupSite = ({ biz, svc, slug }: { biz: string; svc: string; slug: string }) => (
  <div style={{ background: bg, fontFamily: "'Montserrat', sans-serif", color: "#fff" }}>
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 py-5" style={{ background: "rgba(0,0,0,0.9)", borderBottom: `1px solid ${borderClr}` }}>
      <span className="text-xl font-black uppercase tracking-wider">{biz}</span>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: mutedFg }}>
        {["Services", "Packages", "Gallery", "Testimonials", "Contact"].map(l => (
          <span key={l} className="cursor-default hover:text-white transition-colors">{l}</span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex h-10 px-5 rounded-lg items-center text-sm font-bold" style={{ background: goldGrad, color: "#000" }}>
          <Phone className="w-4 h-4 mr-2" /> Call Now
        </div>
        <Menu className="w-6 h-6 md:hidden" style={{ color: mutedFg }} />
      </div>
    </nav>

    {/* Hero */}
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${previewHeroBg})` }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%)" }} />
      </div>
      <div className="relative z-10 px-8 md:px-16 py-20 max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: gold }}>
          Premium {svc}
        </p>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6">
          <span>{biz.split(" ")[0]}</span><br />
          <GoldText>{biz.split(" ").slice(1).join(" ") || "#1 Auto"}</GoldText><br />
          <span>Detailers</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: mutedFg }}>
          Your Go-To For Professional {svc}, Ceramic Coating, and Interior Restoration Services
        </p>
        <div className="flex gap-4 flex-wrap">
          <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={{ background: goldGrad, color: "#000" }}>Call Now</div>
          <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={{ border: `2px solid ${gold}`, color: gold }}>Book Now</div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <ChevronDown className="w-8 h-8 animate-bounce" style={{ color: gold }} />
      </div>
    </section>

    {/* Services */}
    <section className="py-16 px-8 md:px-16" style={{ background: bg }}>
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: gold }}>Welcome to {biz}</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Our <GoldText>Services</GoldText></h2>
        <p style={{ color: mutedFg }}>Professional {svc.toLowerCase()} services tailored to your vehicle</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Mobile Detailing", "Ceramic Coating", "Headlight Restoration", "Buffing Services"].map((name) => (
          <div key={name} className="rounded-xl overflow-hidden group cursor-default" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
            <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${previewHeroBg})`, filter: "brightness(0.5)" }} />
            <div className="p-4">
              <h4 className="font-bold text-sm mb-1">{name}</h4>
              <p className="text-xs" style={{ color: mutedFg }}>Premium service</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-16 px-8 md:px-16" style={{ background: secBg }}>
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: gold }}>Why Choose Us</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">The <GoldText>{biz.split(" ")[0]}</GoldText> Difference</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Shield, t: "Quality Guaranteed" },
          { icon: Clock, t: "Convenient Scheduling" },
          { icon: Award, t: "Expert Technicians" },
          { icon: Sparkles, t: "Premium Products" },
          { icon: ThumbsUp, t: "Trusted Service" },
          { icon: Car, t: "All Vehicles Welcome" },
        ].map(({ icon: I, t }) => (
          <div key={t} className="rounded-xl p-5 text-center" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
            <I className="w-8 h-8 mx-auto mb-3" style={{ color: gold }} />
            <h4 className="font-bold text-sm">{t}</h4>
          </div>
        ))}
      </div>
    </section>

    {/* Packages */}
    <section className="py-16 px-8 md:px-16" style={{ background: bg }}>
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: gold }}>Our Packages</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Choose Your <GoldText>Package</GoldText></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: Flame, badge: "TOP SELLER", title: "Full Interior Detail", price: "$95", time: "1 hr 30 min", features: ["Vacuum & Blow Out", "Shampoo Seats", "Steam Cleaning", "Leather Conditioner", "Trunk Cleaning"], popular: true },
          { icon: Zap, badge: "2nd Best Seller", title: "Rapid Interior", price: "$65", time: "40 min", features: ["Vacuum", "Seat & Door Cleaning", "Vent Cleaning", "Dashboard Wipe"], popular: false },
          { icon: Sparkles, title: "Express Wash", price: "$60", time: "35 min", features: ["Hand Wash & Dry", "Ceramic Wax", "Door Jambs", "Tire Shine"], popular: false },
        ].map((pkg) => (
          <div key={pkg.title} className="rounded-xl p-6 relative" style={{
            background: cardBg,
            border: pkg.popular ? `2px solid ${gold}` : `1px solid ${borderClr}`,
            boxShadow: pkg.popular ? `0 0 30px rgba(249,214,72,0.1)` : "none",
          }}>
            {pkg.badge && (
              <span className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: goldGrad, color: "#000" }}>
                {pkg.badge}
              </span>
            )}
            <pkg.icon className="w-8 h-8 mb-3" style={{ color: gold }} />
            <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
            <p className="text-xs mb-3" style={{ color: mutedFg }}>{pkg.time}</p>
            <p className="text-2xl font-black mb-4" style={{ color: gold }}>{pkg.price}</p>
            <ul className="space-y-2 mb-5">
              {pkg.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: gold }} />
                  {f}
                </li>
              ))}
            </ul>
            <div className="h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={pkg.popular ? { background: goldGrad, color: "#000" } : { border: `1px solid ${gold}`, color: gold }}>
              Book Now
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 px-8 md:px-16" style={{ background: secBg }}>
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: gold }}>Customer Reviews</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our <GoldText>Clients</GoldText> Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { name: "Michael J.", text: "Absolutely incredible work! My car looks better than when I bought it.", vehicle: "2022 BMW 3 Series" },
          { name: "Sarah W.", text: "I was blown away by the results. The interior cleaning was thorough!", vehicle: "2021 Toyota Highlander" },
          { name: "David M.", text: "Best detailing service I have ever used. Professional and punctual.", vehicle: "2023 Ford F-150" },
          { name: "Jennifer B.", text: "They removed stains I thought were permanent. Highly recommend!", vehicle: "2020 Honda Accord" },
        ].map((r) => (
          <div key={r.name} className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: gold }} />)}
            </div>
            <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>"{r.text}"</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">{r.name}</span>
              <span className="text-xs" style={{ color: mutedFg }}>{r.vehicle}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-8 md:px-16 text-center relative overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: goldGrad }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/2 translate-y-1/2" style={{ background: goldGrad }} />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: gold }}>Ready to Transform Your Vehicle?</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Book Your <GoldText>{biz.split(" ")[0]}</GoldText> Detail Today</h2>
        <p className="mb-8" style={{ color: mutedFg }}>Experience the difference professional detailing makes.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={{ background: goldGrad, color: "#000" }}>Call Now</div>
          <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={{ border: `2px solid ${gold}`, color: gold }}>Book Now</div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-8 md:px-16" style={{ background: cardBg, borderTop: `1px solid ${borderClr}` }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-black uppercase mb-3">{biz}</h3>
          <p className="text-sm" style={{ color: mutedFg }}>Professional {svc.toLowerCase()} services that transform your vehicle.</p>
          <div className="flex gap-3 mt-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}><Instagram className="w-4 h-4" style={{ color: mutedFg }} /></div>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}><Facebook className="w-4 h-4" style={{ color: mutedFg }} /></div>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}><Mail className="w-4 h-4" style={{ color: mutedFg }} /></div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3" style={{ color: gold }}>Quick Links</h4>
          <ul className="space-y-2 text-sm" style={{ color: mutedFg }}>
            {["Services", "Packages", "Gallery", "Testimonials", "Contact"].map(l => <li key={l}>{l}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-3" style={{ color: gold }}>Contact</h4>
          <div className="space-y-2 text-sm" style={{ color: mutedFg }}>
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> (214) 555-0199</div>
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@{slug}.com</div>
            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Mon-Fri 8AM-5PM</div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Dallas, TX</div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: `1px solid ${borderClr}`, color: mutedFg }}>
        © 2026 {biz}. All rights reserved. Powered by <span style={{ color: gold }}>Realize</span>
      </div>
    </footer>
  </div>
);

export default Preview;
