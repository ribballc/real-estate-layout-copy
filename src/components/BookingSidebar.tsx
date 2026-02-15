import { Mail, Phone, Clock, MapPin } from "lucide-react";
import FadeIn from "@/components/FadeIn";

/* ═══════════════════════════════════════════════════════
   CMS-READY CONFIG — replace with DB/API data later
   ═══════════════════════════════════════════════════════ */

export const businessInfo = {
  name: "Velarrio Detailing",
  tagline: "We've partnered with Velarrio for secure and easy service bookings.",
  email: "hello@velarrio.com",
  phone: "+1 (800) 555-0199",
  address: "123 Main Street, Suite A, Dallas TX 75201",
  mapQuery: "123+Main+Street+Suite+A+Dallas+TX+75201",
  hours: [
    { day: "Monday", time: "8:00 AM – 5:00 PM" },
    { day: "Tuesday", time: "8:00 AM – 5:00 PM" },
    { day: "Wednesday", time: "8:00 AM – 5:00 PM" },
    { day: "Thursday", time: "8:00 AM – 5:00 PM" },
    { day: "Friday", time: "8:00 AM – 5:00 PM" },
    { day: "Saturday", time: "9:00 AM – 3:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
};

interface BookingSidebarProps {
  showMap?: boolean;
}

const BookingSidebar = ({ showMap = false }: BookingSidebarProps) => (
  <aside className="w-full lg:w-[300px] flex-shrink-0">
    <FadeIn>
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
        {/* Business name */}
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">{businessInfo.name}</h2>
        </div>

        {/* Tagline card */}
        <div className="rounded-xl p-4 border border-accent/20" style={{ background: "hsla(217, 91%, 60%, 0.06)" }}>
          <p className="text-sm text-foreground leading-relaxed">
            👋 {businessInfo.tagline}
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mail className="w-4 h-4 text-accent" />
            Email Us
          </div>
          <a href={`mailto:${businessInfo.email}`} className="text-sm text-accent hover:underline block pl-6">
            {businessInfo.email}
          </a>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Phone className="w-4 h-4 text-accent" />
            Phone Us
          </div>
          <a href={`tel:${businessInfo.phone}`} className="text-sm text-accent hover:underline block pl-6">
            {businessInfo.phone}
          </a>
        </div>

        {/* Hours */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="w-4 h-4 text-accent" />
            Open Hours
          </div>
          <div className="pl-6 space-y-1">
            {businessInfo.hours.map((h) => (
              <div key={h.day} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{h.day}:</span>
                <span className={`font-medium ${h.time === "Closed" ? "text-destructive" : "text-foreground"}`}>
                  {h.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            Location
          </div>
          <p className="text-sm text-muted-foreground pl-6 leading-relaxed">{businessInfo.address}</p>
          {showMap && (
            <div className="pl-6 pt-1">
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  title="Business Location"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${businessInfo.mapQuery}&output=embed`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  </aside>
);

export default BookingSidebar;
