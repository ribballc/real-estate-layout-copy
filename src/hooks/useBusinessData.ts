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

export interface BusinessData {
  profile: BusinessProfile | null;
  services: BusinessService[];
  hours: BusinessHour[];
  loading: boolean;
}

export function useBusinessData(userId: string | null): BusinessData {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<BusinessService[]>([]);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const [profileRes, servicesRes, hoursRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("services").select("*").eq("user_id", userId).order("sort_order"),
        supabase.from("business_hours").select("*").eq("user_id", userId).order("day_of_week"),
      ]);

      if (profileRes.data) setProfile(profileRes.data as unknown as BusinessProfile);
      if (servicesRes.data) setServices(servicesRes.data as unknown as BusinessService[]);

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

    fetch();
  }, [userId]);

  return { profile, services, hours, loading };
}
