import { Star } from 'lucide-react';
import { getHeroImageUrl } from '@/lib/deluxeImages';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';
import type { BusinessTestimonial } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
  testimonials?: BusinessTestimonial[];
}

const DeluxeHero = ({ profile, slug, websiteCopy, testimonials = [] }: Props) => {
  const businessName = profile?.business_name || 'Your Detailing Studio';
  const serviceArea = profile?.service_areas?.[0]?.trim();
  const cityFromAddress = profile?.address?.split(',')[0]?.trim();
  const city = serviceArea || cityFromAddress || '';
  const headline = websiteCopy?.hero_headline || businessName;
  const subheadline = websiteCopy?.hero_subheadline
    || (city ? `Serving ${city} and surrounding areas.` : 'Professional auto detailing. Book online instantly.');
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : null;

  return (
    <section id="home" className="relative min-h-[75svh] sm:min-h-[85svh] lg:min-h-[100svh] flex items-center overflow-hidden">
      {/* Background — no zoom on mobile to avoid overadjustment */}
      <div className="absolute inset-0">
        <img
          src={getHeroImageUrl(slug, profile?.hero_background_url)}
          alt=""
          className="hero-bg-img w-full h-full object-cover object-center sm:object-center"
          style={{ animation: 'siteHeroZoom 12s ease-out forwards' }}
        />
        {/* Layer 1: vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/85" />
        {/* Layer 2: subtle tint + accent glow bottom-left */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-[var(--site-primary)] opacity-[0.08] blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20 sm:pb-28">
        <div className="max-w-2xl">
          <div className="flex flex-col gap-4 text-left border-l-2 border-[var(--site-primary)] pl-5 sm:pl-6">
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: 'var(--site-primary)' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--site-primary)' }} />
              </span>
              <span className="text-[11px] sm:text-xs tracking-widest uppercase font-medium text-white/60">
                {city ? `Proudly Servicing ${city}` : 'Proudly Servicing Our Area'}
              </span>
            </div>

            <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-bold leading-[1.05] tracking-[-0.03em] text-white">
              {headline}
            </h1>

            <p className="text-[15px] sm:text-base leading-[1.55] text-white/70 max-w-[28ch]">
              {subheadline}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={slug ? `/site/${slug}/book` : '#contact'}
                className="book-now-link inline-flex h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-[var(--site-primary)] text-white text-[14px] sm:text-[15px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150 items-center justify-center"
              >
                Book Now
              </a>
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-[14px] font-medium text-white/90 border border-white/30 hover:bg-white/10 transition-colors duration-150 items-center justify-center"
                >
                  Call Now
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
              {avgRating != null && (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[var(--site-primary)] text-[var(--site-primary)]" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-white/60">{avgRating}</span>
                  </div>
                  <span className="text-white/30 hidden sm:inline">·</span>
                </>
              )}
              <span className="text-xs text-white/50">Instant confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeHero;
