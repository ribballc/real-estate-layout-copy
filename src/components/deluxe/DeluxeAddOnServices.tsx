import { ArrowRight, Plus } from 'lucide-react';
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

const addOnAccents = [
  'hsl(217,91%,60%)',
  'hsl(142,71%,45%)',
  'hsl(45,93%,58%)',
  'hsl(280,60%,60%)',
  'hsl(350,80%,60%)',
  'hsl(190,80%,50%)',
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
        <SiteFadeIn>
          <div className="max-w-2xl mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Add-ons</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
              Level up your detail
            </h2>
            <p className="text-white/35 text-base">
              Stack extras onto any package.
            </p>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {displayAddons.map((addon, index) => {
            const accent = addOnAccents[index % addOnAccents.length];
            return (
              <SiteFadeIn key={index} delay={index * 60} distance={16}>
                <div className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.14] transition-all duration-400 group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `${accent}12` }}
                    >
                      <Plus className="w-3.5 h-3.5" style={{ color: accent }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-medium text-[14px] mb-0 truncate">{addon.title}</h3>
                      <p className="text-white/25 text-[12px] truncate">{addon.description}</p>
                    </div>
                  </div>
                  <span className="text-white font-semibold text-[14px] flex-shrink-0">${addon.price}</span>
                </div>
              </SiteFadeIn>
            );
          })}
        </div>

        <SiteFadeIn delay={300}>
          <div className="mt-8 text-center">
            <a href={slug ? `/site/${slug}/book` : "#contact"} className={slug ? "book-now-link inline-block" : "inline-block"}>
              <button className="px-7 py-3 rounded-full text-[13px] font-semibold flex items-center gap-2 group transition-all duration-300 text-white"
                style={{
                  background: 'linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(230,91%,52%) 100%)',
                  boxShadow: '0 4px 16px -4px hsla(217,91%,60%,0.3)',
                }}
              >
                Book with Add-ons
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </a>
          </div>
        </SiteFadeIn>
      </div>
    </section>
  );
};

export default DeluxeAddOnServices;
