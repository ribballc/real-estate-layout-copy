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
  const ctaTagline = websiteCopy?.cta_tagline || `Book your detail with ${businessName}. Online scheduling, instant confirmation.`;

  return (
    <section className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <SiteFadeIn>
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(240,60%,48%) 100%)',
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 30% 20%, hsla(0,0%,100%,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, hsla(0,0%,100%,0.06) 0%, transparent 50%)',
            }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.15] mb-5">
                <Sparkles className="w-3 h-3 text-white/70" />
                <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">Limited spots</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                Ready to see the<br />difference?
              </h2>
              <p className="text-white/60 text-base max-w-md mx-auto mb-8 line-clamp-2"
                style={{ overflowWrap: 'break-word' }}
              >
                {ctaTagline}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-[hsl(217,91%,50%)] px-7 py-3.5 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] transition-all duration-300">
                    Book Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
                {profile?.phone && (
                  <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-medium text-white/90 border border-white/30 hover:border-white/50 hover:bg-white/[0.1] transition-all duration-300 flex items-center justify-center gap-2">
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
