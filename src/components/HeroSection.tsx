import { useState, useEffect, useRef, useCallback } from "react";
import phoneMockup from "@/assets/phone-mockup.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Sticky CTA observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

  // Desktop horizontal parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (imageRef.current && window.innerWidth >= 1024) {
            const scrollY = window.scrollY;
            const offset = Math.min(scrollY * 0.4, 300);
            imageRef.current.style.transform = `translate3d(-${offset}px, 0, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email"); return; }
    window.dispatchEvent(new CustomEvent("hero-email", { detail: trimmed }));
    const formSection = document.getElementById("form-funnel");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
  }, [email]);

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 px-5 md:px-8 pt-5 pb-10 md:pt-8 md:pb-16 lg:pb-20">
        {/* Logo */}
        <div className="max-w-6xl mx-auto">
          <span className="text-xl font-heading font-bold text-primary-foreground tracking-tight">
            velarrio:
          </span>
        </div>

        {/* Hero grid */}
        <div className="max-w-6xl mx-auto mt-5 md:mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-[52%_48%] gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN — Copy + CTA */}
            <div className="text-center md:text-left">
              <h1 className="font-heading text-[27px] md:text-[42px] lg:text-[52px] font-extrabold text-primary-foreground leading-[1.18] tracking-tight">
                Stop Losing $1,000s<br className="md:hidden" /> to No-Shows.
                <span className="block mt-1 md:mt-2 text-[hsl(var(--accent))]">
                  Get Booked 24/7<br className="md:hidden" /> on Autopilot.
                </span>
              </h1>

              <p className="mt-3 md:mt-5 text-[15px] md:text-lg text-primary-foreground/75 leading-[1.55] max-w-md mx-auto md:mx-0">
                Done-for-you website + booking system in 48 hours. Auto reminders and deposits cut no-shows by 40%.
              </p>

              <div className="mt-5 md:mt-8 max-w-sm mx-auto md:mx-0">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="Enter your work email"
                    maxLength={255}
                    className="w-full h-[52px] px-5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-base focus:outline-none focus:border-primary-foreground/50 focus:ring-2 focus:ring-primary-foreground/20 transition-all"
                  />
                  {error && <p className="text-sm text-accent px-2">{error}</p>}
                  <button
                    ref={btnRef}
                    type="submit"
                    className="w-full h-[52px] inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-full text-[16px] font-bold hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg"
                  >
                    Start My Free Trial →
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1 text-[13px] text-primary-foreground/55">
                  <span>✓ 14-day free trial</span>
                  <span>✓ No credit card</span>
                  <span>✓ Live in 48hrs</span>
                </div>
              </div>

              <div className="mt-3 text-center md:text-left">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("pricing");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-primary-foreground/60 hover:text-primary-foreground text-sm font-medium transition-colors underline underline-offset-4"
                >
                  See pricing →
                </button>
              </div>

              <p className="mt-3 md:mt-4 text-[13px] text-primary-foreground/40 text-center md:text-left">
                Trusted by 200+ detailers, PPF & tint shops
              </p>

              {/* PHONE MOCKUP — TABLET ONLY (md but not lg) */}
              <div className="hidden md:block lg:hidden mt-8 mx-auto" style={{ width: '55%', maxWidth: '320px' }}>
                <img
                  src={phoneMockup}
                  alt="Booking calendar on phone"
                  className="w-full h-auto"
                  width={320}
                  height={655}
                />
              </div>
            </div>

            {/* RIGHT COLUMN — Desktop image with horizontal parallax */}
            <div
              ref={imageRef}
              className="hidden lg:block relative"
              style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
            >
              <div className="relative">
                <img
                  src={phoneMockup}
                  alt="Booking calendar on phone"
                  className="w-full max-w-[380px] h-auto drop-shadow-2xl mx-auto"
                  width={380}
                  height={778}
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHONE MOCKUP — MOBILE ONLY */}
      <div className="relative z-10 md:hidden px-5 -mt-2 pb-8">
        <div className="w-[65%] max-w-[240px] mx-auto">
          <img
            src={phoneMockup}
            alt="Booking calendar on phone"
            className="w-full h-auto drop-shadow-xl"
            width={240}
            height={492}
            loading="eager"
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: `linear-gradient(to bottom, transparent, hsl(var(--background)))` }}
      />

      {/* Sticky mobile CTA */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 md:hidden backdrop-blur-lg bg-primary/90 border-t border-primary-foreground/10 shadow-2xl">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("form-funnel");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full h-[52px] inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-full text-[16px] font-bold hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Start Free Trial →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
