import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
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
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--site-primary, hsl(217,91%,60%)) 0%, var(--site-secondary, hsl(230,91%,52%)) 100%)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 30% 20%, hsla(0,0%,100%,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, hsla(0,0%,100%,0.06) 0%, transparent 50%)',
            }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.15] mb-5">
                <Sparkles className="w-3 h-3 text-white/70" />
                <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">Limited spots</span>
              </div>
              <h2 className="site-heading-2 font-bold text-white mb-4"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                {getSectionTitle(websiteCopy, 'section_cta')}
              </h2>
              <p className="site-body text-white/80 max-w-md mx-auto mb-8"
                style={{ overflowWrap: 'break-word' }}
              >
                {ctaTagline}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link w-full sm:w-auto">
                  <button className="site-tap-target w-full sm:w-auto bg-white px-7 py-3.5 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] transition-all duration-300" style={{ color: 'var(--site-primary, hsl(217,91%,50%))' }}>
                    Book Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
                {profile?.phone && (
                  <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} className="w-full sm:w-auto">
                    <button className="site-tap-target w-full sm:w-auto px-7 py-3.5 rounded-full text-[14px] font-medium text-white/90 border border-white/30 hover:border-white/50 hover:bg-white/[0.1] transition-all duration-300 flex items-center justify-center gap-2">
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
