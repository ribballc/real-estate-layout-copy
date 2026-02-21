import { Shield, Clock, Award, Sparkles, ThumbsUp, Car } from 'lucide-react';
import type { BusinessProfile, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';

const features = [
  { icon: Shield, title: 'Satisfaction Guaranteed', description: 'We stand behind every detail.', accent: 'var(--site-primary, hsl(217,91%,60%))' },
  { icon: Clock, title: 'Flexible Scheduling', description: 'Book online 24/7.', accent: 'hsl(142,71%,45%)' },
  { icon: Award, title: 'Certified Pros', description: 'Trained with premium products.', accent: 'hsl(45,93%,58%)' },
  { icon: Sparkles, title: 'Premium Products', description: 'Professional-grade only.', accent: 'hsl(280,60%,60%)' },
  { icon: ThumbsUp, title: 'Trusted Reviews', description: 'Five-star reputation.', accent: 'hsl(350,80%,60%)' },
  { icon: Car, title: 'All Vehicles', description: 'Sedans to exotics.', accent: 'hsl(190,80%,50%)' },
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
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        background: 'radial-gradient(ellipse at 50% 0%, var(--site-primary, hsl(217,91%,60%)) 0%, transparent 60%)',
      }} />
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium mb-4">Why {businessName}</p>
            <h2 className="site-heading-2 font-bold text-white mb-3"
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
          {displayFeatures.map((feature, index) => (
            <SiteFadeIn key={index} delay={index * 60}>
              <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.14] transition-all duration-500 group overflow-hidden text-center">
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${feature.accent}08 0%, transparent 60%)` }}
                />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `${feature.accent}12` }}
                  >
                    <feature.icon className="w-4.5 h-4.5" style={{ color: feature.accent }} />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-[14px]">{feature.title}</h3>
                  <p className="text-white/50 text-[12px] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </SiteFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeWhyChooseUs;
