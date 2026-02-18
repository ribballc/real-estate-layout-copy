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
        <div className="rounded-2xl p-6 md:p-8 space-y-6" style={{ background: "white", border: "1px solid hsl(210,40%,90%)" }}>
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
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6"
          style={{ background: "white", border: "1px solid hsl(210,40%,90%)" }}
        >
          {/* Business name */}
          <div>
            <h2 className="font-heading text-lg font-bold" style={{ color: "hsl(222,47%,11%)" }}>{name}</h2>
          </div>

          {/* Animated glowing ticker */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(217,91%,50%)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              Our Services
            </div>
            <div
              className="relative overflow-hidden rounded-xl py-3 px-4"
              style={{
                background: "hsl(217,91%,97%)",
                border: "1px solid hsl(217,91%,88%)",
              }}
            >
              <div className="relative overflow-hidden">
                <div className="flex animate-[ticker_12s_linear_infinite] whitespace-nowrap gap-6">
                  {[...tickerServices, ...tickerServices].map((s, i) => (
                    <span key={i} className="text-sm font-medium flex items-center gap-2" style={{ color: "hsl(222,47%,11%)" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(217,91%,50%)" }} />
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
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(222,47%,11%)" }}>
                <Mail className="w-4 h-4" style={{ color: "hsl(217,91%,50%)" }} />
                Email Us
              </div>
              <a href={`mailto:${email}`} className="text-sm hover:underline block pl-6" style={{ color: "hsl(217,91%,50%)" }}>
                {email}
              </a>
            </div>
          )}

          {/* Phone */}
          {phone && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(222,47%,11%)" }}>
                <Phone className="w-4 h-4" style={{ color: "hsl(217,91%,50%)" }} />
                Phone Us
              </div>
              <a href={`tel:${phone}`} className="text-sm hover:underline block pl-6" style={{ color: "hsl(217,91%,50%)" }}>
                {phone}
              </a>
            </div>
          )}

          {/* Hours */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(222,47%,11%)" }}>
              <Clock className="w-4 h-4" style={{ color: "hsl(217,91%,50%)" }} />
              Open Hours
            </div>
            <div className="pl-6 space-y-1">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span style={{ color: "hsl(215,16%,47%)" }}>{h.day}:</span>
                  <span
                    className="font-medium"
                    style={{ color: h.time === "Closed" ? "hsl(0,84%,60%)" : "hsl(222,47%,11%)" }}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          {address && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(222,47%,11%)" }}>
                <MapPin className="w-4 h-4" style={{ color: "hsl(217,91%,50%)" }} />
                Location
              </div>
              <p className="text-sm pl-6 leading-relaxed" style={{ color: "hsl(215,16%,47%)" }}>{address}</p>
              {mapQuery && (
                <div className="pl-6 pt-1 space-y-2">
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(210,40%,90%)" }}>
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
                    className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                    style={{ color: "hsl(217,91%,50%)" }}
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
