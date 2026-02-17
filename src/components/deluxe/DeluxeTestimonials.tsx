import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Michael Johnson', rating: 5, text: 'Absolutely incredible work! My car looks better than when I bought it. The attention to detail is unmatched.', vehicle: '2022 BMW 3 Series' },
  { name: 'Sarah Williams', rating: 5, text: 'I was blown away by the results. The interior cleaning was thorough and my SUV smells brand new!', vehicle: '2021 Toyota Highlander' },
  { name: 'David Martinez', rating: 5, text: 'Best detailing service I have ever used. Professional, punctual, and the results speak for themselves.', vehicle: '2023 Ford F-150' },
  { name: 'Jennifer Brown', rating: 5, text: 'They removed stains I thought were permanent. Highly recommend their full interior package!', vehicle: '2020 Honda Accord' },
];

const DeluxeTestimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Customer Reviews</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our <span className="gold-gradient-text">Clients</span> Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Do not just take our word for it - hear from our satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 relative card-shine">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.vehicle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeTestimonials;
