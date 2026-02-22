import { Instagram, Facebook, Mail, Phone, ArrowUpRight } from 'lucide-react';
import type { BusinessProfile, BusinessHour } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';
import PoweredByDarker from '@/components/PoweredByDarker';

interface Props {
  profile?: BusinessProfile | null;
  hours?: BusinessHour[];
}

const DeluxeFooter = ({ profile }: Props) => {
  const currentYear = new Date().getFullYear();
  const businessName = profile?.business_name || 'Detailing Studio';
  const phone = profile?.phone || '';
  const email = profile?.email || '';
  const instagram = profile?.instagram || '';
  const facebook = profile?.facebook || '';
  const tiktok = profile?.tiktok || '';
  const serviceArea = profile?.service_areas?.[0]?.trim();
  const cityFromAddress = profile?.address?.split(',')[0]?.trim();
  const city = serviceArea || cityFromAddress || '';

  const quickLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#packages' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t border-white/10 bg-surface-1">
      <SiteFadeIn distance={16}>
        <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{businessName.charAt(0)}</span>
                </div>
                <span className="text-white font-semibold text-lg tracking-tight">{businessName}</span>
              </div>
              {city && (
                <p className="text-white/50 text-sm">Serving {city} & surrounding areas.</p>
              )}
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-3">Contact</p>
              <div className="flex flex-col gap-2">
                {phone && (
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-white/70 text-sm hover:text-white transition-colors inline-flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-white/40" />
                    {phone}
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="text-white/70 text-sm hover:text-white transition-colors inline-flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/40" />
                    {email}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors">
                    <Instagram className="w-4 h-4 text-white/50" />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors">
                    <Facebook className="w-4 h-4 text-white/50" />
                  </a>
                )}
                {tiktok && (
                  <a href={tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-3">Quick Links</p>
              <div className="flex flex-col gap-2">
                {quickLinks.map(({ label, href }) => (
                  <a key={label} href={href} className="text-white/70 text-sm hover:text-white transition-colors inline-flex items-center gap-1">
                    {label}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs">© {currentYear} {businessName}. All Rights Reserved.</p>
          </div>

          <PoweredByDarker variant="dark" className="mt-6" />
        </div>
      </SiteFadeIn>
    </footer>
  );
};

export default DeluxeFooter;
