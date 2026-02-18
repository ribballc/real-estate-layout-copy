import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ChevronDown, Upload, ImageIcon, X } from "lucide-react";
import { ServiceListSkeleton } from "@/components/skeletons/ServiceCardSkeleton";

interface AddOn { id: string; service_id: string; title: string; description: string; price: number; image_url: string | null; }
interface Service { id: string; title: string; }

const PRESET_ADDONS: Record<string, { title: string; price: number }[]> = {
  "full detail": [
    { title: "Engine Bay Cleaning", price: 50 },
    { title: "Headlight Restoration", price: 75 },
    { title: "Odor Elimination", price: 40 },
    { title: "Pet Hair Removal", price: 35 },
  ],
  "paint protection film": [
    { title: "Full Hood Coverage", price: 200 },
    { title: "Door Edge Guards", price: 60 },
    { title: "Mirror Caps", price: 40 },
    { title: "Rocker Panels", price: 120 },
  ],
  "window tint": [
    { title: "Windshield Strip", price: 50 },
    { title: "Sunroof Tint", price: 75 },
    { title: "Ceramic Upgrade", price: 100 },
  ],
  "interior detail": [
    { title: "Leather Conditioning", price: 40 },
    { title: "Stain Removal", price: 50 },
    { title: "Carpet Shampoo", price: 45 },
    { title: "Dashboard UV Protection", price: 30 },
  ],
  "exterior detailing": [
    { title: "Clay Bar Treatment", price: 50 },
    { title: "Wheel Ceramic Coat", price: 80 },
    { title: "Trim Restoration", price: 35 },
    { title: "Bug & Tar Removal", price: 25 },
  ],
  "vinyl wrap": [
    { title: "Chrome Delete", price: 150 },
    { title: "Accent Stripes", price: 100 },
    { title: "Gloss to Matte Conversion", price: 200 },
  ],
  "ceramic coating": [
    { title: "Wheel Coating", price: 100 },
    { title: "Glass Coating", price: 60 },
    { title: "Interior Coating", price: 80 },
    { title: "Paint Correction (1-Step)", price: 150 },
    { title: "Paint Correction (2-Step)", price: 250 },
  ],
};

// Fallback presets for services that don't match any preset category
const DEFAULT_ADDONS = [
  { title: "Rush Service", price: 50 },
  { title: "Mobile Service Fee", price: 30 },
  { title: "Premium Products Upgrade", price: 40 },
];

const getPresetsForService = (serviceTitle: string) => {
  const lower = serviceTitle.toLowerCase();
  for (const [key, presets] of Object.entries(PRESET_ADDONS)) {
    if (lower.includes(key) || key.includes(lower)) return presets;
  }
  return DEFAULT_ADDONS;
};

const AddOnsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customPrice, setCustomPrice] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("services").select("id, title").eq("user_id", user.id).order("sort_order"),
      supabase.from("add_ons").select("*").eq("user_id", user.id).order("sort_order"),
    ]).then(([sRes, aRes]) => {
      const svcs = (sRes.data || []) as Service[];
      setServices(svcs);
      setAddOns((aRes.data || []) as AddOn[]);
      if (svcs.length > 0) setSelectedService(svcs[0].id);
      setLoading(false);
    });
  }, [user]);

  const refreshAddOns = async () => {
    if (!user) return;
    const { data } = await supabase.from("add_ons").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setAddOns(data as AddOn[]);
  };

  const addPresetAddOn = async (preset: { title: string; price: number }) => {
    if (!user || !selectedService) return;
    const { error } = await supabase.from("add_ons").insert({
      user_id: user.id, service_id: selectedService, title: preset.title, price: preset.price,
      sort_order: addOns.filter(a => a.service_id === selectedService).length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else refreshAddOns();
    setShowAddMenu(false);
  };

  const addCustomAddOn = async () => {
    if (!user || !selectedService || !customTitle.trim()) return;
    const { error } = await supabase.from("add_ons").insert({
      user_id: user.id, service_id: selectedService, title: customTitle.trim(), price: customPrice,
      sort_order: addOns.filter(a => a.service_id === selectedService).length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setCustomTitle(""); setCustomPrice(0); setShowCustomInput(false); refreshAddOns(); }
    setShowAddMenu(false);
  };

  const updateAddOn = async (id: string, updates: Partial<AddOn>) => {
    // Optimistic update
    const prev = addOns.find(a => a.id === id);
    setAddOns((all) => all.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    const { error } = await supabase.from("add_ons").update(updates).eq("id", id);
    if (error) {
      if (prev) setAddOns((all) => all.map((a) => (a.id === id ? prev : a)));
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const deleteAddOn = async (id: string) => {
    await supabase.from("add_ons").delete().eq("id", id);
    setAddOns((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <ServiceListSkeleton count={2} />;

  const filtered = addOns.filter((a) => a.service_id === selectedService);
  const selectedServiceObj = services.find(s => s.id === selectedService);
  const presets = selectedServiceObj ? getPresetsForService(selectedServiceObj.title) : DEFAULT_ADDONS;
  const existingTitles = new Set(filtered.map(a => a.title.toLowerCase()));
  const availablePresets = presets.filter(p => !existingTitles.has(p.title.toLowerCase()));

  return (
    <div className="max-w-2xl">
      <h2 className="dash-page-title text-white mb-6">Add-ons</h2>
      {services.length === 0 ? (
        <p className="text-white/30 text-sm">Create services first to add add-ons.</p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Label className="text-white/50 text-sm shrink-0">Service:</Label>
            <select
              value={selectedService}
              onChange={(e) => { setSelectedService(e.target.value); setShowAddMenu(false); }}
              className="h-10 rounded-lg border border-white/10 text-white px-3 text-sm flex-1 min-w-[160px]"
              style={{ background: "hsl(215 50% 12%)" }}
            >
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <div className="relative">
              <Button onClick={() => setShowAddMenu(!showAddMenu)} size="sm" className="gap-2 shrink-0" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
                <Plus className="w-4 h-4" /> Add <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              {showAddMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setShowAddMenu(false); setShowCustomInput(false); }} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 shadow-xl z-50 py-2 overflow-hidden" style={{ background: "hsl(215 50% 12%)" }}>
                    {availablePresets.length > 0 && (
                      <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/30">
                        Suggested for {selectedServiceObj?.title}
                      </div>
                    )}
                    {availablePresets.map((preset) => (
                      <button
                        key={preset.title}
                        onClick={() => addPresetAddOn(preset)}
                        className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors flex justify-between items-center"
                      >
                        <span>{preset.title}</span>
                        <span className="text-white/30 text-xs">${preset.price}</span>
                      </button>
                    ))}
                    {availablePresets.length > 0 && <div className="border-t border-white/10 my-1" />}
                    {!showCustomInput ? (
                      <button
                        onClick={() => setShowCustomInput(true)}
                        className="w-full text-left px-4 py-2.5 text-sm text-accent hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" /> Custom Add-on
                      </button>
                    ) : (
                      <div className="px-3 py-2 space-y-2">
                        <Input
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomAddOn()}
                          placeholder="Add-on name…"
                          className="h-8 bg-white/5 border-white/10 text-white text-sm focus-visible:ring-accent"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-white/40 text-sm">$</span>
                            <Input
                              type="number"
                              value={customPrice}
                              onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                              onKeyDown={(e) => e.key === "Enter" && addCustomAddOn()}
                              className="h-8 bg-white/5 border-white/10 text-white text-sm focus-visible:ring-accent"
                            />
                          </div>
                          <Button onClick={addCustomAddOn} size="sm" className="h-8 px-3 shrink-0" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map((addon) => (
              <div key={addon.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                {addon.image_url ? (
                  <div className="relative group shrink-0">
                    <img src={addon.image_url} alt={addon.title} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <button
                      onClick={() => updateAddOn(addon.id, { image_url: null } as any)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-12 h-12 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-accent/40 transition-colors shrink-0">
                    <ImageIcon className="w-4 h-4 text-white/20" />
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !user) return;
                      const path = `${user.id}/addons/${Date.now()}-${file.name}`;
                      const { error } = await supabase.storage.from("user-photos").upload(path, file, { upsert: true });
                      if (error) return;
                      const { data: { publicUrl } } = supabase.storage.from("user-photos").getPublicUrl(path);
                      updateAddOn(addon.id, { image_url: publicUrl } as any);
                    }} />
                  </label>
                )}
                <Input value={addon.title} onChange={(e) => updateAddOn(addon.id, { title: e.target.value })} className="flex-1 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
                <div className="flex items-center gap-1">
                  <span className="text-white/40 text-sm">$</span>
                  <Input type="number" value={addon.price} onChange={(e) => updateAddOn(addon.id, { price: parseFloat(e.target.value) || 0 })} className="w-24 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
                </div>
                <button onClick={() => deleteAddOn(addon.id)} aria-label="Delete add-on" className="text-white/50 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-white/30 text-sm text-center py-6">No add-ons for this service yet.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default AddOnsManager;
