import { ArrowRight } from 'lucide-react';
import type { BusinessAddOn } from '@/hooks/useBusinessData';

const defaultAddons = [
  { title: 'Headlight Restoration', price: 85, description: 'Restore clarity and improve nighttime visibility' },
  { title: 'Ceramic Coating', price: 875, description: 'Multi-year hydrophobic protection for your paint' },
  { title: 'Paint Correction', price: 140, description: 'Remove swirls, scratches, and oxidation' },
  { title: 'Engine Bay Detail', price: 75, description: 'Degrease, detail, and dress your engine bay' },
  { title: 'Pet Hair Removal', price: 35, description: 'Thorough removal from seats, carpet, and crevices' },
  { title: 'Odor Elimination', price: 50, description: 'Ozone treatment for stubborn smells' },
];

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
    <section className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Add-ons</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Customize your detail
          </h2>
          <p className="text-white/40 text-lg">
            Enhance any package with specialized services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayAddons.map((addon, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-[15px] mb-0.5">{addon.title}</h3>
                <p className="text-white/30 text-[13px] truncate">{addon.description}</p>
              </div>
              <span className="text-white font-semibold text-[15px] flex-shrink-0">
                ${addon.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={slug ? `/site/${slug}/book` : "#contact"} className={slug ? "book-now-link inline-block" : "inline-block"}>
            <button className="site-btn-primary px-8 py-3.5 rounded-full text-sm font-medium flex items-center gap-2 group">
              Book with Add-ons
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DeluxeAddOnServices;
