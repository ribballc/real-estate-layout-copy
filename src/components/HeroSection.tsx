import { useState, useCallback } from "react";
import darkerLogo from "@/assets/darker-logo.png";
import { ChevronRight, Store, ChevronDown, Zap, Shield } from "lucide-react";
import { lazy, Suspense } from "react";
const PhoneDashboard = lazy(() => import("@/components/PhoneDashboard"));
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const HeroSection = () => {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const { openFunnel } = useSurveyFunnel();


  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = businessName.trim();
    if (!trimmed) { setError("Please enter your business name"); return; }
    window.dispatchEvent(new CustomEvent("hero-business", { detail: trimmed }));
    openFunnel();
  }, [businessName, openFunnel]);

  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)'
    }}>
      {/* Glow Orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500, top: "-15%", left: "-10%",
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.4), transparent)",
          filter: "blur(80px)", opacity: 0.15,
          animation: "orbFloat1 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600, height: 600, bottom: "-20%", right: "-10%",
          background: "radial-gradient(circle, hsla(213, 94%, 68%, 0.3), transparent)",
          filter: "blur(80px)", opacity: 0.12,
          animation: "orbFloat2 30s ease-in-out infinite 5s",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300, height: 300, top: "40%", left: "60%",
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.25), transparent)",
          filter: "blur(80px)", opacity: 0.08,
          animation: "orbFloat3 35s ease-in-out infinite 10s",
        }}
      />

      {/* Diagonal lines grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, hsla(0, 0%, 100%, 1) 1px, transparent 1px), linear-gradient(-45deg, hsla(0, 0%, 100%, 1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      {/* Main hero content area */}
      <div className="relative z-10 px-5 md:px-8 lg:px-20 pt-5 md:pt-6">
        {/* Logo */}
        <div className="max-w-[1400px] mx-auto w-full" style={{
          opacity: 0,
          animation: 'heroFadeScale 0.5s ease-out 0s forwards',
        }}>
          <img src={darkerLogo} alt="Darker" className="h-10 md:h-12" />
        </div>

        {/* Two-column grid */}
        <div className="max-w-[1400px] mx-auto mt-1 md:mt-2 lg:mt-4 w-full grid grid-cols-1 lg:grid-cols-[42%_58%] gap-8 lg:gap-6 items-center min-h-[calc(100vh-120px)]">

          {/* LEFT: Text column */}
          <div className="relative z-10 text-left">
            {/* Badge */}
            <span
              className="text-sky text-[13px] font-medium tracking-[0.05em] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-5"
              style={{
                background: 'hsla(217, 91%, 60%, 0.1)',
                border: '1px solid hsla(217, 91%, 60%, 0.2)',
                opacity: 0,
                animation: 'fadeSlideDown 0.4s ease-out 0.2s forwards',
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
              style={{
                color: 'hsla(0, 0%, 100%, 0.7)',
                opacity: 0,
                animation: 'heroBlurIn 0.5s ease-out 1.0s forwards',
              }}
            >
              We will build your custom website + AI booking system that captures leads 24/7, collects deposits, sends reminders, and optimizes routes. Wake up to booked jobs.
            </p>

            {/* Business name form + CTA */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg"
              style={{ opacity: 0, animation: 'heroFormIn 0.5s ease-out 1.2s forwards' }}
            >
              <div className="relative w-full sm:flex-1" style={{ opacity: 0, animation: 'heroScaleIn 0.4s ease-out 1.2s forwards' }}>
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/30" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => { setBusinessName(e.target.value); if (error) setError(""); }}
                  placeholder="Enter Your Business Name"
                  maxLength={100}
                  className="h-14 w-full rounded-xl pl-10 pr-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 min-h-[52px] focus:outline-none transition-all duration-200"
                  style={{
                    background: 'hsla(0, 0%, 100%, 0.08)',
                    border: '1px solid hsla(0, 0%, 100%, 0.15)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '2px solid hsl(217 91% 60%)';
                    e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.12)';
                    e.currentTarget.style.boxShadow = '0 0 0 4px hsla(217, 91%, 60%, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid hsla(0, 0%, 100%, 0.15)';
                    e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                
                type="submit"
                className="group h-14 px-8 text-base font-semibold rounded-xl min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                  color: 'hsl(0 0% 100%)',
                  boxShadow: '0 8px 24px hsla(217, 91%, 60%, 0.35)',
                  opacity: 0,
                  animation: 'fadeSlideUp 0.5s ease-out 1.4s forwards',
                }}
              >
                Launch My Site Free
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}

            {/* Trust line */}
            <div
              className="mt-5 flex items-center gap-4 flex-wrap"
              style={{
                color: 'hsla(0, 0%, 100%, 0.5)',
                opacity: 0,
                animation: 'fadeSlideUp 0.4s ease-out 1.8s forwards',
              }}
            >
              <span className="text-sm font-medium flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent" /> Built in 5 minutes</span>
              <span className="text-primary-foreground/20">•</span>
              <span className="text-sm font-medium flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent" /> Free for 14 days</span>
            </div>

            {/* Social proof */}
            <div
              className="mt-4 inline-flex items-center gap-2 text-sm"
              style={{
                color: 'hsla(0, 0%, 100%, 0.6)',
                opacity: 0,
                animation: 'fadeSlideUp 0.4s ease-out 2.0s forwards',
              }}
            >
              <span className="text-accent text-sm tracking-wide">★★★★★</span>
              <span className="font-semibold">
              Trusted by <strong>200+</strong> detailers · <strong>$2.4M</strong> in bookings captured
              </span>
            </div>
          </div>

          {/* RIGHT: Animation column (Desktop only) */}
          <div
            className="hidden lg:block relative z-[1]"
            style={{
              opacity: 0,
              animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
              clipPath: 'inset(0)',
            }}
          >
            <Suspense fallback={<div className="w-full aspect-[360/700] max-w-[360px] mx-auto" />}>
              <PhoneDashboard />
            </Suspense>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden md:flex flex-col items-center pb-8 pt-4"
          style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.2s forwards' }}
        >
          <span className="text-primary-foreground/40 text-[13px] font-medium tracking-[0.05em] uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Mobile animation section */}
      <div
        className="block lg:hidden relative z-[1] w-full px-5 pb-16 pt-8"
        style={{
          opacity: 0,
          animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
        }}
      >
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
