import { useEffect } from "react";
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
import { SurveyFunnelProvider } from "@/components/SurveyFunnelContext";
import { fbqEvent, generateEventId } from "@/lib/pixel";
import { sendCapiEvent } from "@/lib/capiEvent";

const SpringBanner = () => (
  <div className="w-full py-2.5 text-center text-sm font-semibold text-white tracking-wide" style={{
    background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
  }}>
    <span className="inline-flex items-center gap-2">
      <span className="text-base" style={{ animation: 'springBounce 2s ease-in-out infinite' }}>🌸</span>
      SPRING SALE: 32% OFF + Free Gifts
    </span>
  </div>
);

const Index = () => {
  // Event 1: ViewContent — Landing Page
  useEffect(() => {
    const eventId = generateEventId();
    fbqEvent('track', 'ViewContent', {
      content_name: 'Landing Page',
      content_category: 'Marketing',
      content_type: 'website',
    }, eventId);
    sendCapiEvent({ eventName: 'ViewContent', eventId });
  }, []);

  // Capture fbclid from Meta ad clicks
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      document.cookie = `_fbc=${fbc}; max-age=31536000; path=/; SameSite=Lax`;
      localStorage.setItem('darker_fbc', fbc);
    }
  }, []);

  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)' }}>
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
      </div>
    </SurveyFunnelProvider>
  );
};

export default Index;
