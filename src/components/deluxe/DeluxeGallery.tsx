import { useRef, useState, useEffect } from 'react';
import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock3 from '@/assets/deluxe/stock-3.jpg';
import stock4 from '@/assets/deluxe/stock-4.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock6 from '@/assets/deluxe/stock-6.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';
import type { BusinessPhoto, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import { useIsMobile } from '@/hooks/use-mobile';
import SiteFadeIn from './SiteFadeIn';

const defaultGalleryItems = [
  { image: stock1, caption: 'Lamborghini Huracán' },
  { image: stock2, caption: 'Toyota GR Supra' },
  { image: stock3, caption: 'Bentley Interior' },
  { image: stock4, caption: 'Lamborghini Huracán EVO' },
  { image: stock5, caption: 'Ferrari F8 Tributo' },
  { image: stock6, caption: 'Huracán Taillight' },
  { image: stock7, caption: 'Huracán Performante' },
  { image: stock1, caption: 'Detail Close-Up' },
];

interface Props {
  photos?: BusinessPhoto[];
  websiteCopy?: WebsiteCopy | null;
}

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const GalleryCard = ({
  item,
}: {
  item: { image: string; caption: string };
}) => (
  <div
    className="group relative aspect-[4/3] overflow-hidden rounded-xl"
    style={{
      boxShadow: '0 4px 24px -8px hsla(0,0%,0%,0.5)',
    }}
  >
    <img
      src={typeof item.image === 'string' ? item.image : String(item.image)}
      alt={item.caption || 'Gallery photo'}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {item.caption && (
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <span className="text-white text-sm font-medium drop-shadow-lg">{item.caption}</span>
      </div>
    )}
  </div>
);

const DeluxeGallery = ({ photos, websiteCopy }: Props) => {
  const hasCms = photos && photos.length > 0;
  const galleryItems = hasCms
    ? photos.map((p) => ({ image: p.url, caption: p.caption || '' }))
    : defaultGalleryItems;

  const isMobile = useIsMobile();
  const splitRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setProgress(1); return; }

    const el = splitRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2;
        const raw = 1 - (center - vh * 0.35) / (vh * 0.45);
        setProgress(Math.max(0, Math.min(1, raw)));
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const items = galleryItems.slice(0, 8);
  const topRow = items.slice(0, 4);
  const bottomRow = items.slice(4, 8);

  const eased = ease(progress);
  const gap = isMobile ? eased * 60 : eased * 80;
  const textOpacity = Math.max(0, (eased - 0.2) / 0.8);
  const textScale = 0.92 + 0.08 * Math.min(1, Math.max(0, (eased - 0.1) / 0.6));

  return (
    <section id="gallery" className="site-section overflow-hidden">
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section tag */}
        <SiteFadeIn>
          <div className="mb-10">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium">{getSectionTitle(websiteCopy, 'section_gallery')}</p>
          </div>
        </SiteFadeIn>

        <div ref={splitRef} className="relative">
          {/* Top half */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {topRow.map((item, index) => (
              <SiteFadeIn key={index} delay={index * 60} distance={24}>
                <GalleryCard item={item} />
              </SiteFadeIn>
            ))}
          </div>

          {/* Split reveal zone — "Results speak for themselves" inside */}
          <div
            className="flex items-center justify-center pointer-events-none select-none py-8 sm:py-12"
            style={{
              opacity: textOpacity,
              transform: `scale(${textScale})`,
              willChange: 'opacity, transform',
            }}
          >
            <div className="text-center px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {getSectionTitle(websiteCopy, 'section_gallery_sub')}
              </h2>
              <p className="text-white/35 text-sm mt-2 hidden sm:block">Swipe-worthy results, every single time.</p>
            </div>
          </div>

          {/* Bottom half */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {bottomRow.map((item, index) => (
              <SiteFadeIn key={index + 4} delay={(index + 4) * 60} distance={24}>
                <GalleryCard item={item} />
              </SiteFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeGallery;
