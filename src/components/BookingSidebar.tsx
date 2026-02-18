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
      <aside className="w-full lg:w-[280px] flex-shrink-0 order-2">
        <div className="rounded-[14px] p-5 space-y-5" style={{ background: "white", border: "1px solid hsl(210,40%,90%)", boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)" }}>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[280px] flex-shrink-0 order-2">
      <FadeIn>
        <div className="rounded-[14px] p-5 space-y-5" style={{ background: "white", border: "1px solid hsl(210,40%,90%)", boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)" }}>
          {/* Business name */}
          <h2 className="font-bold" style={{ fontSize: 16, color: "hsl(222,47%,11%)" }}>{name}</h2>

          {/* Service ticker */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold uppercase tracking-widest" style={{ fontSize: 10, color: "hsl(217,91%,50%)" }}>
              <Sparkles size={12} /> Services
            </div>
            <div className="relative overflow-hidden rounded-lg py-2.5 px-3" style={{ background: "hsl(217,91%,97%)", border: "1px solid hsl(217,91%,90%)" }}>
              <div className="overflow-hidden">
                <div className="flex animate-[ticker_12s_linear_infinite] whitespace-nowrap gap-5">
                  {[...tickerServices, ...tickerServices].map((s, i) => (
                    <span key={i} className="flex items-center gap-1.5 font-medium" style={{ fontSize: 13, color: "hsl(222,47%,11%)" }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "hsl(217,91%,50%)" }} />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          {email && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-semibold" style={{ fontSize: 13, color: "hsl(222,47%,11%)" }}>
                <Mail size={14} style={{ color: "hsl(217,91%,50%)" }} /> Email
              </div>
              <a href={`mailto:${email}`} className="block pl-[22px] hover:underline" style={{ fontSize: 13, color: "hsl(217,91%,50%)" }}>{email}</a>
            </div>
          )}
          {phone && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-semibold" style={{ fontSize: 13, color: "hsl(222,47%,11%)" }}>
                <Phone size={14} style={{ color: "hsl(217,91%,50%)" }} /> Phone
              </div>
              <a href={`tel:${phone}`} className="block pl-[22px] hover:underline" style={{ fontSize: 13, color: "hsl(217,91%,50%)" }}>{phone}</a>
            </div>
          )}

          {/* Hours */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-semibold" style={{ fontSize: 13, color: "hsl(222,47%,11%)" }}>
              <Clock size={14} style={{ color: "hsl(217,91%,50%)" }} /> Hours
            </div>
            <div className="pl-[22px] space-y-0.5">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: "hsl(215,16%,47%)" }}>{h.day}</span>
                  <span className="font-medium" style={{ color: h.time === "Closed" ? "hsl(0,84%,55%)" : "hsl(222,47%,11%)" }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          {address && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-semibold" style={{ fontSize: 13, color: "hsl(222,47%,11%)" }}>
                <MapPin size={14} style={{ color: "hsl(217,91%,50%)" }} /> Location
              </div>
              <p className="pl-[22px] leading-relaxed" style={{ fontSize: 12, color: "hsl(215,16%,47%)" }}>{address}</p>
              {mapQuery && (
                <div className="pl-[22px] pt-1 space-y-1.5">
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid hsl(210,40%,90%)" }}>
                    <iframe title="Location" width="100%" height="140" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
                  </div>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold hover:underline" style={{ fontSize: 12, color: "hsl(217,91%,50%)" }}>
                    <MapPin size={11} /> Get Directions
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
