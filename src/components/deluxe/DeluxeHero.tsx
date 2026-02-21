import { ArrowRight, Play, Star, CalendarCheck, Zap } from 'lucide-react';
import heroBg from '@/assets/deluxe/hero-bg.jpg';
import type { BusinessProfile } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
}

const DeluxeHero = ({ profile, slug }: Props) => {
  const businessName = profile?.business_name || 'Your Detailing Studio';
  const tagline = profile?.tagline || 'Professional auto detailing, ceramic coating, and paint correction services';
  const city = profile?.address?.split(',')[0]?.trim() || '';

  return (
    <section id="home" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" style={{ animation: 'siteHeroZoom 20s ease-out forwards' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[hsl(0,0%,4%)]" />
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
            {city ? `Serving ${city}` : 'Professional Auto Detailing'}
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6"
          style={{ animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}
        >
          {businessName}
        </h1>

        <p
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both' }}
        >
          {tagline}
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: 'siteFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}
        >
          <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link">
            <button className="site-btn-primary px-8 py-4 rounded-full text-[15px] font-semibold flex items-center gap-2.5 group hover:shadow-[0_4px_24px_-4px_rgba(255,255,255,0.2)] transition-all duration-300">
              <CalendarCheck className="w-4 h-4" />
              Book Your Detail
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#services">
            <button className="px-8 py-4 rounded-full text-[15px] font-medium text-white/80 border border-white/[0.15] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 flex items-center gap-2.5">
              <Play className="w-4 h-4" />
              View Services
            </button>
          </a>
        </div>

        {/* Trust indicators with icons */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-16"
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
            <Zap className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[13px] text-white/40">Instant booking</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[13px] text-white/40">Online 24/7</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(0,0%,4%)] to-transparent" />
    </section>
  );
};

export default DeluxeHero;
