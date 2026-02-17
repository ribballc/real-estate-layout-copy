import { Mail, Clock, Instagram, Facebook, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { BusinessProfile, BusinessService, BusinessAddOn, BusinessHour } from '@/hooks/useBusinessData';

const defaultServices = [
  { id: 'interior-sedan', label: 'Full Thorough Deluxe Interior - Sedan ($95)' },
  { id: 'rapid-sedan', label: 'Rapid Deluxe Interior - Sedan ($65)' },
  { id: 'express-sedan', label: 'Deluxe Express Wash - Sedan ($60)' },
  { id: 'interior-truck', label: 'Full Thorough Deluxe Interior - Truck/SUV ($120)' },
  { id: 'rapid-truck', label: 'Rapid Deluxe Interior - Truck/SUV ($105)' },
  { id: 'express-truck', label: 'Deluxe Express Wash - Truck/SUV ($70)' },
];

const defaultAddons = [
  { id: 'ceramic', label: 'Ceramic Coating ($875)' },
  { id: 'headlight', label: 'Headlight Restoration ($85)' },
  { id: 'buffing', label: 'Buffing Services ($140)' },
];

interface Props {
  profile?: BusinessProfile | null;
  services?: BusinessService[];
  addOns?: BusinessAddOn[];
  hours?: BusinessHour[];
}

const DeluxeContactForm = ({ profile, services: cmsServices, addOns: cmsAddOns, hours }: Props) => {
  const { toast } = useToast();
  const [showCalendly, setShowCalendly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', vehicle: '', address: '',
    selectedServices: [] as string[],
    selectedAddons: [] as string[],
    message: '',
  });

  const displayServices = cmsServices && cmsServices.length > 0
    ? cmsServices.map((s) => ({ id: s.id, label: `${s.title} ($${s.price})` }))
    : defaultServices;

  const displayAddons = cmsAddOns && cmsAddOns.length > 0
    ? cmsAddOns.map((a) => ({ id: a.id, label: `${a.title} ($${a.price})` }))
    : defaultAddons;

  const contactPhone = profile?.phone || '+1 (214) 882-2029';
  const contactEmail = profile?.email || 'Deluxedetailing012@gmail.com';
  const instagramUrl = profile?.instagram || 'https://instagram.com/Deluxedetailing1k';
  const facebookUrl = profile?.facebook || 'https://facebook.com/DeluxeeDetailing';
  const tiktokUrl = profile?.tiktok || 'https://www.tiktok.com/@deluxedetailing1k?lang=en';

  // Format hours for display
  const hoursDisplay = hours && hours.length > 0
    ? hours
    : [{ day: 'Mon–Sat', time: '8:00 AM – 8:00 PM' }, { day: 'Sunday', time: 'Closed' }];

  useEffect(() => {
    if (showCalendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    }
  }, [showCalendly]);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleAddonToggle = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedServiceLabels = formData.selectedServices.map(id => displayServices.find(s => s.id === id)?.label || id);
      const selectedAddonLabels = formData.selectedAddons.map(id => displayAddons.find(a => a.id === id)?.label || id);

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name, email: formData.email, phone: formData.phone,
          vehicleType: formData.vehicle, address: formData.address,
          services: selectedServiceLabels, addons: selectedAddonLabels, message: formData.message,
        },
      });
      if (error) throw error;
      toast({ title: "Great!", description: "Your booking request has been sent. Select a time slot to complete your booking." });
      setShowCalendly(true);
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({ title: "Submission received", description: "Select a time slot to complete your booking." });
      setShowCalendly(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="gold-gradient-text">Book</span> Your Detail</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Ready to transform your vehicle? Contact us to schedule your appointment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h3>
              <div className="space-y-6">
                <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-primary-foreground" /></div>
                  <div><p className="font-semibold text-foreground">Call Us</p><p className="text-sm">{contactPhone}</p></div>
                </a>
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-primary-foreground" /></div>
                  <div><p className="font-semibold text-foreground">Email Us</p><p className="text-sm">{contactEmail}</p></div>
                </a>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-primary-foreground" /></div>
                  <div>
                    <p className="font-semibold text-foreground">Business Hours</p>
                    {hoursDisplay.map((h, i) => (
                      <p key={i} className="text-sm">{h.day}: {h.time}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Follow Us</h3>
              <div className="flex gap-4">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-secondary hover:gold-gradient flex items-center justify-center transition-all group">
                    <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-secondary hover:gold-gradient flex items-center justify-center transition-all group">
                    <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
                  </a>
                )}
                {tiktokUrl && (
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-secondary hover:gold-gradient flex items-center justify-center transition-all group">
                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border">
            {showCalendly ? (
              <>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Schedule Your Appointment</h3>
                <div className="calendly-inline-widget" data-url="https://calendly.com/deluxedetailing012/30min?back=1&month=2025-12" style={{ minWidth: '320px', height: '630px' }} />
                <Button variant="outline" className="w-full mt-4" onClick={() => setShowCalendly(false)}>Back to Form</Button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Request a Booking</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <input type="text" placeholder="Vehicle (Year, Make, Model)" className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} />
                  </div>
                  <input type="text" placeholder="Address" className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Select Your Service</p>
                    <div className="grid grid-cols-1 gap-2">
                      {displayServices.map((service) => (
                        <label key={service.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.selectedServices.includes(service.id) ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/50'}`}>
                          <input type="checkbox" checked={formData.selectedServices.includes(service.id)} onChange={() => handleServiceToggle(service.id)} className="w-4 h-4 accent-primary" />
                          <span className="text-sm text-foreground">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Add-ons</p>
                    <div className="grid grid-cols-1 gap-2">
                      {displayAddons.map((addon) => (
                        <label key={addon.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.selectedAddons.includes(addon.id) ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/50'}`}>
                          <input type="checkbox" checked={formData.selectedAddons.includes(addon.id)} onChange={() => handleAddonToggle(addon.id)} className="w-4 h-4 accent-primary" />
                          <span className="text-sm text-foreground">{addon.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <textarea placeholder="Additional Details or Questions" rows={4} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground resize-none" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  <Button type="submit" variant="gold" size="xl" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeContactForm;
