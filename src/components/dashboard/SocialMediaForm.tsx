import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TOAST } from "@/lib/toast-messages";
import { Loader2 } from "lucide-react";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

const fields = [
  { key: "instagram", label: "Instagram", prefix: "@", baseUrl: "https://instagram.com/", placeholder: "yourbusiness" },
  { key: "facebook", label: "Facebook", prefix: "@", baseUrl: "https://facebook.com/", placeholder: "yourbusiness" },
  { key: "tiktok", label: "TikTok", prefix: "@", baseUrl: "https://tiktok.com/@", placeholder: "yourbusiness" },
  { key: "youtube", label: "YouTube", prefix: "@", baseUrl: "https://youtube.com/@", placeholder: "yourbusiness" },
  { key: "google_business", label: "Google Business", prefix: "", baseUrl: "", placeholder: "https://g.page/yourbusiness" },
] as const;

// Extract handle from a full URL or return as-is
const extractHandle = (value: string, baseUrl: string): string => {
  if (!value) return "";
  if (!baseUrl) return value; // Google Business stays as full URL
  // Remove common URL patterns to get just the handle
  let handle = value;
  handle = handle.replace(/^https?:\/\/(www\.)?/, "");
  handle = handle.replace(/^(instagram\.com|facebook\.com|tiktok\.com|youtube\.com)\/?@?/, "");
  handle = handle.replace(/^\/+/, "");
  handle = handle.replace(/\/$/, "");
  return handle;
};

// Build full URL from handle
const buildUrl = (handle: string, baseUrl: string): string => {
  if (!handle) return "";
  if (!baseUrl) return handle; // Google Business is already a URL
  return `${baseUrl}${handle}`;
};

const SocialMediaForm = ({ embedded = false }: { embedded?: boolean }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [handles, setHandles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("instagram, facebook, tiktok, youtube, google_business").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        // Convert stored URLs to handles for display
        const h: Record<string, string> = {};
        fields.forEach(f => {
          h[f.key] = extractHandle((data as any)[f.key] || "", f.baseUrl);
        });
        setHandles(h);
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    // Convert handles back to full URLs for storage
    const form: Record<string, string> = {};
    fields.forEach(f => {
      form[f.key] = buildUrl(handles[f.key] || "", f.baseUrl);
    });
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    setSaving(false);
    if (error) toast(TOAST.GENERIC_ERROR);
    else toast(TOAST.SOCIAL_SAVED);
  };

  if (loading) return <FormSkeleton rows={4} />;

  return (
    <div className={embedded ? "" : "max-w-2xl"}>
      {!embedded && <h2 className="text-2xl font-bold text-white mb-6">Social Media</h2>}
      <div className="space-y-5">
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label className="text-white/70 text-sm">{f.label}</Label>
            <div className="relative">
              {f.prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium select-none">
                  {f.prefix}
                </span>
              )}
              <Input
                value={handles[f.key] || ""}
                onChange={(e) => setHandles({ ...handles, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className={`h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent ${f.prefix ? "pl-8" : ""}`}
              />
            </div>
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving} className="h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaForm;
