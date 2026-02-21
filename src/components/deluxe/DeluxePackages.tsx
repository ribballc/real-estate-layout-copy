import { Check, ArrowRight } from 'lucide-react';
import type { BusinessService } from '@/hooks/useBusinessData';
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
    features: ['Hand wash & dry', 'Ceramic wax application', 'Door jambs', 'Tire shine', 'Bug & tar removal'],
  },
  {
    title: 'Interior Detail',
    price: '$95',
    description: 'Complete interior transformation',
    features: ['Full vacuum & blow out', 'Steam cleaning', 'Shampoo seats & mats', 'Leather conditioning', 'Dashboard & console detail', 'Vent & cupholder cleaning'],
    popular: true,
  },
  {
    title: 'Full Detail',
    price: '$180',
    description: 'Inside and out, showroom ready',
    features: ['Everything in Interior', 'Hand wash & clay bar', 'Paint decontamination', 'Ceramic sealant', 'Trim restoration', 'Engine bay cleaning'],
  },
];

interface Props {
  services?: BusinessService[];
  slug?: string;
}

const DeluxePackages = ({ services, slug }: Props) => {
  const hasCms = services && services.length > 0;

  const packages: Package[] = hasCms
    ? services.map((s) => ({
        title: s.title,
        price: `$${s.price}`,
        description: s.description?.split('\n')[0] || '',
        features: s.description ? s.description.split('\n').filter(Boolean) : [],
        popular: s.popular,
      }))
    : defaultPackages;

  return (
    <section id="packages" className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Pricing</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-white/40 text-lg">
              No hidden fees. Pick a package and book in under 60 seconds.
            </p>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <SiteFadeIn key={index} delay={index * 120}>
              <div
                className={`relative rounded-2xl p-6 transition-all duration-500 group ${
                  pkg.popular
                    ? 'bg-white text-[hsl(0,0%,4%)] ring-1 ring-white shadow-[0_0_60px_-12px_rgba(255,255,255,0.15)]'
                    : 'bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] uppercase tracking-widest font-semibold bg-[hsl(0,0%,4%)] text-white px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-1 ${pkg.popular ? 'text-[hsl(0,0%,4%)]' : 'text-white'}`}>
                    {pkg.title}
                  </h3>
                  <p className={`text-[13px] ${pkg.popular ? 'text-[hsl(0,0%,4%)]/50' : 'text-white/40'}`}>
                    {pkg.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${pkg.popular ? 'text-[hsl(0,0%,4%)]' : 'text-white'}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-sm ml-1 ${pkg.popular ? 'text-[hsl(0,0%,4%)]/40' : 'text-white/30'}`}>
                    starting
                  </span>
                </div>

                <a href={slug ? `/site/${slug}/book` : "#contact"} className={slug ? "book-now-link block mb-6" : "block mb-6"}>
                  <button className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                    pkg.popular
                      ? 'bg-[hsl(0,0%,4%)] text-white hover:bg-[hsl(0,0%,15%)]'
                      : 'bg-white/[0.08] text-white hover:bg-white/[0.14] border border-white/[0.1]'
                  }`}>
                    Book Now
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </a>

                <ul className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px]">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${pkg.popular ? 'text-[hsl(0,0%,4%)]' : 'text-white/50'}`} />
                      <span className={pkg.popular ? 'text-[hsl(0,0%,4%)]/70' : 'text-white/50'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </SiteFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxePackages;
