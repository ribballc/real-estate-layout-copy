import { ArrowRight, Droplets, Shield, Paintbrush, Car } from 'lucide-react';
import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';
import type { BusinessService } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

const serviceIcons = [Droplets, Shield, Paintbrush, Car];
const serviceAccents = [
  'hsl(217,91%,60%)',
  'hsl(142,71%,45%)',
  'hsl(45,93%,58%)',
  'hsl(280,60%,60%)',
];

const defaultServices = [
  { image: stock2, title: 'Interior Detail', description: 'Full vacuum, shampoo, leather conditioning, and deep steam cleaning', price: 95 },
  { image: stock5, title: 'Ceramic Coating', description: 'Long-lasting hydrophobic protection for your paint', price: 875 },
  { image: stock1, title: 'Paint Correction', description: 'Remove swirls, scratches, and oxidation for a flawless finish', price: 250 },
  { image: stock7, title: 'Exterior Wash', description: 'Hand wash, clay bar, wax, tire shine, and door jambs', price: 60 },
];

const defaultImages = [stock2, stock5, stock1, stock7];

interface Props {
  services?: BusinessService[];
  slug?: string;
}

const DeluxeServicesOverview = ({ services, slug }: Props) => {
  const displayServices = services && services.length > 0
    ? services.map((s, i) => ({
        image: s.image_url || defaultImages[i % defaultImages.length],
        title: s.title,
        description: s.description,
        price: s.price,
      }))
    : defaultServices;

  return (
    <section id="services" className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <SiteFadeIn>
          <div className="max-w-2xl mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium mb-4">Services</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3"
              style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              What we do best
            </h2>
            <p className="text-white/50 text-base leading-relaxed line-clamp-2" style={{ overflowWrap: 'break-word' }}>
              From quick refreshes to complete transformations.
            </p>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {displayServices.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const accent = serviceAccents[index % serviceAccents.length];
            return (
              <SiteFadeIn key={index} delay={index * 80}>
                <a
                  href={slug ? `/site/${slug}/book` : "#packages"}
                  className={slug ? "book-now-link group block" : "group block"}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500"
                    style={{
                      background: 'hsl(0,0%,7%)',
                      boxShadow: '0 8px 32px -12px hsla(0,0%,0%,0.5)',
                    }}
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={typeof service.image === "string" ? service.image : String(service.image)}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,7%)] via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      {/* Icon + Title row */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: `${accent}18`,
                            border: `1px solid ${accent}25`,
                          }}
                        >
                          <Icon className="w-4 h-4" style={{ color: accent }} />
                        </div>
                        <h3 className="text-white font-semibold text-lg truncate">{service.title}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-white/45 text-sm leading-relaxed line-clamp-3 mb-4" style={{ overflowWrap: 'break-word' }}>
                        {service.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <div>
                          <span className="text-white/40 text-xs">Starting at </span>
                          <span className="text-white font-semibold text-base">${service.price}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                          style={{ background: `${accent}20` }}
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </SiteFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeluxeServicesOverview;
