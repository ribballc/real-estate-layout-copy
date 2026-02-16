import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe, Phone, Mail, Clock, MapPin, Instagram, Facebook, Star,
  ChevronDown, Menu, Shield, Award, Sparkles, ThumbsUp, Car,
  Check, Flame, Zap, ExternalLink,
} from "lucide-react";
import previewHeroBg from "@/assets/preview-hero-bg.jpg";

/* ─── Types ─── */
interface Profile {
  business_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  map_query: string;
  logo_url: string | null;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  google_business: string;
  primary_color: string | null;
  secondary_color: string | null;
  service_areas: string[] | null;
  no_business_address: boolean | null;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
  image_url: string | null;
}

interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  photo_url: string | null;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface HourRow {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  return `${hr % 12 || 12}:${m} ${ampm}`;
}

/* ─── Color Helpers ─── */
function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/* ─── Main Component ─── */
const DemoWebsite = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hours, setHours] = useState<HourRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("services").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("testimonials").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("photos").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("business_hours").select("*").eq("user_id", user.id),
    ]).then(([p, s, t, ph, h]) => {
      if (p.data) setProfile(p.data as unknown as Profile);
      setServices((s.data || []) as Service[]);
      setTestimonials((t.data || []) as Testimonial[]);
      setPhotos((ph.data || []) as Photo[]);
      setHours((h.data || []) as HourRow[]);
      setLoading(false);
    });
  }, [user]);

  if (loading || !profile) return null;

  const biz = profile.business_name || "Your Business";
  const accentHex = profile.primary_color || "#3B82F6";
  const accentHsl = hexToHsl(accentHex);
  const isDark = profile.secondary_color !== "#FFFFFF";

  // Derived colors
  const accent = `hsl(${accentHsl})`;
  const accentGrad = `linear-gradient(135deg, ${accent} 0%, hsl(${accentHsl.split(" ")[0]} ${parseInt(accentHsl.split(" ")[1]) + 10}% ${parseInt(accentHsl.split(" ")[2]) - 10}%) 100%)`;
  const bg = isDark ? "#000" : "#fff";
  const fg = isDark ? "#fff" : "#111";
  const cardBg = isDark ? "hsl(0 0% 5%)" : "hsl(0 0% 97%)";
  const secBg = isDark ? "hsl(0 0% 8%)" : "hsl(0 0% 94%)";
  const mutedFg = isDark ? "hsl(0 0% 65%)" : "hsl(0 0% 40%)";
  const borderClr = isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 85%)";
  const slug = biz.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const GoldText = ({ children }: { children: React.ReactNode }) => (
    <span style={{ background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {children}
    </span>
  );

  const sortedHours = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ boxShadow: `0 0 40px ${accent}15` }}>
      {/* Browser bar */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderBottom: `1px solid ${borderClr}` }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <div className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-mono" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: mutedFg }}>
          <Globe className="w-3 h-3 mr-2" style={{ color: accent }} />
          {slug}.realize.pro
        </div>
      </div>

      {/* ═══ WEBSITE CONTENT ═══ */}
      <div style={{ background: bg, fontFamily: "'Montserrat', sans-serif", color: fg }}>

        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4" style={{ background: isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)", borderBottom: `1px solid ${borderClr}` }}>
          <div className="flex items-center gap-3">
            {profile.logo_url && <img src={profile.logo_url} alt={biz} className="h-10 w-auto rounded-lg object-contain" />}
            <span className="text-lg font-black uppercase tracking-wider">{biz}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: mutedFg }}>
            {["Services", "Gallery", "Reviews", "Contact"].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="hidden md:flex h-10 px-5 rounded-lg items-center text-sm font-bold" style={{ background: accentGrad, color: isDark ? "#000" : "#fff" }}>
            <Phone className="w-4 h-4 mr-2" /> {profile.phone || "Call Now"}
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photos[0]?.url || previewHeroBg})` }}>
            <div className="absolute inset-0" style={{ background: isDark ? "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.5))" : "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.5))" }} />
          </div>
          <div className="relative z-10 px-8 md:px-16 py-16 max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>
              {profile.tagline || "Premium Auto Detailing"}
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
              <GoldText>{biz}</GoldText>
            </h1>
            {profile.tagline && (
              <p className="text-lg mb-6" style={{ color: mutedFg }}>{profile.tagline}</p>
            )}
            {(profile.service_areas?.length ?? 0) > 0 && (
              <p className="text-sm mb-6" style={{ color: mutedFg }}>
                Serving: {profile.service_areas!.join(" · ")}
              </p>
            )}
            <div className="flex gap-4 flex-wrap">
              {profile.phone && (
                <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={{ background: accentGrad, color: isDark ? "#000" : "#fff" }}>
                  <Phone className="w-4 h-4 mr-2" /> {profile.phone}
                </div>
              )}
              <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={{ border: `2px solid ${accent}`, color: accent }}>
                Book Online
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        {services.length > 0 && (
          <section className="py-14 px-8 md:px-16" style={{ background: bg }}>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Our Services</p>
              <h2 className="text-3xl md:text-4xl font-bold">What We <GoldText>Offer</GoldText></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc) => (
                <div key={svc.id} className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                  {svc.image_url && (
                    <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${svc.image_url})` }} />
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{svc.title}</h4>
                      {svc.popular && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: accentGrad, color: isDark ? "#000" : "#fff" }}>Popular</span>
                      )}
                    </div>
                    <p className="text-sm mb-3" style={{ color: mutedFg }}>{svc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black" style={{ color: accent }}>${svc.price}</span>
                      <div className="h-9 px-4 rounded-lg flex items-center text-xs font-bold" style={{ border: `1px solid ${accent}`, color: accent }}>Book</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <section className="py-14 px-8 md:px-16" style={{ background: secBg }}>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Our Work</p>
              <h2 className="text-3xl md:text-4xl font-bold"><GoldText>Gallery</GoldText></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.slice(0, 8).map((p) => (
                <div key={p.id} className="rounded-xl overflow-hidden aspect-square">
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-14 px-8 md:px-16" style={{ background: bg }}>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Customer Reviews</p>
              <h2 className="text-3xl md:text-4xl font-bold">What Our <GoldText>Clients</GoldText> Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.slice(0, 4).map((r) => (
                <div key={r.id} className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: accent }} />)}
                  </div>
                  <p className="text-sm mb-3" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>
                    "{r.content}"
                  </p>
                  <span className="text-xs font-semibold">— {r.author}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact / Footer */}
        <footer className="py-12 px-8 md:px-16" style={{ background: cardBg, borderTop: `1px solid ${borderClr}` }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {profile.logo_url && <img src={profile.logo_url} alt={biz} className="h-12 w-auto rounded-lg object-contain" />}
                <h3 className="text-lg font-black uppercase">{biz}</h3>
              </div>
              {profile.tagline && <p className="text-sm mb-4" style={{ color: mutedFg }}>{profile.tagline}</p>}
              {/* Social icons */}
              <div className="flex gap-3">
                {profile.instagram && (
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}>
                    <Instagram className="w-4 h-4" style={{ color: mutedFg }} />
                  </div>
                )}
                {profile.facebook && (
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}>
                    <Facebook className="w-4 h-4" style={{ color: mutedFg }} />
                  </div>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="font-bold text-sm mb-3" style={{ color: accent }}>Contact</h4>
              <div className="space-y-2 text-sm" style={{ color: mutedFg }}>
                {profile.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {profile.phone}</div>}
                {profile.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {profile.email}</div>}
                {!profile.no_business_address && profile.address && (
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {profile.address}</div>
                )}
                {(profile.service_areas?.length ?? 0) > 0 && (
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Serving: {profile.service_areas!.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Business hours */}
            <div>
              <h4 className="font-bold text-sm mb-3" style={{ color: accent }}>Hours</h4>
              <div className="space-y-1.5 text-sm" style={{ color: mutedFg }}>
                {sortedHours.length > 0 ? sortedHours.map((h) => (
                  <div key={h.day_of_week} className="flex justify-between">
                    <span>{DAYS[h.day_of_week]}</span>
                    <span className="font-medium" style={{ color: h.is_closed ? "#ef4444" : fg }}>
                      {h.is_closed ? "Closed" : `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`}
                    </span>
                  </div>
                )) : (
                  <p className="text-xs">Hours not set yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          {!profile.no_business_address && profile.map_query && (
            <div className="mt-8 rounded-xl overflow-hidden border" style={{ borderColor: borderClr }}>
              <iframe
                title="Business Location"
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${profile.map_query}&output=embed`}
              />
            </div>
          )}

          <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: `1px solid ${borderClr}`, color: mutedFg }}>
            © {new Date().getFullYear()} {biz}. All rights reserved. Powered by <span style={{ color: accent }}>Realize</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DemoWebsite;
