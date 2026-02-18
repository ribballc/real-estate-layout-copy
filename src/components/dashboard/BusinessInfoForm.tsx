import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Plus, Palette, ChevronDown, Share2 } from "lucide-react";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import HoursManager from "./HoursManager";
import SocialMediaForm from "./SocialMediaForm";
import AddressAutocomplete from "./AddressAutocomplete";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ACCENT_COLORS = [
  "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#EF4444",
  "#F97316", "#EAB308", "#22C55E", "#14B8A6", "#06B6D4",
];

const BusinessInfoForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "", tagline: "", email: "", phone: "", address: "", map_query: "",
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [noBusinessAddress, setNoBusinessAddress] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [showLogoUpsell, setShowLogoUpsell] = useState(false);

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
        setNoBusinessAddress((data as any).no_business_address ?? false);
        setServiceAreas((data as any).service_areas ?? []);
        setPrimaryColor((data as any).primary_color || "#3B82F6");
        setThemeMode((data as any).secondary_color === "#FFFFFF" ? "light" : "dark");
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const updateData: any = {
      ...form,
      no_business_address: noBusinessAddress,
      service_areas: serviceAreas,
      primary_color: primaryColor,
      secondary_color: themeMode === "light" ? "#FFFFFF" : "#1E3A5F",
    };
    if (noBusinessAddress) {
      updateData.address = "";
      updateData.map_query = "";
    }
    const { error } = await supabase.from("profiles").update(updateData).eq("user_id", user.id);
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

  const addServiceArea = (city: string) => {
    const trimmed = city.trim();
    if (trimmed && !serviceAreas.includes(trimmed)) setServiceAreas([...serviceAreas, trimmed]);
    setCitySearch("");
  };

  const removeServiceArea = (city: string) => setServiceAreas(serviceAreas.filter(a => a !== city));

  if (loading) return <FormSkeleton rows={6} />;

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-white/75">{label}</Label>
      <Input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent" />
    </div>
  );

  const AccentPicker = () => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-white/75">Accent Color</Label>
      <div className="flex items-center gap-3 flex-wrap">
        {ACCENT_COLORS.map(c => (
          <button
            key={c}
            onClick={() => setPrimaryColor(c)}
            className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${primaryColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-[hsl(215,50%,10%)] scale-110" : "ring-1 ring-white/10"}`}
            style={{ background: c }}
          />
        ))}
        <label className="relative cursor-pointer">
          <div className="w-8 h-8 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center hover:border-white/40 transition-colors" style={{ background: primaryColor }}>
            <Plus className="w-3 h-3 text-white/60" />
          </div>
          <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md border border-white/10" style={{ background: primaryColor }} />
        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-8 w-28 bg-white/5 border-white/10 text-white text-xs font-mono focus-visible:ring-accent" />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="dash-page-title text-white mb-1">Business Info</h2>
      <p className="text-white/40 text-sm mb-6">Manage your business details and branding</p>
      <div className="space-y-5">
        {/* Logo */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/75">Logo</Label>
          <div className="flex items-center gap-4">
            {logoUrl && <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-white/10" />}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Upload className="w-4 h-4" /> Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <button
              onClick={() => setShowLogoUpsell(true)}
              className="text-sm text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
            >
              Need A Logo?
            </button>
          </div>
        </div>

        {field("Business Name", "business_name", "text", "Your Business Name")}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/75">Tagline</Label>
          <Textarea value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="A short description of your business" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent min-h-[80px]" />
        </div>
        {field("Email", "email", "email", "contact@business.com")}
        {field("Phone", "phone", "tel", "(555) 123-4567")}

        {/* Brand Colors & Theme */}
        <div className="rounded-[14px] border border-white/10 bg-white/5 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <div>
              <Label className="text-white text-sm font-medium">Website Appearance</Label>
              <p className="text-white/40 text-xs mt-0.5">Customize your public booking website</p>
            </div>
          </div>

          {/* Theme Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white/75">Theme Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className={`rounded-[14px] border p-4 text-left transition-all ${themeMode === mode ? "border-accent bg-accent/10 ring-1 ring-accent/30" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
                >
                  <div className={`w-full h-16 rounded-lg mb-3 border ${mode === "light" ? "bg-white border-gray-200" : "bg-[hsl(215,50%,10%)] border-white/10"}`}>
                    <div className="p-2 flex gap-1.5">
                      <div className="w-6 h-1.5 rounded-full" style={{ background: primaryColor }} />
                      <div className={`w-4 h-1.5 rounded-full ${mode === "light" ? "bg-gray-300" : "bg-white/20"}`} />
                    </div>
                  </div>
                  <span className={`text-sm font-medium capitalize ${themeMode === mode ? "text-accent" : "text-white/60"}`}>{mode} Mode</span>
                </button>
              ))}
            </div>
          </div>

          <AccentPicker />

          {/* Live preview */}
          <div className="mt-3">
            <Label className="text-white/50 text-xs mb-2 block">Preview</Label>
            <div className={`rounded-lg p-4 flex items-center gap-3 border ${themeMode === "light" ? "bg-white border-gray-200" : "bg-[hsl(215,50%,10%)] border-white/10"}`}>
              <div className="h-8 px-4 rounded-md flex items-center text-sm font-medium text-white" style={{ background: primaryColor }}>
                Book Now
              </div>
              <span className="text-sm" style={{ color: primaryColor }}>Your Link</span>
              <div className="ml-auto w-3 h-3 rounded-full" style={{ background: primaryColor }} />
            </div>
          </div>
        </div>

        {/* No Business Address Toggle */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white text-sm font-medium">No Business Address</Label>
              <p className="text-white/40 text-xs mt-0.5">Enable if you're a mobile-only business</p>
            </div>
            <Switch checked={noBusinessAddress} onCheckedChange={setNoBusinessAddress} />
          </div>
        </div>

        {!noBusinessAddress && (
          <>
            <div className="space-y-2">
              <Label className="text-white/70 text-sm">Address</Label>
              <AddressAutocomplete
                value={form.address}
                onChange={(val) => setForm({ ...form, address: val, map_query: val.replace(/\s+/g, "+") })}
                placeholder="Start typing your address..."
                type="address"
              />
            </div>
          </>
        )}

        {/* Service Areas */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <Label className="text-white text-sm font-medium">Service Areas</Label>
          <p className="text-white/40 text-xs">Search and select all cities you serve</p>
          {serviceAreas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map(area => (
                <span key={area} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/15 text-accent border border-accent/20">
                  {area}
                  <button onClick={() => removeServiceArea(area)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
          <AddressAutocomplete
            value={citySearch}
            onChange={(val) => {
              setCitySearch(val);
              // Auto-add if user selects from dropdown (the value will be a formatted city)
              if (val.includes(",") && val.length > 3) {
                addServiceArea(val);
                setCitySearch("");
              }
            }}
            placeholder="Search for a city or town..."
            type="city"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="h-11" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving…</> : "Save Changes"}
        </Button>
      </div>

      {/* Social Media section */}
      <div id="social" className="mt-10 pt-8 border-t border-white/10">
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">Social Media</h3>
                <p className="text-white/40 text-xs">Connect your social profiles</p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-white/30 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-6">
            <SocialMediaForm embedded />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Hours section */}
      <div id="hours" className="mt-10 pt-8 border-white/10">
        <HoursManager />
      </div>

      {/* Logo Upsell Modal */}
      {showLogoUpsell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm dash-card p-6 space-y-5" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Custom Logo Design</h3>
              <button onClick={() => setShowLogoUpsell(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <p className="text-white/60 text-sm leading-relaxed">
                Get a professionally designed logo that matches your brand. Our designers will create a custom logo tailored to your detailing business.
              </p>
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">$50</div>
                <div className="text-accent text-sm font-medium">One-time payment</div>
              </div>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Custom designed for your brand
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Multiple format files (PNG, SVG)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 2 revision rounds included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Delivered in 3-5 business days
                </li>
              </ul>
            </div>
            <Button
              className="w-full h-12 text-base font-semibold"
              style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}
              onClick={() => {
                toast({ title: "Coming soon!", description: "Logo design service will be available shortly." });
                setShowLogoUpsell(false);
              }}
            >
              Get My Custom Logo — $50
            </Button>
            <p className="text-white/30 text-xs text-center">Secure payment · Satisfaction guaranteed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessInfoForm;
