import { Plus } from 'lucide-react';
import type { BusinessAddOn } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

const defaultAddons = [
  { title: 'Headlight Restoration', price: 85, description: 'Restore clarity and visibility' },
  { title: 'Ceramic Coating', price: 875, description: 'Multi-year hydrophobic protection' },
  { title: 'Paint Correction', price: 140, description: 'Remove swirls and scratches' },
  { title: 'Engine Bay Detail', price: 75, description: 'Degrease and dress' },
  { title: 'Pet Hair Removal', price: 35, description: 'Thorough removal from all surfaces' },
  { title: 'Odor Elimination', price: 50, description: 'Ozone treatment' },
];

const addOnIconClasses = ['text-accent', 'text-emerald-400', 'text-amber-400', 'text-violet-400', 'text-rose-400', 'text-cyan-400'];

interface Props {
  addOns?: BusinessAddOn[];
  slug?: string;
}

const DeluxeAddOnServices = ({ addOns, slug }: Props) => {
  const hasCms = addOns && addOns.length > 0;
  const displayAddons = hasCms
    ? addOns.map((a) => ({ title: a.title, price: a.price, description: a.description }))
    : defaultAddons;

  return (
    <section className="site-section relative overflow-hidden">
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="max-w-2xl mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium mb-4">Add-ons</p>
            <h2 className="site-heading-2 font-bold text-white mb-3">
              Level up your detail
            </h2>
            <p className="text-white/50 text-base">
              Stack extras onto any package.
            </p>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {displayAddons.map((addon, index) => (
              <SiteFadeIn key={index} delay={index * 60} distance={16}>
                <div className="flex items-center justify-between gap-3 bg-surface-2 border border-white/10 rounded-xl p-4 hover:border-white/15 transition-all duration-400 group shadow-glass">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 bg-white/10">
                      <Plus className={`w-3.5 h-3.5 ${addOnIconClasses[index % addOnIconClasses.length]}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-medium text-[14px] mb-0 truncate">{addon.title}</h3>
                      <p className="text-white/40 text-[12px] truncate">{addon.description}</p>
                    </div>
                  </div>
                  <span className="text-white font-semibold text-sm flex-shrink-0 font-mono">${addon.price}</span>
                </div>
              </SiteFadeIn>
          ))}
        </div>

        <SiteFadeIn delay={300}>
          <div className="mt-8 text-center">
            <a
              href={slug ? `/site/${slug}/book` : "#contact"}
              className={`block w-full sm:w-auto max-w-xs mx-auto h-14 px-8 rounded-xl bg-[var(--site-primary)] text-white text-[15px] font-semibold tracking-[-0.01em] hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center ${slug ? 'book-now-link' : ''}`}
            >
              Book with Add-ons
            </a>
          </div>
        </SiteFadeIn>
      </div>
    </section>
  );
};

export default DeluxeAddOnServices;
