import HeroSection from "@/components/HeroSection";
import PublishersSection from "@/components/PublishersSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhySection from "@/components/WhySection";
import PricingSection from "@/components/PricingSection";
import TestimonialSection from "@/components/TestimonialSection";
import FunnelSection from "@/components/FunnelSection";
import CtaFooter from "@/components/CtaFooter";
import SurveyFunnelModal from "@/components/SurveyFunnelModal";
import { SurveyFunnelProvider } from "@/components/SurveyFunnelContext";

const Index = () => {
  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen">
        <HeroSection />
        <PublishersSection />
        <HowItWorksSection />
        <WhySection />
        <PricingSection />
        <TestimonialSection />
        <FunnelSection />
        <CtaFooter />
        <SurveyFunnelModal />
      </div>
    </SurveyFunnelProvider>
  );
};

export default Index;
