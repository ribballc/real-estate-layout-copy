import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Store, ChevronDown } from "lucide-react";
import PremiumBookingDemo from "@/components/PremiumBookingDemo";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const HeroSection = () => {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { openFunnel } = useSurveyFunnel();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

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
      {/* Subtle mesh glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 20%, hsla(217, 91%, 60%, 0.06), transparent)',
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      {/* Main hero content area */}
      <div className="relative z-10 px-5 md:px-8 lg:px-20 pt-6 md:pt-10">
        {/* Logo */}
        <div className="max-w-[1400px] mx-auto w-full" style={{
          opacity: 0,
          animation: 'heroFadeScale 0.5s ease-out 0s forwards',
        }}>
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio</h2>
        </div>

        {/* Two-column grid */}
        <div className="max-w-[1400px] mx-auto mt-8 md:mt-14 w-full grid grid-cols-1 lg:grid-cols-[42%_58%] gap-8 lg:gap-6 items-center min-h-[calc(100vh-120px)]">

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
              For Mobile Detailers
            </span>

            {/* Headline */}
            <h1 className="text-primary-foreground leading-[1.1] tracking-[-0.02em]">
              <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold">
                <span className="inline-block" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.4s forwards' }}>
                  Stop Losing{" "}
                </span>
                <span className="inline-block text-sky text-[40px] md:text-[64px] lg:text-[85px]" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.6s forwards' }}>
                  $1,200+/Month
                </span>
              </span>
              <span
                className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold"
                style={{ opacity: 0, animation: 'fadeSlideUp 0.6s ease-out 0.8s forwards' }}
              >
                to Missed Calls
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
              Get a professional website with 24/7 booking. Customers book themselves while you're in the field. Automated reminders, deposits, and a calendar that fills itself.
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
                ref={btnRef}
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
                Activate My Free Website
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
              <span className="text-sm font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Built in 5 minutes</span>
              <span className="text-primary-foreground/20">•</span>
              <span className="text-sm font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Free for 14 days</span>
              <span className="text-primary-foreground/20">•</span>
              <span className="text-sm font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Cancel anytime</span>
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
            <PremiumBookingDemo />
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

      {/* Mobile animation section - completely separate from text */}
      <div
        className="block lg:hidden relative z-[1] w-full px-5 pb-16 pt-8"
        style={{
          opacity: 0,
          animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
        }}
      >
        <div className="w-full max-w-[500px] mx-auto min-h-[400px]">
          <PremiumBookingDemo />
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden border-t border-primary-foreground/10 shadow-2xl animate-[fadeSlideUp_0.3s_ease-out]"
          style={{ background: 'hsla(215, 50%, 10%, 0.95)', backdropFilter: 'blur(16px)' }}
        >
          <button
            type="button"
            onClick={openFunnel}
            className="w-full h-14 font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 min-h-[48px] text-primary-foreground"
            style={{
              background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
            }}
          >
            Activate My Free Website →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
