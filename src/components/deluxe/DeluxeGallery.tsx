import { useRef, useState, useEffect } from 'react';
import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock3 from '@/assets/deluxe/stock-3.jpg';
import stock4 from '@/assets/deluxe/stock-4.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock6 from '@/assets/deluxe/stock-6.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';
import type { BusinessPhoto } from '@/hooks/useBusinessData';
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
}

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const GalleryCard = ({
  item,
  offsetY,
}: {
  item: { image: string; caption: string };
  offsetY: number;
}) => (
  <div
    className="group relative aspect-[4/3] overflow-hidden rounded-xl"
    style={{ transform: `translateY(${offsetY}px)`, willChange: 'transform' }}
  >
    <img
      src={typeof item.image === 'string' ? item.image : String(item.image)}
      alt={item.caption || 'Gallery photo'}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
    {item.caption && (
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <span className="text-white text-sm font-medium drop-shadow-lg">{item.caption}</span>
      </div>
    )}
  </div>
);

const DeluxeGallery = ({ photos }: Props) => {
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
  const gap = isMobile ? eased * 56 : eased * 72;
  const textOpacity = Math.max(0, (eased - 0.25) / 0.75);
  const textScale = 0.9 + 0.1 * Math.min(1, Math.max(0, (eased - 0.15) / 0.6));

  return (
    <section id="gallery" className="site-section overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop header */}
        <SiteFadeIn>
          <div className="max-w-2xl mb-16 hidden md:block">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Our Work</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Results speak<br />for themselves
            </h2>
          </div>
        </SiteFadeIn>

        {/* Mobile label only */}
        <SiteFadeIn>
          <div className="md:hidden mb-8">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium">Our Work</p>
          </div>
        </SiteFadeIn>

        <div ref={splitRef} className="relative">
          {/* Top half */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {topRow.map((item, index) => (
              <SiteFadeIn key={index} delay={index * 60} distance={24}>
                <GalleryCard item={item} offsetY={-gap} />
              </SiteFadeIn>
            ))}
          </div>

          {/* Split reveal zone */}
          <div
            className="flex items-center justify-center pointer-events-none select-none"
            style={{
              height: `${gap * 2}px`,
              opacity: textOpacity,
              transform: `scale(${textScale})`,
              willChange: 'opacity, transform',
              overflow: 'hidden',
            }}
          >
            {/* Mobile: headline reveal */}
            <div className="md:hidden text-center px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                Results speak<br />for themselves
              </h2>
            </div>
            {/* Desktop: subtle accent line */}
            <div className="hidden md:flex items-center w-full max-w-sm mx-auto gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20" style={{ transform: `scaleX(${eased})`, transformOrigin: 'left' }} />
              <span className="text-white/30 text-xs uppercase tracking-[0.25em] whitespace-nowrap font-medium">Our Work</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20" style={{ transform: `scaleX(${eased})`, transformOrigin: 'right' }} />
            </div>
          </div>

          {/* Bottom half */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {bottomRow.map((item, index) => (
              <SiteFadeIn key={index + 4} delay={(index + 4) * 60} distance={24}>
                <GalleryCard item={item} offsetY={gap} />
              </SiteFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeGallery;
