import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'border-b border-white/[0.06]' : 'bg-transparent'
    }`}
      style={isScrolled ? {
        background: 'hsla(0,0%,4%,0.8)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="#home" className="flex items-center gap-3 min-h-[44px] items-center">
            {logoSrc ? (
              <img src={logoSrc} alt={businessName} className="h-7 w-auto" />
            ) : (
              <span className="text-white font-semibold text-base tracking-tight truncate max-w-[180px]">{businessName}</span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] text-white/50 hover:text-white transition-colors duration-300 tracking-wide uppercase font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {slug && (
              <a href={`/site/${slug}/book`} className="book-now-link">
                <button
                  className="site-tap-target text-[12px] px-5 py-2 rounded-full font-semibold flex items-center gap-2 group text-white transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, var(--site-primary, hsl(217,91%,60%)) 0%, var(--site-secondary, hsl(230,91%,52%)) 100%)',
                    boxShadow: '0 2px 12px -2px hsla(217,91%,60%,0.3)',
                  }}
                >
                  Book Now
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </a>
            )}
          </div>

          <button
            className="md:hidden site-tap-target text-white/70 p-2 -mr-2 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 top-14 z-40"
            style={{
              background: 'hsla(0,0%,4%,0.97)',
              backdropFilter: 'blur(24px)',
              animation: 'siteFadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="flex flex-col px-4 sm:px-6 pt-6 gap-0.5">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="site-tap-target py-3 min-h-[44px] flex items-center text-white/70 hover:text-white transition-colors text-lg font-medium border-b border-white/[0.04]"
                  style={{ animation: `siteFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {slug && (
                <a
                  href={`/site/${slug}/book`}
                  className="book-now-link mt-5"
                  onClick={() => setIsOpen(false)}
                  style={{ animation: `siteFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${navLinks.length * 40}ms both` }}
                >
                  <button
                    className="site-tap-target w-full text-base px-5 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--site-primary, hsl(217,91%,60%)) 0%, var(--site-secondary, hsl(230,91%,52%)) 100%)',
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
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
