import { useState, useEffect, useRef } from "react";
import phoneMockup from "@/assets/phone-mockup.png";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
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
                Stop Losing Money to No-Shows.
                <span className="block mt-2">Get More Bookings on Autopilot.</span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-lg mx-auto md:mx-0">
                We build you a custom website + smart booking calendar in 48 hours. Mobile detailers using our system book <strong className="text-primary-foreground">40% more jobs</strong> and cut no-shows in half.
              </p>

              {/* CTA area */}
              <div className="mt-8 flex flex-col items-center md:items-start gap-3 max-w-md mx-auto md:mx-0">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                  <div className="w-full relative">
                    <input
                      ref={emailRef}
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

                {/* Phone mockup - mobile only */}
                <div className="md:hidden w-[85%] max-w-[360px] mx-auto mt-10 mb-8">
                  <img src={phoneMockup} alt="Phone showing booking schedule" className="w-full h-auto" />
                </div>

                {/* Secondary CTA */}
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-medium transition-colors underline underline-offset-4"
                >
                  See a live demo site →
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs md:text-sm text-primary-foreground/60">
                <span>✓ 14-day free trial</span>
                <span>✓ No credit card required</span>
                <span>✓ Live in 48 hours</span>
              </div>
              <p className="mt-2 text-xs text-primary-foreground/40 text-center md:text-left">
                Join 200+ detailers, PPF, and tint shops already growing with us
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
            onClick={scrollToEmail}
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
