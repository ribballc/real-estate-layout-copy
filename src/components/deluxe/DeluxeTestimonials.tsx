import { Star } from 'lucide-react';
import type { BusinessTestimonial } from '@/hooks/useBusinessData';

const defaultTestimonials = [
  { name: 'Michael J.', rating: 5, text: 'Absolutely incredible work. My car looks better than when I bought it. The attention to detail is unmatched.' },
  { name: 'Sarah W.', rating: 5, text: 'I was blown away by the results. The interior cleaning was thorough and my SUV smells brand new.' },
  { name: 'David M.', rating: 5, text: 'Best detailing service I have ever used. Professional, punctual, and the results speak for themselves.' },
  { name: 'Jennifer B.', rating: 5, text: 'They removed stains I thought were permanent. Highly recommend their full interior package.' },
];

interface Props {
  testimonials?: BusinessTestimonial[];
}

const DeluxeTestimonials = ({ testimonials }: Props) => {
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Reviews</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Trusted by car owners everywhere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                {testimonial.photo_url ? (
                  <img src={testimonial.photo_url} alt={testimonial.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-white/40 text-xs font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <span className="text-white/50 text-sm font-medium">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeTestimonials;
