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

const Index = () => {
  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen relative">
        <ScrollProgress />
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
