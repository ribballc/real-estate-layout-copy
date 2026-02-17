import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface BusinessProfile {
  business_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  map_query: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  google_business: string;
}

export interface BusinessService {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
  image_url: string | null;
  sort_order: number;
}

export interface BusinessHour {
  day: string;
  time: string;
}

export interface BusinessTestimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  photo_url: string | null;
}

export interface BusinessPhoto {
  id: string;
  url: string;
  caption: string;
  sort_order: number;
}

export interface BusinessAddOn {
  id: string;
  service_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
}

export interface BusinessData {
  profile: BusinessProfile | null;
  services: BusinessService[];
  hours: BusinessHour[];
  testimonials: BusinessTestimonial[];
  photos: BusinessPhoto[];
  addOns: BusinessAddOn[];
  loading: boolean;
}

export function useBusinessData(userId: string | null): BusinessData {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [testimonials, setTestimonials] = useState<BusinessTestimonial[]>([]);
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [addOns, setAddOns] = useState<BusinessAddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchBusinessData(userId, setProfile, setServices, setHours, setTestimonials, setPhotos, setAddOns, setLoading);
  }, [userId]);

  return { profile, services, hours, testimonials, photos, addOns, loading };
}

export function useBusinessDataBySlug(slug: string | null): BusinessData {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [testimonials, setTestimonials] = useState<BusinessTestimonial[]>([]);
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [addOns, setAddOns] = useState<BusinessAddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    const resolve = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("slug", slug)
        .single();

      if (!data?.user_id) { setLoading(false); return; }
      fetchBusinessData(data.user_id, setProfile, setServices, setHours, setTestimonials, setPhotos, setAddOns, setLoading);
    };
    resolve();
  }, [slug]);

  return { profile, services, hours, testimonials, photos, addOns, loading };
}

function fetchBusinessData(
  userId: string,
  setProfile: (v: BusinessProfile | null) => void,
  setServices: (v: BusinessService[]) => void,
  setHours: (v: BusinessHour[]) => void,
  setTestimonials: (v: BusinessTestimonial[]) => void,
  setPhotos: (v: BusinessPhoto[]) => void,
  setAddOns: (v: BusinessAddOn[]) => void,
  setLoading: (v: boolean) => void,
) {
  const fetchData = async () => {
    const [profileRes, servicesRes, hoursRes, testimonialsRes, photosRes, addOnsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).single(),
      supabase.from("services").select("*").eq("user_id", userId).order("sort_order"),
      supabase.from("business_hours").select("*").eq("user_id", userId).order("day_of_week"),
      supabase.from("testimonials").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("photos").select("*").eq("user_id", userId).order("sort_order"),
      supabase.from("add_ons").select("*").eq("user_id", userId).order("sort_order"),
    ]);

    if (profileRes.data) setProfile(profileRes.data as unknown as BusinessProfile);
    if (servicesRes.data) setServices(servicesRes.data as unknown as BusinessService[]);
    if (testimonialsRes.data) setTestimonials(testimonialsRes.data as unknown as BusinessTestimonial[]);
    if (photosRes.data) setPhotos(photosRes.data as unknown as BusinessPhoto[]);
    if (addOnsRes.data) setAddOns(addOnsRes.data as unknown as BusinessAddOn[]);

    // Transform hours
    if (hoursRes.data && hoursRes.data.length > 0) {
      const formatted = hoursRes.data.map((h: any) => {
        const dayName = DAYS[h.day_of_week] ?? `Day ${h.day_of_week}`;
        if (h.is_closed) return { day: dayName, time: "Closed" };
        const fmt = (t: string) => {
          const [hh, mm] = t.split(":");
          const hour = parseInt(hh);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${h12}:${mm} ${ampm}`;
        };
        return { day: dayName, time: `${fmt(h.open_time)} – ${fmt(h.close_time)}` };
      });
      setHours(formatted);
    } else {
      setHours(DAYS.map((d) => ({ day: d, time: d === "Sunday" ? "Closed" : "9:00 AM – 5:00 PM" })));
    }

    setLoading(false);
  };

  fetchData();
}
