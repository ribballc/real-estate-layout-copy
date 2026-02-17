import { Button } from '@/components/ui/button';
import type { BusinessProfile } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
}

const DeluxeCTASection = ({ profile, slug }: Props) => {
  const businessName = profile?.business_name || 'Deluxe';
  const phone = profile?.phone || '+12148822029';
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 gold-gradient rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 gold-gradient rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Ready to Transform Your Vehicle?</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Book Your <span className="gold-gradient-text">{businessName}</span> Detail Today</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Experience the difference professional detailing makes. Your car deserves the best – contact us now to schedule your appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link">
              <Button variant="hero" size="xl">Book Now</Button>
            </a>
            <a href={phoneHref}>
              <Button variant="goldOutline" size="xl">Call Now</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeCTASection;
