import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/deluxe/logo.png';
import type { BusinessProfile } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
}

const DeluxeNavbar = ({ profile, slug }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#packages', label: 'Packages' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  const phoneNumber = profile?.phone || '+12148822029';
  const phoneHref = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
  const logoSrc = profile?.logo_url || logo;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg shadow-primary/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a href="#home" className="flex items-center">
            <img src={logoSrc} alt={profile?.business_name || 'Deluxe Detailing'} className="h-16 w-auto" />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-foreground hover:text-primary transition-colors duration-300 font-medium tracking-wide">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {slug && (
              <a href={`/site/${slug}/book`} className="book-now-link">
                <Button variant="gold" size="lg">
                  Book Now
                </Button>
              </a>
            )}
            <a href={phoneHref}>
              <Button variant="goldOutline" size="lg">
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </a>
          </div>

          <button className="lg:hidden text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="px-4 py-3 text-foreground hover:text-primary hover:bg-secondary transition-colors duration-300 font-medium" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-4 space-y-2">
                {slug && (
                  <a href={`/site/${slug}/book`} className="book-now-link block" onClick={() => setIsOpen(false)}>
                    <Button variant="gold" className="w-full">
                      Book Now
                    </Button>
                  </a>
                )}
                <a href={phoneHref}>
                  <Button variant="goldOutline" className="w-full">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DeluxeNavbar;
