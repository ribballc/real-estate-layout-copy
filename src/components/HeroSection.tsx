import { useState, useEffect, useRef } from "react";
import { CalendarCheck, MessageSquareWarning, Smartphone } from "lucide-react";

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
        <div className="max-w-5xl mx-auto mt-8 md:mt-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
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

                {/* Secondary CTA */}
                <button
                  type="button"
                  onClick={() => {
                    const formSection = document.getElementById("form-funnel");
                    if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                  }}
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
            </div>

            {/* Right: Visual mockup */}
            <div className="hidden md:flex flex-col gap-4">
              {/* Split screen comparison */}
              <div className="grid grid-cols-2 gap-3">
                {/* Before - chaotic */}
                <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareWarning className="w-5 h-5 text-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wide">Before</span>
                  </div>
                  <div className="space-y-2">
                    {["Hey can I book tmrw?", "What time works?", "Nvm I'll txt later", "Still available??"].map((msg, i) => (
                      <div key={i} className={`text-xs px-3 py-2 rounded-xl ${i % 2 === 0 ? 'bg-primary-foreground/10 text-primary-foreground/60 ml-auto max-w-[85%]' : 'bg-primary-foreground/5 text-primary-foreground/40 mr-auto max-w-[85%]'}`}>
                        {msg}
                      </div>
                    ))}
                    <div className="text-[10px] text-accent/80 font-medium mt-2 text-center">😩 3 no-shows this week</div>
                  </div>
                </div>

                {/* After - clean calendar */}
                <div className="bg-primary-foreground/5 border border-[hsl(72,80%,75%)]/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarCheck className="w-5 h-5 text-[hsl(72,80%,75%)]" />
                    <span className="text-xs font-bold text-[hsl(72,80%,75%)] uppercase tracking-wide">After</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: "9:00 AM", name: "Full Detail", status: "Confirmed ✓" },
                      { time: "12:00 PM", name: "Interior Clean", status: "Confirmed ✓" },
                      { time: "3:00 PM", name: "PPF Install", status: "Confirmed ✓" },
                    ].map((apt, i) => (
                      <div key={i} className="bg-primary-foreground/10 rounded-lg px-3 py-2 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-primary-foreground/80">{apt.time}</div>
                          <div className="text-[10px] text-primary-foreground/50">{apt.name}</div>
                        </div>
                        <span className="text-[10px] text-[hsl(72,80%,75%)] font-medium">{apt.status}</span>
                      </div>
                    ))}
                    <div className="text-[10px] text-[hsl(72,80%,75%)] font-medium mt-2 text-center">🎉 0 no-shows this week</div>
                  </div>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-5 flex items-center gap-5">
                <div className="flex-shrink-0">
                  <Smartphone className="w-10 h-10 text-primary-foreground/30" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-foreground/80">3 taps to book</p>
                  <p className="text-xs text-primary-foreground/50 mt-1">
                    Customers pick a service, choose a time, and confirm — no calls, no texts, no chasing.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
