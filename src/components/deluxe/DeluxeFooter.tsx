import { Instagram, Facebook, Mail, Clock, Phone } from 'lucide-react';
import logo from '@/assets/deluxe/logo.png';

const DeluxeFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <img src={logo} alt="Deluxe Detailing" className="h-20 w-auto mb-6" />
            <p className="text-muted-foreground mb-6 max-w-md">
              Professional auto detailing services that transform your vehicle. Experience the Deluxe difference with our premium interior and exterior packages.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/Deluxedetailing1k" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary hover:gold-gradient flex items-center justify-center transition-all group">
                <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="https://www.facebook.com/share/1AFcvYQsZr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary hover:gold-gradient flex items-center justify-center transition-all group">
                <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="https://www.tiktok.com/@deluxedetailing1k?lang=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-secondary hover:gold-gradient flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Packages', 'Gallery', 'Testimonials', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-foreground">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+12148822029" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary" /><span className="text-sm">+1 (214) 882-2029</span>
                </a>
              </li>
              <li>
                <a href="mailto:Deluxedetailing012@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary" /><span className="text-sm">Deluxedetailing012@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm"><p>Mon–Sat: 8:00 AM – 8:00 PM</p><p>Sunday: Closed</p></div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© {currentYear} Deluxe Detailing. All rights reserved.</p>
          <p className="text-muted-foreground text-sm">Premium Auto Detailing Services</p>
        </div>
      </div>
    </footer>
  );
};

export default DeluxeFooter;
