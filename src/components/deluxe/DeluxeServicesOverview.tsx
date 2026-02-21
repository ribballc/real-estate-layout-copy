import { ArrowRight } from 'lucide-react';
import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';
import type { BusinessService } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

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
          <div className="max-w-2xl mb-16">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Services</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
              style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              Every detail,<br />handled with precision
            </h2>
            <p className="text-white/40 text-lg leading-relaxed line-clamp-3" style={{ overflowWrap: 'break-word' }}>
              From quick refreshes to complete transformations — choose the level of care your vehicle deserves.
            </p>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayServices.map((service, index) => (
            <SiteFadeIn key={index} delay={index * 100}>
              <a
                href={slug ? `/site/${slug}/book` : "#packages"}
                className={slug ? "book-now-link group block" : "group block"}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(255,255,255,0.06)]">
                  <img
                    src={typeof service.image === "string" ? service.image : String(service.image)}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{service.title}</h3>
                        <p className="text-white/40 text-[13px] leading-relaxed line-clamp-2">{service.description}</p>
                      </div>
                      <div className="flex-shrink-0 ml-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/[0.08]">
                      <span className="text-white/60 text-[13px]">Starting at </span>
                      <span className="text-white font-semibold">${service.price}</span>
                    </div>
                  </div>
                </div>
              </a>
            </SiteFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeServicesOverview;
