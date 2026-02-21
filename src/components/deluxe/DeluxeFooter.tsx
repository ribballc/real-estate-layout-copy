import { Instagram, Facebook, Mail, Phone, ArrowUpRight } from 'lucide-react';
import type { BusinessProfile, BusinessHour } from '@/hooks/useBusinessData';
import SiteFadeIn from './SiteFadeIn';

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

  return (
    <footer className="border-t border-white/[0.06]">
      <SiteFadeIn distance={16}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{businessName.charAt(0)}</span>
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">{businessName}</span>
            </div>

            <div className="flex items-center gap-3">
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <Phone className="w-3.5 h-3.5 text-white/50" />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <Mail className="w-3.5 h-3.5 text-white/50" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <Instagram className="w-3.5 h-3.5 text-white/50" />
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <Facebook className="w-3.5 h-3.5 text-white/50" />
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <svg className="w-3.5 h-3.5 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-[12px]">© {currentYear} {businessName}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['Services', 'Work', 'Contact'].map((label) => (
                <a key={label} href={`#${label.toLowerCase()}`} className="text-white/30 text-[12px] hover:text-white/60 transition-colors duration-300 flex items-center gap-0.5">
                  {label}
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </SiteFadeIn>
    </footer>
  );
};

export default DeluxeFooter;
