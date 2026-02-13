import { useState, useEffect, useRef } from "react";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

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
    if (!trimmed) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }

    // Scroll to the form funnel section
    const formSection = document.getElementById("form-funnel");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
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
      {/* Bottom fade to background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{
          background: `linear-gradient(to bottom, transparent, hsl(var(--background)))`,
        }}
      />

      <div className="relative z-10 px-6 pt-8 pb-32">
        {/* Logo */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-primary-foreground tracking-tight">realize:</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mt-8 md:mt-24">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.05]">
            Your Website Built In Just A Few Clicks (For FREE)
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-snug">
            Get your business listing in front of the right audience with targeted, outcome-based advertising
          </p>

          {/* Email capture form */}
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center gap-3 max-w-md mx-auto">
            <div className="w-full relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your email address"
                maxLength={255}
                className="w-full px-6 py-4 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-base focus:outline-none focus:border-primary-foreground/50 focus:ring-2 focus:ring-primary-foreground/20 transition-all"
              />
            </div>
            {error && (
              <p className="text-sm text-accent">{error}</p>
            )}
            <button
              ref={btnRef}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(72,80%,75%)] text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-[hsl(72,80%,70%)] transition-colors duration-300 shadow-lg"
            >
              Create My Website Free
            </button>
          </form>
        </div>
      </div>

      {/* Sticky mobile button */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden">
          <button
            type="button"
            onClick={() => {
              const formSection = document.getElementById("form-funnel");
              if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
            }}
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
