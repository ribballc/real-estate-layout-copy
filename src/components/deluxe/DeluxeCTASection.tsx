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
          <div className="relative overflow-hidden rounded-2xl p-10 md:p-16 text-center bg-accent">
            <div className="absolute inset-0 pointer-events-none bg-white/10" style={{
              maskImage: 'radial-gradient(ellipse 70% 50% at 30% 20%, black 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, black 0%, transparent 50%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 30% 20%, black 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, black 0%, transparent 50%)',
            }} />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                {getSectionTitle(websiteCopy, 'section_cta')}
              </h2>
              <p className="text-white/90 text-[15px] max-w-md mx-auto mb-8 leading-relaxed"
                style={{ overflowWrap: 'break-word' }}
              >
                {ctaTagline}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={slug ? `/site/${slug}/book` : "#contact"}
                  className="book-now-link block w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-[var(--site-primary)] text-[15px] font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center"
                >
                  Book Now
                </a>
                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
                    className="h-12 px-6 flex items-center justify-center text-[14px] font-medium text-white hover:text-white/90 border border-white/40 hover:bg-white/10 rounded-xl transition-colors duration-150 w-full sm:w-auto"
                  >
                    Call Us
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
