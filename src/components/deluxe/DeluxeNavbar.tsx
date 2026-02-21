import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import type { BusinessProfile } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
}

const DeluxeNavbar = ({ profile, slug }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#gallery', label: 'Work' },
    { href: '#testimonials', label: 'Reviews' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const businessName = profile?.business_name || 'Detailing Studio';
  const logoSrc = profile?.logo_url;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[hsl(0,0%,4%)]/90 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-3">
            {logoSrc ? (
              <img src={logoSrc} alt={businessName} className="h-8 w-auto" />
            ) : (
              <span className="text-white font-semibold text-lg tracking-tight">{businessName}</span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] text-white/60 hover:text-white transition-colors duration-300 tracking-wide uppercase font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {slug && (
              <a href={`/site/${slug}/book`} className="book-now-link">
                <button className="site-btn-primary text-[13px] px-5 py-2.5 rounded-full font-medium flex items-center gap-2 group">
                  Book Now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </a>
            )}
          </div>

          <button className="md:hidden text-white/80 p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-[hsl(0,0%,4%)]/95 backdrop-blur-xl border-t border-white/[0.06] pb-6">
            <div className="flex flex-col pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2 py-3 text-white/70 hover:text-white transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {slug && (
                <a href={`/site/${slug}/book`} className="book-now-link mt-4" onClick={() => setIsOpen(false)}>
                  <button className="site-btn-primary w-full text-sm px-5 py-3 rounded-full font-medium">
                    Book Now
                  </button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DeluxeNavbar;
