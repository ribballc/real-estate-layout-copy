import { useState, useEffect, useRef, useCallback } from "react";
import heroDetail from "@/assets/hero-detail.png";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const HeroSection = () => {
  const [email, setEmail] = useState("");
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
    const trimmed = email.trim();
    if (!trimmed) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email"); return; }
    window.dispatchEvent(new CustomEvent("hero-email", { detail: trimmed }));
    openFunnel();
  }, [email, openFunnel]);

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
              <span className="bg-accent/15 text-accent text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-3 border border-accent/20">
                For Mobile Detailers
              </span>

              {/* Headline */}
              <h1 className="text-primary-foreground leading-[1.08] tracking-tight text-left">
                <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold">
                  Book Jobs in Your Sleep.
                </span>
                <span className="block font-heading text-[36px] md:text-[56px] lg:text-[72px] font-extrabold text-accent">
                  Get Paid Before You Show Up.
                </span>
              </h1>

              {/* Body */}
              <p className="mt-4 text-[15px] md:text-lg text-primary-foreground/70 leading-[1.6] max-w-lg text-left">
                The booking system that runs itself: customers book 24/7, deposits hit your account automatically, and your calendar stays packed. Set up in 5 minutes. No tech skills needed.
              </p>

              {/* Email form + CTA */}
              <form onSubmit={handleSubmit} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  placeholder="Enter your work email"
                  maxLength={255}
                  className="h-14 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 w-full sm:flex-1 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 focus:border-primary-foreground/50 transition-all"
                />
                <button
                  ref={btnRef}
                  type="submit"
                  className="h-14 px-8 text-base bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
                >
                  Start My Free Trial →
                </button>
              </form>
              {error && <p className="text-sm text-accent mt-2 text-center lg:text-left">{error}</p>}

              {/* Social proof inline */}
              <div className="mt-6 flex items-center gap-3 justify-center lg:justify-start">
                {/* Avatar stack */}
                <div className="flex -space-x-2">
                  {['M', 'J', 'A', 'K'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-xs font-bold"
                      style={{
                        background: [
                          'hsl(82, 75%, 55%)',
                          'hsl(172, 55%, 30%)',
                          'hsl(42, 85%, 55%)',
                          'hsl(200, 60%, 50%)',
                        ][i],
                        color: i === 0 ? 'hsl(172, 55%, 16%)' : 'white',
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <span className="text-primary-foreground font-bold text-sm block leading-tight">1,200+</span>
                  <span className="text-primary-foreground/50 text-xs leading-tight">Trusted by mobile detailers</span>
                </div>
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
            Start Free Trial →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
