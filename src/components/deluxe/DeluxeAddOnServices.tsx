import { Lightbulb, Shield, Wrench, CircleDot, Dog, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const addons = [
  { icon: Lightbulb, title: 'Headlight Restoration', price: '$85', description: 'Headlights, Taillights & Fog Lights' },
  { icon: Shield, title: 'Ceramic Coating', price: '$875', description: 'Long-lasting protection and shine' },
  { icon: Wrench, title: 'Buffing Services', price: '$140', description: 'Scratches, Paint Correction' },
  { icon: CircleDot, title: 'Dent Removal', price: 'Starting at $100', description: 'Price depends on size' },
  { icon: Dog, title: 'Pet Hair Removal', price: 'Check Upon Arrival', description: 'Lvl 1: $10 • Lvl 2: $20 • Lvl 3: $35 • Lvl 4: $50 • Lvl 5: $80+' },
  { icon: AlertTriangle, title: 'Mold, Blood, Urine & Body Fluids', price: 'Contact for Quote', description: 'Specialized cleaning service' },
];

const DeluxeAddOnServices = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Enhance Your Detail</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="gold-gradient-text">Add-On</span> Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Take your detail to the next level with our premium add-on services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 group card-shine">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:gold-gradient transition-all duration-300">
                  <addon.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-foreground">{addon.title}</h3>
                  <p className="text-xl font-black gold-gradient-text mb-2">{addon.price}</p>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#contact">
            <Button variant="gold" size="xl">Get a Quote</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DeluxeAddOnServices;
