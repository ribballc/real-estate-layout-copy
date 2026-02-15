import HeroSection from "@/components/HeroSection";
import ValueBreakdown from "@/components/ValueBreakdown";
import ManifestoSection from "@/components/ManifestoSection";
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
      SPRING SALE: Up To 40% OFF + 4 Free Gifts
    </span>
    <style>{`@keyframes springBounce { 0%,100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(-10deg) scale(1.1); } 75% { transform: rotate(10deg) scale(1.1); } }`}</style>
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
        <ManifestoSection />
        <HowItWorksSection />
        <WhySection />
        <TestimonialSection />
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
