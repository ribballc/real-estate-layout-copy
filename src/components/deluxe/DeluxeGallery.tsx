import gallery1 from '@/assets/deluxe/gallery-1.png';
import gallery2 from '@/assets/deluxe/gallery-2.png';
import gallery3 from '@/assets/deluxe/gallery-3.png';
import gallery4 from '@/assets/deluxe/gallery-4.png';
import gallery5 from '@/assets/deluxe/gallery-5.png';
import gallery6 from '@/assets/deluxe/gallery-6.png';
import gallery7 from '@/assets/deluxe/gallery-7.png';
import gallery8 from '@/assets/deluxe/gallery-8.png';
import type { BusinessPhoto } from '@/hooks/useBusinessData';

const defaultGalleryItems = [
  { image: gallery1, caption: 'Interior Detail' },
  { image: gallery2, caption: 'Cadillac CT5' },
  { image: gallery3, caption: 'SRT Interior' },
  { image: gallery4, caption: 'Dodge Challenger' },
  { image: gallery5, caption: 'Mercedes AMG' },
  { image: gallery6, caption: 'Mercedes GLC' },
  { image: gallery7, caption: 'Cadillac Lyriq' },
  { image: gallery8, caption: 'Lyriq Interior' },
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
        <div className="max-w-2xl mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Our Work</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Results speak<br />for themselves
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {galleryItems.map((item, index) => (
            <div key={index} className="break-inside-avoid group">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={typeof item.image === 'string' ? item.image : String(item.image)}
                  alt={item.caption || 'Gallery photo'}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white text-sm font-medium">{item.caption}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeGallery;
