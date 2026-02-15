import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Store, ChevronDown } from "lucide-react";
import AdvancedBookingDemo from "@/components/AdvancedBookingDemo";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";

const HeroSection = () => {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [liveCount, setLiveCount] = useState(200);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { openFunnel } = useSurveyFunnel();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

  // Live counter: +1 every 30s, caps at 250, resets to 200
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev >= 250 ? 200 : prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = businessName.trim();
    if (!trimmed) { setError("Please enter your business name"); return; }
    window.dispatchEvent(new CustomEvent("hero-business", { detail: trimmed }));
    openFunnel();
  }, [businessName, openFunnel]);

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col" style={{
      background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)'
    }}>
      {/* Subtle mesh glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 20%, hsla(217, 91%, 60%, 0.06), transparent)',
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-0 md:pt-10 md:pb-0 flex-1 flex flex-col">
        {/* Logo */}
        <div className="max-w-6xl mx-auto w-full" style={{
          opacity: 0,
          animation: 'heroFadeScale 0.5s ease-out 0s forwards',
        }}>
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio</h2>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-14 flex-1 w-full">
          <div className="max-w-2xl mx-auto text-center lg:text-left lg:max-w-none lg:grid lg:grid-cols-[55%_45%] lg:gap-12 lg:items-center">

            {/* Copy block */}
            <div className="text-left">
              {/* Badge */}
              <span
                className="text-sky text-[13px] font-medium tracking-[0.05em] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-5"
                style={{
                  background: 'hsla(217, 91%, 60%, 0.1)',
                  border: '1px solid hsla(217, 91%, 60%, 0.2)',
                  opacity: 0,
                  animation: 'fadeSlideDown 0.4s ease-out 0s forwards',
                }}
              >
                For Mobile Detailers
              </span>

              {/* Headline */}
              <h1 className="text-primary-foreground leading-[1.1] tracking-[-0.02em] text-left">
                {/* Line 1 */}
                <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.2s forwards' }}>
                  Stop Losing{" "}
                  <span className="text-sky">$1,200+/Month</span>
                </span>
                <span className="block font-heading text-[36px] md:text-[56px] font-bold" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease-out 0.3s forwards' }}>
                  to Missed Calls
                </span>
                {/* Line 2 */}
                <span
                  className="block font-heading text-[44px] md:text-[72px] font-black mt-2 text-sky"
                  style={{
                    opacity: 0,
                    animation: 'fadeSlideUp 0.6s ease-out 0.4s forwards',
                    textShadow: '0 0 40px hsla(213, 94%, 68%, 0.3)',
                  }}
                >
                  Get Bookings 24/7 —{" "}
                  <span className="inline-block" style={{ animation: 'heroPulseOnce 0.6s ease-out 1.0s forwards' }}>FREE</span>
                </span>
              </h1>

              {/* Sub-headline bullet list */}
              <ul className="mt-5 space-y-3 max-w-[600px] text-left">
                {[
                  { text: <>Professional website + booking system (normally <strong className="font-semibold">$2,997</strong>) — yours free</>, delay: '0.7s' },
                  { text: <>Live in <strong className="font-semibold">less than 5 min</strong></>, delay: '0.82s' },
                  { text: <>Join <strong className="font-semibold">200+</strong> detailers using Velarrio</>, delay: '0.94s' },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[16px] md:text-[18px] font-medium leading-[1.7]"
                    style={{
                      color: 'hsla(0, 0%, 100%, 0.9)',
                      opacity: 0,
                      animation: `fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay} forwards`,
                    }}
                  >
                    <span className="text-accent text-[20px] mt-0.5 shrink-0">✓</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* Business name form + CTA */}
              <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0"
                style={{ opacity: 0, animation: 'heroFormIn 0.4s ease-out 1.0s forwards' }}
              >
                <div className="relative w-full sm:flex-1">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/30" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); if (error) setError(""); }}
                    placeholder="Enter Your Business Name"
                    maxLength={100}
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
                  ref={btnRef}
                  type="submit"
                  className="group h-14 px-10 text-[17px] font-semibold rounded-xl min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
                    color: 'hsl(0 0% 100%)',
                    boxShadow: '0 8px 24px hsla(217, 91%, 60%, 0.35)',
                    animation: 'ctaPulse 3s ease-in-out 1.5s infinite',
                  }}
                >
                  Get My Free Website
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
              {error && <p className="text-sm text-destructive mt-2 text-center lg:text-left">{error}</p>}

              {/* Outcome preview */}
              <div
                className="mt-4 flex items-center gap-3 justify-center lg:justify-start flex-wrap text-[13px] md:text-sm"
                style={{
                  color: 'hsla(0, 0%, 100%, 0.6)',
                  opacity: 0,
                  animation: 'fadeSlideUp 0.4s ease-out 1.2s forwards',
                }}
              >
                <span className="font-semibold">Try free for 14 days</span>
                <span className="text-primary-foreground/20">•</span>
                <span className="font-semibold">Keep it if you love it</span>
                <span className="text-primary-foreground/20">•</span>
                <span>Cancel anytime</span>
              </div>

              {/* Trust line */}
              <div
                className="mt-5 flex items-center gap-4 justify-center lg:justify-start flex-wrap text-[13px] md:text-sm"
                style={{
                  color: 'hsla(0, 0%, 100%, 0.5)',
                  opacity: 0,
                  animation: 'fadeSlideUp 0.4s ease-out 1.3s forwards',
                }}
              >
                <span className="font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Setup in 5 minutes</span>
                <span className="text-primary-foreground/20">•</span>
                <span className="font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Free for 14 days</span>
                <span className="text-primary-foreground/20">•</span>
                <span className="font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> No tech skills needed</span>
              </div>

              {/* Social proof */}
              <div
                className="mt-6 inline-flex items-center gap-4 text-[13px] md:text-sm"
                style={{
                  color: 'hsla(0, 0%, 100%, 0.7)',
                  opacity: 0,
                  animation: 'fadeSlideUp 0.4s ease-out 1.4s forwards',
                }}
              >
                <span className="text-accent text-base tracking-wide">★★★★★</span>
                <span className="font-semibold flex items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'hsl(160 84% 39%)', animation: 'livePulse 2s ease-in-out infinite' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'hsl(160 84% 39%)' }} />
                  </span>
                  Trusted by <strong>{liveCount}+</strong> detailers&nbsp;·&nbsp;<strong>$2.4M</strong> in bookings captured
                </span>
              </div>
            </div>

            {/* Advanced Booking Demo */}
            <div
              style={{
                opacity: 0,
                animation: 'heroPhoneIn 0.8s ease-out 1.6s forwards',
              }}
            >
              <AdvancedBookingDemo />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden md:flex flex-col items-center pb-8 mt-auto"
          style={{ opacity: 0, animation: 'fadeSlideUp 0.4s ease-out 2.2s forwards' }}
        >
          <span className="text-primary-foreground/40 text-[13px] font-medium tracking-[0.05em] uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {showStickyBtn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden border-t border-primary-foreground/10 shadow-2xl animate-[fadeSlideUp_0.3s_ease-out]"
          style={{ background: 'hsla(215, 50%, 10%, 0.95)', backdropFilter: 'blur(16px)' }}
        >
          <button
            type="button"
            onClick={openFunnel}
            className="w-full h-14 font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 min-h-[48px] text-primary-foreground"
            style={{
              background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
            }}
          >
            Get My Free Website →
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
