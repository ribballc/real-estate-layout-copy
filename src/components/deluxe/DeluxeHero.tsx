import { ArrowRight, Play, Star, CalendarCheck, Zap, Shield } from 'lucide-react';
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

  // Use AI-generated copy when available, fall back to defaults
  const headline = websiteCopy?.hero_headline || businessName;
  const subheadline = websiteCopy?.hero_subheadline
    || profile?.tagline
    || 'Professional auto detailing, ceramic coating, and paint correction services';
  const aboutSnippet = websiteCopy?.about_paragraph || '';

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" style={{ animation: 'siteHeroZoom 20s ease-out forwards' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[hsl(0,0%,4%)]" />
        {/* Colored accent glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 20%, hsla(217,91%,60%,0.08) 0%, transparent 60%)',
        }} />
      </div>

      {/* Subtle grid overlay for tech feel */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsla(0,0%,100%,0.1) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] backdrop-blur-sm mb-8"
          style={{ animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[13px] text-white/70 font-medium tracking-wide">
            {city ? `Now booking in ${city}` : 'Now accepting online bookings'}
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-6 max-w-4xl mx-auto"
          style={{
            animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {headline}
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed line-clamp-3"
          style={{
            animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both',
            overflowWrap: 'break-word',
          }}
        >
          {subheadline}
        </p>

        {/* About snippet — only shows if AI copy exists */}
        {aboutSnippet && (
          <p
            className="text-sm md:text-base text-white/35 max-w-xl mx-auto mb-10 leading-relaxed line-clamp-2"
            style={{
              animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both',
              overflowWrap: 'break-word',
            }}
          >
            {aboutSnippet}
          </p>
        )}

        {!aboutSnippet && <div className="mb-10" />}

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          style={{ animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}
        >
          <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2.5 group transition-all duration-300 text-white"
              style={{
                background: 'linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,91%,54%) 100%)',
                boxShadow: '0 4px 24px -4px hsla(217,91%,60%,0.4)',
              }}
            >
              <CalendarCheck className="w-4 h-4" />
              Book Your Detail
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#services" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full text-[15px] font-medium text-white/80 border border-white/[0.15] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 flex items-center justify-center gap-2.5">
              <Play className="w-4 h-4" />
              View Services
            </button>
          </a>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-14"
          style={{ animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[13px] text-white/40 font-medium">5.0 rated</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" style={{ color: 'hsl(217,91%,60%)' }} />
            <span className="text-[13px] text-white/40">Instant booking</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: 'hsl(142,71%,45%)' }} />
            <span className="text-[13px] text-white/40">Satisfaction guaranteed</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(0,0%,4%)] to-transparent" />
    </section>
  );
};

export default DeluxeHero;
