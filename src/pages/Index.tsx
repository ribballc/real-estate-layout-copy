import HeroSection from "@/components/HeroSection";
import ValueBreakdown from "@/components/ValueBreakdown";

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
  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen relative">
        <ScrollProgress />
        <SpringBanner />
        <HeroSection />
        <ValueBreakdown />
        
        <HowItWorksSection />
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
