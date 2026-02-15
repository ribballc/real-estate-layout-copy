import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Star, ChevronDown, X, Upload, ImageIcon, Settings2 } from "lucide-react";
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
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <div className="relative">
          <Button onClick={() => setShowAddMenu(!showAddMenu)} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add Service <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setShowAddMenu(false); setShowCustomInput(false); }} />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 shadow-xl z-50 py-2 overflow-hidden" style={{ background: "hsl(215 50% 12%)" }}>
                {availablePresets.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => addPresetService(preset)}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
                {availablePresets.length > 0 && <div className="border-t border-white/10 my-1" />}
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full text-left px-4 py-2.5 text-sm text-accent hover:bg-white/10 transition-colors flex items-center gap-2"
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
                      className="h-8 bg-white/5 border-white/10 text-white text-sm focus-visible:ring-accent"
                      autoFocus
                    />
                    <Button onClick={addCustomService} size="sm" className="h-8 px-3 shrink-0" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                {/* Image upload */}
                <div className="flex items-center gap-3">
                  {service.image_url ? (
                    <div className="relative group">
                      <img src={service.image_url} alt={service.title} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                      <button
                        onClick={() => updateService(service.id, { image_url: null } as any)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-accent/40 transition-colors shrink-0">
                      <ImageIcon className="w-5 h-5 text-white/20" />
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
                    className="h-10 bg-white/5 border-white/10 text-white font-semibold focus-visible:ring-accent"
                  />
                </div>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(service.id, { description: e.target.value })}
                  placeholder="Description…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent min-h-[60px]"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label className="text-white/50 text-xs">Price $</Label>
                    <Input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateService(service.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-28 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent"
                    />
                  </div>
                  <button
                    onClick={() => updateService(service.id, { popular: !service.popular })}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors ${service.popular ? "bg-accent/20 text-accent" : "bg-white/5 text-white/40 hover:text-white/60"}`}
                  >
                    <Star className="w-3 h-3" /> Popular
                  </button>
                  <button
                    onClick={() => { setOptionsServiceId(service.id); setOptionsServiceName(service.title); }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors bg-white/5 text-white/40 hover:text-white/60"
                  >
                    <Settings2 className="w-3 h-3" /> Options
                  </button>
                </div>
              </div>
              <button onClick={() => deleteService(service.id)} className="text-white/30 hover:text-red-400 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-center text-white/30 py-8 text-sm">No services yet. Add your first service above.</p>
        )}
      </div>

      {/* Add-ons section */}
      <div id="add-ons" className="mt-10 pt-8 border-t border-white/10">
        <AddOnsManager />
      </div>
    </div>
  );
};

export default ServicesManager;
