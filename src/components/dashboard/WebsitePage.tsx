import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, Pencil, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const WebsitePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("slug")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setSlug(data?.slug ?? null);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const siteUrl = slug
    ? `${window.location.origin}/site/${slug}`
    : null;

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => navigate("/dashboard/business")}
          className="gap-2 bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)] text-white"
        >
          <Pencil className="w-4 h-4" />
          Make Changes
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-border bg-card text-foreground hover:bg-muted"
          asChild
        >
          <a href="mailto:info@darkerdigital.com">
            <Mail className="w-4 h-4" />
            Request Changes
          </a>
        </Button>
      </div>

      {/* Website embed */}
      {siteUrl ? (
        <div
          className="rounded-2xl overflow-hidden border border-border relative"
          style={{ boxShadow: "0 0 40px rgba(0,0,0,0.08)" }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[hsl(0,80%,60%)]" />
              <div className="w-3 h-3 rounded-full bg-[hsl(40,90%,55%)]" />
              <div className="w-3 h-3 rounded-full bg-[hsl(140,60%,45%)]" />
            </div>
            <div className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-mono bg-muted/50 text-muted-foreground">
              <Globe className="w-3 h-3 mr-2 text-primary" />
              {slug}.darkerdigital.com
            </div>
          </div>

          <iframe
            src={siteUrl}
            title="Your Website"
            className="w-full border-0"
            style={{ height: "80vh" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-border p-12 text-center space-y-3">
          <Globe className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            Complete your business info to generate your website.
          </p>
          <Button onClick={() => navigate("/dashboard/business")} size="sm">
            Set Up Business Info
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebsitePage;
