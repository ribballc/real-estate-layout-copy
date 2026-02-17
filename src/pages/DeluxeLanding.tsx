import { useEffect } from 'react';
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

  // When rendered inside the dashboard iframe, intercept "Book Now" clicks
  // and notify parent to switch to the Booking Page tab
  useEffect(() => {
    if (window.self === window.top) return; // not in iframe
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a.book-now-link');
      if (anchor) {
        e.preventDefault();
        window.parent.postMessage('dd-book-now', '*');
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  const isDark = profile?.secondary_color !== "#FFFFFF";

  return (
    <main className={`min-h-screen bg-background font-montserrat ${isDark ? "site-dark" : ""}`}>
      <DeluxeNavbar profile={profile} />
      <DeluxeHero profile={profile} slug={slug} />
      <DeluxeServicesOverview services={services} />
      <DeluxeWhyChooseUs profile={profile} />
      <DeluxePackages services={services} slug={slug} />
      <DeluxeAddOnServices addOns={addOns} />
      <DeluxeGallery photos={photos} />
      <DeluxeCTASection profile={profile} slug={slug} />
      <DeluxeTestimonials testimonials={testimonials} />
      <DeluxeFAQ profile={profile} />
      <DeluxeContactForm profile={profile} services={services} addOns={addOns} hours={hours} />
      <DeluxeFooter profile={profile} hours={hours} />
    </main>
  );
};

export default DeluxeLanding;
