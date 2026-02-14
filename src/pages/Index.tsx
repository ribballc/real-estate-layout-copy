import HeroSection from "@/components/HeroSection";
import PublishersSection from "@/components/PublishersSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhySection from "@/components/WhySection";
import PricingSection from "@/components/PricingSection";
import TestimonialSection from "@/components/TestimonialSection";
import FunnelSection from "@/components/FunnelSection";
import CtaFooter from "@/components/CtaFooter";
import SurveyFunnelModal from "@/components/SurveyFunnelModal";
import ScrollProgress from "@/components/ScrollProgress";
import SocialProofNotification from "@/components/SocialProofNotification";
import FloatingOrbs from "@/components/FloatingOrbs";
import { SurveyFunnelProvider } from "@/components/SurveyFunnelContext";

const Index = () => {
  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen relative">
        <FloatingOrbs />
        <ScrollProgress />
        <HeroSection />
        <PublishersSection />
        <HowItWorksSection />
        <WhySection />
        <PricingSection />
        <TestimonialSection />
        <FunnelSection />
        <CtaFooter />
        <SurveyFunnelModal />
        <SocialProofNotification />
      </div>
    </SurveyFunnelProvider>
  );
};

export default Index;
