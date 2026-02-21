import { Check, ArrowRight, Crown, Zap } from 'lucide-react';
import type { BusinessService, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';

interface Package {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const defaultPackages: Package[] = [
  {
    title: 'Express Wash',
    price: '$60',
    description: 'Quick exterior refresh',
    features: ['Hand wash & dry', 'Ceramic wax', 'Door jambs', 'Tire shine', 'Bug & tar removal'],
  },
  {
    title: 'Interior Detail',
    price: '$95',
    description: 'Complete interior transformation',
    features: ['Full vacuum & blow out', 'Steam cleaning', 'Shampoo seats & mats', 'Leather conditioning', 'Dashboard detail', 'Vent cleaning'],
    popular: true,
  },
  {
    title: 'Full Detail',
    price: '$180',
    description: 'Showroom ready, inside & out',
    features: ['Everything in Interior', 'Hand wash & clay bar', 'Paint decontamination', 'Ceramic sealant', 'Trim restoration', 'Engine bay detail'],
  },
];

interface Props {
  services?: BusinessService[];
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxePackages = ({ services, slug, websiteCopy }: Props) => {
  const hasCms = services && services.length > 0;

  const packages: Package[] = hasCms
    ? services.map((s) => ({
        title: s.title,
        price: `$${s.price}`,
        description: s.description?.split('\n')[0] || '',
        features: s.description ? s.description.split('\n').filter(Boolean) : [],
        popular: s.popular,
      }))
    : [];

  return (
    <section id="packages" className="site-section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        background: 'linear-gradient(180deg, transparent 0%, transparent 40%, var(--site-primary, hsl(217,91%,60%)) 100%)',
      }} />
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium mb-4">Pricing</p>
            <h2 className="site-heading-2 font-bold text-white mb-3">
              {getSectionTitle(websiteCopy, 'section_packages')}
            </h2>
            <p className="site-body text-white/50">
              {getSectionTitle(websiteCopy, 'section_packages_sub')}
            </p>
          </div>
        </SiteFadeIn>

        {!hasCms ? (
          <SiteFadeIn>
            <div className="max-w-md mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
              <p className="text-white/60 text-sm mb-4">Add your services in the dashboard to show pricing and packages here.</p>
              <a href={slug ? `/site/${slug}/book` : '#contact'} className={slug ? 'book-now-link' : ''}>
                <button className="site-tap-target px-6 py-3 rounded-full text-sm font-medium text-white/80 border border-white/[0.12] hover:bg-white/[0.06] transition-colors">
                  View booking
                </button>
              </a>
            </div>
          </SiteFadeIn>
        ) : (
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {packages.map((pkg, index) => {
            const popular = pkg.popular;
            return (
              <SiteFadeIn key={index} delay={index * 100}>
                <div className="w-full sm:w-[320px]">
                <div
                  className={`relative rounded-2xl p-6 transition-all duration-500 group overflow-hidden ${
                    popular
                      ? 'ring-1 shadow-[0_0_40px_-12px_rgba(0,0,0,0.25)]'
                      : 'bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                  style={popular ? {
                    background: 'linear-gradient(180deg, hsla(217,91%,60%,0.06) 0%, hsla(0,0%,100%,0.02) 100%)',
                    borderColor: 'var(--site-primary, hsl(217,91%,60%))',
                  } : undefined}
                >
                  {popular && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{
                      background: 'radial-gradient(ellipse at 50% 0%, var(--site-primary, hsl(217,91%,60%)) 0%, transparent 60%)',
                    }} />
                  )}

                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="text-[11px] uppercase tracking-widest font-semibold px-4 py-1 rounded-full flex items-center gap-1.5"
                        style={{
                          background: 'linear-gradient(135deg, var(--site-primary, hsl(217,91%,60%)) 0%, var(--site-secondary, hsl(230,91%,52%)) 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px -2px hsla(217,91%,60%,0.3)',
                        }}
                      >
                        <Zap className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="mb-5 pt-2">
                      <h3 className="text-white font-semibold text-lg mb-0.5 truncate">{pkg.title}</h3>
                      <p className="text-white/45 text-[13px] line-clamp-1" style={{ overflowWrap: 'break-word' }}>{pkg.description}</p>
                    </div>

                    <div className="mb-5">
                      <span className="text-3xl font-bold text-white tracking-tight">{pkg.price}</span>
                      <span className="text-white/25 text-sm ml-1">starting</span>
                    </div>

                    <a href={slug ? `/site/${slug}/book` : "#contact"} className={slug ? "book-now-link block mb-5" : "block mb-5"}>
                      <button
                        className={`site-tap-target w-full py-3 rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                          popular
                            ? 'text-white hover:shadow-[0_4px_20px_-4px_hsla(217,91%,60%,0.3)]'
                            : 'bg-white/[0.08] text-white hover:bg-white/[0.14] border border-white/[0.1]'
                        }`}
                        style={popular ? {
                          background: 'linear-gradient(135deg, var(--site-primary, hsl(217,91%,60%)) 0%, var(--site-secondary, hsl(230,91%,52%)) 100%)',
                        } : undefined}
                      >
                        Book Now
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </a>

                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px]">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${popular ? 'bg-[hsla(217,91%,60%,0.12)]' : 'bg-white/[0.06]'}`}>
                            <Check className="w-2.5 h-2.5 text-white/50" style={popular ? { color: 'var(--site-primary, hsl(217,91%,60%))' } : undefined} />
                          </div>
                          <span className="text-white/55">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </div>
              </SiteFadeIn>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default DeluxePackages;
