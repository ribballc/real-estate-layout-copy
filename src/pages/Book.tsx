import { useState } from "react";
import { ChevronRight, Mail, Phone, Clock, MapPin, ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";

/* ═══════════════════════════════════════════════════════
   CMS-READY CONFIG — replace with DB/API data later
   ═══════════════════════════════════════════════════════ */

const businessInfo = {
  name: "Velarrio Detailing",
  tagline: "We've partnered with Velarrio for secure and easy service bookings.",
  email: "hello@velarrio.com",
  phone: "+1 (800) 555-0199",
  address: "123 Main Street, Suite A, Dallas TX 75201",
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

const steps = [
  "Select a service",
  "Your Car",
  "Options",
  "Quote",
  "Booking",
  "Checkout",
];

interface Service {
  id: string;
  title: string;
  description: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    id: "interior",
    title: "Interior Detail",
    description: "Deep interior clean, vacuum, leather care, and interior protection — starting at $180.",
  },
  {
    id: "exterior",
    title: "Exterior Detail",
    description: "Full wash, clay bar, polish, and sealant for a showroom finish — starting at $250.",
    popular: true,
  },
  {
    id: "full",
    title: "Full Detail",
    description: "Complete interior + exterior package for the ultimate transformation — starting at $400.",
  },
  {
    id: "ceramic",
    title: "Ceramic Coating",
    description: "Professional-grade ceramic coating for long-lasting paint protection — starting at $600.",
  },
];

/* ═══════════════════════════════════════════════════════ */

const Book = () => {
  const [activeStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "hsl(210 40% 98%)" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          background: "hsla(0, 0%, 100%, 0.85)",
          backdropFilter: "blur(16px) saturate(180%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center">
          <a href="/" className="font-heading text-xl font-bold text-foreground tracking-tight">
            velarrio
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── LEFT SIDEBAR ── */}
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
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    Location
                  </div>
                  <p className="text-sm text-muted-foreground pl-6 leading-relaxed">{businessInfo.address}</p>
                </div>
              </div>
            </FadeIn>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">
            {/* Step breadcrumb */}
            <FadeIn>
              <nav className="flex items-center gap-1 flex-wrap mb-8 md:mb-10">
                {steps.map((step, i) => (
                  <span key={step} className="flex items-center gap-1">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        i === activeStep
                          ? "text-accent"
                          : i < activeStep
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {step}
                    </span>
                    {i < steps.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0" />
                    )}
                  </span>
                ))}
              </nav>
            </FadeIn>

            {/* Section heading */}
            <FadeIn delay={50}>
              <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-8 md:mb-10">
                Select a service
              </h1>
            </FadeIn>

            {/* Service cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => (
                <FadeIn key={service.id} delay={100 + i * 80}>
                  <button
                    onClick={() => setSelectedService(service.id)}
                    className={`group relative w-full text-left rounded-2xl p-6 md:p-7 min-h-[200px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                      selectedService === service.id
                        ? "ring-2 ring-accent shadow-[0_12px_32px_hsla(217,91%,60%,0.2)]"
                        : "hover:shadow-[0_12px_32px_hsla(217,91%,60%,0.12)]"
                    }`}
                    style={{
                      background: "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)",
                    }}
                  >
                    {service.popular && (
                      <span className="absolute -top-3 right-4 text-[11px] font-semibold px-3 py-1 rounded-md uppercase tracking-[0.06em] bg-accent text-accent-foreground">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-primary-foreground mb-2">{service.title}</h3>
                      <p className="text-sm text-primary-foreground/60 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="mt-5">
                      <span
                        className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-5 py-2.5 min-h-[44px] transition-all duration-300 group-hover:gap-3"
                        style={{
                          background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
                          color: "hsl(0 0% 100%)",
                          boxShadow: "0 4px 12px hsla(217, 91%, 60%, 0.3)",
                        }}
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Book;
