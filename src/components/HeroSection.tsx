import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Store } from "lucide-react";
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
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(172, 55%, 16%) 0%, hsl(172, 45%, 22%) 40%, hsl(172, 35%, 30%) 70%, hsl(160, 30%, 40%) 100%)'
    }}>
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-0 md:pt-10 md:pb-0">
        {/* Logo */}
        <div className="max-w-6xl mx-auto" style={{
          opacity: 0,
          animation: `heroFadeScale 0.5s ${BOUNCE} 0s forwards`,
        }}>
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-14">
          <div className="max-w-2xl mx-auto text-center lg:text-left lg:max-w-none lg:grid lg:grid-cols-[55%_45%] lg:gap-12 lg:items-center">

            {/* Copy block */}
            <div className="text-left">
              {/* Badge */}
              <span
                className="text-brass text-sm font-serif italic tracking-wide px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 border border-brass/30"
                style={{
                  background: 'linear-gradient(135deg, hsl(37 40% 60% / 0.12), hsl(37 35% 50% / 0.18))',
                  opacity: 0,
                  animation: `fadeSlideDown 0.5s ease-out 0.2s forwards`,
                }}
              >
                ✦ THE PROFESSIONAL'S SYSTEM
              </span>

              {/* Headline - word by word */}
              <h1 className="text-primary-foreground leading-[1.08] tracking-[-0.02em] text-left">
                <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
                  <span className="inline-block" style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 0.4s forwards` }}>
                    Stop Losing{" "}
                  </span>
                  <span className="inline-block text-[110%] font-black" style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 0.6s forwards` }}>
                    $1,200+/Month
                  </span>
                </span>
                <span
                  className="block font-serif italic text-[40px] md:text-[64px] lg:text-[80px] font-semibold text-accent"
                  style={{
                    textShadow: '0 2px 8px rgba(164,214,94,0.15)',
                    opacity: 0,
                    animation: `heroBounceIn 0.7s ${BOUNCE} 0.8s forwards`,
                  }}
                >
                  to Missed Calls
                </span>
              </h1>

              {/* Body - blur to focus */}
              <p
                className="mt-4 text-[15px] md:text-lg text-primary-foreground/70 leading-[1.6] max-w-lg text-left"
                style={{
                  opacity: 0,
                  filter: 'blur(8px)',
                  animation: `heroBlurIn 0.6s ease-out 1.0s forwards`,
                }}
              >
                Get a professional website with 24/7 booking—so customers book themselves while you're in the field. Automated reminders, deposit collection, and a calendar that fills itself. Built in 5 minutes.
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
                    className="h-14 w-full rounded-full border border-primary-foreground/20 bg-primary-foreground/10 pl-10 pr-6 text-sm text-primary-foreground placeholder:text-primary-foreground/30 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 focus:scale-[1.02] transition-all duration-300"
                  />
                </div>
                <button
                  ref={(el) => {
                    (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
                    (magneticRef as React.MutableRefObject<HTMLElement | null>).current = el;
                  }}
                  type="submit"
                  className="group h-14 px-8 text-base font-bold rounded-full shadow-md min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:shadow-[0_12px_32px_rgba(164,214,94,0.35)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  style={{
                    background: 'linear-gradient(180deg, hsl(82 80% 60%) 0%, hsl(82 75% 55%) 100%)',
                    color: 'hsl(var(--accent-foreground))',
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
              <p
                className="mt-4 text-primary-foreground/50 text-sm text-center lg:text-left flex items-center gap-2 justify-center lg:justify-start flex-wrap"
                style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 2.0s forwards` }}
              >
                <span><span className="text-accent">✓</span> Built in 5 minutes</span>
                <span className="text-primary-foreground/30">•</span>
                <span className="font-serif italic text-accent text-[15px]">Free for 14 days</span>
                <span className="text-primary-foreground/30">•</span>
                <span><span className="text-accent">✓</span> Cancel anytime</span>
              </p>

              {/* Social proof inline */}
              <div
                className="mt-5 flex items-center gap-3 justify-center lg:justify-start"
                style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease-out 2.2s forwards` }}
              >
                <span className="text-accent text-sm tracking-wide">★★★★★</span>
                <span className="text-primary-foreground/60 text-sm">Trusted by <strong>200+</strong> detailers · <strong>$2.4M</strong> in bookings captured</span>
              </div>
            </div>

            {/* Desktop image */}
            <div
              className="hidden lg:flex justify-center items-end mt-8"
              style={{
                perspective: '1000px',
                opacity: 0,
                animation: `heroPhoneIn 0.9s ${BOUNCE} 1.6s forwards`,
              }}
            >
              <img
                src={heroDetail}
                alt="Detailing booking app showing today's schedule"
                className="w-full max-w-[480px] h-auto drop-shadow-2xl animate-[heroFloat_3s_ease-in-out_infinite]"
                loading="eager"
                width={480}
                height={888}
              />
            </div>
          </div>

          {/* Mobile image — below CTA */}
          <div
            className="lg:hidden mt-10 flex justify-center"
            style={{ opacity: 0, animation: `fadeSlideUp 0.8s ease-out 1.8s forwards` }}
          >
            <img
              src={heroDetail}
              alt="Detailing booking app showing today's schedule"
              className="w-full max-w-[320px] h-auto drop-shadow-2xl"
              loading="eager"
              width={360}
              height={740}
            />
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden backdrop-blur-lg bg-primary/95 border-t border-primary-foreground/10 shadow-2xl animate-[fadeSlideUp_0.3s_ease-out]">
          <button
            type="button"
            onClick={openFunnel}
            className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
          >
            Build My Website Free →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
