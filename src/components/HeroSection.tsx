import { useState, useEffect, useRef } from "react";
import phoneMockup from "@/assets/phone-mockup.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

  // Parallax effect for mobile only
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) return;
      const scrollY = window.scrollY;
      const offset = Math.min(scrollY * 0.3, 50);
      setParallaxY(-offset);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email"); return; }
    const formSection = document.getElementById("form-funnel");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToForm = () => {
    const formSection = document.getElementById("form-funnel");
    if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
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
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{ background: `linear-gradient(to bottom, transparent, hsl(var(--background)))` }}
      />

      <div className="relative z-10 px-6 pt-8 pb-32">
        {/* Logo */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-primary-foreground tracking-tight">realize:</h2>
        </div>

        {/* Hero Content - 2 col on desktop */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-20">
          <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="text-center md:text-left">
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.08]">
                Stop Losing $1,000s to No-Shows.
                <span className="block mt-2">Get More Bookings on Autopilot.</span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-lg mx-auto md:mx-0">
                Custom website + smart booking calendar built in 48 hours. Mobile detailers using our system book <strong className="text-primary-foreground">40% more jobs</strong> and cut no-shows in half.
              </p>

              {/* CTA area */}
              <div className="mt-8 flex flex-col items-center md:items-start gap-3 max-w-md mx-auto md:mx-0">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                  <div className="w-full relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      placeholder="Enter your email address"
                      maxLength={255}
                      className="w-full px-6 py-4 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-base focus:outline-none focus:border-primary-foreground/50 focus:ring-2 focus:ring-primary-foreground/20 transition-all"
                    />
                  </div>
                  {error && <p className="text-sm text-accent">{error}</p>}
                  <button
                    ref={btnRef}
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(72,80%,75%)] text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-[hsl(72,80%,70%)] transition-colors duration-300 shadow-lg"
                  >
                    Create My Website Free
                  </button>
                </form>

                {/* Phone mockup - mobile only, between CTA and demo link */}
                <div
                  ref={phoneRef}
                  className="md:hidden w-[85%] max-w-[360px] mx-auto mt-10 mb-8"
                  style={{
                    willChange: 'transform',
                    transform: `translate3d(0, ${parallaxY}px, 0)`,
                    transition: 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <img src={phoneMockup} alt="Phone showing booking schedule" className="w-full h-auto" />
                </div>

                {/* Secondary CTA */}
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-medium transition-colors underline underline-offset-4"
                >
                  See a demo site →
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs md:text-sm text-primary-foreground/60">
                <span>✓ 14-day free trial</span>
                <span>✓ No credit card required</span>
                <span>✓ Setup in 48 hours</span>
              </div>
              <p className="mt-2 text-xs text-primary-foreground/40 text-center md:text-left">
                Built for mobile detailers, PPF shops, and tint specialists
              </p>

              {/* Phone mockup - tablet only */}
              <div className="hidden md:block lg:hidden mt-12 mb-8 mx-auto" style={{ width: '70%', maxWidth: '420px' }}>
                <img src={phoneMockup} alt="Phone showing booking schedule" className="w-full h-auto" />
              </div>
            </div>

            {/* Right: Phone mockup - desktop only */}
            <div className="hidden lg:flex justify-center items-center relative z-10">
              <img
                src={phoneMockup}
                alt="Phone showing booking schedule"
                className="w-full max-w-[400px] h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile button */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
          <button
            type="button"
            onClick={scrollToForm}
            className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(72,80%,75%)] text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-[hsl(72,80%,70%)] transition-colors duration-300 shadow-lg"
          >
            Create My Website Free
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
