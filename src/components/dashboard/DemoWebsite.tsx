import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe, Phone, Mail, Clock, MapPin, Instagram, Facebook, Star,
  ChevronLeft, Menu, X, Calendar, ChevronRight,
} from "lucide-react";
import demoHeroBg from "@/assets/demo-hero.jpg";

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
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  return `${hr % 12 || 12}:${m} ${ampm}`;
}

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

function generateTimeSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur < end) {
    const hh = Math.floor(cur / 60);
    const mm = cur % 60;
    slots.push(`${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`);
    cur += 60;
  }
  return slots;
}

/* ─── Sub-components ─── */

type Page = "home" | "booking" | "gallery" | "reviews";

interface ThemeColors {
  accent: string;
  accentGrad: string;
  bg: string;
  fg: string;
  cardBg: string;
  secBg: string;
  mutedFg: string;
  borderClr: string;
  isDark: boolean;
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
  const [page, setPage] = useState<Page>("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const accent = `hsl(${accentHsl})`;
  const accentGrad = `linear-gradient(135deg, ${accent} 0%, hsl(${accentHsl.split(" ")[0]} ${parseInt(accentHsl.split(" ")[1]) + 10}% ${parseInt(accentHsl.split(" ")[2]) - 10}%) 100%)`;
  const bg = isDark ? "#000" : "#fff";
  const fg = isDark ? "#fff" : "#111";
  const cardBg = isDark ? "hsl(0 0% 5%)" : "hsl(0 0% 97%)";
  const secBg = isDark ? "hsl(0 0% 8%)" : "hsl(0 0% 94%)";
  const mutedFg = isDark ? "hsl(0 0% 65%)" : "hsl(0 0% 40%)";
  const borderClr = isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 85%)";
  const slug = biz.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const theme: ThemeColors = { accent, accentGrad, bg, fg, cardBg, secBg, mutedFg, borderClr, isDark };

