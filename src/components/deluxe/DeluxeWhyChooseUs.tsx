import { Shield, Clock, Award, Sparkles, ThumbsUp, Car } from 'lucide-react';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';

const featureIconClasses = ['text-accent', 'text-emerald-400', 'text-amber-400', 'text-violet-400', 'text-rose-400', 'text-cyan-400'];
const features = [
  { icon: Shield, title: 'Satisfaction Guaranteed', description: 'We stand behind every detail.' },
  { icon: Clock, title: 'Flexible Scheduling', description: 'Book online 24/7.' },
  { icon: Award, title: 'Certified Pros', description: 'Trained with premium products.' },
  { icon: Sparkles, title: 'Premium Products', description: 'Professional-grade only.' },
  { icon: ThumbsUp, title: 'Trusted Reviews', description: 'Five-star reputation.' },
  { icon: Car, title: 'All Vehicles', description: 'Sedans to exotics.' },
];

interface Props {
  profile?: BusinessProfile | null;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeWhyChooseUs = ({ profile, websiteCopy }: Props) => {
  const businessName = profile?.business_name || 'us';
  const aboutText = websiteCopy?.about_paragraph || '';
  const displayFeatures = websiteCopy?.why_choose_us_items && websiteCopy.why_choose_us_items.length > 0
    ? websiteCopy.why_choose_us_items.map((item, i) => ({
        ...features[i % features.length],
        title: item.title,
        description: item.description,
      }))
    : features;

  return (
    <section className="site-section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-accent" style={{
        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 60%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 60%)',
      }} />
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--site-primary)] font-semibold mb-3">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight"
              style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              {getSectionTitle(websiteCopy, 'section_why_choose_us')}
            </h2>
            {aboutText && (
              <p className="site-body text-white/50 mt-3 line-clamp-3"
                style={{ overflowWrap: 'break-word' }}
              >
                {aboutText}
              </p>
            )}
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {displayFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
            <SiteFadeIn key={index} delay={index * 60}>
              <div className="relative bg-surface-2 border border-white/10 rounded-xl p-5 hover:border-white/15 transition-all duration-500 group overflow-hidden text-center shadow-glass">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 bg-white/10">
                    <Icon className={`w-4.5 h-4.5 ${featureIconClasses[index % featureIconClasses.length]}`} />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm">{feature.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </SiteFadeIn>
          );})}
        </div>
      </div>
    </section>
  );
};

export default DeluxeWhyChooseUs;
