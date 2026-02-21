import { ArrowRight } from 'lucide-react';
import service1 from '@/assets/deluxe/service-1.jpg';
import service2 from '@/assets/deluxe/service-2.jpg';
import service3 from '@/assets/deluxe/service-3.jpg';
import service4 from '@/assets/deluxe/service-4.jpg';
import type { BusinessService } from '@/hooks/useBusinessData';

const defaultServices = [
  { image: service1, title: 'Interior Detail', description: 'Full vacuum, shampoo, leather conditioning, and deep steam cleaning', price: 95 },
  { image: service2, title: 'Ceramic Coating', description: 'Long-lasting hydrophobic protection for your paint', price: 875 },
  { image: service3, title: 'Paint Correction', description: 'Remove swirls, scratches, and oxidation for a flawless finish', price: 250 },
  { image: service4, title: 'Exterior Wash', description: 'Hand wash, clay bar, wax, tire shine, and door jambs', price: 60 },
];

const defaultImages = [service1, service2, service3, service4];

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
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Services</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Every detail,<br />handled with precision
          </h2>
          <p className="text-white/40 text-lg leading-relaxed">
            From quick refreshes to complete transformations — choose the level of care your vehicle deserves.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayServices.map((service, index) => (
            <a
              key={index}
              href={slug ? `/site/${slug}/book` : "#packages"}
              className={slug ? "book-now-link group" : "group"}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500">
                <img
                  src={typeof service.image === "string" ? service.image : String(service.image)}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{service.title}</h3>
                      <p className="text-white/40 text-[13px] leading-relaxed line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeServicesOverview;
