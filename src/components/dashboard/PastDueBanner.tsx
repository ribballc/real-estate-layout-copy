import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PastDueBannerProps {
  isDark: boolean;
}

const PastDueBanner = ({ isDark }: PastDueBannerProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const openPortal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast({
        title: "Error",
        description: "Could not open billing portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full px-4 py-3 flex items-center justify-between gap-3 text-sm shrink-0"
      style={{
        background: "hsl(0, 72%, 51%)",
        color: "white",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span className="font-medium truncate">
          Payment failed. Update your billing to keep your site live.
        </span>
      </div>
      <button
        onClick={openPortal}
        disabled={loading}
        className="shrink-0 text-sm font-semibold px-3 py-1 rounded-md transition-colors whitespace-nowrap"
        style={{
          background: "hsla(0,0%,100%,0.2)",
        }}
      >
        {loading ? "Loading..." : "Update Payment →"}
      </button>
    </div>
  );
};

export default PastDueBanner;
