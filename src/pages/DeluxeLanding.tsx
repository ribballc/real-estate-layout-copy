import { useParams } from 'react-router-dom';
import { useBusinessDataBySlug } from '@/hooks/useBusinessData';
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
  const { slug } = useParams<{ slug: string }>();
  const { profile, services, hours, testimonials, photos, addOns, loading } = useBusinessDataBySlug(slug || null);

  const isDark = profile?.secondary_color !== "#FFFFFF";

  return (
    <main className={`min-h-screen bg-background font-montserrat ${isDark ? "site-dark" : ""}`}>
      <DeluxeNavbar profile={profile} />
      <DeluxeHero profile={profile} />
      <DeluxeServicesOverview services={services} />
      <DeluxeWhyChooseUs profile={profile} />
      <DeluxePackages services={services} />
      <DeluxeAddOnServices addOns={addOns} />
      <DeluxeGallery photos={photos} />
      <DeluxeCTASection profile={profile} />
      <DeluxeTestimonials testimonials={testimonials} />
      <DeluxeFAQ profile={profile} />
      <DeluxeContactForm profile={profile} services={services} addOns={addOns} hours={hours} />
      <DeluxeFooter profile={profile} hours={hours} />
    </main>
  );
};

export default DeluxeLanding;
