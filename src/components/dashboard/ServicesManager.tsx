import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  Trash2,
  Star,
  ChevronDown,
  X,
  ImageIcon,
  Settings2,
  Camera,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ServiceOptionsManager from "./ServiceOptionsManager";
import AddOnsManager from "./AddOnsManager";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
  sort_order: number;
  image_url: string | null;
}

const PRESET_SERVICES = [
  { title: "Full Detail", description: "Complete interior and exterior detailing service" },
  { title: "Paint Protection Film", description: "Clear bra/PPF installation to protect your paint" },
  { title: "Window Tint", description: "Professional window tinting for heat and UV protection" },
  { title: "Interior Detail", description: "Deep clean and condition all interior surfaces" },
  { title: "Exterior Detailing", description: "Full exterior wash, clay bar, polish and wax" },
  { title: "Vinyl Wrap", description: "Custom vinyl wrap for color change or protection" },
  { title: "Ceramic Coating", description: "Long-lasting ceramic coating for paint protection and shine" },
];

const ServicesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [optionsServiceId, setOptionsServiceId] = useState<string | null>(null);
  const [optionsServiceName, setOptionsServiceName] = useState("");
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [showManualMenu, setShowManualMenu] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanPreview, setScanPreview] = useState<string | null>(null);

  const fetchServices = async () => {
    if (!user) return;
    const { data } = await supabase.from("services").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setServices(data as Service[]);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, [user]);

  const addPresetService = async (preset: { title: string; description: string }) => {
    if (!user) return;
    const { error } = await supabase.from("services").insert({
      user_id: user.id, title: preset.title, description: preset.description, sort_order: services.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchServices();
    setShowAddMenu(false);
  };

  const addCustomService = async () => {
    if (!user || !customTitle.trim()) return;
    const { error } = await supabase.from("services").insert({
      user_id: user.id, title: customTitle.trim(), sort_order: services.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setCustomTitle(""); setShowCustomInput(false); fetchServices(); }
    setShowAddMenu(false);
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const { error } = await supabase.from("services").update(updates).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Photo scan handler
  const handlePhotoScan = async (file: File) => {
    if (!user) return;
    setScanning(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setScanPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      // Upload to storage first
      const path = `${user.id}/scans/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("user-photos").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("user-photos").getPublicUrl(path);

      // Call AI edge function
      const { data: session } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-price-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Failed (${resp.status})`);
      }

      const result = await resp.json();
      const extracted = result.services || [];

      if (extracted.length === 0) {
        toast({ title: "No services found", description: "Couldn't identify services in this image. Try a clearer photo.", variant: "destructive" });
        setScanning(false);
        return;
      }

      // Create services + their options
      let created = 0;
      for (const svc of extracted) {
        const { data: newService, error: svcErr } = await supabase.from("services").insert({
          user_id: user.id,
          title: svc.title,
          description: svc.description || "",
          price: svc.base_price || 0,
          sort_order: services.length + created,
        }).select().single();

        if (svcErr || !newService) continue;
        created++;

        // Add options if present
        if (svc.options && svc.options.length > 0) {
          const { data: group } = await supabase.from("service_option_groups").insert({
            service_id: newService.id,
            user_id: user.id,
            title: "Package Level",
            option_type: "radio",
            sort_order: 0,
          }).select().single();

          if (group) {
            const items = svc.options.map((opt: any, i: number) => ({
              group_id: group.id,
              user_id: user.id,
              label: opt.label,
              description: opt.description || "",
              price_modifier: opt.price || 0,
              sort_order: i,
            }));
            await supabase.from("service_option_items").insert(items);
          }
        }
      }

      toast({ title: "Services imported!", description: `Added ${created} service${created !== 1 ? "s" : ""} from your photo.` });
      fetchServices();
      setShowScanDialog(false);
      setScanPreview(null);
    } catch (err: any) {
      console.error("Scan error:", err);
      toast({ title: "Scan failed", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  const existingTitles = new Set(services.map(s => s.title.toLowerCase()));
  const availablePresets = PRESET_SERVICES.filter(p => !existingTitles.has(p.title.toLowerCase()));

  if (optionsServiceId) {
    const svc = services.find((s) => s.id === optionsServiceId);
    return (
      <div className="max-w-2xl">
        <ServiceOptionsManager
          serviceId={optionsServiceId}
          serviceName={svc?.title || optionsServiceName}
          onClose={() => setOptionsServiceId(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Services</h2>
        <div className="relative">
          <Button onClick={() => setShowAddMenu(!showAddMenu)} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add Service <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setShowAddMenu(false); setShowCustomInput(false); setShowManualMenu(false); }} />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border shadow-xl z-50 py-2 overflow-hidden bg-popover">
                {!showManualMenu ? (
                  <>
                    <button
                      onClick={() => setShowManualMenu(true)}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2.5"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" /> Add Manually
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); setShowScanDialog(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" /> Magic Upload
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setShowManualMenu(false)} className="w-full text-left px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                      <ChevronDown className="w-3 h-3 rotate-90" /> Back
                    </button>
                    <div className="border-t border-border my-1" />
                    {availablePresets.map((preset) => (
                      <button
                        key={preset.title}
                        onClick={() => addPresetService(preset)}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors"
                      >
                        {preset.title}
                      </button>
                    ))}
                    {availablePresets.length > 0 && <div className="border-t border-border my-1" />}
                    {!showCustomInput ? (
                      <button
                        onClick={() => setShowCustomInput(true)}
                        className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-accent/10 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" /> Custom Service
                      </button>
                    ) : (
                      <div className="px-3 py-2 flex gap-2">
                        <Input
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomService()}
                          placeholder="Service name…"
                          className="h-8 text-foreground text-sm"
                          autoFocus
                        />
                        <Button onClick={addCustomService} size="sm" className="h-8 px-3 shrink-0" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
                          Add
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Photo Scan Dialog */}
      <Dialog open={showScanDialog} onOpenChange={(o) => { setShowScanDialog(o); if (!o) { setScanPreview(null); setScanning(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Scan Your Price List
            </DialogTitle>
            <DialogDescription>
              Upload or take a photo of your price list, menu, or flyer. We'll automatically extract your services, packages, and pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {scanning ? (
              <div className="flex flex-col items-center gap-4 py-8">
                {scanPreview && (
                  <img src={scanPreview} alt="Scanning" className="w-32 h-32 object-cover rounded-xl opacity-60" />
                )}
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing your price list…</p>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 border-2 border-dashed border-border rounded-xl p-10 cursor-pointer hover:border-primary/40 transition-colors">
                <Camera className="w-10 h-10 text-muted-foreground/40" />
                <span className="text-sm font-medium text-foreground">Tap to upload or take a photo</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, or HEIC</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoScan(file);
                  }}
                />
              </label>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                {/* Image upload */}
                <div className="flex items-center gap-3">
                  {service.image_url ? (
                    <div className="relative group">
                      <img src={service.image_url} alt={service.title} className="w-16 h-16 rounded-lg object-cover border border-border" />
                      <button
                        onClick={() => updateService(service.id, { image_url: null } as any)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors shrink-0">
                      <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !user) return;
                        const path = `${user.id}/services/${Date.now()}-${file.name}`;
                        const { error } = await supabase.storage.from("user-photos").upload(path, file, { upsert: true });
                        if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
                        const { data: { publicUrl } } = supabase.storage.from("user-photos").getPublicUrl(path);
                        updateService(service.id, { image_url: publicUrl } as any);
                      }} />
                    </label>
                  )}
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(service.id, { title: e.target.value })}
                    className="h-10 text-foreground font-semibold"
                  />
                </div>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(service.id, { description: e.target.value })}
                  placeholder="Description…"
                  className="text-foreground placeholder:text-muted-foreground/40 min-h-[60px]"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label className="text-muted-foreground text-xs">Price $</Label>
                    <Input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateService(service.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-28 h-9 text-foreground"
                    />
                  </div>
                  <button
                    onClick={() => updateService(service.id, { popular: !service.popular })}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors ${service.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    <Star className="w-3 h-3" /> Popular
                  </button>
                  <button
                    onClick={() => { setOptionsServiceId(service.id); setOptionsServiceName(service.title); }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Settings2 className="w-3 h-3" /> Options
                  </button>
                </div>
              </div>
              <button onClick={() => deleteService(service.id)} aria-label="Delete service" className="text-muted-foreground/30 hover:text-destructive transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-center text-muted-foreground/50 py-8 text-sm">No services yet. Add your first service above.</p>
        )}
      </div>

      {/* Add-ons section */}
      <div id="add-ons" className="mt-10 pt-8 border-t border-border">
        <AddOnsManager />
      </div>
    </div>
  );
};

export default ServicesManager;
