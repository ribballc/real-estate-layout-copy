import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe, Phone, Mail, Clock, MapPin, Instagram, Facebook, Star,
  ChevronLeft, Menu, X, Calendar, ChevronRight, ChevronDown,
  Shield, Award, Sparkles, Check, ThumbsUp, Car, Truck,
  Plus, Minus, Quote, ArrowRight, Flame, Zap,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
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

interface AddOn {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
  image_url: string | null;
  service_id: string;
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

/* ─── Card Shine CSS ─── */
const cardShineStyle = `
  .card-shine-demo {
    position: relative;
    overflow: hidden;
  }
  .card-shine-demo::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(255,255,255,0.03) 45%,
      rgba(255,255,255,0.06) 50%,
      rgba(255,255,255,0.03) 55%,
      transparent 60%
    );
    transform: translateX(-100%) translateY(-100%);
    transition: transform 0.6s ease;
    pointer-events: none;
    z-index: 1;
  }
  .card-shine-demo:hover::before {
    transform: translateX(0) translateY(0);
  }
`;

/* ─── Main Component ─── */
const DemoWebsite = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
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
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [vehicleTab, setVehicleTab] = useState<"sedan" | "truck">("sedan");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gallery carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const autoplay = useCallback(() => { emblaApi?.scrollNext(); }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(autoplay, 3000);
    return () => clearInterval(interval);
  }, [emblaApi, autoplay]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("services").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("add_ons").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("testimonials").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("photos").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("business_hours").select("*").eq("user_id", user.id),
    ]).then(([p, s, ao, t, ph, h]) => {
      if (p.data) setProfile(p.data as unknown as Profile);
      setServices((s.data || []) as Service[]);
      setAddOns((ao.data || []) as AddOn[]);
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

  const goldIconBox = { background: accentGrad, display: "flex", alignItems: "center", justifyContent: "center" };
  const goldIconColor = isDark ? "#000" : "#fff";

  // FAQ data
  const faqData = [
    { question: `How long does a full detail take?`, answer: `A full thorough interior detail typically takes about 1.5 hours for sedans. Larger vehicles like trucks and SUVs may take longer. Express services are completed in about 35-40 minutes.` },
    { question: `Does ${biz} offer mobile detailing?`, answer: `Contact us to discuss mobile detailing options. We can accommodate your needs and come to your location for added convenience.` },
    { question: `What payment methods do you accept?`, answer: `We accept all major credit cards, debit cards, and cash. Payment is due upon completion of the service.` },
    { question: `Do I need to make an appointment?`, answer: `Yes, we recommend booking an appointment to ensure we can accommodate you at your preferred time. You can book online or contact us directly.` },
    { question: `What products does ${biz} use?`, answer: `We use only premium, professional-grade detailing products that are safe for all vehicle surfaces and interiors, carefully selected for optimal results.` },
    { question: `Can you remove pet hair from my vehicle?`, answer: `Absolutely! We offer pet hair removal as an add-on service. Pricing varies depending on the severity level, which we assess upon arrival.` },
  ];

  // Why choose us features
  const whyFeatures = [
    { icon: Shield, title: "Quality Guaranteed", desc: "We stand behind our work with a 100% satisfaction guarantee on every detail." },
    { icon: Clock, title: "Convenient Scheduling", desc: "Flexible appointments to fit your busy schedule, including weekends." },
    { icon: Award, title: "Expert Technicians", desc: "Trained professionals using premium products and techniques." },
    { icon: Sparkles, title: "Premium Products", desc: "Only the finest detailing products for showroom-quality results." },
    { icon: ThumbsUp, title: "Trusted Service", desc: "Building lasting relationships through honest, reliable work." },
    { icon: Car, title: "All Vehicles Welcome", desc: "From daily drivers to luxury vehicles, we detail them all." },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ boxShadow: `0 0 40px ${accent}15` }}>
      <style>{cardShineStyle}</style>

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
            {/* ══ 1. HERO ══ */}
            <section className="relative min-h-[80vh] flex items-end overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photos[0]?.url || demoHeroBg})` }}>
                <div className="absolute inset-0" style={{ background: isDark
                  ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)"
                  : "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.3) 100%)"
                }} />
              </div>
              <div className="relative z-10 w-full px-8 md:px-16 pb-16 pt-32">
                <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: accent }}>
                  {(profile.service_areas?.length ?? 0) > 0 ? profile.service_areas![0] : "Professional Auto Detailing"}
                </p>
                <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-5" style={{ letterSpacing: "-0.02em" }}>
                  {biz.split(" ").map((word, i) => (
                    <span key={i} className="block">{i === 1 ? <GoldText>{word}</GoldText> : word}</span>
                  ))}
                </h1>
                <p className="text-base md:text-lg max-w-lg mb-8" style={{ color: mutedFg }}>
                  {profile.tagline || "Your Go-To For Professional Detailing, Ceramic Coating, and Paint Correction Services"}
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="h-14 px-10 rounded-none flex items-center text-sm font-bold uppercase tracking-wider cursor-pointer transition-transform hover:scale-105" style={{ ...btnStyle(), letterSpacing: "0.1em" }} onClick={() => navigate("booking")}>
                    Book Now
                  </div>
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="h-14 px-10 rounded-none flex items-center text-sm font-bold uppercase tracking-wider no-underline cursor-pointer transition-transform hover:scale-105" style={{ ...btnStyle(true), letterSpacing: "0.1em" }}>
                      Call {profile.phone}
                    </a>
                  )}
                </div>
                {testimonials.length > 0 && (
                  <div className="mt-8 flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#facc15" }} />)}
                    </div>
                    <span className="text-sm font-semibold">{testimonials.length}+ Five Star Reviews</span>
                  </div>
                )}
              </div>
            </section>

            {/* ══ 2. WELCOME / ABOUT ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: bg }}>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Welcome to</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase mb-6"><GoldText>{biz}</GoldText></h2>
                <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: mutedFg }}>
                  {profile.tagline
                    ? `${profile.tagline}. We bring top-quality detailing straight to your location. Skip the hassle of waiting at a shop.`
                    : "We bring top-quality detailing, ceramic coating, and paint correction straight to your location. With years of experience, we take pride in making vehicles look their best."}
                </p>
              </div>
            </section>

            {/* ══ 3. SERVICES OVERVIEW ══ */}
            {services.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: secBg }}>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Our Services</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase">Our <GoldText>Services</GoldText></h2>
                  <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: mutedFg }}>Professional auto detailing services tailored to your vehicle type</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {services.slice(0, 4).map((svc) => (
                    <div key={svc.id} className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer card-shine-demo" onClick={() => handleBookService(svc)}>
                      {svc.image_url ? (
                        <img src={svc.image_url} alt={svc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full" style={{ background: cardBg }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-2 transition-colors" style={{ ...(isDark ? {} : {}) }}>
                          {svc.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-4">{svc.description?.slice(0, 50)}</p>
                        <div className="flex items-center gap-2 text-sm font-bold cursor-pointer" style={{ color: accent }}>
                          View Packages <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══ 4. PACKAGES / PRICING ══ */}
            {services.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: bg }}>
                <div className="text-center mb-12">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Detailing Packages</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase mb-8"><GoldText>Detailing Packages</GoldText></h2>

                  {/* Vehicle Type Tabs */}
                  <div className="flex justify-center gap-2 mb-4">
                    {([
                      { id: "sedan" as const, label: "Sedans & Coupes", Icon: Car },
                      { id: "truck" as const, label: "Trucks & SUVs", Icon: Truck },
                    ]).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setVehicleTab(tab.id)}
                        className="flex items-center gap-2 px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-all"
                        style={{
                          background: vehicleTab === tab.id ? accentGrad : "transparent",
                          color: vehicleTab === tab.id ? goldIconColor : mutedFg,
                          border: `2px solid ${vehicleTab === tab.id ? accent : borderClr}`,
                        }}
                      >
                        <tab.Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: mutedFg }}>* Starting Prices - Subject to Change Based On Condition Of Vehicle *</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {services.map((svc, idx) => {
                    const icons = [Flame, Zap, Sparkles, Shield, Award, Car];
                    const IconComp = icons[idx % icons.length];
                    const priceMultiplier = vehicleTab === "truck" ? 1.25 : 1;
                    const displayPrice = Math.round(svc.price * priceMultiplier);

                    return (
                      <div key={svc.id} className="rounded-xl overflow-hidden relative card-shine-demo transition-all duration-300"
                        style={{ background: cardBg, border: `1px solid ${svc.popular ? accent : borderClr}` }}>
                        {svc.popular && (
                          <div className="absolute top-4 right-4 z-10 text-[10px] font-black uppercase px-3 py-1 rounded-full" style={{ background: accentGrad, color: goldIconColor }}>
                            TOP SELLER
                          </div>
                        )}
                        <div className="p-8">
                          <div className="w-12 h-12 rounded-lg mb-6" style={goldIconBox}>
                            <IconComp className="w-6 h-6" style={{ color: goldIconColor }} />
                          </div>
                          <h3 className="text-xl font-black uppercase mb-2">{svc.title}</h3>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-black" style={{ background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                              Starting at ${displayPrice}
                            </span>
                          </div>
                          {svc.description && (
                            <div className="pt-6 mb-6" style={{ borderTop: `1px solid ${borderClr}` }}>
                              <p className="text-sm font-semibold mb-4">Includes:</p>
                              <ul className="space-y-3">
                                {svc.description.split(/[,\n•]+/).filter(Boolean).map((feat, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: mutedFg }}>
                                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                                    {feat.trim()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <div className="flex-1 h-11 rounded-lg flex items-center justify-center text-sm font-bold uppercase tracking-wider cursor-pointer" style={svc.popular ? btnStyle() : btnStyle(true)} onClick={() => handleBookService(svc)}>
                              Book Now
                            </div>
                            {profile.phone && (
                              <a href={`tel:${profile.phone}`} className="h-11 px-5 rounded-lg flex items-center justify-center text-sm font-bold no-underline cursor-pointer" style={btnStyle(true)}>
                                <Phone className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ══ 5. ADD-ON SERVICES ══ */}
            {addOns.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: secBg }}>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Enhance Your Detail</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase"><GoldText>Add-On</GoldText> Services</h2>
                  <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: mutedFg }}>Take your detail to the next level with our premium add-on services</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {addOns.map((addon) => (
                    <div key={addon.id} className="p-6 rounded-xl group card-shine-demo transition-all duration-300"
                      style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg flex-shrink-0" style={goldIconBox}>
                          <Sparkles className="w-6 h-6" style={{ color: goldIconColor }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{addon.title}</h3>
                          <p className="text-xl font-black mb-2" style={{ background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            ${addon.price}
                          </p>
                          <p className="text-sm" style={{ color: mutedFg }}>{addon.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <div className="inline-flex h-14 px-10 items-center text-sm font-bold uppercase tracking-wider cursor-pointer" style={{ ...btnStyle(), letterSpacing: "0.1em" }} onClick={() => navigate("booking")}>
                    Get a Quote
                  </div>
                </div>
              </section>
            )}

            {/* ══ 6. WHY CHOOSE US ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: isDark ? secBg : bg }}>
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Why Choose Us</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase">The <GoldText>{biz}</GoldText> Difference</h2>
                <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: mutedFg }}>Experience the highest standard in auto detailing with our commitment to excellence</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {whyFeatures.map((item, i) => (
                  <div key={i} className="p-8 rounded-xl card-shine-demo group transition-all duration-300"
                    style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <div className="w-14 h-14 rounded-lg mb-6 transition-transform duration-300 group-hover:scale-110" style={goldIconBox}>
                      <item.icon className="w-7 h-7" style={{ color: goldIconColor }} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: mutedFg }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ 7. GALLERY CAROUSEL ══ */}
            {photos.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: isDark ? bg : secBg }}>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Our Work</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase"><GoldText>Gallery</GoldText></h2>
                  <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: mutedFg }}>See the transformation our detailing services deliver</p>
                </div>
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {photos.slice(0, 8).map(p => (
                      <div key={p.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 first:pl-0">
                        <div className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer" onClick={() => navigate("gallery")}>
                          <img src={p.url} alt={p.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: accent }}>
                              {p.caption || "Detail"}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: accentGrad }}>
                            <svg className="w-5 h-5" style={{ color: goldIconColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {photos.length > 8 && (
                  <div className="text-center mt-8">
                    <span className="text-sm font-bold uppercase tracking-wider cursor-pointer" style={{ color: accent }} onClick={() => navigate("gallery")}>View All Photos →</span>
                  </div>
                )}
              </section>
            )}

            {/* ══ 8. TESTIMONIALS ══ */}
            {testimonials.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: isDark ? secBg : bg }}>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Customer Reviews</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase">What Our <GoldText>Clients</GoldText> Say</h2>
                  <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: mutedFg }}>Don't just take our word for it – hear from our satisfied customers</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {testimonials.slice(0, 4).map(r => (
                    <div key={r.id} className="rounded-xl p-8 relative card-shine-demo transition-all duration-300"
                      style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      <Quote className="absolute top-6 right-6 w-10 h-10" style={{ color: `${accent}30` }} />
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" style={{ color: accent }} />)}
                      </div>
                      <p className="text-base mb-6 leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)" }}>
                        "{r.content}"
                      </p>
                      <div className="pt-4" style={{ borderTop: `1px solid ${borderClr}` }}>
                        <span className="font-bold">{r.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {testimonials.length > 4 && (
                  <div className="text-center mt-8">
                    <span className="text-sm font-bold uppercase tracking-wider cursor-pointer" style={{ color: accent }} onClick={() => navigate("reviews")}>See All Reviews →</span>
                  </div>
                )}
              </section>
            )}

            {/* ══ 9. FAQ ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: isDark ? bg : secBg }}>
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Got Questions?</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase">Frequently <GoldText>Asked</GoldText> Questions</h2>
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="rounded-xl overflow-hidden transition-colors" style={{ background: cardBg, border: `1px solid ${faqOpen === index ? accent : borderClr}` }}>
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                      onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    >
                      <span className="font-semibold pr-4">{faq.question}</span>
                      <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: accentGrad }}>
                        {faqOpen === index ? (
                          <Minus className="w-4 h-4" style={{ color: goldIconColor }} />
                        ) : (
                          <Plus className="w-4 h-4" style={{ color: goldIconColor }} />
                        )}
                      </span>
                    </button>
                    <div style={{
                      maxHeight: faqOpen === index ? "200px" : "0px",
                      opacity: faqOpen === index ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                    }}>
                      <p className="px-6 pb-5 leading-relaxed text-sm" style={{ color: mutedFg }}>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ══ 10. CONTACT FORM ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: isDark ? secBg : bg }}>
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Get In Touch</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase"><GoldText>Book</GoldText> Your Detail</h2>
                <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: mutedFg }}>Ready to transform your vehicle? Contact us to schedule your appointment</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Left: Contact Info */}
                <div className="space-y-6">
                  <div className="p-8 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      {profile.phone && (
                        <a href={`tel:${profile.phone}`} className="flex items-center gap-4 no-underline transition-colors" style={{ color: mutedFg }}>
                          <div className="w-12 h-12 rounded-lg flex-shrink-0" style={goldIconBox}>
                            <Phone className="w-5 h-5" style={{ color: goldIconColor }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: fg }}>Call Us</p>
                            <p className="text-sm">{profile.phone}</p>
                          </div>
                        </a>
                      )}
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-4 no-underline transition-colors" style={{ color: mutedFg }}>
                          <div className="w-12 h-12 rounded-lg flex-shrink-0" style={goldIconBox}>
                            <Mail className="w-5 h-5" style={{ color: goldIconColor }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: fg }}>Email Us</p>
                            <p className="text-sm">{profile.email}</p>
                          </div>
                        </a>
                      )}
                      <div className="flex items-center gap-4" style={{ color: mutedFg }}>
                        <div className="w-12 h-12 rounded-lg flex-shrink-0" style={goldIconBox}>
                          <Clock className="w-5 h-5" style={{ color: goldIconColor }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: fg }}>Business Hours</p>
                          {sortedHours.length > 0 ? (
                            <>
                              {sortedHours.filter(h => !h.is_closed).length > 0 && (
                                <p className="text-sm">
                                  {(() => {
                                    const openDays = sortedHours.filter(h => !h.is_closed);
                                    if (openDays.length === 0) return "Hours not set";
                                    const first = openDays[0];
                                    const last = openDays[openDays.length - 1];
                                    return `${DAYS[first.day_of_week].slice(0, 3)}–${DAYS[last.day_of_week].slice(0, 3)}: ${formatTime(first.open_time)} – ${formatTime(first.close_time)}`;
                                  })()}
                                </p>
                              )}
                              {sortedHours.filter(h => h.is_closed).length > 0 && (
                                <p className="text-sm">{sortedHours.filter(h => h.is_closed).map(h => DAYS[h.day_of_week]).join(", ")}: Closed</p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm">Hours not set yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(profile.instagram || profile.facebook || profile.tiktok) && (
                    <div className="p-8 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                      <div className="flex gap-4">
                        {profile.instagram && (
                          <a href={`https://instagram.com/${profile.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all" style={{ background: secBg }}>
                            <Instagram className="w-5 h-5" style={{ color: mutedFg }} />
                          </a>
                        )}
                        {profile.facebook && (
                          <a href={`https://facebook.com/${profile.facebook.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all" style={{ background: secBg }}>
                            <Facebook className="w-5 h-5" style={{ color: mutedFg }} />
                          </a>
                        )}
                        {profile.tiktok && (
                          <a href={`https://tiktok.com/@${profile.tiktok.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all" style={{ background: secBg }}>
                            <svg className="w-5 h-5" style={{ color: mutedFg }} viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Contact Form (display-only) */}
                <div className="p-8 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                  <h3 className="text-2xl font-bold mb-6">Request a Booking</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <input type="text" placeholder="Your Name" readOnly className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                      <input type="email" placeholder="Email Address" readOnly className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <input type="tel" placeholder="Phone Number" readOnly className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                      <input type="text" placeholder="Vehicle (Year, Make, Model)" readOnly className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                    </div>
                    <input type="text" placeholder="Address" readOnly className="w-full px-4 py-3 rounded-lg text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />

                    {/* Service checkboxes */}
                    {services.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Select Your Service</p>
                        <div className="grid grid-cols-1 gap-2">
                          {services.map(svc => (
                            <label key={svc.id} className="flex items-center gap-3 p-3 rounded-lg cursor-default" style={{ background: secBg, border: `1px solid ${borderClr}` }}>
                              <input type="checkbox" readOnly className="w-4 h-4" style={{ accentColor: accent }} />
                              <span className="text-sm">{svc.title} (${svc.price})</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add-on checkboxes */}
                    {addOns.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Add-ons</p>
                        <div className="grid grid-cols-1 gap-2">
                          {addOns.map(ao => (
                            <label key={ao.id} className="flex items-center gap-3 p-3 rounded-lg cursor-default" style={{ background: secBg, border: `1px solid ${borderClr}` }}>
                              <input type="checkbox" readOnly className="w-4 h-4" style={{ accentColor: accent }} />
                              <span className="text-sm">{ao.title} (${ao.price})</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <textarea placeholder="Additional Details or Questions" readOnly rows={4} className="w-full px-4 py-3 rounded-lg text-sm resize-none" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                    <div className="h-12 rounded-lg flex items-center justify-center text-sm font-bold uppercase tracking-wider" style={{ ...btnStyle(), letterSpacing: "0.1em" }}>
                      Book Now
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ 11. CTA BANNER ══ */}
            <section className="py-20 px-8 md:px-16 text-center relative overflow-hidden" style={{ background: isDark ? bg : secBg }}>
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: accentGrad }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/2 translate-y-1/2" style={{ background: accentGrad }} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Ready to Transform Your Vehicle?</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Book Your <GoldText>{biz}</GoldText> Detail Today</h2>
                <p className="text-base max-w-lg mx-auto mb-8" style={{ color: mutedFg }}>
                  Experience the difference professional detailing makes. Your car deserves the best – contact us now to schedule your appointment.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <div className="h-14 px-10 flex items-center text-sm font-bold uppercase tracking-wider cursor-pointer" style={{ ...btnStyle(), letterSpacing: "0.1em" }} onClick={() => navigate("booking")}>
                    <Calendar className="w-4 h-4 mr-2" /> Book Now
                  </div>
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="h-14 px-10 flex items-center text-sm font-bold uppercase tracking-wider no-underline cursor-pointer" style={{ ...btnStyle(true), letterSpacing: "0.1em" }}>
                      <Phone className="w-4 h-4 mr-2" /> Call {profile.phone}
                    </a>
                  )}
                </div>
              </div>
            </section>
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
                <div key={r.id} className="rounded-xl p-5 relative" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                  <Quote className="absolute top-4 right-4 w-8 h-8" style={{ color: `${accent}20` }} />
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
