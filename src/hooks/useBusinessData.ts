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
  error: string | null;
}

export function useBusinessData(userId: string | null): BusinessData {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [testimonials, setTestimonials] = useState<BusinessTestimonial[]>([]);
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [addOns, setAddOns] = useState<BusinessAddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchBusinessData(userId, setProfile, setServices, setHours, setTestimonials, setPhotos, setAddOns, setLoading, setError);
  }, [userId]);

  return { profile, services, hours, testimonials, photos, addOns, loading, error };
}

export function useBusinessDataBySlug(slug: string | null): BusinessData {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [testimonials, setTestimonials] = useState<BusinessTestimonial[]>([]);
  const [photos, setPhotos] = useState<BusinessPhoto[]>([]);
  const [addOns, setAddOns] = useState<BusinessAddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setError(null);

    const resolve = async () => {
      try {
        const { data, error: profileErr } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("slug", slug)
          .single();

        if (profileErr || !data?.user_id) {
          setError("Business not found");
          setLoading(false);
          return;
        }
        fetchBusinessData(data.user_id, setProfile, setServices, setHours, setTestimonials, setPhotos, setAddOns, setLoading, setError);
      } catch (e) {
        setError("Something went wrong");
        setLoading(false);
      }
    };
    resolve();
  }, [slug]);

  return { profile, services, hours, testimonials, photos, addOns, loading, error };
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
  setError: (v: string | null) => void,
) {
  const fetchData = async () => {
    try {
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

      if (hoursRes.data && hoursRes.data.length > 0) {
        const formatted = hoursRes.data.map((h: { day_of_week: number; is_closed: boolean; open_time: string; close_time: string }) => {
          const dayName = DAYS[h.day_of_week] ?? `Day ${h.day_of_week}`;
          if (h.is_closed) return { day: dayName, time: "Closed" };
          const fmt = (t: string) => {
            const [hh] = t.split(":");
            const hour = parseInt(hh || "0");
            const ampm = hour >= 12 ? "PM" : "AM";
            const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${h12}:${(t.split(":")[1] || "00")} ${ampm}`;
          };
          return { day: dayName, time: `${fmt(h.open_time)} – ${fmt(h.close_time)}` };
        });
        setHours(formatted);
      } else {
        setHours(DAYS.map((d) => ({ day: d, time: d === "Sunday" ? "Closed" : "9:00 AM – 5:00 PM" })));
      }
    } catch {
      setError("Failed to load. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}
