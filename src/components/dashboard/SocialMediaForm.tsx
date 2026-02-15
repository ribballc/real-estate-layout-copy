import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const fields = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourbusiness" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourbusiness" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourbusiness" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourbusiness" },
  { key: "google_business", label: "Google Business", placeholder: "https://g.page/yourbusiness" },
] as const;

const SocialMediaForm = ({ embedded = false }: { embedded?: boolean }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("instagram, facebook, tiktok, youtube, google_business").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setForm(data as Record<string, string>);
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!", description: "Social links updated." });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className={embedded ? "" : "max-w-2xl"}>
      {!embedded && <h2 className="text-2xl font-bold text-white mb-6">Social Media</h2>}
      <div className="space-y-5">
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label className="text-white/70 text-sm">{f.label}</Label>
            <Input
              value={form[f.key] || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
            />
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
