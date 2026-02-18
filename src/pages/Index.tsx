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

import ExitIntentPopup from "@/components/ExitIntentPopup";
import { SurveyFunnelProvider } from "@/components/SurveyFunnelContext";
import { trackEvent, generateEventId } from "@/lib/tracking";
import SEOHead from "@/components/SEOHead";
import { SITE_URL, FAQ_ITEMS } from "@/lib/seo";

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

// Structured data for the marketing site
const MARKETING_STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Darker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '54',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '54',
        priceCurrency: 'USD',
        unitText: 'MONTH',
        referenceQuantity: { '@type': 'QuantitativeValue', value: '1', unitCode: 'MON' },
      },
      eligibleCustomerType: 'Business',
      description: 'Website and booking system for auto detailers',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Darker',
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.jpg`,
    sameAs: [
      'https://instagram.com/darkerdigital',
      'https://twitter.com/darkerdigital',
      'https://facebook.com/darkerdigital',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@darkerdigital.com',
    },
  },
];

const Index = () => {
  // Event 1: ViewContent — Landing Page
  useEffect(() => {
    trackEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Landing Page',
        content_category: 'Marketing',
        content_type: 'website',
      },
    });
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

  // Capture UTM parameters for attribution
  useEffect(() => {
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const params = new URLSearchParams(window.location.search);
    const utmData: Record<string, string> = {};
    utmParams.forEach((param) => {
      const value = params.get(param);
      if (value) utmData[param] = value;
    });
    if (Object.keys(utmData).length > 0) {
      sessionStorage.setItem('darker_utm', JSON.stringify(utmData));
      if (!localStorage.getItem('darker_utm_first_touch')) {
        localStorage.setItem('darker_utm_first_touch', JSON.stringify({
          ...utmData,
          landing_page: window.location.pathname,
          timestamp: Date.now(),
        }));
      }
    }
  }, []);

  return (
    <SurveyFunnelProvider>
      <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)' }}>
        <SEOHead
          description="Done-for-you website and 24/7 online booking for detailers, PPF installers, and tint shops. Customers book and pay deposits automatically. Start free, no card needed."
          canonicalUrl={SITE_URL}
          structuredData={MARKETING_STRUCTURED_DATA}
        />
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
      </div>
    </SurveyFunnelProvider>
  );
};

export default Index;
