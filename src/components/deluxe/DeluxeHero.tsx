import { ArrowRight, Star, CalendarCheck, Sparkles } from 'lucide-react';
import heroBg from '@/assets/deluxe/hero-bg.jpg';
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
  const city = profile?.address?.split(',')[0]?.trim() || '';
  const headline = websiteCopy?.hero_headline || businessName;
  const subheadline = websiteCopy?.hero_subheadline
    || profile?.tagline
    || 'Premium auto detailing. Book online instantly.';
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : null;

  return (
    <section id="home" className="relative min-h-[85vh] md:min-h-[90vh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={profile?.hero_background_url && profile.hero_background_url.startsWith('http') ? profile.hero_background_url : heroBg}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ animation: 'siteHeroZoom 18s ease-out forwards' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, hsla(0,0%,0%,0.3) 0%, hsla(0,0%,0%,0.5) 40%, hsl(0,0%,4%) 100%)',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-[0.06]" style={{
          background: 'radial-gradient(ellipse, var(--site-primary, hsl(217,91%,60%)) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
          style={{
            background: 'hsla(0,0%,100%,0.07)',
            border: '1px solid hsla(0,0%,100%,0.1)',
            backdropFilter: 'blur(12px)',
            animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-white/60 font-medium tracking-wide">
            {city ? `Booking in ${city}` : 'Online booking available'}
          </span>
        </div>

        <h1
          className="site-heading-1 font-bold text-white mb-5 max-w-3xl"
          style={{
            animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {headline}
        </h1>

        <p
          className="site-body-lg text-white/60 max-w-md mb-8 line-clamp-2"
          style={{
            animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
            overflowWrap: 'break-word',
          }}
        >
          {subheadline}
        </p>

        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          style={{ animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
        >
          <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link w-full sm:w-auto">
            <button
              className="site-tap-target w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-semibold flex items-center justify-center gap-2.5 group transition-all duration-300 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--site-primary, hsl(217,91%,60%)) 0%, var(--site-secondary, hsl(230,91%,52%)) 100%)',
                boxShadow: '0 4px 20px -4px hsla(217,91%,60%,0.35)',
              }}
            >
              <CalendarCheck className="w-4 h-4" />
              Book Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#services" className="w-full sm:w-auto">
            <button className="site-tap-target w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-medium text-white/70 border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 flex items-center justify-center gap-2">
              View Services
            </button>
          </a>
        </div>

        <div
          className="flex flex-wrap items-center gap-4 sm:gap-5 mt-10"
          style={{ animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both' }}
        >
          {avgRating != null && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[12px] text-white/45 font-medium">{avgRating}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
            </>
          )}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color: 'var(--site-primary, hsl(217,91%,60%))' }} />
            <span className="text-[12px] text-white/45">Instant confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeHero;
