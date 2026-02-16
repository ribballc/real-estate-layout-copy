import { useState, useCallback } from "react";
import darkerLogo from "@/assets/darker-logo.png";
import { ChevronRight, ChevronDown, Zap, Shield } from "lucide-react";
import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
const PhoneDashboard = lazy(() => import("@/components/PhoneDashboard"));

const SERVICE_TYPES = [
  "Auto Detailing",
  "Mobile Detailing",
  "Car Wash",
  "Detailing Shop",
] as const;

const HeroSection = () => {
  const [businessName, setBusinessName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = businessName.trim();
    if (!trimmed) { setError("Please enter your business name"); return; }
    if (!serviceType) { setError("Please select a service type"); return; }
    if (!firstName.trim()) { setError("Please enter your first name"); return; }
    if (!phone.trim()) { setError("Please enter your phone number"); return; }

    const leadData = {
      businessName: trimmed,
      serviceType,
      firstName: firstName.trim(),
      phone: phone.trim(),
    };
    localStorage.setItem("leadData", JSON.stringify(leadData));
    navigate("/loading");
  }, [businessName, serviceType, firstName, phone, navigate]);

  const inputStyle = {
    background: 'hsla(0, 0%, 100%, 0.05)',
    border: '1px solid hsla(0, 0%, 100%, 0.15)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid hsl(217 91% 60%)';
    e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.08)';
    e.currentTarget.style.boxShadow = '0 0 0 3px hsla(217, 91%, 60%, 0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = '1px solid hsla(0, 0%, 100%, 0.15)';
    e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.05)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)'
    }}>
      {/* Glow Orbs */}
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 500, height: 500, top: "-15%", left: "-10%",
        background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.4), transparent)",
        filter: "blur(80px)", opacity: 0.15,
        animation: "orbFloat1 25s ease-in-out infinite",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 600, height: 600, bottom: "-20%", right: "-10%",
        background: "radial-gradient(circle, hsla(213, 94%, 68%, 0.3), transparent)",
        filter: "blur(80px)", opacity: 0.12,
        animation: "orbFloat2 30s ease-in-out infinite 5s",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 300, height: 300, top: "40%", left: "60%",
        background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.25), transparent)",
        filter: "blur(80px)", opacity: 0.08,
        animation: "orbFloat3 35s ease-in-out infinite 10s",
      }} />

      {/* Grid patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(45deg, hsla(0, 0%, 100%, 1) 1px, transparent 1px), linear-gradient(-45deg, hsla(0, 0%, 100%, 1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      {/* Main content */}
      <div className="relative z-10 px-5 md:px-8 lg:px-20 pt-5 md:pt-6">
        {/* Logo */}
        <div className="max-w-[1400px] mx-auto w-full" style={{
          opacity: 0, animation: 'heroFadeScale 0.5s ease-out 0s forwards',
        }}>
          <img src={darkerLogo} alt="Darker" className="h-10 md:h-12" />
        </div>

        {/* Two-column grid */}
        <div className="max-w-[1400px] mx-auto mt-1 md:mt-2 lg:mt-4 w-full grid grid-cols-1 lg:grid-cols-[42%_58%] gap-8 lg:gap-6 items-center min-h-[calc(100vh-120px)]">

          {/* LEFT: Text + Form */}
          <div className="relative z-10 text-left">
            {/* Badge */}
            <span
              className="text-sky text-[13px] font-medium tracking-[0.05em] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-5"
              style={{
                background: 'hsla(217, 91%, 60%, 0.1)',
                border: '1px solid hsla(217, 91%, 60%, 0.2)',
                opacity: 0, animation: 'fadeSlideDown 0.4s ease-out 0.2s forwards',
              }}
            >
              FOR DETAILERS & INSTALLERS
            </span>

            {/* Headline */}
            <h1 className="text-primary-foreground leading-[1.1] tracking-[-0.02em]">
              <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.4s forwards' }}>
                The Instant
              </span>
              <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.5s forwards' }}>
                Website & Booking
              </span>
              <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.6s forwards' }}>
                System For{' '}
                <span className="font-semibold italic" style={{ color: '#10B981', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                  Auto Pros
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="mt-5 text-[15px] md:text-xl leading-[1.6] max-w-[600px]"
              style={{ color: 'hsla(0, 0%, 100%, 0.7)', opacity: 0, animation: 'heroBlurIn 0.5s ease-out 1.0s forwards' }}
            >
              We will build your custom website + AI booking system that captures leads 24/7, collects deposits, sends reminders, and optimizes routes. Wake up to booked jobs.
            </p>

            {/* Lead Capture Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 max-w-[500px] rounded-2xl p-7 md:p-10"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                opacity: 0, animation: 'heroFormIn 0.5s ease-out 1.2s forwards',
              }}
            >
              {/* Business Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => { setBusinessName(e.target.value); if (error) setError(""); }}
                  placeholder="e.g. Elite Mobile Detailing"
                  maxLength={100}
                  className="w-full h-[52px] rounded-xl px-4 text-base text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Service Type */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Service Type *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => { setServiceType(e.target.value); if (error) setError(""); }}
                  className="w-full h-[52px] rounded-xl px-4 text-base text-primary-foreground focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="" disabled className="bg-slate-900">Select your service...</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-slate-900">{type}</option>
                  ))}
                </select>
              </div>

              {/* Name + Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); if (error) setError(""); }}
                    placeholder="First name"
                    maxLength={50}
                    className="w-full h-[52px] rounded-xl px-4 text-base text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (error) setError(""); }}
                    placeholder="(555) 123-4567"
                    maxLength={20}
                    className="w-full h-[52px] rounded-xl px-4 text-base text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive mb-3">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                className="group w-full h-[56px] rounded-xl text-[17px] font-semibold inline-flex items-center justify-between px-8 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                }}
              >
                <span>Build My Free Website</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="text-center text-[13px] mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                No card required • Takes 30 seconds • 14-day free trial
              </p>
            </form>

            {/* Trust line */}
            <div className="mt-5 flex items-center gap-4 flex-wrap" style={{
              color: 'hsla(0, 0%, 100%, 0.5)', opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 1.8s forwards',
            }}>
              <span className="text-sm font-medium flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent" /> Built in 5 minutes</span>
              <span className="text-primary-foreground/20">•</span>
              <span className="text-sm font-medium flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent" /> Free for 14 days</span>
            </div>

            {/* Social proof */}
            <div className="mt-4 inline-flex items-center gap-2 text-sm" style={{
              color: 'hsla(0, 0%, 100%, 0.6)', opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.0s forwards',
            }}>
              <span className="text-accent text-sm tracking-wide">★★★★★</span>
              <span className="font-semibold">
                Trusted by <strong>200+</strong> detailers · <strong>$2.4M</strong> in bookings captured
              </span>
            </div>
          </div>

          {/* RIGHT: Phone mockup (Desktop) */}
          <div className="hidden lg:block relative z-[1]" style={{
            opacity: 0, animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards', clipPath: 'inset(0)',
          }}>
            <Suspense fallback={<div className="w-full aspect-[360/700] max-w-[360px] mx-auto" />}>
              <PhoneDashboard />
            </Suspense>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:flex flex-col items-center pb-8 pt-4" style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.2s forwards' }}>
          <span className="text-primary-foreground/40 text-[13px] font-medium tracking-[0.05em] uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Mobile phone section */}
      <div className="block lg:hidden relative z-[1] w-full px-5 pb-16 pt-8" style={{
        opacity: 0, animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
      }}>
        <div className="w-full max-w-[360px] mx-auto">
          <Suspense fallback={<div className="w-full aspect-[360/700]" />}>
            <PhoneDashboard />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
