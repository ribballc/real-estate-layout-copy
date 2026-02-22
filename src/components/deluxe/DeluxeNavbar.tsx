import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
  const phone = profile?.phone?.replace(/[^\d+]/g, '') || '';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'border-b border-white/10 bg-surface-1' : 'bg-transparent'
    }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="#home" className="flex items-center gap-3 min-h-[44px] items-center">
            {logoSrc ? (
              <img src={logoSrc} alt={businessName} className="h-8 w-auto max-h-10" />
            ) : (
              <span className="text-white font-semibold text-lg tracking-tight truncate max-w-[200px]">{businessName}</span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] sm:text-xs text-white/60 hover:text-white transition-colors duration-200 tracking-widest uppercase font-medium"
              >
                {link.label}
              </a>
            ))}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="text-[11px] sm:text-xs text-white/70 hover:text-white transition-colors duration-200 tracking-wide font-medium"
              >
                Call {phone.length === 10 ? phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : profile?.phone || phone}
              </a>
            )}
          </div>

          <div className="hidden md:flex items-center">
            {slug && (
              <a
                href={`/site/${slug}/book`}
                className="book-now-link block h-12 px-6 rounded-xl bg-[var(--site-primary)] text-white text-[14px] font-semibold tracking-[-0.01em] hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center"
              >
                Book Now
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
          <div className="md:hidden fixed inset-0 top-14 sm:top-16 z-40 bg-surface-0">
            <div className="flex flex-col px-4 sm:px-6 pt-6 gap-0.5">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="site-tap-target py-3 min-h-[44px] flex items-center text-white/70 hover:text-white transition-colors text-lg font-medium border-b border-white/10"
                  style={{ animation: `siteFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {slug && (
                <a
                  href={`/site/${slug}/book`}
                  className="book-now-link block mt-5 w-full h-12 px-6 rounded-xl bg-[var(--site-primary)] text-white text-[14px] font-semibold tracking-[-0.01em] hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                  style={{ animation: `siteFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${navLinks.length * 40}ms both` }}
                >
                  Book Now
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
