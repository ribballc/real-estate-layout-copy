import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import service1 from '@/assets/deluxe/service-1.jpg';
import service2 from '@/assets/deluxe/service-2.jpg';
import service3 from '@/assets/deluxe/service-3.jpg';
import service4 from '@/assets/deluxe/service-4.jpg';

const services = [
  { image: service1, title: 'Mobile Detailing', description: 'We come to you for convenient on-site service' },
  { image: service2, title: 'Ceramic Coating', description: 'Long-lasting protection for your paint' },
  { image: service3, title: 'Headlight Restoration', description: 'Restore clarity and improve visibility' },
  { image: service4, title: 'Buffing Services', description: 'Remove scratches and restore shine' },
];

const DeluxeServicesOverview = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Welcome to Deluxe Detailing</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="gold-gradient-text">Services</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Professional auto detailing services tailored to your vehicle type</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-white/80 text-sm mb-4">{service.description}</p>
                <a href="#packages">
                  <Button variant="gold" size="sm" className="group/btn">
                    View Packages
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeluxeServicesOverview;
