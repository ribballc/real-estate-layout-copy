import { Droplets, Shield, Paintbrush, Car } from 'lucide-react';
import type { BusinessService, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import { getServiceImageUrl } from '@/lib/deluxeImages';
import SiteFadeIn from './SiteFadeIn';

const serviceIcons = [Droplets, Shield, Paintbrush, Car];
const serviceAccentClasses = ['text-accent', 'text-emerald-400', 'text-amber-400', 'text-violet-400'];

const defaultServices = [
  { title: 'Interior Detail', description: 'Full vacuum, shampoo, leather conditioning, and deep steam cleaning', price: 95 },
  { title: 'Ceramic Coating', description: 'Long-lasting hydrophobic protection for your paint', price: 875 },
  { title: 'Paint Correction', description: 'Remove swirls, scratches, and oxidation for a flawless finish', price: 250 },
  { title: 'Exterior Wash', description: 'Hand wash, clay bar, wax, tire shine, and door jambs', price: 60 },
];

interface Props {
  services?: BusinessService[];
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeServicesOverview = ({ services, slug, websiteCopy }: Props) => {
  const displayServices = services && services.length > 0
    ? services.map((s, i) => ({
        image: getServiceImageUrl(slug, i, s.image_url),
        title: s.title,
        description: s.description,
        price: s.price,
      }))
    : defaultServices.map((s, i) => ({
        ...s,
        image: getServiceImageUrl(slug, i, null),
      }));

  return (
    <section id="services" className="site-section">
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--site-primary)] font-semibold mb-3">Our Services</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight"
              style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              {getSectionTitle(websiteCopy, 'section_services')}
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed" style={{ overflowWrap: 'break-word' }}>
              {getSectionTitle(websiteCopy, 'section_services_sub')}
            </p>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {displayServices.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <SiteFadeIn key={index} delay={index * 80}>
                <a
                  href={slug ? `/site/${slug}/book` : "#packages"}
                  className={slug ? "book-now-link group block" : "group block"}
                >
                  <div className="relative overflow-hidden rounded-xl border border-white/10 hover:border-white/15 transition-all duration-500 bg-surface-1 shadow-glass">
                    {/* Image with strong bottom fade */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <img
                        src={typeof service.image === "string" ? service.image : String(service.image)}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/80 to-transparent" />
                    </div>

                    {/* Content — overlaps fade zone */}
                    <div className="relative px-5 sm:px-6 pb-6 -mt-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/10 border border-white/10">
                        <Icon className={`w-[18px] h-[18px] ${serviceAccentClasses[index % serviceAccentClasses.length]}`} />
                      </div>
                      <div className="flex items-baseline justify-between gap-2 mb-2">
                        <h3 className="text-white font-semibold text-xl truncate">{service.title}</h3>
                        {service.price != null && (
                          <span className="text-white/60 text-sm font-medium shrink-0">From ${typeof service.price === 'number' ? service.price : service.price}</span>
                        )}
                      </div>
                      <p className="text-white/50 text-[15px] leading-[1.6] line-clamp-3 mb-4" style={{ overflowWrap: 'break-word' }}>
                        {service.description}
                      </p>
                      <span className="text-[13px] font-medium text-[var(--site-primary)] group-hover:underline">
                        Learn more →
                      </span>
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
