import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FeatureFlag {
  flag_name: string;
  enabled_globally: boolean;
  enabled_for_user_ids: string[];
  description: string;
}

export function useFeatureFlag(flagName: string): { enabled: boolean; loading: boolean } {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("enabled_globally, enabled_for_user_ids")
        .eq("flag_name", flagName)
        .maybeSingle();

      if (error || !data) {
        setEnabled(false);
      } else {
        const globally = data.enabled_globally === true;
        const forUser = user ? (data.enabled_for_user_ids as string[])?.includes(user.id) : false;
        setEnabled(globally || forUser);
      }
      setLoading(false);
    };
    check();
  }, [flagName, user]);

  return { enabled, loading };
}

export function useAllFeatureFlags(): { flags: FeatureFlag[]; loading: boolean } {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("feature_flags")
      .select("flag_name, enabled_globally, enabled_for_user_ids, description")
      .order("flag_name")
      .then(({ data }) => {
        setFlags((data as FeatureFlag[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { flags, loading };
}
