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

        <div className="flex flex-wrap justify-center gap-3">
          {displayServices.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const accent = serviceAccents[index % serviceAccents.length];
            return (
              <SiteFadeIn key={index} delay={index * 80}>
                <a
                  href={slug ? `/site/${slug}/book` : "#packages"}
                  className={slug ? "book-now-link group block" : "group block"}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4] w-[calc(50vw-24px)] sm:w-[240px] lg:w-[260px] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500"
                    style={{
                      boxShadow: '0 8px 32px -12px hsla(0,0%,0%,0.4)',
                    }}
                  >
                    <img
                      src={typeof service.image === "string" ? service.image : String(service.image)}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${accent}18`,
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${accent}25`,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-end justify-between">
                        <div className="min-w-0">
                          <h3 className="text-white font-semibold text-base mb-0.5 truncate">{service.title}</h3>
                          <p className="text-white/45 text-[12px] leading-relaxed line-clamp-1">{service.description}</p>
                        </div>
                        <div className="flex-shrink-0 ml-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                          style={{ background: `${accent}25` }}
                        >
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-white/[0.08]">
                        <span className="text-white/50 text-[12px]">From </span>
                        <span className="text-white font-semibold text-sm">${service.price}</span>
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
