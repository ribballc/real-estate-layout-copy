import { Star, Quote } from 'lucide-react';
import type { BusinessTestimonial, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';

const defaultTestimonials = [
  { name: 'Michael J.', rating: 5, text: 'Absolutely incredible work. My car looks better than when I bought it.' },
  { name: 'Sarah W.', rating: 5, text: 'I was blown away by the results. The interior cleaning was thorough and my SUV smells brand new.' },
  { name: 'David M.', rating: 5, text: 'Best detailing service I have ever used. Professional, punctual, and the results speak for themselves.' },
  { name: 'Jennifer B.', rating: 5, text: 'They removed stains I thought were permanent. Highly recommend their full interior package.' },
];

interface Props {
  testimonials?: BusinessTestimonial[];
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeTestimonials = ({ testimonials, websiteCopy }: Props) => {
  const hasCms = testimonials && testimonials.length > 0;

  const displayTestimonials = hasCms
    ? testimonials.map((t) => ({
        name: t.author,
        rating: t.rating,
        text: t.content,
        photo_url: t.photo_url,
      }))
    : defaultTestimonials.map((t) => ({ ...t, photo_url: null as string | null }));

  return (
    <section id="testimonials" className="site-section">
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SiteFadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--site-primary)] font-semibold mb-3">What Our Clients Say</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {getSectionTitle(websiteCopy, 'section_testimonials')}
            </h2>
          </div>
        </SiteFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {displayTestimonials.map((testimonial, index) => (
            <SiteFadeIn key={index} delay={index * 80}>
              <div className="relative bg-surface-2 border border-white/10 rounded-xl p-6 hover:border-white/15 transition-all duration-500 h-full group overflow-hidden shadow-glass">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-amber-400/5" style={{
                  maskImage: 'radial-gradient(circle 60% at 50% 0%, black 0%, transparent 60%)',
                  WebkitMaskImage: 'radial-gradient(circle 60% at 50% 0%, black 0%, transparent 60%)',
                }} />
                <Quote className="absolute top-5 right-5 w-7 h-7 text-white/5 group-hover:text-white/10 transition-colors duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-3">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    {testimonial.photo_url ? (
                      <img src={testimonial.photo_url} alt={testimonial.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold bg-accent/20 text-accent">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-white/55 text-[13px] font-medium block">{testimonial.name}</span>
                      <span className="text-white/20 text-[11px]">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </SiteFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeTestimonials;
