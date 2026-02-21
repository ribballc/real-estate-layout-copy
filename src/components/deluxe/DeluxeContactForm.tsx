import { Mail, Clock, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type { BusinessProfile, BusinessHour } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  services?: any[];
  addOns?: any[];
  hours?: BusinessHour[];
  slug?: string;
}

const DeluxeContactForm = ({ profile, hours, slug }: Props) => {
  const phone = profile?.phone || '';
  const email = profile?.email || '';
  const address = profile?.address || '';
  const instagram = profile?.instagram || '';
  const facebook = profile?.facebook || '';
  const tiktok = profile?.tiktok || '';

  const hoursDisplay = hours && hours.length > 0
    ? hours
    : [{ day: 'Mon–Sat', time: '9:00 AM – 5:00 PM' }, { day: 'Sunday', time: 'Closed' }];

  const contactItems = [
    ...(phone ? [{ icon: Phone, label: 'Phone', value: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` }] : []),
    ...(email ? [{ icon: Mail, label: 'Email', value: email, href: `mailto:${email}` }] : []),
    ...(address ? [{ icon: MapPin, label: 'Location', value: address, href: undefined }] : []),
  ];

  return (
    <section id="contact" className="site-section">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — contact info */}
          <div>
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 font-medium mb-4">Contact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-8">
              Get in touch
            </h2>

            <div className="space-y-5 mb-8">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <p className="text-white/30 text-[12px] uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white/70 text-sm hover:text-white transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-white/70 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <p className="text-white/30 text-[12px] uppercase tracking-wider mb-1">Hours</p>
                  {hoursDisplay.map((h, i) => (
                    <p key={i} className="text-white/50 text-sm">{h.day}: {h.time}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4 text-white/50" />
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4 text-white/50" />
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Right — CTA card */}
          <div className="flex items-center">
            <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book Online</h3>
              <p className="text-white/40 text-sm mb-6 leading-relaxed">
                Skip the phone call. Pick your service, choose a time, and get instant confirmation.
              </p>
              <a href={slug ? `/site/${slug}/book` : "#"} className={slug ? "book-now-link" : undefined}>
                <button className="site-btn-primary w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 group">
                  Schedule Now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeContactForm;
