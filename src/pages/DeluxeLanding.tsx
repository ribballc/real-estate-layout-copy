import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useBusinessDataBySlug } from '@/hooks/useBusinessData';
import SEOHead from '@/components/SEOHead';
import { buildHoursSchema } from '@/lib/seo';
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
  useEffect(() => {
    if (window.self === window.top) return;
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

  // Build dynamic SEO data
  const businessName = profile?.business_name || 'Auto Detailing';
  const city = profile?.address?.split(',')[0]?.trim() || '';
  const servicesList = services.slice(0, 3).map((s) => s.title).join(', ');
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : null;
  const ogImage = photos.length > 0 ? photos[0].url : 'https://darkerdigital.com/og-default.jpg';
  const canonicalUrl = `https://darkerdigital.com/site/${slug}`;

  const structuredData = useMemo(() => {
    const schemas: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        name: businessName,
        url: canonicalUrl,
        ...(profile?.phone && { telephone: profile.phone }),
        ...(profile?.address && {
          address: {
            '@type': 'PostalAddress',
            addressLocality: city,
            addressCountry: 'US',
          },
        }),
        openingHoursSpecification: buildHoursSchema(hours),
        priceRange: '$$',
        ...(services.length > 0 && {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Detailing Services',
            itemListElement: services.map((s) => ({
              '@type': 'Offer',
              name: s.title,
              description: s.description,
              price: s.price,
              priceCurrency: 'USD',
            })),
          },
        }),
        ...(avgRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            reviewCount: testimonials.length,
            bestRating: '5',
            worstRating: '1',
          },
        }),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: businessName,
        url: canonicalUrl,
        potentialAction: {
          '@type': 'ReserveAction',
          target: `https://darkerdigital.com/site/${slug}/book`,
          name: 'Book a Detail',
        },
      },
    ];
    return schemas;
  }, [businessName, canonicalUrl, profile, services, hours, testimonials, avgRating, city, slug]);

  const geoMeta = city ? [
    { name: 'geo.placename', content: city },
  ] : [];

  return (
    <main className={`min-h-screen bg-background font-montserrat ${isDark ? "site-dark" : ""}`}>
      <SEOHead
        title={`${businessName} — Auto Detailing${city ? ` in ${city}` : ''} | Book Online`}
        description={`${businessName} offers professional ${servicesList || 'auto detailing'}${city ? ` in ${city}` : ''}. Book online 24/7. Deposits accepted, instant confirmation, SMS reminders.`}
        canonicalUrl={canonicalUrl}
        ogImage={ogImage}
        structuredData={structuredData}
        extraMeta={geoMeta}
      />
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
