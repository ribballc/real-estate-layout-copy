import { useState, useEffect, useRef, useCallback } from "react";
import heroDetail from "@/assets/hero-detail.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

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
    if (!trimmed) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email"); return; }
    window.dispatchEvent(new CustomEvent("hero-email", { detail: trimmed }));
    const formSection = document.getElementById("form-funnel");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
  }, [email]);

  const scrollToEmail = () => {
    if (emailRef.current) {
      emailRef.current.scrollIntoView({ behavior: "smooth" });
      emailRef.current.focus({ preventScroll: true });
    }
  };

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
                Stop Losing $1,000s to
                <span className="block">No-Shows and Missed Calls.</span>
                <span className="block text-[hsl(var(--accent))]">Get Booked 24/7 on Autopilot.</span>
              </h1>

              <p className="mt-5 text-base md:text-lg text-primary-foreground/80 leading-[1.6] max-w-lg mx-auto lg:mx-0">
                Custom website + 24/7 smart booking calendar built for you in 48 hours. Automated reminders and deposit collection cut no-shows by 40% — so you stop losing $500-1,000/month in missed appointments.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col md:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  placeholder="Enter your work email"
                  maxLength={255}
                  className="h-14 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 w-full md:flex-1 min-h-[52px] focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 focus:border-primary-foreground/50 transition-all"
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

              <div className="mt-4 flex flex-col gap-1 text-sm text-primary-foreground/70 text-center lg:text-left">
                <span>✓ 14-day free trial — no credit card</span>
                <span>✓ Done-for-you website live in 48 hours</span>
                <span>✓ Cancel anytime, no contracts</span>
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
                <span className="text-amber-400">★★★★★</span>
                <span>Trusted by 200+ mobile detailers, PPF shops, and tint specialists</span>
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
            onClick={scrollToEmail}
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
