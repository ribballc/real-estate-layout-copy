import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Globe } from "lucide-react";

const DemoWebsite = () => {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("business_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.business_name) setBusinessName(data.business_name);
        setLoading(false);
      });
  }, [user]);

  if (loading) return null;

  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="rounded-2xl overflow-hidden border border-border relative" style={{ boxShadow: "0 0 40px rgba(0,0,0,0.08)" }}>
      {/* DEMO badge - large red */}
      <div
        className="absolute top-14 right-3 z-30 text-sm font-black uppercase px-4 py-2 rounded-lg"
        style={{
          background: "hsl(0 84% 60%)",
          color: "#fff",
          letterSpacing: "0.15em",
          boxShadow: "0 4px 12px hsla(0, 84%, 60%, 0.4)",
        }}
      >
        DEMO
      </div>

      {/* Browser bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[hsl(0,80%,60%)]" />
          <div className="w-3 h-3 rounded-full bg-[hsl(40,90%,55%)]" />
          <div className="w-3 h-3 rounded-full bg-[hsl(140,60%,45%)]" />
        </div>
        <div className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-mono bg-muted/50 text-muted-foreground">
          <Globe className="w-3 h-3 mr-2 text-primary" />
          {slug || "yourbusiness"}.darkerdigital.com
        </div>
      </div>

      {/* Iframe embed */}
      <iframe
        src="https://deluxe-shine-clone.lovable.app"
        title="Demo Website Preview"
        className="w-full border-0"
        style={{ height: "80vh" }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};

export default DemoWebsite;
