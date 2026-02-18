import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ValueBreakdown from "@/components/ValueBreakdown";
import LogoTicker from "@/components/LogoTicker";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhySection from "@/components/WhySection";
import TestimonialSection from "@/components/TestimonialSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaFooter from "@/components/CtaFooter";
import SurveyFunnelModal from "@/components/SurveyFunnelModal";
import ScrollProgress from "@/components/ScrollProgress";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { SurveyFunnelProvider, useSurveyFunnel } from "@/components/SurveyFunnelContext";

const BANNER_MESSAGES = [
  "🔒  See your live website in the dashboard — no card needed to start",
  "⚡  Setup takes 5 minutes. Your site goes live in 48 hours.",
  "★★★★★  Trusted by 200+ detailing shops · $2.4M in bookings captured",
];

const SpringBanner = () => {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % BANNER_MESSAGES.length);
        setFade(true);
      }, 350);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full py-2.5 text-center text-sm font-semibold text-white tracking-wide relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
      }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent 0%, hsla(0,0%,100%,0.12) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'bannerShimmer 3s linear infinite',
        }}
      />
      <span
        className="inline-flex items-center gap-2 relative z-10 transition-all duration-[350ms] ease-out"
        style={{
          opacity: fade ? 1 : 0,
          transform: fade ? 'translateY(0)' : 'translateY(6px)',
        }}
      >
        {BANNER_MESSAGES[idx]}
      </span>
    </div>
  );
};

const MobileStickyBar = () => {
  const { openFunnel } = useSurveyFunnel();
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
      style={{
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'hsl(215, 50%, 10%)',
        borderTop: '1px solid hsla(0, 0%, 100%, 0.1)',
      }}
    >
      <div className="flex h-full">
        {/* TODO: replace with your phone number */}
        <a
          href="tel:+1XXXXXXXXXX"
          className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm active:opacity-80 transition-opacity"
        >
          📞 Call Us
        </a>
        <div className="w-px my-3" style={{ background: 'hsla(0, 0%, 100%, 0.1)' }} />
        <button
          onClick={openFunnel}
          className="flex-1 flex items-center justify-center gap-1 text-white font-bold text-sm active:opacity-80 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 50%) 100%)',
          }}
        >
          Start Free →
        </button>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen relative noise-overlay pb-16 md:pb-0" style={{ background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)' }}>
        <ScrollProgress />
        <SpringBanner />
        <HeroSection />
        <LogoTicker />
        <HowItWorksSection />
        <ValueBreakdown />
        <TestimonialSection />
        <WhySection />
        <PricingSection />
        <FaqSection />
        <CtaFooter />
        <SurveyFunnelModal />
        <ExitIntentPopup />
        <MobileStickyBar />
      </div>
    </SurveyFunnelProvider>
  );
};

export default Index;
