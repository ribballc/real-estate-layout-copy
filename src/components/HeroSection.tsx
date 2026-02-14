import { useState, useEffect, useRef, useCallback } from "react";
import heroDetail from "@/assets/hero-detail.png";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const { openFunnel } = useSurveyFunnel();

  // Sticky CTA observer
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
    if (!trimmed) { setError("Please enter your business name"); return; }
    window.dispatchEvent(new CustomEvent("hero-email", { detail: trimmed }));
    openFunnel();
  }, [email, openFunnel]);

  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-20 md:pt-10 md:pb-20">
        {/* Logo */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mt-6 md:mt-16">
          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <span className="bg-accent/10 text-accent text-base md:text-lg font-semibold px-5 py-2 rounded-full inline-block mb-4">
                For Mobile Detailers
              </span>

              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.12]">
                Book Jobs in Your Sleep.
                <span className="block text-[hsl(var(--accent))]">Get Paid Before You Show Up.</span>
              </h1>

              <p className="mt-5 text-base md:text-lg text-primary-foreground/80 leading-[1.6] max-w-lg mx-auto lg:mx-0">
                Activate your own AI booking assistant in 60 seconds: it books customers 24/7, collects deposits to your account automatically, and keeps your calendar packed—while you detail. See it work instantly.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col md:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary-foreground/70 mb-1.5 text-left">Your Business Name</label>
                  <input
                    ref={emailRef}
                    type="text"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="Example: 'Elite Mobile Detailing'"
                    maxLength={255}
                    className="h-14 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 w-full min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 focus:border-primary-foreground/50 transition-all"
                  />
                </div>
                <button
                  ref={btnRef}
                  type="submit"
                  className="h-14 px-8 text-base bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px] md:self-end"
                >
                  See My AI Assistant Now →
                </button>
              </form>
              {error && <p className="text-sm text-accent mt-2 text-center lg:text-left">{error}</p>}

              <div className="mt-4 text-sm text-primary-foreground/70 text-center lg:text-left">
                <span>✓ See it live in 60 seconds • Free for 14 days • No credit card yet</span>
              </div>

              {/* See pricing link */}
              <div className="mt-4 text-center lg:text-left">
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className="text-sm text-accent underline underline-offset-2 hover:brightness-110 transition-all"
                >
                  See pricing →
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-primary-foreground/60">
                <span>⭐⭐⭐⭐⭐</span>
                <span>Trusted by 200+ detailers, PPF shops, and tint specialists</span>
              </div>
            </div>

            {/* Right: Desktop image — static PNG */}
            <div className="hidden lg:flex justify-center items-center">
              <img
                src={heroDetail}
                alt="Detailing booking app showing today's schedule"
                className="w-full max-w-[420px] h-auto drop-shadow-2xl"
                loading="eager"
                width={360}
                height={740}
              />
            </div>
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