  const GoldText = ({ children }: { children: React.ReactNode }) => (
    <span style={{ background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {children}
    </span>
  );

  const sortedHours = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);

  const navigate = (p: Page) => {
    setPage(p);
    setMobileMenu(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookService = (svc: Service) => {
    setSelectedService(svc);
    setSelectedDate(null);
    setSelectedTime(null);
    navigate("booking");
  };

  const navItems: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Gallery", page: "gallery" },
    { label: "Reviews", page: "reviews" },
    { label: "Book Now", page: "booking" },
  ];

  // Calendar helpers
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getHoursForDay = (dayOfWeek: number) => hours.find(h => h.day_of_week === dayOfWeek);

  const isDateAvailable = (date: Date) => {
    if (date < today) return false;
    const dow = date.getDay();
    const h = getHoursForDay(dow);
    return h ? !h.is_closed : false;
  };

  const timeSlotsForDate = selectedDate
    ? (() => {
        const h = getHoursForDay(selectedDate.getDay());
        if (!h || h.is_closed) return [];
        return generateTimeSlots(h.open_time, h.close_time);
      })()
    : [];

  const btnStyle = (outlined?: boolean) =>
    outlined
      ? { border: `2px solid ${accent}`, color: accent, cursor: "pointer" }
      : { background: accentGrad, color: isDark ? "#000" : "#fff", cursor: "pointer" };

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
          {slug}.realize.pro{page !== "home" ? `/${page}` : ""}
        </div>
      </div>

      {/* ═══ WEBSITE CONTENT ═══ */}
      <div ref={scrollRef} style={{ background: bg, fontFamily: "'Montserrat', sans-serif", color: fg, maxHeight: "80vh", overflowY: "auto" }}>

        {/* Navbar */}
        <nav className="sticky top-0 z-20 flex items-center justify-between px-6 py-4" style={{ background: isDark ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.97)", borderBottom: `1px solid ${borderClr}`, backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("home")}>
            {profile.logo_url && <img src={profile.logo_url} alt={biz} className="h-10 w-auto rounded-lg object-contain" />}
            <span className="text-lg font-black uppercase tracking-wider">{biz}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map(n => (
              <span key={n.label} onClick={() => navigate(n.page)} className="cursor-pointer transition-colors" style={{ color: page === n.page ? accent : mutedFg }}>
                {n.label}
              </span>
            ))}
          </div>
          <div className="hidden md:flex h-10 px-5 rounded-lg items-center text-sm font-bold cursor-pointer" style={btnStyle()} onClick={() => navigate("booking")}>
            <Calendar className="w-4 h-4 mr-2" /> Book Now
          </div>
          {/* Mobile menu toggle */}
          <div className="md:hidden cursor-pointer" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden px-6 py-4 space-y-3" style={{ background: cardBg, borderBottom: `1px solid ${borderClr}` }}>
            {navItems.map(n => (
              <div key={n.label} onClick={() => navigate(n.page)} className="py-2 text-sm font-semibold cursor-pointer" style={{ color: page === n.page ? accent : fg }}>
                {n.label}
              </div>
            ))}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 py-2 text-sm font-semibold" style={{ color: accent }}>
                <Phone className="w-4 h-4" /> {profile.phone}
              </a>
            )}
          </div>
        )}

        {/* ─── PAGE: HOME ─── */}
        {page === "home" && (
          <>
            {/* Hero */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photos[0]?.url || demoHeroBg})` }}>
                <div className="absolute inset-0" style={{ background: isDark ? "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.5))" : "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.5))" }} />
              </div>
              <div className="relative z-10 px-8 md:px-16 py-16 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>
                  {profile.tagline || "Premium Auto Detailing"}
                </p>
                <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
                  <GoldText>{biz}</GoldText>
                </h1>
                {profile.tagline && <p className="text-lg mb-6" style={{ color: mutedFg }}>{profile.tagline}</p>}
                {(profile.service_areas?.length ?? 0) > 0 && (
                  <p className="text-sm mb-6" style={{ color: mutedFg }}>Serving: {profile.service_areas!.join(" · ")}</p>
                )}
                <div className="flex gap-4 flex-wrap">
                  <div className="h-12 px-8 rounded-lg flex items-center text-sm font-bold" style={btnStyle()} onClick={() => navigate("booking")}>
                    <Calendar className="w-4 h-4 mr-2" /> Book Now
                  </div>
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="h-12 px-8 rounded-lg flex items-center text-sm font-bold no-underline" style={btnStyle(true)}>
                      <Phone className="w-4 h-4 mr-2" /> Call Us
                    </a>
                  )}
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
                  {services.map(svc => (
                    <div key={svc.id} className="rounded-xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      {svc.image_url && <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${svc.image_url})` }} />}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{svc.title}</h4>
                          {svc.popular && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: accentGrad, color: isDark ? "#000" : "#fff" }}>Popular</span>}
                        </div>
                        <p className="text-sm mb-3" style={{ color: mutedFg }}>{svc.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black" style={{ color: accent }}>${svc.price}</span>
                          <div className="h-9 px-4 rounded-lg flex items-center text-xs font-bold cursor-pointer" style={btnStyle(true)} onClick={() => handleBookService(svc)}>Book</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Photo Gallery preview */}
            {photos.length > 0 && (
              <section className="py-14 px-8 md:px-16" style={{ background: secBg }}>
                <div className="text-center mb-10">
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Our Work</p>
                  <h2 className="text-3xl md:text-4xl font-bold"><GoldText>Gallery</GoldText></h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {photos.slice(0, 8).map(p => (
                    <div key={p.id} className="rounded-xl overflow-hidden aspect-square cursor-pointer" onClick={() => navigate("gallery")}>
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
                {photos.length > 8 && (
                  <div className="text-center mt-6">
                    <span className="text-sm font-semibold cursor-pointer" style={{ color: accent }} onClick={() => navigate("gallery")}>View All Photos →</span>
                  </div>
                )}
              </section>
            )}

            {/* Testimonials preview */}
            {testimonials.length > 0 && (
              <section className="py-14 px-8 md:px-16" style={{ background: bg }}>
                <div className="text-center mb-10">
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Customer Reviews</p>
                  <h2 className="text-3xl md:text-4xl font-bold">What Our <GoldText>Clients</GoldText> Say</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {testimonials.slice(0, 4).map(r => (
                    <div key={r.id} className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: accent }} />)}
                      </div>
                      <p className="text-sm mb-3" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>"{r.content}"</p>
                      <span className="text-xs font-semibold">— {r.author}</span>
                    </div>
                  ))}
                </div>
                {testimonials.length > 4 && (
                  <div className="text-center mt-6">
                    <span className="text-sm font-semibold cursor-pointer" style={{ color: accent }} onClick={() => navigate("reviews")}>See All Reviews →</span>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* ─── PAGE: GALLERY ─── */}
        {page === "gallery" && (
          <section className="py-14 px-8 md:px-16" style={{ background: bg }}>
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate("home")}>
              <ChevronLeft className="w-5 h-5" style={{ color: accent }} />
              <span className="text-sm font-semibold" style={{ color: accent }}>Back</span>
            </div>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Our Work</p>
              <h2 className="text-3xl md:text-4xl font-bold"><GoldText>Gallery</GoldText></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map(p => (
                <div key={p.id} className="rounded-xl overflow-hidden aspect-square group relative">
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">{p.caption}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {photos.length === 0 && <p className="text-center text-sm" style={{ color: mutedFg }}>No photos yet.</p>}
          </section>
        )}

        {/* ─── PAGE: REVIEWS ─── */}
        {page === "reviews" && (
          <section className="py-14 px-8 md:px-16" style={{ background: bg }}>
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate("home")}>
              <ChevronLeft className="w-5 h-5" style={{ color: accent }} />
              <span className="text-sm font-semibold" style={{ color: accent }}>Back</span>
            </div>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Customer Reviews</p>
              <h2 className="text-3xl md:text-4xl font-bold">All <GoldText>Reviews</GoldText></h2>
              {testimonials.length > 0 && (
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" style={{ color: accent }} />)}
                  <span className="ml-2 text-sm font-semibold">{(testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)} ({testimonials.length} reviews)</span>
                </div>
              )}
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              {testimonials.map(r => (
                <div key={r.id} className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                  <div className="flex items-center gap-3 mb-2">
                    {r.photo_url && <img src={r.photo_url} alt={r.author} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <span className="text-sm font-bold">{r.author}</span>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" style={{ color: accent }} />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>"{r.content}"</p>
                </div>
              ))}
              {testimonials.length === 0 && <p className="text-center text-sm" style={{ color: mutedFg }}>No reviews yet.</p>}
            </div>
          </section>
        )}

        {/* ─── PAGE: BOOKING ─── */}
        {page === "booking" && (
          <section className="py-14 px-8 md:px-16" style={{ background: bg }}>
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate("home")}>
              <ChevronLeft className="w-5 h-5" style={{ color: accent }} />
              <span className="text-sm font-semibold" style={{ color: accent }}>Back</span>
            </div>

            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Schedule Appointment</p>
              <h2 className="text-3xl md:text-4xl font-bold">Book <GoldText>Online</GoldText></h2>
            </div>

            {/* Step 1: Select Service */}
            {!selectedService && (
              <div className="max-w-2xl mx-auto space-y-3">
                <h3 className="text-lg font-bold mb-4">1. Choose a Service</h3>
                {services.map(svc => (
                  <div key={svc.id} className="rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: cardBg, border: `1px solid ${borderClr}` }}
                    onClick={() => { setSelectedService(svc); setSelectedDate(null); setSelectedTime(null); }}>
                    <div>
                      <h4 className="font-bold">{svc.title}</h4>
                      <p className="text-xs mt-1" style={{ color: mutedFg }}>{svc.description}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <span className="text-lg font-black" style={{ color: accent }}>${svc.price}</span>
                      <ChevronRight className="w-4 h-4 mt-1 mx-auto" style={{ color: mutedFg }} />
                    </div>
                  </div>
                ))}
                {services.length === 0 && <p className="text-center text-sm" style={{ color: mutedFg }}>No services available yet.</p>}
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {selectedService && (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => { setSelectedService(null); setSelectedDate(null); setSelectedTime(null); }}>
                  <ChevronLeft className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-sm" style={{ color: accent }}>Change service</span>
                </div>

                <div className="rounded-xl p-4 mb-6" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold">{selectedService.title}</h4>
                      <p className="text-xs" style={{ color: mutedFg }}>{selectedService.description}</p>
                    </div>
                    <span className="text-xl font-black" style={{ color: accent }}>${selectedService.price}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-4">2. Pick a Date & Time</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} className="p-1 rounded-lg" style={{ color: mutedFg }}>
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-bold text-sm">{MONTHS[calMonth]} {calYear}</span>
                      <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} className="p-1 rounded-lg" style={{ color: mutedFg }}>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2" style={{ color: mutedFg }}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <span key={d} className="font-semibold py-1">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => <span key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const date = new Date(calYear, calMonth, i + 1);
                        const avail = isDateAvailable(date);
                        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                        return (
                          <button
                            key={i}
                            disabled={!avail}
                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                            className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-medium transition-all"
                            style={{
                              background: isSelected ? accentGrad : "transparent",
                              color: isSelected ? (isDark ? "#000" : "#fff") : avail ? fg : `${mutedFg}`,
                              opacity: avail ? 1 : 0.3,
                              cursor: avail ? "pointer" : "not-allowed",
                            }}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <h4 className="font-bold text-sm mb-4">
                      {selectedDate ? `${DAYS[selectedDate.getDay()]}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}` : "Select a date"}
                    </h4>
                    {selectedDate ? (
                      timeSlotsForDate.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlotsForDate.map(t => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className="py-2.5 rounded-lg text-xs font-semibold transition-all"
                              style={{
                                background: selectedTime === t ? accentGrad : "transparent",
                                color: selectedTime === t ? (isDark ? "#000" : "#fff") : fg,
                                border: `1px solid ${selectedTime === t ? accent : borderClr}`,
                              }}
                            >
                              {formatTime(t)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: mutedFg }}>No available slots on this day.</p>
                      )
                    ) : (
                      <p className="text-sm" style={{ color: mutedFg }}>Pick a date to see available times.</p>
                    )}
                  </div>
                </div>

                {/* Confirm */}
                {selectedDate && selectedTime && (
                  <div className="mt-6 rounded-xl p-5" style={{ background: cardBg, border: `1px solid ${accent}` }}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold">{selectedService.title}</h4>
                        <p className="text-sm mt-1" style={{ color: mutedFg }}>
                          {DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()} at {formatTime(selectedTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black" style={{ color: accent }}>${selectedService.price}</span>
                        <div className="h-11 px-8 rounded-lg flex items-center text-sm font-bold" style={btnStyle()}>
                          Confirm Booking
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ─── FOOTER (all pages) ─── */}
        <footer className="py-12 px-8 md:px-16" style={{ background: cardBg, borderTop: `1px solid ${borderClr}` }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate("home")}>
                {profile.logo_url && <img src={profile.logo_url} alt={biz} className="h-12 w-auto rounded-lg object-contain" />}
                <h3 className="text-lg font-black uppercase">{biz}</h3>
              </div>
              {profile.tagline && <p className="text-sm mb-4" style={{ color: mutedFg }}>{profile.tagline}</p>}
              <div className="flex gap-3">
                {profile.instagram && (
                  <a href={`https://instagram.com/${profile.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}>
                    <Instagram className="w-4 h-4" style={{ color: mutedFg }} />
                  </a>
                )}
                {profile.facebook && (
                  <a href={`https://facebook.com/${profile.facebook.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: secBg }}>
                    <Facebook className="w-4 h-4" style={{ color: mutedFg }} />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3" style={{ color: accent }}>Contact</h4>
              <div className="space-y-2 text-sm" style={{ color: mutedFg }}>
                {profile.phone && <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:underline"><Phone className="w-3.5 h-3.5" /> {profile.phone}</a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:underline"><Mail className="w-3.5 h-3.5" /> {profile.email}</a>}
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

            <div>
              <h4 className="font-bold text-sm mb-3" style={{ color: accent }}>Hours</h4>
              <div className="space-y-1.5 text-sm" style={{ color: mutedFg }}>
                {sortedHours.length > 0 ? sortedHours.map(h => (
                  <div key={h.day_of_week} className="flex justify-between">
                    <span>{DAYS[h.day_of_week]}</span>
                    <span className="font-medium" style={{ color: h.is_closed ? "#ef4444" : fg }}>
                      {h.is_closed ? "Closed" : `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`}
                    </span>
                  </div>
                )) : <p className="text-xs">Hours not set yet</p>}
              </div>
            </div>
          </div>

          {!profile.no_business_address && profile.map_query && (
            <div className="mt-8 rounded-xl overflow-hidden border" style={{ borderColor: borderClr }}>
              <iframe title="Business Location" width="100%" height="200" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${profile.map_query}&output=embed`} />
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
