import stock1 from '@/assets/deluxe/stock-1.jpg';
import stock2 from '@/assets/deluxe/stock-2.jpg';
import stock3 from '@/assets/deluxe/stock-3.jpg';
import stock4 from '@/assets/deluxe/stock-4.jpg';
import stock5 from '@/assets/deluxe/stock-5.jpg';
import stock6 from '@/assets/deluxe/stock-6.jpg';
import stock7 from '@/assets/deluxe/stock-7.jpg';
import type { BusinessPhoto } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

const defaultGalleryItems = [
  { image: stock1, caption: 'Lamborghini Huracán' },
  { image: stock2, caption: 'Toyota GR Supra' },
  { image: stock3, caption: 'Bentley Interior' },
  { image: stock4, caption: 'Lamborghini Huracán EVO' },
  { image: stock5, caption: 'Ferrari F8 Tributo' },
  { image: stock6, caption: 'Huracán Taillight' },
  { image: stock7, caption: 'Huracán Performante' },
];

interface Props {
  photos?: BusinessPhoto[];
}

const DeluxeGallery = ({ photos }: Props) => {
  const hasCms = photos && photos.length > 0;

  const galleryItems = hasCms
    ? photos.map((p) => ({ image: p.url, caption: p.caption || '' }))
    : defaultGalleryItems;

  return (
    <section id="gallery" className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <SiteFadeIn>
          <div className="max-w-2xl mb-16">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Our Work</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Results speak<br />for themselves
            </h2>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryItems.map((item, index) => {
            // Alternating aspect ratios for collage feel, but all grid-aligned
            const tall = index % 3 === 0;
            return (
              <SiteFadeIn key={index} delay={index * 60} distance={24}>
                <div className={`group ${tall ? 'row-span-2' : ''}`}>
                  <div className={`relative overflow-hidden rounded-xl ${tall ? 'aspect-[3/4]' : 'aspect-square'}`}>
                    <img
                      src={typeof item.image === 'string' ? item.image : String(item.image)}
                      alt={item.caption || 'Gallery photo'}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                        <span className="text-white text-sm font-medium drop-shadow-lg">{item.caption}</span>
                      </div>
                    )}
                  </div>
                </div>
              </SiteFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeluxeGallery;
