import { useState, useEffect, useRef, useCallback } from "react";
import { Circle, ChevronRight } from "lucide-react";
import heroDetail from "@/assets/hero-detail.png";
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-14">
          <div className="max-w-2xl mx-auto text-center lg:text-left lg:max-w-none lg:grid lg:grid-cols-[55%_45%] lg:gap-12 lg:items-center">

            {/* Copy block */}
            <div className="text-left">
              {/* Badge */}
              <span className="bg-accent/15 text-accent text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 border border-accent/20">
                <Circle className="w-2 h-2 fill-accent text-accent" />
                For Mobile Detailers
              </span>

              {/* Headline */}
              <h1 className="text-primary-foreground leading-[1.08] tracking-tight text-left">
                <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold">
                  Stop Losing $1,200+/Month
                </span>
                <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold text-accent">
                  to Missed Calls
                </span>
              </h1>

              {/* Body */}
              <p className="mt-4 text-[15px] md:text-lg text-primary-foreground/70 leading-[1.6] max-w-lg text-left">
                Get a professional website with 24/7 booking—so customers book themselves while you're in the field. Automated reminders, deposit collection, and a calendar that fills itself. Built in 5 minutes.
              </p>

              {/* Business name form + CTA */}
              <form onSubmit={handleSubmit} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                <div className="relative w-full sm:flex-1">
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); if (error) setError(""); }}
                    placeholder="Elite Mobile Detailing"
                    maxLength={100}
                    className="h-14 w-full rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 focus:border-primary-foreground/50 transition-all"
                  />
                </div>
                <button
                  ref={btnRef}
                  type="submit"
                  className="h-14 px-8 text-base bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  See My Website Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
              {error && <p className="text-sm text-accent mt-2 text-center lg:text-left">{error}</p>}

              {/* Trust line */}
              <p className="mt-4 text-primary-foreground/50 text-sm text-center lg:text-left">
                ✓ Built in 60 seconds • Free for 14 days • Cancel anytime
              </p>

              {/* Social proof inline */}
              <div className="mt-5 flex items-center gap-3 justify-center lg:justify-start">
                <span className="text-amber-400 text-sm tracking-wide">★★★★★</span>
                <span className="text-primary-foreground/60 text-sm">Join 200+ mobile detailers capturing every job</span>
              </div>
            </div>

            {/* Desktop image */}
            <div className="hidden lg:flex justify-center items-end mt-8">
              <img
                src={heroDetail}
                alt="Detailing booking app showing today's schedule"
                className="w-full max-w-[400px] h-auto drop-shadow-2xl"
                loading="eager"
                width={360}
                height={740}
              />
            </div>
          </div>

          {/* Mobile image — below CTA */}
          <div className="lg:hidden mt-10 flex justify-center">
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
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden backdrop-blur-lg bg-primary/95 border-t border-primary-foreground/10 shadow-2xl">
          <button
            type="button"
            onClick={openFunnel}
            className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
          >
            See My Website Now →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
