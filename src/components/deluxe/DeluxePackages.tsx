import { Check, Zap } from 'lucide-react';
import type { BusinessProfile, BusinessService, WebsiteCopy } from '@/hooks/useBusinessData';
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
  profile?: BusinessProfile | null;
  services?: BusinessService[];
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxePackages = ({ profile, services, slug, websiteCopy }: Props) => {
  const hasCms = services && services.length > 0;

  // CMS services or default packages — site always looks complete to end customers.
  const packages: Package[] = hasCms
    ? services!.map((s) => ({
        title: s.title,
        price: `$${s.price}`,
        description: s.description?.split('\n')[0] || '',
        features: s.description ? s.description.split('\n').filter(Boolean) : [],
        popular: s.popular,
      }))
    : defaultPackages;

  return (
    <section id="packages" className="site-section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        background: 'linear-gradient(180deg, transparent 0%, transparent 40%, var(--accent) 100%)',
      }} />
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--site-primary)] font-semibold mb-3">Packages & Pricing</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              {getSectionTitle(websiteCopy, 'section_packages')}
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed">
              {getSectionTitle(websiteCopy, 'section_packages_sub')}
            </p>
          </div>
        </SiteFadeIn>

        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {packages.map((pkg, index) => {
            const popular = pkg.popular;
            return (
              <SiteFadeIn key={index} delay={index * 100}>
                <div className="w-full sm:w-[320px]">
                <div
                  className={`relative rounded-2xl p-6 transition-all duration-500 group overflow-hidden ${
                    popular
                      ? 'ring-1 ring-accent shadow-glass bg-surface-2 bg-accent/5'
                      : 'bg-surface-3/50 border border-white/10 hover:border-white/15'
                  }`}
                >
                  {popular && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-accent" style={{
                      maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 60%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 60%)',
                    }} />
                  )}

                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="text-[11px] uppercase tracking-widest font-semibold px-4 py-1 rounded-full flex items-center gap-1.5 bg-accent text-white">
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
                      <span className="text-3xl font-bold text-white tracking-tight font-mono">{pkg.price}</span>
                      <span className="text-white/40 text-xs uppercase tracking-wider ml-2">*Starting price</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mb-5">
                      <a
                        href={slug ? `/site/${slug}/book` : "#contact"}
                        className={`block w-full h-12 px-6 rounded-xl bg-[var(--site-primary)] text-white text-[14px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center ${slug ? 'book-now-link' : ''}`}
                      >
                        Book Now
                      </a>
                      {profile?.phone && (
                        <a
                          href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}
                          className="block w-full h-12 px-6 rounded-xl border border-white/20 text-white/90 text-[14px] font-medium hover:bg-white/10 transition-all duration-150 flex items-center justify-center"
                        >
                          Call Now
                        </a>
                      )}
                    </div>

                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px]">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${popular ? 'bg-accent/20' : 'bg-white/10'}`}>
                            <Check className={`w-2.5 h-2.5 ${popular ? 'text-accent' : 'text-white/50'}`} />
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
      </div>
    </section>
  );
};

export default DeluxePackages;
