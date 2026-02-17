import { Shield, Clock, Award, Sparkles, ThumbsUp, Car } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Quality Guaranteed', description: 'We stand behind our work with a 100% satisfaction guarantee on every detail.' },
  { icon: Clock, title: 'Convenient Scheduling', description: 'Flexible appointments to fit your busy schedule, including weekends.' },
  { icon: Award, title: 'Expert Technicians', description: 'Trained professionals using premium products and techniques.' },
  { icon: Sparkles, title: 'Premium Products', description: 'Only the finest detailing products for showroom-quality results.' },
  { icon: ThumbsUp, title: 'Trusted Service', description: 'Building lasting relationships through honest, reliable work.' },
  { icon: Car, title: 'All Vehicles Welcome', description: 'From daily drivers to luxury vehicles, we detail them all.' },
];

const DeluxeWhyChooseUs = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Why Choose Us</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The <span className="gold-gradient-text">Deluxe</span> Difference</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Experience the highest standard in auto detailing with our commitment to excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-8 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 card-shine group">
              <div className="w-14 h-14 rounded-lg gold-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeWhyChooseUs;
