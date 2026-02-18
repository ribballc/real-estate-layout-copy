import { useState, useEffect, useRef, useCallback } from "react";
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
import SocialProofNotification from "@/components/SocialProofNotification";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { SurveyFunnelProvider, useSurveyFunnel } from "@/components/SurveyFunnelContext";

const BANNER_MESSAGES = [
  "🔥  Limited Spots — Only 12 Free Trials Left This Week",
  "⚡  Setup Takes 5 Minutes. Your Site Goes Live in 48 Hours.",
  "💰  Detailers Are Averaging $2,800+ More Per Month After Joining",
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
      }, 300);
    }, 4000);
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
        className="inline-flex items-center gap-2 relative z-10 transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
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
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden mobile-sticky-cta"
      style={{
        height: '64px',
        background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
      }}
    >
      <div className="flex h-full">
        <a
          href="tel:"
          className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm active:opacity-80 transition-opacity"
        >
          📞 Call Us
        </a>
        <div className="w-px bg-white/20 my-3" />
        <button
          onClick={openFunnel}
          className="flex-1 flex items-center justify-center gap-1 text-white font-extrabold text-sm active:opacity-80 transition-opacity"
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
      <div className="min-h-screen relative noise-overlay pb-[72px] md:pb-0" style={{ background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)' }}>
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
        <SocialProofNotification />
        <ExitIntentPopup />
        <MobileStickyBar />
      </div>
    </SurveyFunnelProvider>
  );
};

export default Index;
