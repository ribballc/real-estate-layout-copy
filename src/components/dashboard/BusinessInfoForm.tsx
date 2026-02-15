import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const BusinessInfoForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "", tagline: "", email: "", phone: "", address: "", map_query: "",
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setForm({
          business_name: data.business_name || "",
          tagline: data.tagline || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          map_query: data.map_query || "",
        });
        setLogoUrl(data.logo_url);
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Error saving", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!", description: "Business info updated." });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
    await supabase.from("profiles").update({ logo_url: publicUrl }).eq("user_id", user.id);
    setLogoUrl(publicUrl);
    toast({ title: "Logo uploaded!" });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div className="space-y-2">
      <Label className="text-white/70 text-sm">{label}</Label>
      <Input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
      />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Business Info</h2>
      <div className="space-y-5">
        {/* Logo */}
        <div className="space-y-2">
          <Label className="text-white/70 text-sm">Logo</Label>
          <div className="flex items-center gap-4">
            {logoUrl && <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-white/10" />}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {field("Business Name", "business_name", "text", "Your Business Name")}
        <div className="space-y-2">
          <Label className="text-white/70 text-sm">Tagline</Label>
          <Textarea
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="A short description of your business"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"
          />
        </div>
        {field("Email", "email", "email", "contact@business.com")}
        {field("Phone", "phone", "tel", "(555) 123-4567")}
        {field("Address", "address", "text", "123 Main St, City, State")}
        {field("Map Query", "map_query", "text", "Your+Business+Name+City")}

        <Button onClick={handleSave} disabled={saving} className="h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default BusinessInfoForm;
