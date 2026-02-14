import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Store, ChevronDown } from "lucide-react";
import heroDetail from "@/assets/hero-detail.png";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import { useMagnetic } from "@/hooks/useMagnetic";

const BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const HeroSection = () => {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const magneticRef = useMagnetic(0.15, 10);
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
    <section className="relative overflow-hidden min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, hsl(160 50% 8%) 0%, hsl(160 40% 14%) 50%, hsl(160 50% 8%) 100%)'
    }}>
      {/* Radial glow */}
      <div className="absolute inset-0 opacity-100" style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 20%, hsla(82, 65%, 55%, 0.07), transparent)',
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-0 md:pt-10 md:pb-0 flex-1 flex flex-col">
        {/* Logo */}
        <div className="max-w-6xl mx-auto w-full" style={{
          opacity: 0,
          animation: `heroFadeScale 0.5s ${BOUNCE} 0s forwards`,
        }}>
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-14 flex-1 w-full">
          <div className="max-w-2xl mx-auto text-center lg:text-left lg:max-w-none lg:grid lg:grid-cols-[55%_45%] lg:gap-12 lg:items-center">

            {/* Copy block */}
            <div className="text-left">
              {/* Badge */}
              <span
                className="text-accent text-xs font-heading font-semibold tracking-[0.1em] uppercase px-4 py-2 rounded-full inline-flex items-center gap-2 mb-5"
                style={{
                  background: 'hsla(82, 65%, 55%, 0.12)',
                  border: '1px solid hsla(82, 65%, 55%, 0.25)',
                  boxShadow: '0 0 20px hsla(82, 65%, 55%, 0.15)',
                  opacity: 0,
                  animation: `fadeSlideDown 0.5s ease-out 0.2s forwards`,
                }}
              >
                FOR MOBILE DETAILERS
              </span>

              {/* Headline */}
              <h1 className="text-primary-foreground leading-[0.95] tracking-[-0.03em] text-left">
                <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-bold">
                  <span className="inline-block" style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 0.4s forwards` }}>
                    Stop Losing{" "}
                  </span>
                  <span className="inline-block" style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 0.6s forwards` }}>
                    $1,200+/Month
                  </span>
                </span>
                <span
                  className="block font-serif italic text-[40px] md:text-[64px] lg:text-[80px] text-accent"
                  style={{
                    textShadow: '0 0 40px hsla(82, 65%, 55%, 0.3)',
                    marginLeft: '-4px',
                    opacity: 0,
                    animation: `heroBounceIn 0.7s ${BOUNCE} 0.8s forwards`,
                  }}
                >
                  to Missed Calls
                </span>
              </h1>

              {/* Sub-headline */}
              <p
                className="mt-5 text-[15px] md:text-lg leading-[1.7] max-w-lg text-left"
                style={{
                  color: 'hsla(0, 0%, 100%, 0.7)',
                  opacity: 0,
                  filter: 'blur(8px)',
                  animation: `heroBlurIn 0.6s ease-out 1.0s forwards`,
                }}
              >
                Get a professional website with 24/7 booking. Customers book themselves while you're in the field. Automated reminders, deposits, and a calendar that fills itself.
              </p>

              {/* Business name form + CTA */}
              <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0"
                style={{ opacity: 0, animation: `heroFormIn 0.6s ease-out 1.2s forwards` }}
              >
                <div className="relative w-full sm:flex-1" style={{ opacity: 0, animation: `heroScaleIn 0.5s ease-out 1.2s forwards` }}>
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/30" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); if (error) setError(""); }}
                    placeholder="Enter Your Business Name"
                    maxLength={100}
                    className="h-14 w-full rounded-[14px] pl-10 pr-6 text-sm text-primary-foreground placeholder:text-primary-foreground/35 min-h-[52px] focus:outline-none focus:scale-[1.01] transition-all duration-300"
                    style={{
                      background: 'hsla(0, 0%, 100%, 0.08)',
                      border: '1px solid hsla(0, 0%, 100%, 0.15)',
                      backdropFilter: 'blur(10px)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid hsl(82 65% 55%)';
                      e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.12)';
                      e.currentTarget.style.boxShadow = '0 0 24px hsla(82, 65%, 55%, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid hsla(0, 0%, 100%, 0.15)';
                      e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button
                  ref={(el) => {
                    (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
                    (magneticRef as React.MutableRefObject<HTMLElement | null>).current = el;
                  }}
                  type="submit"
                  className="group h-14 px-10 text-base font-bold rounded-[14px] min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400"
                  style={{
                    background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
                    color: 'hsl(160 50% 8%)',
                    boxShadow: '0 8px 24px hsla(82, 65%, 55%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.2)',
                    opacity: 0,
                    animation: `heroBounceIn 0.6s ${BOUNCE} 1.4s forwards, ctaGlow 3s ease-in-out 2.5s infinite`,
                  }}
                >
                  Build My Website Free
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </form>
              {error && <p className="text-sm text-accent mt-2 text-center lg:text-left">{error}</p>}

              {/* Trust line */}
              <div
                className="mt-5 flex items-center gap-5 justify-center lg:justify-start flex-wrap"
                style={{
                  color: 'hsla(0, 0%, 100%, 0.55)',
                  opacity: 0,
                  animation: `fadeSlideUp 0.5s ease-out 2.0s forwards`,
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
                className="mt-5 inline-flex items-center gap-3 px-5 py-3 rounded-xl"
                style={{
                  background: 'hsla(0, 0%, 100%, 0.05)',
                  border: '1px solid hsla(0, 0%, 100%, 0.1)',
                  backdropFilter: 'blur(10px)',
                  opacity: 0,
                  animation: `fadeSlideUp 0.5s ease-out 2.2s forwards`,
                }}
              >
                <span className="text-accent text-sm tracking-wide">★★★★★</span>
                <span className="text-primary-foreground/80 text-sm font-medium">
                  Trusted by <strong>200+</strong> detailers · <strong>$2.4M</strong> in bookings
                </span>
              </div>
            </div>

            {/* Desktop image */}
            <div
              className="hidden lg:flex justify-center items-end mt-8"
              style={{
                perspective: '1200px',
                opacity: 0,
                animation: `heroPhoneIn 0.9s ${BOUNCE} 1.6s forwards`,
              }}
            >
              <img
                src={heroDetail}
                alt="Detailing booking app showing today's schedule"
                className="w-full max-w-[520px] h-auto animate-[heroFloat_4s_ease-in-out_infinite]"
                style={{
                  transform: 'perspective(1200px) rotateY(-8deg) rotateX(2deg)',
                  filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))',
                }}
                loading="eager"
                width={520}
                height={960}
              />
            </div>
          </div>

          {/* Mobile image */}
          <div
            className="lg:hidden mt-10 flex justify-center"
            style={{ opacity: 0, animation: `fadeSlideUp 0.8s ease-out 1.8s forwards` }}
          >
            <img
              src={heroDetail}
              alt="Detailing booking app showing today's schedule"
              className="w-full max-w-[280px] h-auto"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
              loading="eager"
              width={280}
              height={520}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden md:flex flex-col items-center pb-8 mt-auto"
          style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 2.4s forwards` }}
        >
          <span className="text-primary-foreground/40 text-xs tracking-[0.1em] uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden border-t border-primary-foreground/10 shadow-2xl animate-[fadeSlideUp_0.3s_ease-out]"
          style={{ background: 'hsla(160, 50%, 8%, 0.95)', backdropFilter: 'blur(16px)' }}
        >
          <button
            type="button"
            onClick={openFunnel}
            className="w-full h-14 font-bold rounded-[14px] shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
            style={{
              background: 'linear-gradient(135deg, hsl(82 65% 55%) 0%, hsl(82 55% 45%) 100%)',
              color: 'hsl(160 50% 8%)',
            }}
          >
            Build My Website Free →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
