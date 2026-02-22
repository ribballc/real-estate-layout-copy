import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import darkerLogo from "@/assets/darker-logo.png";
import heroPenguin from "@/assets/hero-penguin.png";
import { ChevronRight, ChevronDown, Zap, Shield, Phone } from "lucide-react";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import { trackEvent } from "@/lib/tracking";

/** Basic US phone validation — 10 digits after stripping formatting */
function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** Auto-format as user types: (555) 123-4567 */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const HeroSection = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const { openFunnel } = useSurveyFunnel();

  const handleCtaClick = useCallback(() => {
    trackEvent({
      eventName: "hero_phone_step_started",
      type: "trackCustom",
      customData: { content_name: "Hero Phone Step" },
    });
    setShowPhoneInput(true);
  }, []);

  const handlePhoneSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = phone.trim();
    if (!trimmed) { setError("Please enter your phone number"); return; }
    if (!isValidPhone(trimmed)) { setError("Please enter a valid phone number"); return; }

    trackEvent({
      eventName: "hero_phone_step_completed",
      type: "trackCustom",
      userData: { phone: trimmed },
      customData: { content_name: "Hero Phone Captured" },
    });

    // Open the multi-step funnel modal with the phone pre-filled
    openFunnel(trimmed);
    // Reset local state for next time
    setShowPhoneInput(false);
    setPhone("");
  }, [phone, openFunnel]);

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
        {/* Logo */}
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between" style={{
          opacity: 0, animation: 'heroFadeScale 0.5s ease-out 0s forwards',
        }}>
          <img src={darkerLogo} alt="Darker" className="h-8 md:h-10 w-auto" />
          <Link
            to="/login"
            className="text-sm font-medium transition-colors duration-200 hover:underline underline-offset-4"
            style={{ color: 'hsla(0, 0%, 100%, 0.5)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'hsla(217, 91%, 70%, 0.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'hsla(0, 0%, 100%, 0.5)')}
          >
            Log in →
          </Link>
        </div>

        {/* Two-column grid */}
        <div className="max-w-[1400px] mx-auto mt-1 md:mt-1 lg:mt-2 w-full grid grid-cols-1 lg:grid-cols-[42%_58%] gap-8 lg:gap-6 items-center min-h-[calc(100vh-120px)]">

          {/* LEFT: Text column */}
          <div className="relative z-10 text-left">
            {/* Badge */}
            <span
              className="text-sky text-[13px] font-medium tracking-[0.05em] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-5"
              style={{
                background: 'hsla(217, 91%, 60%, 0.1)',
                border: '1px solid hsla(217, 91%, 60%, 0.2)',
                opacity: 0, animation: 'fadeSlideDown 0.4s ease-out 0.2s forwards',
              }}
            >
              FOR DETAILERS & INSTALLERS
            </span>

            {/* Headline */}
            <h1 className="text-primary-foreground leading-[1.1] tracking-[-0.02em]">
              <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.4s forwards' }}>
                The Instant
              </span>
              <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.5s forwards' }}>
                Website & Booking
              </span>
              <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.6s forwards' }}>
                System For{' '}
                <span className="hidden md:inline-block relative font-semibold italic" style={{ color: '#10B981', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                  Auto Pros
                  <svg className="absolute -bottom-2 left-0 w-full h-3 overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ opacity: 0, animation: 'greenUnderlineIn 0.8s ease-out 1.2s forwards' }}>
                    <path d="M0 9 Q100 2, 200 7" fill="none" stroke="url(#greenGlow)" strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'underlineDraw 0.8s ease-out 1.2s forwards' }} />
                    <path d="M0 9 Q100 2, 200 7" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" style={{ filter: 'blur(6px)', opacity: 0.5, strokeDasharray: 220, strokeDashoffset: 220, animation: 'underlineDraw 0.8s ease-out 1.2s forwards' }} />
                    <defs>
                      <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </span>
              <span className="block md:hidden font-heading text-[36px] font-semibold italic relative" style={{ opacity: 0, animation: 'fadeSlideUp 0.6s ease-out 0.7s forwards', color: '#10B981', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                <span className="relative inline-block">
                  Auto Pros
                  <svg className="absolute -bottom-2 left-0 w-full h-3 overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ opacity: 0, animation: 'greenUnderlineIn 0.8s ease-out 1.4s forwards' }}>
                    <path d="M0 9 Q100 2, 200 7" fill="none" stroke="url(#greenGlowMobile)" strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'underlineDraw 0.8s ease-out 1.4s forwards' }} />
                    <path d="M0 9 Q100 2, 200 7" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" style={{ filter: 'blur(6px)', opacity: 0.5, strokeDasharray: 220, strokeDashoffset: 220, animation: 'underlineDraw 0.8s ease-out 1.4s forwards' }} />
                    <defs>
                      <linearGradient id="greenGlowMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="mt-5 text-[15px] md:text-xl leading-[1.6] max-w-[600px]"
              style={{ color: 'hsla(0, 0%, 100%, 0.7)', opacity: 0, animation: 'heroBlurIn 0.5s ease-out 1.0s forwards' }}
            >
              Get a professional website with 24/7 booking. Customers book themselves while you're in the field. Automated reminders, deposits, and a calendar that fills itself.
            </p>

            {/* Phone-first CTA */}
            <div
              className="mt-7 max-w-lg"
              style={{ opacity: 0, animation: 'heroFormIn 0.5s ease-out 1.2s forwards' }}
            >
              {!showPhoneInput ? (
                /* Initial CTA button */
                <button
                  type="button"
                  onClick={handleCtaClick}
                  data-event="hero_cta_click"
                  className="group h-14 px-8 text-base font-semibold rounded-xl min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                    color: 'hsl(0 0% 100%)',
                    boxShadow: '0 8px 24px hsla(217, 91%, 60%, 0.35)',
                    opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 1.4s forwards',
                  }}
                >
                  Get My Free Demo
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ) : (
                /* Inline phone capture */
                <form
                  onSubmit={handlePhoneSubmit}
                  className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="relative w-full sm:flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/30" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatPhone(e.target.value));
                        if (error) setError("");
                      }}
                      placeholder="(555) 123-4567"
                      maxLength={16}
                      autoFocus
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
                    Get My Demo
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              )}

              {/* Label or error */}
              {showPhoneInput && !error && (
                <p className="text-xs mt-2 animate-in fade-in duration-200" style={{ color: 'hsla(0, 0%, 100%, 0.45)' }}>
                  Enter your mobile number to start your free demo
                </p>
              )}
              {error && <p className="text-sm text-destructive mt-2 animate-in fade-in duration-200">{error}</p>}
            </div>

            {/* Trust line */}
            <div className="mt-5 flex items-center gap-4 flex-wrap" style={{
              color: 'hsla(0, 0%, 100%, 0.5)', opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 1.8s forwards',
            }}>
              <span className="text-sm font-medium flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent" /> Built in 5 minutes</span>
              <span className="text-primary-foreground/20">•</span>
              <span className="text-sm font-medium flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent" /> Free for 14 days</span>
            </div>


            {/* Social proof */}
            <div className="mt-4 inline-flex items-center gap-3 text-sm" style={{
              color: 'hsla(0, 0%, 100%, 0.6)', opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.0s forwards',
            }}>
              <div className="flex items-center">
                {[
                  { initials: 'TB', bg: '#3b82f6' },
                  { initials: 'RG', bg: '#10b981' },
                  { initials: 'MV', bg: '#f59e0b' },
                  { initials: 'JD', bg: '#8b5cf6' },
                  { initials: 'CS', bg: '#ef4444' },
                ].map((a, i) => (
                  <div
                    key={a.initials}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-[hsl(215,50%,10%)]"
                    style={{
                      backgroundColor: a.bg,
                      color: 'white',
                      marginLeft: i === 0 ? 0 : '-0.5rem',
                      zIndex: 5 - i,
                    }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <span className="text-accent text-sm tracking-wide">★★★★★</span>
              <span className="font-semibold">
                4.9 · <strong>200+</strong> Detailers & Shops
              </span>
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
        <div className="hidden md:flex flex-col items-center pb-8 pt-4" style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.2s forwards' }}>
          <span className="text-primary-foreground/40 text-[13px] font-medium tracking-[0.05em] uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Mobile penguin hero */}
      <div className="block lg:hidden relative z-[1] w-full px-6 pb-0 pt-4" style={{
        opacity: 0, animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
      }}>
        <img
          src={heroPenguin}
          alt="Darker mascot penguin holding a phone with the dashboard"
          className="w-full max-w-[320px] mx-auto h-auto object-contain"
          style={{ filter: 'drop-shadow(0 16px 32px hsla(217, 91%, 20%, 0.35))' }}
        />
      </div>

      {/* Ice-ground transition — spans full width, fades into white section below */}
      <div className="relative w-full" style={{ marginTop: '-2px' }}>
        <div
          className="w-full h-24 md:h-36"
          style={{
            background: 'linear-gradient(180deg, hsla(200, 30%, 75%, 0) 0%, hsla(200, 40%, 82%, 0.5) 25%, hsla(200, 50%, 88%, 0.7) 50%, hsl(210, 40%, 95%) 75%, hsl(210, 40%, 98%) 100%)',
          }}
        />
        {/* Icy shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsla(200, 60%, 90%, 0.3) 20%, hsla(200, 80%, 95%, 0.15) 50%, hsla(200, 60%, 90%, 0.3) 80%, transparent 100%)',
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
