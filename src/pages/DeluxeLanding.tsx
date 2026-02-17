import DeluxeNavbar from '@/components/deluxe/DeluxeNavbar';
import DeluxeHero from '@/components/deluxe/DeluxeHero';
import DeluxeWhyChooseUs from '@/components/deluxe/DeluxeWhyChooseUs';
import DeluxeServicesOverview from '@/components/deluxe/DeluxeServicesOverview';
import DeluxePackages from '@/components/deluxe/DeluxePackages';
import DeluxeAddOnServices from '@/components/deluxe/DeluxeAddOnServices';
import DeluxeGallery from '@/components/deluxe/DeluxeGallery';
import DeluxeTestimonials from '@/components/deluxe/DeluxeTestimonials';
import DeluxeCTASection from '@/components/deluxe/DeluxeCTASection';
import DeluxeFAQ from '@/components/deluxe/DeluxeFAQ';
import DeluxeContactForm from '@/components/deluxe/DeluxeContactForm';
import DeluxeFooter from '@/components/deluxe/DeluxeFooter';

const DeluxeLanding = () => {
  return (
    <main className="min-h-screen bg-background font-montserrat">
      <DeluxeNavbar />
      <DeluxeHero />
      <DeluxeServicesOverview />
      <DeluxeWhyChooseUs />
      <DeluxePackages />
      <DeluxeAddOnServices />
      <DeluxeGallery />
      <DeluxeCTASection />
      <DeluxeTestimonials />
      <DeluxeFAQ />
      <DeluxeContactForm />
      <DeluxeFooter />
    </main>
  );
};

export default DeluxeLanding;
