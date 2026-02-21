import { useState } from 'react';
import { Mail, Clock, Phone, MapPin, Instagram, Facebook, ArrowRight, Send, Check } from 'lucide-react';
import type { BusinessProfile, BusinessHour, WebsiteCopy } from '@/hooks/useBusinessData';
import { getSectionTitle } from '@/lib/siteSectionCopy';
import SiteFadeIn from './SiteFadeIn';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  profile?: BusinessProfile | null;
  services?: any[];
  addOns?: any[];
  hours?: BusinessHour[];
  slug?: string;
  websiteCopy?: WebsiteCopy | null;
}

const DeluxeContactForm = ({ profile, hours, slug, websiteCopy }: Props) => {
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !leadName.trim() || !leadEmail.trim() || !leadMessage.trim()) return;
    setLeadError(null);
    setLeadSubmitting(true);
    const { error } = await supabase.from('contact_leads').insert({
      slug,
      name: leadName.trim().slice(0, 200),
      email: leadEmail.trim().slice(0, 254),
      message: leadMessage.trim().slice(0, 2000),
    });
    setLeadSubmitting(false);
    if (error) {
      setLeadError('Something went wrong. Try again or call us.');
      return;
    }
    setLeadSent(true);
    setLeadName('');
    setLeadEmail('');
    setLeadMessage('');
  };

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
    <section id="contact" className="site-section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        background: 'radial-gradient(ellipse at 20% 80%, var(--site-primary, hsl(217,91%,60%)) 0%, transparent 60%)',
      }} />
      <div className="site-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SiteFadeIn>
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-medium mb-4">Contact</p>
              <h2 className="site-heading-2 font-bold text-white mb-8">
                {getSectionTitle(websiteCopy, 'section_contact_heading')}
              </h2>

              <div className="space-y-5 mb-8">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-white/50" />
                    </div>
                    <div>
                      <p className="text-white/40 text-[12px] uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-white/70 text-sm hover:text-white transition-colors duration-300">{item.value}</a>
                      ) : (
                        <p className="text-white/70 text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[12px] uppercase tracking-wider mb-1">Hours</p>
                    {hoursDisplay.map((h, i) => (
                      <p key={i} className="text-white/60 text-sm">{h.day}: {h.time}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="site-tap-target min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] hover:scale-105 flex items-center justify-center transition-all duration-300">
                    <Instagram className="w-4 h-4 text-white/50" />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="site-tap-target min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] hover:scale-105 flex items-center justify-center transition-all duration-300">
                    <Facebook className="w-4 h-4 text-white/50" />
                  </a>
                )}
                {tiktok && (
                  <a href={tiktok} target="_blank" rel="noopener noreferrer" className="site-tap-target min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] hover:scale-105 flex items-center justify-center transition-all duration-300">
                    <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </SiteFadeIn>

          <SiteFadeIn delay={150}>
            <div className="space-y-6">
              {/* Message us form */}
              <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-500">
                <h3 className="text-lg font-bold text-white mb-1">Message us</h3>
                <p className="text-white/50 text-sm mb-4">We&apos;ll get back to you shortly.</p>
                {leadSent ? (
                  <div className="flex items-center gap-2 text-white/70 text-sm py-4">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Thanks! We&apos;ve received your message.
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                      maxLength={200}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                      maxLength={254}
                      required
                    />
                    <textarea
                      placeholder="Message"
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                      maxLength={2000}
                      required
                    />
                    {leadError && <p className="text-red-400/90 text-xs">{leadError}</p>}
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="site-tap-target w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/15 border border-white/[0.12] transition-colors disabled:opacity-50"
                    >
                      {leadSubmitting ? 'Sending…' : <>Send message <Send className="w-3.5 h-3.5" /></>}
                    </button>
                  </form>
                )}
              </div>
              {/* Book Online card */}
              <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center hover:border-white/[0.12] transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Book Online</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  Skip the phone call. Pick your service, choose a time, and get instant confirmation.
                </p>
                <a href={slug ? `/site/${slug}/book` : "#"} className={slug ? "book-now-link" : undefined}>
                  <button className="site-btn-primary w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 group hover:shadow-[0_4px_20px_-4px_rgba(255,255,255,0.15)] transition-all duration-300">
                    Schedule Now
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </a>
              </div>
            </div>
          </SiteFadeIn>
        </div>
      </div>
    </section>
  );
};

export default DeluxeContactForm;
