import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import darkerLogo from "@/assets/darker-logo.png";
import heroPenguin from "@/assets/hero-penguin.png";
import heroPenguinMobile from "@/assets/hero-penguin-mobile.png";
import { ChevronRight, ChevronDown, Mail } from "lucide-react";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import { trackEvent } from "@/lib/tracking";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { openFunnel } = useSurveyFunnel();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) { setError("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email"); return; }

    trackEvent({
      eventName: "hero_email_captured",
      type: "trackCustom",
      customData: { content_name: "Hero Email Captured", email: trimmed },
    });

    openFunnel(trimmed);
    setEmail("");
  }, [email, openFunnel]);

  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)'
    }}>
      {/* Glow Orbs */}
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 500, height: 500, top: "-15%", left: "-10%",
        background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.4), transparent)",
        filter: "blur(80px)", opacity: 0.15, animation: "orbFloat1 25s ease-in-out infinite",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 600, height: 600, bottom: "-20%", right: "-10%",
        background: "radial-gradient(circle, hsla(213, 94%, 68%, 0.3), transparent)",
        filter: "blur(80px)", opacity: 0.12, animation: "orbFloat2 30s ease-in-out infinite 5s",
      }} />
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 300, height: 300, top: "40%", left: "60%",
        background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.25), transparent)",
        filter: "blur(80px)", opacity: 0.08, animation: "orbFloat3 35s ease-in-out infinite 10s",
      }} />

      {/* Grid patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(45deg, hsla(0, 0%, 100%, 1) 1px, transparent 1px), linear-gradient(-45deg, hsla(0, 0%, 100%, 1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      {/* Main content */}
      <div className="relative z-10 px-5 md:px-8 lg:px-20 pt-5 md:pt-4">
        {/* Logo + Login */}
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between" style={{
          opacity: 0, animation: 'heroFadeScale 0.5s ease-out 0s forwards',
        }}>
          <img src={darkerLogo} alt="Darker" className="h-8 md:h-10 w-auto" />
          <Link
            to="/login"
            className="text-sm font-medium transition-colors duration-200 hover:underline underline-offset-4"
            style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'hsla(217, 91%, 70%, 0.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'hsla(0, 0%, 100%, 0.4)')}
          >
            Log in →
          </Link>
        </div>

        {/* Two-column grid */}
        <div className="max-w-[1400px] mx-auto mt-1 md:mt-1 lg:mt-2 w-full grid grid-cols-1 lg:grid-cols-[42%_58%] gap-8 lg:gap-6 items-center min-h-[calc(100vh-120px)]">

          {/* LEFT: Text column */}
          <div className="relative z-10 text-left">
            {/* Audience tag */}
            <span
              className="text-[13px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-6"
              style={{
                background: 'hsla(217, 91%, 60%, 0.1)',
                border: '1px solid hsla(217, 91%, 60%, 0.2)',
                color: 'hsl(217, 91%, 70%)',
                opacity: 0, animation: 'fadeSlideDown 0.4s ease-out 0.2s forwards',
              }}
            >
              FOR DETAILERS & INSTALLERS
            </span>

            {/* Headline */}
            <h1 className="text-primary-foreground leading-[1.1] tracking-[-0.02em]">
              <span className="block font-heading text-[30px] md:text-[44px] lg:text-[48px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.4s forwards' }}>
                Stop chasing clients.
              </span>
              <span className="block font-heading text-[30px] md:text-[44px] lg:text-[48px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.55s forwards' }}>
                Start filling your calendar
              </span>
              <span className="block font-heading text-[30px] md:text-[44px] lg:text-[48px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.7s forwards' }}>
                automatically.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="mt-5 text-[15px] md:text-lg leading-[1.65] max-w-[540px]"
              style={{ color: 'hsla(0, 0%, 100%, 0.65)', opacity: 0, animation: 'heroBlurIn 0.5s ease-out 1.0s forwards' }}
            >
              Launch a pro booking site in 5 minutes that takes deposits, sends reminders, and keeps your schedule full while you're working on cars.
            </p>

            {/* Microcopy + Email CTA */}
            <div
              className="mt-7 max-w-lg"
              style={{ opacity: 0, animation: 'heroFormIn 0.5s ease-out 1.2s forwards' }}
            >
              <p className="text-[15px] font-semibold mb-1" style={{ color: 'hsla(0, 0%, 100%, 0.85)' }}>
                Get your free site + live demo
              </p>
              <p className="text-[13px] mb-3" style={{ color: 'hsla(0, 0%, 100%, 0.45)' }}>
                Enter your email to see how it works in real time.
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative w-full sm:flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsla(0, 0%, 100%, 0.3)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="h-14 w-full rounded-xl pl-10 pr-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 min-h-[52px] focus:outline-none transition-all duration-200"
                    style={{
                      background: 'hsla(0, 0%, 100%, 0.08)',
                      border: '1px solid hsla(0, 0%, 100%, 0.15)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid hsl(217 91% 60%)';
                      e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.12)';
                      e.currentTarget.style.boxShadow = '0 0 0 4px hsla(217, 91%, 60%, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid hsla(0, 0%, 100%, 0.15)';
                      e.currentTarget.style.background = 'hsla(0, 0%, 100%, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="group h-14 px-8 text-base font-semibold rounded-xl min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                    color: 'hsl(0 0% 100%)',
                    boxShadow: '0 8px 24px hsla(217, 91%, 60%, 0.35)',
                  }}
                >
                  Claim My Free Site
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>

              {error && <p className="text-sm text-destructive mt-2 animate-in fade-in duration-200">{error}</p>}

              {/* Reassurance */}
              <p className="text-[12px] mt-3" style={{ color: 'hsla(0, 0%, 100%, 0.4)' }}>
                No credit card needed. Go live in one day.
              </p>
            </div>

            {/* Social proof – single compact line */}
            <div className="mt-5 inline-flex items-center gap-2 text-sm" style={{
              color: 'hsla(0, 0%, 100%, 0.55)', opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 1.6s forwards',
            }}>
              <span className="font-semibold" style={{ color: 'hsla(0, 0%, 100%, 0.75)' }}>4.9</span>
              <span className="text-accent tracking-wide">★★★★★</span>
              <span>used by 200+ auto detailers and shops.</span>
            </div>
          </div>

          {/* RIGHT: Penguin Hero (Desktop) */}
          <div className="hidden lg:flex relative z-[1] items-end justify-center" style={{
            opacity: 0, animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
          }}>
            <img
              src={heroPenguin}
              alt="Darker mascot penguin holding a phone with the dashboard"
              className="w-full max-w-[520px] h-auto object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 40px hsla(217, 91%, 20%, 0.4))' }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:flex flex-col items-center pb-8 pt-4" style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.0s forwards' }}>
          <span className="text-primary-foreground/40 text-[13px] font-medium tracking-[0.05em] uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Mobile penguin hero — full width, flush with section below */}
      <div className="block lg:hidden relative z-[1] w-full -mb-px">
        <img
          src={heroPenguinMobile}
          alt="Darker mascot penguin holding a phone with the dashboard"
          className="w-full h-auto block"
          style={{ display: 'block' }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
