import { useState, useEffect, useRef, useCallback } from "react";
import heroDetail from "@/assets/hero-detail.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
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

  // Mobile parallax on scroll
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf: number;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        setParallaxY(Math.min(window.scrollY * 0.3, 50));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
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

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-12 md:pt-10 md:pb-20">
        {/* Logo */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">realize:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-14">
          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <span className="bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-4">
                For Mobile Detailers
              </span>

              <h1 className="font-heading text-[32px] md:text-5xl lg:text-[54px] font-extrabold text-primary-foreground leading-[1.15] tracking-tight">
                Stop Losing Money
                <span className="block">to No-Shows.</span>
              </h1>

              <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 leading-[1.6] max-w-xl mx-auto lg:mx-0">
                We build you a custom website + booking system in minutes. Detailers on our platform book <strong className="text-primary-foreground">40% more jobs</strong> and cut no-shows in half.
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
                  Get Started Free →
                </button>
              </form>
              {error && <p className="text-sm text-accent mt-2 text-center lg:text-left">{error}</p>}

              <p className="text-sm text-primary-foreground/60 mt-3 text-center lg:text-left">
                ✓ Free 14-day trial · No credit card · Launch in 5 mins
              </p>

              {/* Social proof */}
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-primary-foreground/60">
                <span className="text-amber-400">★★★★★</span>
                <span>Trusted by 200+ auto detail shops</span>
              </div>

              {/* Mobile image — no box, PNG transparency, parallax */}
              <div className="lg:hidden mt-8 flex justify-center">
                <img
                  src={heroDetail}
                  alt="Detailing booking app showing today's schedule"
                  className="w-[85%] max-w-[360px] h-auto"
                  style={{
                    transform: `translate3d(0, -${parallaxY}px, 0)`,
                    willChange: "transform",
                  }}
                  loading="eager"
                  width={360}
                  height={740}
                />
              </div>
            </div>

            {/* Right: Desktop image — no box, static PNG */}
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
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden bg-primary/95 backdrop-blur-lg border-t border-primary-foreground/10 shadow-xl">
          <button
            type="button"
            onClick={scrollToEmail}
            className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-full shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
          >
            Get Started Free →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
