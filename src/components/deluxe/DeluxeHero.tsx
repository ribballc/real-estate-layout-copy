import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroBg from '@/assets/deluxe/hero-bg.jpg';
import type { BusinessProfile } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
}

const DeluxeHero = ({ profile, slug }: Props) => {
  const businessName = profile?.business_name || 'Deluxe';
  const tagline = profile?.tagline || 'Your Go-To For Professional Car Detailing, Ceramic Coating, and Interior Restoration Services';
  const phone = profile?.phone || '+12148822029';
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Premium Auto Detailing
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground">{businessName}</span>
            <br />
            <span className="gold-gradient-text">#1 Auto</span>
            <br />
            <span className="text-foreground">Detailers</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link">
              <Button variant="hero" size="xl">Book Now</Button>
            </a>
            <a href={phoneHref}>
              <Button variant="goldOutline" size="xl">Call Now</Button>
            </a>
          </div>
        </div>
      </div>

      <a href="#services" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce">
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
};

export default DeluxeHero;
