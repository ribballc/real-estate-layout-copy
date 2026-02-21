import { ArrowRight, Star, CalendarCheck, Sparkles } from 'lucide-react';
import heroBg from '@/assets/deluxe/hero-bg.jpg';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeHero = ({ profile, slug, websiteCopy }: Props) => {
  const businessName = profile?.business_name || 'Your Detailing Studio';
  const city = profile?.address?.split(',')[0]?.trim() || '';
  const headline = businessName;
  const subheadline = websiteCopy?.hero_subheadline
    || profile?.tagline
    || 'Premium auto detailing. Book online instantly.';

  return (
    <section id="home" className="relative min-h-[85vh] md:min-h-[90vh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" style={{ animation: 'siteHeroZoom 18s ease-out forwards' }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, hsla(0,0%,0%,0.3) 0%, hsla(0,0%,0%,0.5) 40%, hsl(0,0%,4%) 100%)',
        }} />
        {/* Accent glow — top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none" style={{
          background: 'radial-gradient(ellipse, hsla(217,91%,60%,0.06) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20 pt-32">
        {/* Pill */}
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-5 max-w-3xl line-clamp-2"
          style={{
            animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {headline}
        </h1>

        <p
          className="text-base sm:text-lg text-white/60 max-w-md mb-8 leading-relaxed line-clamp-2"
          style={{
            animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
            overflowWrap: 'break-word',
          }}
        >
          {subheadline}
        </p>

        <div
          className="flex flex-col sm:flex-row items-start gap-3"
          style={{ animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
        >
          <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link w-full sm:w-auto">
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-semibold flex items-center justify-center gap-2.5 group transition-all duration-300 text-white"
              style={{
                background: 'linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,91%,52%) 100%)',
                boxShadow: '0 4px 20px -4px hsla(217,91%,60%,0.35)',
              }}
            >
              <CalendarCheck className="w-4 h-4" />
              Book Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#services" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-medium text-white/70 border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 flex items-center justify-center gap-2">
              View Services
            </button>
          </a>
        </div>

        {/* Trust row */}
        <div
          className="flex flex-wrap items-center gap-4 sm:gap-5 mt-10"
          style={{ animation: 'siteFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[12px] text-white/45 font-medium">5.0</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[hsl(217,91%,60%)]" />
            <span className="text-[12px] text-white/45">Instant confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeHero;
