import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeCTASection = ({ profile, slug, websiteCopy }: Props) => {
  const businessName = profile?.business_name || 'us';
  const ctaTagline = websiteCopy?.cta_tagline || `Book your detail with ${businessName} today. Online scheduling, instant confirmation, premium results.`;

  return (
    <section className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <SiteFadeIn>
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,91%,48%) 100%)',
            }}
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 30% 20%, hsla(0,0%,100%,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(0,0%,100%,0.08) 0%, transparent 50%)',
            }} />
            {/* Corner accent dots */}
            <div className="absolute top-6 left-6 w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="absolute bottom-6 right-6 w-1.5 h-1.5 rounded-full bg-white/20" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.15] mb-6">
                <Sparkles className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[12px] font-medium text-white/80 uppercase tracking-wider">Limited availability</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                Ready to see<br />the difference?
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 line-clamp-3"
                style={{ overflowWrap: 'break-word' }}
              >
                {ctaTagline}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-[hsl(217,91%,50%)] px-8 py-4 rounded-full text-[15px] font-bold flex items-center justify-center gap-2.5 group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] transition-all duration-300">
                    Book Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
                {profile?.phone && (
                  <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 rounded-full text-[15px] font-medium text-white/90 border border-white/30 hover:border-white/50 hover:bg-white/[0.1] transition-all duration-300 flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Us
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </SiteFadeIn>
      </div>
    </section>
  );
};

export default DeluxeCTASection;
