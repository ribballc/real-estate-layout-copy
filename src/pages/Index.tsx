import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FormFunnelSection from "@/components/FormFunnelSection";
import PublishersSection from "@/components/PublishersSection";
import WhySection from "@/components/WhySection";
import TestimonialSection from "@/components/TestimonialSection";
import FunnelSection from "@/components/FunnelSection";
import CtaFooter from "@/components/CtaFooter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FormFunnelSection />
      <PublishersSection />
      <WhySection />
      <TestimonialSection />
      <FunnelSection />
      <CtaFooter />
    </div>
  );
};

export default Index;
