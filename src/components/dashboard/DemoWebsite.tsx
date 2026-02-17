import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe, Phone, Mail, Clock, MapPin, Instagram, Facebook, Star,
  ChevronLeft, Menu, X, Calendar, ChevronRight, ChevronDown,
  Shield, Award, Sparkles, Check, ThumbsUp, Car, Truck,
  Plus, Minus, Quote, ArrowRight, Flame, Zap, Heart,
  MousePointer, CreditCard, Wifi,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import demoHeroBg from "@/assets/demo-hero.jpg";
import DemoFadeIn from "./demo/DemoFadeIn";
import DemoFloatingElements from "./demo/DemoFloatingElements";
import DemoBookingModal from "./demo/DemoBookingModal";

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

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
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
  const [page, setPage] = useState<"home" | "gallery" | "reviews">("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [vehicleTab, setVehicleTab] = useState<"sedan" | "truck">("sedan");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState<Service | null>(null);
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Gallery carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const autoplay = useCallback(() => { emblaApi?.scrollNext(); }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(autoplay, 3000);
    return () => clearInterval(interval);
  }, [emblaApi, autoplay]);

  // Sticky header shrink
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setHeaderShrunk(el.scrollTop > 80);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

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
  const goldIconColor = isDark ? "#000" : "#fff";

  const GoldText = ({ children }: { children: React.ReactNode }) => (
    <span style={{ background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{children}</span>
  );

  const sortedHours = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);

  const navigate = (p: "home" | "gallery" | "reviews") => {
    setPage(p);
    setMobileMenu(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookService = (svc: Service) => {
    setBookingPreselect(svc);
    setBookingOpen(true);
  };

  const openBooking = () => {
    setBookingPreselect(null);
    setBookingOpen(true);
  };

  const navItems: { label: string; action: () => void; page?: string }[] = [
    { label: "Home", action: () => navigate("home"), page: "home" },
    { label: "Gallery", action: () => navigate("gallery"), page: "gallery" },
    { label: "Reviews", action: () => navigate("reviews"), page: "reviews" },
    { label: "Book Now", action: openBooking },
  ];

  const btnStyle = (outlined?: boolean) =>
    outlined
      ? { border: `2px solid ${accent}`, color: accent, cursor: "pointer" }
      : { background: accentGrad, color: goldIconColor, cursor: "pointer" };

  const goldIconBox = { background: accentGrad, display: "flex", alignItems: "center", justifyContent: "center" };

  const faqData = [
    { question: `How long does a full detail take?`, answer: `A full thorough interior detail typically takes about 1.5 hours for sedans. Larger vehicles like trucks and SUVs may take longer.` },
    { question: `Does ${biz} offer mobile detailing?`, answer: `Contact us to discuss mobile detailing options. We can accommodate your needs and come to your location.` },
    { question: `What payment methods do you accept?`, answer: `We accept all major credit cards, debit cards, and cash. Payment is due upon completion of the service.` },
    { question: `Do I need to make an appointment?`, answer: `Yes, we recommend booking an appointment to ensure we can accommodate you at your preferred time.` },
    { question: `What products does ${biz} use?`, answer: `We use only premium, professional-grade detailing products that are safe for all vehicle surfaces.` },
    { question: `Can you remove pet hair from my vehicle?`, answer: `Absolutely! We offer pet hair removal as an add-on service.` },
  ];

  const whyFeatures = [
    { icon: Shield, title: "Quality Guaranteed", desc: "100% satisfaction guarantee on every detail." },
    { icon: Clock, title: "Convenient Scheduling", desc: "Flexible appointments including weekends." },
    { icon: Award, title: "Expert Technicians", desc: "Trained professionals using premium products." },
    { icon: Sparkles, title: "Premium Products", desc: "Only the finest products for showroom results." },
    { icon: ThumbsUp, title: "Trusted Service", desc: "Building lasting relationships through quality." },
    { icon: Car, title: "All Vehicles Welcome", desc: "From daily drivers to luxury, we detail them all." },
  ];

  // Instagram mock data
  const instaPhotos = photos.slice(0, 6);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 relative" style={{ boxShadow: `0 0 40px ${accent}15` }}>
      {/* DEMO badge */}
      <div className="absolute top-14 right-3 z-30 text-[9px] font-black uppercase px-2 py-1 rounded-md" style={{ background: "rgba(239,68,68,0.9)", color: "#fff", letterSpacing: "0.1em" }}>
        DEMO
      </div>

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
      <div ref={scrollRef} style={{ background: bg, fontFamily: "'Montserrat', sans-serif", color: fg, maxHeight: "80vh", overflowY: "auto", position: "relative" }}>

        {/* Sticky Navbar */}
        <nav
          className="sticky top-0 z-20 flex items-center justify-between transition-all duration-300"
          style={{
            padding: headerShrunk ? "8px 24px" : "16px 24px",
            background: isDark ? "rgba(0,0,0,0.97)" : "rgba(255,255,255,0.97)",
            borderBottom: `1px solid ${borderClr}`,
            backdropFilter: "blur(16px)",
            boxShadow: headerShrunk ? `0 4px 20px rgba(0,0,0,0.1)` : "none",
          }}
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("home")}>
            {profile.logo_url && <img src={profile.logo_url} alt={biz} className="h-10 w-auto rounded-lg object-contain transition-all duration-300" style={{ height: headerShrunk ? "32px" : "40px" }} />}
            <span className="text-lg font-black uppercase tracking-wider">{biz}</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <span
                key={n.label}
                onClick={n.action}
                className="cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: n.page === page ? accent : mutedFg,
                  background: n.page === page ? `${accent}10` : "transparent",
                }}
              >
                {n.label}
              </span>
            ))}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium no-underline" style={{ color: mutedFg }}>
                <Phone className="w-3.5 h-3.5" /> {profile.phone}
              </a>
            )}
          </div>
          <div className="hidden md:flex h-10 px-5 rounded-xl items-center text-sm font-bold cursor-pointer transition-transform hover:scale-105" style={btnStyle()} onClick={openBooking}>
            <Calendar className="w-4 h-4 mr-2" /> Book Now
          </div>
          <div className="md:hidden cursor-pointer" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden px-6 py-4 space-y-1" style={{ background: cardBg, borderBottom: `1px solid ${borderClr}`, animation: "demoSlideInLeft 0.2s ease-out" }}>
            {navItems.map(n => (
              <div key={n.label} onClick={n.action} className="py-3 px-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors" style={{ color: n.page === page ? accent : fg }}>
                {n.label}
              </div>
            ))}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 py-3 px-3 text-sm font-semibold" style={{ color: accent }}>
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
                <div className="absolute inset-0" style={{
                  background: isDark
                    ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)"
                    : "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.3) 100%)"
                }} />
              </div>
              <div className="relative z-10 w-full px-8 md:px-16 pb-16 pt-32">
                <DemoFadeIn>
                  <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: accent }}>
                    {(profile.service_areas?.length ?? 0) > 0 ? profile.service_areas![0] : "Professional Auto Detailing"}
                  </p>
                </DemoFadeIn>
                <DemoFadeIn delay={100}>
                  <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-5" style={{ letterSpacing: "-0.02em" }}>
                    {biz.split(" ").map((word, i) => (
                      <span key={i} className="block">{i === 1 ? <GoldText>{word}</GoldText> : word}</span>
                    ))}
                  </h1>
                </DemoFadeIn>
                <DemoFadeIn delay={200}>
                  <p className="text-base md:text-lg max-w-lg mb-8" style={{ color: mutedFg }}>
                    {profile.tagline || "Premium detailing that transforms your ride. Book online in 60 seconds."}
                  </p>
                </DemoFadeIn>
                <DemoFadeIn delay={300}>
                  <div className="flex gap-4 flex-wrap">
                    <div className="h-14 px-10 rounded-xl flex items-center text-sm font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105 hover:shadow-lg" style={{ ...btnStyle(), letterSpacing: "0.1em", boxShadow: `0 8px 24px ${accent}30` }} onClick={openBooking}>
                      Book Now
                    </div>
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="h-14 px-10 rounded-xl flex items-center text-sm font-bold uppercase tracking-wider no-underline cursor-pointer transition-all hover:scale-105" style={{ ...btnStyle(true), letterSpacing: "0.1em" }}>
                        Call {profile.phone}
                      </a>
                    )}
                  </div>
                </DemoFadeIn>

                {/* Floating trust badges */}
                <DemoFadeIn delay={500}>
                  <div className="flex flex-wrap gap-3 mt-8">
                    {[
                      { icon: Star, text: "4.9★ Rating" },
                      { icon: ThumbsUp, text: `${Math.max(testimonials.length * 50, 200)}+ Happy Customers` },
                      { icon: Zap, text: "Same-Day Available" },
                    ].map((badge, i) => (
                      <div
                        key={badge.text}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                          backdropFilter: "blur(8px)",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                          animation: `demoFloatBadge 3s ease-in-out infinite ${i * 0.3}s`,
                        }}
                      >
                        <badge.icon className="w-3.5 h-3.5" style={{ color: accent }} />
                        {badge.text}
                      </div>
                    ))}
                  </div>
                </DemoFadeIn>

                {/* Scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <div className="flex flex-col items-center gap-1" style={{ animation: "demoScrollIndicator 2s ease-in-out infinite" }}>
                    <MousePointer className="w-4 h-4" style={{ color: mutedFg }} />
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: mutedFg }}>Scroll</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ 2. TRUST BAR ══ */}
            <DemoFadeIn>
              <section className="py-6 px-8 flex flex-wrap items-center justify-center gap-8" style={{ background: cardBg, borderBottom: `1px solid ${borderClr}` }}>
                {[
                  { icon: Shield, text: "Fully Insured" },
                  { icon: Award, text: "5-Star Rated" },
                  { icon: Sparkles, text: "Eco-Friendly Products" },
                  { icon: CreditCard, text: "Secure Payments" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: mutedFg }}>
                    <item.icon className="w-4 h-4" style={{ color: accent }} />
                    {item.text}
                  </div>
                ))}
              </section>
            </DemoFadeIn>

            {/* ══ 3. WELCOME ══ */}
            <DemoFadeIn>
              <section className="py-20 px-8 md:px-16" style={{ background: bg }}>
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Welcome to</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase mb-6"><GoldText>{biz}</GoldText></h2>
                  <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: mutedFg }}>
                    {profile.tagline
                      ? `${profile.tagline}. We bring top-quality detailing straight to your location.`
                      : "We bring top-quality detailing, ceramic coating, and paint correction straight to your location."}
                  </p>
                </div>
              </section>
            </DemoFadeIn>

            {/* ══ 4. SERVICES ══ */}
            {services.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: secBg }}>
                <DemoFadeIn>
                  <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Our Services</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase">Our <GoldText>Services</GoldText></h2>
                  </div>
                </DemoFadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {services.slice(0, 4).map((svc, i) => (
                    <DemoFadeIn key={svc.id} delay={i * 100}>
                      <div className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer card-shine-demo transition-all duration-300 hover:shadow-2xl hover:-translate-y-1" onClick={() => handleBookService(svc)}>
                        {svc.image_url ? (
                          <img src={svc.image_url} alt={svc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full" style={{ background: cardBg }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{svc.title}</h3>
                          <p className="text-white/80 text-sm mb-4">{svc.description?.slice(0, 50)}</p>
                          <div className="flex items-center gap-2 text-sm font-bold transition-transform group-hover:translate-x-1" style={{ color: accent }}>
                            Book Now <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </DemoFadeIn>
                  ))}
                </div>
              </section>
            )}

            {/* ══ 5. PACKAGES ══ */}
            {services.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: bg }}>
                <DemoFadeIn>
                  <div className="text-center mb-12">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Detailing Packages</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-8"><GoldText>Detailing Packages</GoldText></h2>
                    <div className="flex justify-center gap-2 mb-4">
                      {([
                        { id: "sedan" as const, label: "Sedans & Coupes", Icon: Car },
                        { id: "truck" as const, label: "Trucks & SUVs", Icon: Truck },
                      ]).map(tab => (
                        <button key={tab.id} onClick={() => setVehicleTab(tab.id)} className="flex items-center gap-2 px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-all rounded-xl"
                          style={{
                            background: vehicleTab === tab.id ? accentGrad : "transparent",
                            color: vehicleTab === tab.id ? goldIconColor : mutedFg,
                            border: `2px solid ${vehicleTab === tab.id ? accent : borderClr}`,
                          }}
                        >
                          <tab.Icon className="w-4 h-4" />{tab.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs mt-2" style={{ color: mutedFg }}>* Starting Prices - Subject to Change *</p>
                  </div>
                </DemoFadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {services.map((svc, idx) => {
                    const icons = [Flame, Zap, Sparkles, Shield, Award, Car];
                    const IconComp = icons[idx % icons.length];
                    const priceMultiplier = vehicleTab === "truck" ? 1.25 : 1;
                    const displayPrice = Math.round(svc.price * priceMultiplier);

                    return (
                      <DemoFadeIn key={svc.id} delay={idx * 80}>
                        <div className="rounded-xl overflow-hidden relative card-shine-demo transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                          style={{ background: cardBg, border: `1px solid ${svc.popular ? accent : borderClr}` }}>
                          {svc.popular && (
                            <div className="absolute top-4 right-4 z-10 text-[10px] font-black uppercase px-3 py-1 rounded-full" style={{ background: accentGrad, color: goldIconColor }}>
                              TOP SELLER
                            </div>
                          )}
                          <div className="p-8">
                            <div className="w-12 h-12 rounded-xl mb-6" style={goldIconBox}>
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
                                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />{feat.trim()}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="flex gap-3">
                              <div className="flex-1 h-11 rounded-xl flex items-center justify-center text-sm font-bold uppercase tracking-wider cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]" style={svc.popular ? btnStyle() : btnStyle(true)} onClick={() => handleBookService(svc)}>
                                Book Now
                              </div>
                              {profile.phone && (
                                <a href={`tel:${profile.phone}`} className="h-11 px-5 rounded-xl flex items-center justify-center text-sm font-bold no-underline cursor-pointer" style={btnStyle(true)}>
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </DemoFadeIn>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ══ 6. ADD-ONS ══ */}
            {addOns.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: secBg }}>
                <DemoFadeIn>
                  <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Enhance Your Detail</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase"><GoldText>Add-On</GoldText> Services</h2>
                  </div>
                </DemoFadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {addOns.map((addon, i) => (
                    <DemoFadeIn key={addon.id} delay={i * 80}>
                      <div className="p-6 rounded-xl group card-shine-demo transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={goldIconBox}>
                            <Sparkles className="w-6 h-6" style={{ color: goldIconColor }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">{addon.title}</h3>
                            <p className="text-xl font-black mb-2" style={{ background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>${addon.price}</p>
                            <p className="text-sm" style={{ color: mutedFg }}>{addon.description}</p>
                          </div>
                        </div>
                      </div>
                    </DemoFadeIn>
                  ))}
                </div>
                <DemoFadeIn delay={300}>
                  <div className="text-center mt-12">
                    <div className="inline-flex h-14 px-10 rounded-xl items-center text-sm font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105" style={{ ...btnStyle(), letterSpacing: "0.1em" }} onClick={openBooking}>
                      Get a Quote
                    </div>
                  </div>
                </DemoFadeIn>
              </section>
            )}

            {/* ══ 7. WHY CHOOSE US ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: isDark ? secBg : bg }}>
              <DemoFadeIn>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Why Choose Us</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase">The <GoldText>{biz}</GoldText> Difference</h2>
                </div>
              </DemoFadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {whyFeatures.map((item, i) => (
                  <DemoFadeIn key={i} delay={i * 80}>
                    <div className="p-8 rounded-xl card-shine-demo group transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      <div className="w-14 h-14 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={goldIconBox}>
                        <item.icon className="w-7 h-7" style={{ color: goldIconColor }} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: mutedFg }}>{item.desc}</p>
                    </div>
                  </DemoFadeIn>
                ))}
              </div>
            </section>

            {/* ══ 8. GALLERY CAROUSEL ══ */}
            {photos.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: isDark ? bg : secBg }}>
                <DemoFadeIn>
                  <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Our Work</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase"><GoldText>Gallery</GoldText></h2>
                  </div>
                </DemoFadeIn>
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {photos.slice(0, 8).map(p => (
                      <div key={p.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 first:pl-0">
                        <div className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer" onClick={() => navigate("gallery")}>
                          <img src={p.url} alt={p.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: accent }}>{p.caption || "Detail"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {photos.length > 8 && (
                  <div className="text-center mt-8">
                    <span className="text-sm font-bold uppercase tracking-wider cursor-pointer transition-colors" style={{ color: accent }} onClick={() => navigate("gallery")}>View All Photos →</span>
                  </div>
                )}
              </section>
            )}

            {/* ══ 9. TESTIMONIALS ══ */}
            {testimonials.length > 0 && (
              <section className="py-20 px-8 md:px-16" style={{ background: isDark ? secBg : bg }}>
                <DemoFadeIn>
                  <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Customer Reviews</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase">What Our <GoldText>Clients</GoldText> Say</h2>
                  </div>
                </DemoFadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {testimonials.slice(0, 4).map((r, i) => (
                    <DemoFadeIn key={r.id} delay={i * 100}>
                      <div className="rounded-xl p-8 relative card-shine-demo transition-all duration-300 hover:shadow-lg" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                        <Quote className="absolute top-6 right-6 w-10 h-10" style={{ color: `${accent}30` }} />
                        <div className="flex gap-0.5 mb-4">
                          {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" style={{ color: accent }} />)}
                        </div>
                        <p className="text-base mb-6 leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)" }}>"{r.content}"</p>
                        <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${borderClr}` }}>
                          {r.photo_url && <img src={r.photo_url} alt={r.author} className="w-10 h-10 rounded-full object-cover" />}
                          <span className="font-bold">{r.author}</span>
                        </div>
                      </div>
                    </DemoFadeIn>
                  ))}
                </div>
                {testimonials.length > 4 && (
                  <div className="text-center mt-8">
                    <span className="text-sm font-bold uppercase tracking-wider cursor-pointer" style={{ color: accent }} onClick={() => navigate("reviews")}>See All Reviews →</span>
                  </div>
                )}
              </section>
            )}

            {/* ══ 10. INSTAGRAM MOCK ══ */}
            {instaPhotos.length >= 4 && (
              <section className="py-20 px-8 md:px-16" style={{ background: isDark ? bg : secBg }}>
                <DemoFadeIn>
                  <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Follow Us</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase"><GoldText>@{biz.replace(/\s+/g, "").toLowerCase()}</GoldText></h2>
                  </div>
                </DemoFadeIn>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-w-5xl mx-auto">
                  {instaPhotos.map((p, i) => (
                    <DemoFadeIn key={p.id} delay={i * 60}>
                      <div className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer">
                        <img src={p.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </DemoFadeIn>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <span className="text-sm font-bold uppercase tracking-wider cursor-pointer" style={{ color: accent }}>
                    <Instagram className="w-4 h-4 inline-block mr-1" /> Follow Us on Instagram
                  </span>
                </div>
              </section>
            )}

            {/* ══ 11. FAQ ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: isDark ? (instaPhotos.length >= 4 ? secBg : bg) : (instaPhotos.length >= 4 ? bg : secBg) }}>
              <DemoFadeIn>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Got Questions?</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase">Frequently <GoldText>Asked</GoldText> Questions</h2>
                </div>
              </DemoFadeIn>
              <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq, index) => (
                  <DemoFadeIn key={index} delay={index * 60}>
                    <div className="rounded-xl overflow-hidden transition-all duration-300" style={{ background: cardBg, border: `1px solid ${faqOpen === index ? accent : borderClr}`, boxShadow: faqOpen === index ? `0 0 0 3px ${accent}10` : "none" }}>
                      <button className="w-full px-6 py-5 flex items-center justify-between text-left" onClick={() => setFaqOpen(faqOpen === index ? null : index)}>
                        <span className="font-bold text-sm pr-4">{faq.question}</span>
                        <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform duration-300" style={{ color: accent, transform: faqOpen === index ? "rotate(180deg)" : "rotate(0)" }} />
                      </button>
                      <div style={{ maxHeight: faqOpen === index ? "200px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                        <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: mutedFg }}>{faq.answer}</div>
                      </div>
                    </div>
                  </DemoFadeIn>
                ))}
              </div>
            </section>

            {/* ══ 12. CONTACT ══ */}
            <section className="py-20 px-8 md:px-16" style={{ background: isDark ? secBg : bg }}>
              <DemoFadeIn>
                <div className="text-center mb-14">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Get In Touch</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase">Contact <GoldText>Us</GoldText></h2>
                </div>
              </DemoFadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <DemoFadeIn delay={100}>
                  <div className="space-y-4">
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md no-underline" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }}>
                        <div className="w-12 h-12 rounded-xl flex-shrink-0" style={goldIconBox}><Phone className="w-5 h-5" style={{ color: goldIconColor }} /></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: mutedFg }}>Phone</p><p className="font-bold">{profile.phone}</p></div>
                      </a>
                    )}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md no-underline" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }}>
                        <div className="w-12 h-12 rounded-xl flex-shrink-0" style={goldIconBox}><Mail className="w-5 h-5" style={{ color: goldIconColor }} /></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: mutedFg }}>Email</p><p className="font-bold">{profile.email}</p></div>
                      </a>
                    )}
                    {!profile.no_business_address && profile.address && (
                      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                        <div className="w-12 h-12 rounded-xl flex-shrink-0" style={goldIconBox}><MapPin className="w-5 h-5" style={{ color: goldIconColor }} /></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: mutedFg }}>Location</p><p className="font-bold">{profile.address}</p></div>
                      </div>
                    )}
                    {sortedHours.length > 0 && (
                      <div className="p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: mutedFg }}>Business Hours</p>
                        <div className="space-y-1.5 text-sm">
                          {sortedHours.map(h => (
                            <div key={h.day_of_week} className="flex justify-between">
                              <span>{DAYS[h.day_of_week]}</span>
                              <span className="font-medium" style={{ color: h.is_closed ? "#ef4444" : fg }}>
                                {h.is_closed ? "Closed" : `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DemoFadeIn>

                <DemoFadeIn delay={200}>
                  <div className="p-8 rounded-xl" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Your Name" readOnly className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                        <input type="email" placeholder="Email" readOnly className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                      </div>
                      <input type="tel" placeholder="Phone Number" readOnly className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                      <textarea placeholder="Your Message" readOnly rows={4} className="w-full px-4 py-3 rounded-xl text-sm resize-none" style={{ background: secBg, border: `1px solid ${borderClr}`, color: fg }} />
                      <div className="h-12 rounded-xl flex items-center justify-center text-sm font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-[1.02]" style={{ ...btnStyle(), letterSpacing: "0.1em" }}>
                        Send Message
                      </div>
                    </div>
                  </div>
                </DemoFadeIn>
              </div>
            </section>

            {/* ══ 13. CTA BANNER ══ */}
            <DemoFadeIn>
              <section className="py-20 px-8 md:px-16 text-center relative overflow-hidden" style={{ background: isDark ? bg : secBg }}>
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute top-0 left-0 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: accentGrad }} />
                  <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full translate-x-1/2 translate-y-1/2" style={{ background: accentGrad }} />
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>Ready to Transform Your Vehicle?</p>
                  <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Book Your <GoldText>{biz}</GoldText> Detail Today</h2>
                  <p className="text-base max-w-lg mx-auto mb-8" style={{ color: mutedFg }}>
                    Experience the difference professional detailing makes. Your car deserves the best.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <div className="h-14 px-10 rounded-xl flex items-center text-sm font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105" style={{ ...btnStyle(), letterSpacing: "0.1em", boxShadow: `0 8px 24px ${accent}30` }} onClick={openBooking}>
                      <Calendar className="w-4 h-4 mr-2" /> Book Now
                    </div>
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`} className="h-14 px-10 rounded-xl flex items-center text-sm font-bold uppercase tracking-wider no-underline cursor-pointer transition-all hover:scale-105" style={{ ...btnStyle(true), letterSpacing: "0.1em" }}>
                        <Phone className="w-4 h-4 mr-2" /> Call {profile.phone}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            </DemoFadeIn>
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
              {photos.map((p, i) => (
                <DemoFadeIn key={p.id} delay={i * 50}>
                  <div className="rounded-xl overflow-hidden aspect-square group relative">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">{p.caption}</span>
                      </div>
                    )}
                  </div>
                </DemoFadeIn>
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
              {testimonials.map((r, i) => (
                <DemoFadeIn key={r.id} delay={i * 60}>
                  <div className="rounded-xl p-5 relative" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <Quote className="absolute top-4 right-4 w-8 h-8" style={{ color: `${accent}20` }} />
                    <div className="flex items-center gap-3 mb-2">
                      {r.photo_url && <img src={r.photo_url} alt={r.author} className="w-10 h-10 rounded-full object-cover" />}
                      <div>
                        <span className="text-sm font-bold">{r.author}</span>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" style={{ color: accent }} />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>"{r.content}"</p>
                  </div>
                </DemoFadeIn>
              ))}
              {testimonials.length === 0 && <p className="text-center text-sm" style={{ color: mutedFg }}>No reviews yet.</p>}
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
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
                  <a href={`https://instagram.com/${profile.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: secBg }}>
                    <Instagram className="w-4 h-4" style={{ color: mutedFg }} />
                  </a>
                )}
                {profile.facebook && (
                  <a href={`https://facebook.com/${profile.facebook.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: secBg }}>
                    <Facebook className="w-4 h-4" style={{ color: mutedFg }} />
                  </a>
                )}
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["Insured", "Licensed", "Eco-Friendly"].map(badge => (
                  <span key={badge} className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ background: secBg, color: mutedFg }}>{badge}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3" style={{ color: accent }}>Quick Links</h4>
              <div className="space-y-2 text-sm" style={{ color: mutedFg }}>
                <div className="cursor-pointer hover:underline" onClick={() => navigate("home")}>Home</div>
                <div className="cursor-pointer hover:underline" onClick={() => navigate("gallery")}>Gallery</div>
                <div className="cursor-pointer hover:underline" onClick={() => navigate("reviews")}>Reviews</div>
                <div className="cursor-pointer hover:underline" onClick={openBooking}>Book Now</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3" style={{ color: accent }}>Contact</h4>
              <div className="space-y-2 text-sm" style={{ color: mutedFg }}>
                {profile.phone && <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:underline"><Phone className="w-3.5 h-3.5" /> {profile.phone}</a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:underline"><Mail className="w-3.5 h-3.5" /> {profile.email}</a>}
                {!profile.no_business_address && profile.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {profile.address}</div>}
              </div>
            </div>
          </div>

          {!profile.no_business_address && profile.map_query && (
            <div className="mt-8 rounded-xl overflow-hidden border" style={{ borderColor: borderClr }}>
              <iframe title="Business Location" width="100%" height="200" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${profile.map_query}&output=embed`} />
            </div>
          )}

          <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: `1px solid ${borderClr}`, color: mutedFg }}>
            © {new Date().getFullYear()} {biz}. All rights reserved. Powered by <span style={{ color: accent }}>Darker</span>
          </div>
        </footer>
      </div>

      {/* Floating Elements */}
      <DemoFloatingElements
        accent={accent}
        accentGrad={accentGrad}
        isDark={isDark}
        onBookNow={openBooking}
        scrollContainer={scrollRef.current}
      />

      {/* Booking Modal */}
      <DemoBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        services={services}
        addOns={addOns}
        hours={hours}
        accent={accent}
        accentGrad={accentGrad}
        isDark={isDark}
        preSelectedService={bookingPreselect}
      />
    </div>
  );
};

export default DemoWebsite;
