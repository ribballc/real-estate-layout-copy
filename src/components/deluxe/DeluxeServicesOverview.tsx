import { Droplets, Shield, Paintbrush, Car } from 'lucide-react';
import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';
import type { BusinessService, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';

const serviceIcons = [Droplets, Shield, Paintbrush, Car];
const serviceAccents = [
  'var(--site-primary, hsl(217,91%,60%))',
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
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeServicesOverview = ({ services, slug, websiteCopy }: Props) => {
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
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="max-w-2xl mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium mb-4">Services</p>
            <h2 className="site-heading-2 font-bold text-white mb-3"
              style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              {getSectionTitle(websiteCopy, 'section_services')}
            </h2>
            <p className="text-white/50 text-base leading-relaxed line-clamp-2" style={{ overflowWrap: 'break-word' }}>
              {getSectionTitle(websiteCopy, 'section_services_sub')}
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
                    {/* Image with strong bottom fade */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <img
                        src={typeof service.image === "string" ? service.image : String(service.image)}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Strong fade: image bleeds into card bg */}
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to top, hsl(0,0%,7%) 0%, hsl(0,0%,7%) 5%, hsla(0,0%,7%,0.85) 25%, hsla(0,0%,7%,0.3) 55%, transparent 100%)',
                      }} />
                    </div>

                    {/* Content — overlaps fade zone */}
                    <div className="relative px-5 sm:px-6 pb-6 -mt-4">
                      {/* Icon badge */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{
                          background: `${accent}15`,
                          border: `1px solid ${accent}22`,
                        }}
                      >
                        <Icon className="w-[18px] h-[18px]" style={{ color: accent }} />
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-semibold text-lg mb-2.5 truncate">{service.title}</h3>

                      {/* Description */}
                      <p className="text-white/45 text-[14px] leading-[1.7] line-clamp-4" style={{ overflowWrap: 'break-word' }}>
                        {service.description}
                      </p>
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
