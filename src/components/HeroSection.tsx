import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Store, ChevronDown, Clock } from "lucide-react";
import { useSurveyFunnel } from "@/components/SurveyFunnelContext";
import BookingSimulator from "@/components/BookingSimulator";

const HeroSection = () => {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const [liveCount, setLiveCount] = useState(237);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { openFunnel } = useSurveyFunnel();

  // Sticky CTA observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (btnRef.current) observer.observe(btnRef.current);
    return () => observer.disconnect();
  }, []);

  // Live counter — increment every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => c + 1);
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
    <section
      className="relative overflow-hidden min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)" }}
    >
      {/* Mesh glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 30% 20%, hsla(217, 91%, 60%, 0.06), transparent)",
      }} />
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)",
        backgroundSize: "50px 50px",
      }} />

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-0 md:pt-10 flex-1 flex flex-col">
        {/* Logo */}
        <div className="max-w-6xl mx-auto w-full" style={{ opacity: 0, animation: "heroFadeScale 0.5s ease-out 0s forwards" }}>
          <h2 className="text-xl font-heading font-bold text-primary-foreground tracking-tight">velarrio</h2>
        </div>

        {/* Hero content — split layout */}
        <div className="max-w-6xl mx-auto mt-6 md:mt-10 flex-1 w-full">
          <div className="lg:grid lg:grid-cols-[58%_42%] lg:gap-10 lg:items-center">

            {/* LEFT — Copy block */}
            <div className="text-left">
              {/* Urgency banner */}
              <div
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 mb-5"
                style={{
                  background: "hsla(217, 91%, 60%, 0.1)",
                  border: "1px solid hsla(217, 91%, 60%, 0.3)",
                  opacity: 0,
                  animation: "fadeSlideDown 0.4s ease-out 0.1s forwards",
                }}
              >
                <span className="text-base" style={{ animation: "urgencyPulse 2s ease-in-out infinite" }}>🔥</span>
                <span className="text-sky text-[13px] font-semibold">Only 12 setup slots left this week</span>
              </div>

              {/* Badge */}
              <div style={{ opacity: 0, animation: "fadeSlideDown 0.4s ease-out 0.2s forwards" }}>
                <span
                  className="text-sky text-[13px] font-medium tracking-[0.05em] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mb-5"
                  style={{
                    background: "hsla(217, 91%, 60%, 0.1)",
                    border: "1px solid hsla(217, 91%, 60%, 0.2)",
                  }}
                >
                  For Mobile Detailers
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-primary-foreground leading-[1.1] tracking-[-0.02em]">
                <span className="block font-heading text-[32px] md:text-[44px] lg:text-[52px] font-bold" style={{ opacity: 0, animation: "fadeSlideUp 0.5s ease-out 0.4s forwards" }}>
                  Stop Losing
                </span>
                <span
                  className="block font-heading text-[42px] md:text-[64px] lg:text-[96px] font-black text-sky"
                  style={{
                    opacity: 0,
                    animation: "fadeSlideUp 0.5s ease-out 0.6s forwards",
                    textShadow: "0 0 40px hsla(213, 94%, 68%, 0.4)",
                  }}
                >
                  <CountUpDollar target={1200} duration={2000} />
                </span>
                <span className="block font-heading text-[32px] md:text-[44px] lg:text-[52px] font-bold" style={{ opacity: 0, animation: "fadeSlideUp 0.6s ease-out 0.8s forwards" }}>
                  to Missed Calls
                </span>
              </h1>

              {/* Sub-headline */}
              <p
                className="mt-5 text-[15px] md:text-lg lg:text-[22px] leading-[1.5] max-w-[500px]"
                style={{ color: "hsla(0, 0%, 100%, 0.7)", opacity: 0, animation: "heroBlurIn 0.5s ease-out 1.0s forwards" }}
              >
                Stop chasing. Start closing. Get bookings while you work.
              </p>

              {/* Form + CTA */}
              <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg"
                style={{ opacity: 0, animation: "heroFormIn 0.5s ease-out 1.2s forwards" }}
              >
                <div className="relative w-full sm:flex-1" style={{ opacity: 0, animation: "heroScaleIn 0.4s ease-out 1.2s forwards" }}>
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/30" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); if (error) setError(""); }}
                    placeholder="Enter Your Business Name"
                    maxLength={100}
                    aria-label="Business name"
                    className="h-14 w-full rounded-xl pl-10 pr-6 text-base text-primary-foreground placeholder:text-primary-foreground/40 min-h-[52px] focus:outline-none transition-all duration-200"
                    style={{ background: "hsla(0, 0%, 100%, 0.08)", border: "1px solid hsla(0, 0%, 100%, 0.15)" }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = "2px solid hsl(217 91% 60%)";
                      e.currentTarget.style.background = "hsla(0, 0%, 100%, 0.12)";
                      e.currentTarget.style.boxShadow = "0 0 0 4px hsla(217, 91%, 60%, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = "1px solid hsla(0, 0%, 100%, 0.15)";
                      e.currentTarget.style.background = "hsla(0, 0%, 100%, 0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  ref={btnRef}
                  type="submit"
                  className="group h-14 px-6 lg:px-8 text-[15px] font-semibold rounded-xl min-h-[48px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
                    color: "hsl(0 0% 100%)",
                    boxShadow: "0 8px 24px hsla(217, 91%, 60%, 0.35)",
                    opacity: 0,
                    animation: "fadeSlideUp 0.5s ease-out 1.4s forwards",
                  }}
                >
                  <Clock className="w-4 h-4 transition-transform duration-500 group-hover:rotate-[360deg]" />
                  See My Website in <strong>60 Seconds</strong>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}

              {/* Trust line */}
              <div
                className="mt-5 flex items-center gap-3 flex-wrap text-sm"
                style={{ color: "hsla(0, 0%, 100%, 0.5)", opacity: 0, animation: "fadeSlideUp 0.4s ease-out 1.8s forwards" }}
              >
                <span className="font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Live in 48 hours</span>
                <span className="text-primary-foreground/20">•</span>
                <span className="font-medium flex items-center gap-1.5"><span className="text-accent">✓</span> Free for 14 days</span>
                <span className="text-primary-foreground/20">•</span>
                <span className="font-semibold flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 100%, 0.65)" }}>
                  <span className="text-accent">✓</span> $0 until first booking
                </span>
              </div>

              {/* Social proof with live counter */}
              <div
                className="mt-4 inline-flex items-center gap-2 text-sm"
                style={{ color: "hsla(0, 0%, 100%, 0.6)", opacity: 0, animation: "fadeSlideUp 0.4s ease-out 2.0s forwards" }}
              >
                <span className="text-accent tracking-wide">★★★★★</span>
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" style={{ animation: "livePulse 2s ease-in-out infinite" }} />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-semibold">
                    <strong>{liveCount}</strong> detailers trust Velarrio · <strong>$2.4M+</strong> in bookings captured
                  </span>
                </span>
              </div>
            </div>

            {/* RIGHT — Booking Simulator */}
            <div className="mt-10 lg:mt-0" style={{ opacity: 0, animation: "heroPhoneIn 0.8s ease-out 1.6s forwards" }}>
              <BookingSimulator />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden md:flex flex-col items-center pb-8 mt-auto"
          style={{ opacity: 0, animation: "fadeSlideUp 0.4s ease-out 2.2s forwards" }}
        >
          <span className="text-primary-foreground/40 text-[13px] font-medium tracking-[0.05em] uppercase mb-2">Scroll to see how it works</span>
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" style={{ animation: "scrollBounce 2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {showStickyBtn && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 md:hidden border-t border-primary-foreground/10 shadow-2xl animate-[fadeSlideUp_0.3s_ease-out]"
          style={{ background: "hsla(215, 50%, 10%, 0.95)", backdropFilter: "blur(16px)" }}
        >
          <button
            type="button"
            onClick={openFunnel}
            className="w-full h-14 font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 min-h-[48px] text-primary-foreground"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
          >
            Build My Website Free →
          </button>
        </div>
      )}
    </section>
  );
};

/* Animated dollar counter for headline */
const CountUpDollar = ({ target, duration }: { target: number; duration: number }) => {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    // Delay to match animation timeline
    setTimeout(() => requestAnimationFrame(animate), 600);
  }, [target, duration]);

  return <>${value.toLocaleString()}+/Month</>;
};

export default HeroSection;
