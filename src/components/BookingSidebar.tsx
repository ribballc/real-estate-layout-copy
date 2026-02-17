import { Mail, Phone, Clock, MapPin, Sparkles } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { Skeleton } from "@/components/ui/skeleton";
import type { BusinessData } from "@/hooks/useBusinessData";

interface BookingSidebarProps {
  businessData: BusinessData;
}

const BookingSidebar = ({ businessData }: BookingSidebarProps) => {
  const { profile, services, hours, loading } = businessData;

  const name = profile?.business_name || "Business";
  const email = profile?.email || "";
  const phone = profile?.phone || "";
  const address = profile?.address || "";
  const mapQuery = profile?.map_query || "";
  const tickerServices = services.length > 0 ? services.map((s) => s.title) : ["No services yet"];

  if (loading) {
    return (
      <aside className="w-full lg:w-[300px] flex-shrink-0 order-2">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0 order-2">
      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
          {/* Business name */}
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">{name}</h2>
          </div>

          {/* Animated glowing ticker */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              Our Services
            </div>
            <div
              className="relative overflow-hidden rounded-xl border border-accent/30 py-3 px-4"
              style={{
                background: "linear-gradient(135deg, hsla(217, 91%, 60%, 0.08) 0%, hsla(217, 91%, 60%, 0.02) 100%)",
                boxShadow: "0 0 20px hsla(217, 91%, 60%, 0.12), inset 0 0 20px hsla(217, 91%, 60%, 0.04)",
              }}
            >
              <div
                className="absolute inset-0 rounded-xl animate-pulse opacity-40"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, hsla(217, 91%, 60%, 0.1) 50%, transparent 100%)",
                }}
              />
              <div className="relative overflow-hidden">
                <div className="flex animate-[ticker_12s_linear_infinite] whitespace-nowrap gap-6">
                  {[...tickerServices, ...tickerServices].map((s, i) => (
                    <span key={i} className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          {email && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Mail className="w-4 h-4 text-accent" />
                Email Us
              </div>
              <a href={`mailto:${email}`} className="text-sm text-accent hover:underline block pl-6">
                {email}
              </a>
            </div>
          )}

          {/* Phone */}
          {phone && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Phone className="w-4 h-4 text-accent" />
                Phone Us
              </div>
              <a href={`tel:${phone}`} className="text-sm text-accent hover:underline block pl-6">
                {phone}
              </a>
            </div>
          )}

          {/* Hours */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="w-4 h-4 text-accent" />
              Open Hours
            </div>
            <div className="pl-6 space-y-1">
              {hours.map((h) => (
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
          {address && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                Location
              </div>
              <p className="text-sm text-muted-foreground pl-6 leading-relaxed">{address}</p>
              {mapQuery && (
                <div className="pl-6 pt-1 space-y-2">
                  <div className="rounded-xl overflow-hidden border border-border">
                    <iframe
                      title="Business Location"
                      width="100%"
                      height="180"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Get Directions
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </FadeIn>
    </aside>
  );
};

export default BookingSidebar;
