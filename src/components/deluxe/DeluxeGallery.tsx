import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import gallery1 from '@/assets/deluxe/gallery-1.png';
import gallery2 from '@/assets/deluxe/gallery-2.png';
import gallery3 from '@/assets/deluxe/gallery-3.png';
import gallery4 from '@/assets/deluxe/gallery-4.png';
import gallery5 from '@/assets/deluxe/gallery-5.png';
import gallery6 from '@/assets/deluxe/gallery-6.png';
import gallery7 from '@/assets/deluxe/gallery-7.png';
import gallery8 from '@/assets/deluxe/gallery-8.png';

const galleryItems = [
  { image: gallery1, title: 'Interior Detail', category: 'Interior' },
  { image: gallery2, title: 'Cadillac CT5', category: 'Exterior' },
  { image: gallery3, title: 'SRT Interior', category: 'Interior' },
  { image: gallery4, title: 'Dodge Challenger', category: 'Exterior' },
  { image: gallery5, title: 'Mercedes AMG', category: 'Exterior' },
  { image: gallery6, title: 'Mercedes GLC', category: 'Exterior' },
  { image: gallery7, title: 'Cadillac Lyriq', category: 'Exterior' },
  { image: gallery8, title: 'Lyriq Interior', category: 'Interior' },
];

const DeluxeGallery = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(autoplay, 3000);
    return () => clearInterval(interval);
  }, [emblaApi, autoplay]);

  return (
    <section id="gallery" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Our Work</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="gold-gradient-text">Gallery</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">See the transformation our detailing services deliver</p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {galleryItems.map((item, index) => (
              <div key={index} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 first:pl-0">
                <div className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-foreground text-xl font-bold mt-1">{item.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full gold-gradient flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeGallery;
