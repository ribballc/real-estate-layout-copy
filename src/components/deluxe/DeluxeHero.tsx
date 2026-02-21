import { ArrowRight, Play } from 'lucide-react';
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
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[hsl(0,0%,4%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] backdrop-blur-sm mb-8 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[13px] text-white/70 font-medium tracking-wide">
            {city ? `Serving ${city}` : 'Professional Auto Detailing'}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {businessName}
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link">
            <button className="site-btn-primary px-8 py-4 rounded-full text-[15px] font-semibold flex items-center gap-2.5 group">
              Book Your Detail
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#services">
            <button className="px-8 py-4 rounded-full text-[15px] font-medium text-white/80 border border-white/[0.15] hover:border-white/30 hover:bg-white/[0.04] transition-all flex items-center gap-2.5">
              <Play className="w-4 h-4" />
              View Services
            </button>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[13px] text-white/40">5.0 rated</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[13px] text-white/40">Online booking</span>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[13px] text-white/40">Instant confirmation</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(0,0%,4%)] to-transparent" />
    </section>
  );
};

export default DeluxeHero;
