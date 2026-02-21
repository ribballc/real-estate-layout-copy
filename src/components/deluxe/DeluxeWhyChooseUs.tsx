import { Shield, Clock, Award, Sparkles, ThumbsUp, Car } from 'lucide-react';
import type { BusinessProfile } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

const features = [
  { icon: Shield, title: 'Satisfaction Guaranteed', description: 'We stand behind every detail with a quality guarantee.' },
  { icon: Clock, title: 'Flexible Scheduling', description: 'Book online 24/7 with times that fit your life.' },
  { icon: Award, title: 'Certified Technicians', description: 'Trained professionals using premium-grade products.' },
  { icon: Sparkles, title: 'Premium Products', description: 'Only professional-grade products for lasting results.' },
  { icon: ThumbsUp, title: 'Trusted & Reviewed', description: 'Hundreds of five-star reviews from happy customers.' },
  { icon: Car, title: 'All Vehicles', description: 'Sedans, trucks, SUVs, exotics — we detail them all.' },
];

interface Props {
  profile?: BusinessProfile | null;
}

const DeluxeWhyChooseUs = ({ profile }: Props) => {
  const businessName = profile?.business_name || 'us';

  return (
    <section className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Why Choose {businessName}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Built on trust,<br />driven by results
            </h2>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <SiteFadeIn key={index} delay={index * 80}>
              <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-500 group overflow-hidden">
                {/* Subtle gradient glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 30% 20%, hsla(0,0%,100%,0.04) 0%, transparent 60%)' }}
                />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4 group-hover:bg-white/[0.12] group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-[15px]">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
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
