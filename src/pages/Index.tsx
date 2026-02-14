import HeroSection from "@/components/HeroSection";
import PublishersSection from "@/components/PublishersSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhySection from "@/components/WhySection";
import TestimonialSection from "@/components/TestimonialSection";
import FunnelSection from "@/components/FunnelSection";
import FormFunnelSection from "@/components/FormFunnelSection";
import CtaFooter from "@/components/CtaFooter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PublishersSection />
      <HowItWorksSection />
      <WhySection />
      <TestimonialSection />
      <FunnelSection />
      <FormFunnelSection />
      <CtaFooter />
    </div>
  );
};

export default Index;
