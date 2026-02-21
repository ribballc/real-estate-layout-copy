import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  ChevronDown,
  Camera,
  PlusCircle,
  Pencil,
  ImageIcon,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddOnsManager from "./AddOnsManager";
import ServiceFullEditor from "./ServiceFullEditor";
import { ServiceListSkeleton } from "@/components/skeletons/ServiceCardSkeleton";

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
  const [editingService, setEditingService] = useState<Service | null>(null);
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
    // Optimistic update
    const prev = services.find(s => s.id === id);
    setServices((s) => s.map((svc) => (svc.id === id ? { ...svc, ...updates } : svc)));
    const { error } = await supabase.from("services").update(updates).eq("id", id);
    if (error) {
      // Revert
      if (prev) setServices((s) => s.map((svc) => (svc.id === id ? prev : svc)));
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Authentication required. Please log in.");
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape-price-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
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

  if (loading) return <ServiceListSkeleton />;

  const existingTitles = new Set(services.map(s => s.title.toLowerCase()));
  const availablePresets = PRESET_SERVICES.filter(p => !existingTitles.has(p.title.toLowerCase()));

  // Full-screen editor
  if (editingService) {
    return (
      <ServiceFullEditor
        service={editingService}
        onClose={() => { setEditingService(null); fetchServices(); }}
        onUpdate={updateService}
        onDelete={deleteService}
      />
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="dash-page-title text-foreground">Services</h2>
        <div className="relative">
          <Button onClick={() => setShowAddMenu(!showAddMenu)} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add Service <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setShowAddMenu(false); setShowCustomInput(false); setShowManualMenu(false); }} />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-[14px] border border-border shadow-xl z-50 py-2 overflow-hidden bg-popover">
                {!showManualMenu ? (
                  <>
                    <button
                      onClick={() => setShowManualMenu(true)}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" /> Add Manually
                    </button>
                    <button
                      onClick={() => { setShowAddMenu(false); setShowScanDialog(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2"
                    >
                      <span className="relative flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, hsla(217,91%,60%,0.25) 0%, transparent 70%)", filter: "blur(3px)", width: "24px", height: "24px", margin: "-2px" }} />
                        <Camera className="w-4 h-4 text-muted-foreground relative" />
                      </span>
                      Magic Upload
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setShowManualMenu(false)} className="w-full text-left px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
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
              <Camera className="w-5 h-5 text-muted-foreground" /> Scan Your Price List
            </DialogTitle>
            <DialogDescription>
              Upload or take a photo of your price list, menu, or flyer. We'll automatically extract your services, packages, and pricing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {scanning ? (
              <div className="flex flex-col items-center gap-4 py-8">
                {scanPreview && (
                  <img src={scanPreview} alt="Scanning" className="w-32 h-32 object-cover rounded-lg opacity-60" />
                )}
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing your price list…</p>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 border-2 border-dashed border-border rounded-[14px] p-10 cursor-pointer hover:border-primary/40 transition-colors">
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

      {/* Service Cards — tap to edit */}
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setEditingService(service)}
            className="dash-card !p-0 overflow-hidden w-full text-left group"
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              {/* Service photo or placeholder */}
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate block">{service.title}</span>
                <span className="text-xs text-muted-foreground">${service.price.toFixed(0)}{service.popular ? " · Popular" : ""}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Pencil className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                <ChevronDown className="w-4 h-4 text-muted-foreground/40 -rotate-90" />
              </div>
            </div>
          </button>
        ))}
        {services.length === 0 && (
          <EmptyState
            icon={PlusCircle}
            title="Add your first service"
            description="Services are how customers book and pay. Add a detail package to get started — we have preset services to save you time."
            action={{ label: "Add a Service", onClick: () => setShowAddMenu(true) }}
            secondaryAction={{ label: "Use a Preset", onClick: () => { setShowAddMenu(true); setShowManualMenu(true); } }}
          />
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
