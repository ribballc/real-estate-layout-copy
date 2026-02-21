import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Trash2,
  Star,
  Plus,
  Sparkles,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
  sort_order: number;
  image_url: string | null;
}

interface OptionItem {
  id: string;
  group_id: string;
  label: string;
  description: string;
  price_modifier: number;
  sort_order: number;
}

interface OptionGroup {
  id: string;
  service_id: string;
  title: string;
  description: string;
  option_type: string;
  sort_order: number;
  required: boolean;
  items: OptionItem[];
}

interface Props {
  service: Service;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Service>) => void;
  onDelete: (id: string) => void;
}

/* ═══════════════════════════════════════════════════════
   VEHICLE TYPES (for pricing)
   ═══════════════════════════════════════════════════════ */
const VEHICLE_TYPES = [
  { key: "sedan", label: "Sedan / Coupe", modifier: 0 },
  { key: "suv", label: "SUV / Crossover", modifier: 30 },
  { key: "truck", label: "Truck", modifier: 40 },
  { key: "van", label: "Van / XL", modifier: 60 },
  { key: "exotic", label: "Exotic / Luxury", modifier: 80 },
];

/* ═══════════════════════════════════════════════════════
   PACKAGE PRESETS by service type
   ═══════════════════════════════════════════════════════ */
const PACKAGE_PRESETS: Record<string, { title: string; items: { label: string; description: string; price: number }[] }[]> = {
  "full detail": [
    { title: "Package Level", items: [
      { label: "Standard Detail", description: "Full wash, vacuum, basic interior wipe-down", price: 0 },
      { label: "Premium Detail", description: "Clay bar, polish, leather conditioning, deep clean", price: 75 },
      { label: "Ultimate Detail", description: "Paint correction, ceramic spray, engine bay, everything", price: 150 },
    ] },
  ],
  "interior detail": [
    { title: "Package Level", items: [
      { label: "Basic Interior", description: "Vacuum, wipe-down, windows", price: 0 },
      { label: "Deep Clean", description: "Steam clean, shampoo, leather conditioning", price: 50 },
      { label: "Full Restoration", description: "Stain removal, odor elimination, UV protection", price: 100 },
    ] },
  ],
  "exterior detailing": [
    { title: "Package Level", items: [
      { label: "Wash & Wax", description: "Hand wash, dry, spray wax", price: 0 },
      { label: "Clay & Polish", description: "Clay bar treatment, single-stage polish", price: 60 },
      { label: "Full Correction", description: "Multi-stage paint correction, sealant", price: 150 },
    ] },
  ],
  "ceramic coating": [
    { title: "Coating Package", items: [
      { label: "1-Year Coating", description: "Entry-level ceramic protection", price: 0 },
      { label: "3-Year Coating", description: "Professional grade ceramic coating", price: 200 },
      { label: "5-Year Coating", description: "Premium multi-layer ceramic coating", price: 500 },
    ] },
  ],
  "window tint": [
    { title: "Tint Package", items: [
      { label: "Standard Dyed", description: "Basic heat and UV rejection", price: 0 },
      { label: "Carbon Film", description: "Superior heat rejection, no fade", price: 50 },
      { label: "Ceramic Film", description: "Best clarity, max heat rejection", price: 120 },
    ] },
  ],
  "paint protection film": [
    { title: "Coverage Area", items: [
      { label: "Partial Front", description: "Hood edge, fenders, mirrors", price: 0 },
      { label: "Full Front", description: "Full hood, bumper, fenders, mirrors", price: 300 },
      { label: "Full Body", description: "Complete vehicle wrap in PPF", price: 2000 },
    ] },
  ],
  "vinyl wrap": [
    { title: "Wrap Coverage", items: [
      { label: "Accent Wrap", description: "Roof, mirrors, trim pieces", price: 0 },
      { label: "Partial Wrap", description: "Partial panels and accents", price: 500 },
      { label: "Full Wrap", description: "Complete vehicle color change", price: 1500 },
    ] },
  ],
};

function getPackagePresets(serviceName: string) {
  const key = serviceName.toLowerCase().trim();
  for (const [k, v] of Object.entries(PACKAGE_PRESETS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   SERVICE NAME SUGGESTIONS
   ═══════════════════════════════════════════════════════ */
const SERVICE_SUGGESTIONS = [
  "Full Detail", "Interior Detail", "Exterior Detailing", "Ceramic Coating",
  "Window Tint", "Paint Protection Film", "Vinyl Wrap", "Paint Correction",
  "Headlight Restoration", "Engine Bay Cleaning", "Odor Elimination",
  "Leather Conditioning", "Wheel Coating", "Glass Coating", "Chrome Delete",
  "Mobile Detailing", "Fleet Detailing", "Motorcycle Detail", "Boat Detail",
  "RV Detail", "Aircraft Detail", "Scratch Removal", "Dent Removal",
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
const ServiceFullEditor = ({ service, onClose, onUpdate, onDelete }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Local state for editing
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [popular, setPopular] = useState(service.popular);
  const [imageUrl, setImageUrl] = useState(service.image_url);
  const [uploading, setUploading] = useState(false);

  // Suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredSuggestions = useMemo(() => {
    if (!title.trim()) return SERVICE_SUGGESTIONS.slice(0, 8);
    return SERVICE_SUGGESTIONS.filter(s =>
      s.toLowerCase().includes(title.toLowerCase()) && s.toLowerCase() !== title.toLowerCase()
    ).slice(0, 6);
  }, [title]);

  // Vehicle pricing
  const [vehiclePricing, setVehiclePricing] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    VEHICLE_TYPES.forEach(v => { initial[v.key] = price + v.modifier; });
    return initial;
  });

  // Update vehicle pricing when base price changes
  useEffect(() => {
    setVehiclePricing(prev => {
      const next: Record<string, number> = {};
      VEHICLE_TYPES.forEach(v => {
        // Keep custom values if they differ from old base+modifier
        const oldBase = service.price;
        if (prev[v.key] === oldBase + v.modifier) {
          next[v.key] = price + v.modifier;
        } else {
          next[v.key] = prev[v.key];
        }
      });
      return next;
    });
  }, [price]);

  // Packages (option groups)
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const fetchGroups = async () => {
    if (!user) return;
    const { data: groupsData } = await supabase
      .from("service_option_groups")
      .select("*")
      .eq("service_id", service.id)
      .eq("user_id", user.id)
      .order("sort_order");
    if (!groupsData) { setLoadingGroups(false); return; }
    const groupIds = groupsData.map(g => g.id);
    let items: OptionItem[] = [];
    if (groupIds.length > 0) {
      const { data } = await supabase
        .from("service_option_items")
        .select("*")
        .in("group_id", groupIds)
        .order("sort_order");
      items = (data || []) as OptionItem[];
    }
    setGroups(groupsData.map(g => ({
      ...g,
      items: items.filter(i => i.group_id === g.id),
    })));
    setLoadingGroups(false);
  };

  useEffect(() => { fetchGroups(); }, [user, service.id]);

  // Save changes back
  const saveField = (field: string, value: any) => {
    onUpdate(service.id, { [field]: value } as any);
  };

  // Debounced saves
  useEffect(() => {
    const t = setTimeout(() => { if (title !== service.title) saveField("title", title); }, 600);
    return () => clearTimeout(t);
  }, [title]);

  useEffect(() => {
    const t = setTimeout(() => { if (description !== service.description) saveField("description", description); }, 600);
    return () => clearTimeout(t);
  }, [description]);

  useEffect(() => {
    const t = setTimeout(() => { if (price !== service.price) saveField("price", price); }, 600);
    return () => clearTimeout(t);
  }, [price]);

  // Image upload
  const handleImageUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const path = `${user.id}/services/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("user-photos").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("user-photos").getPublicUrl(path);
    setImageUrl(publicUrl);
    saveField("image_url", publicUrl);
    setUploading(false);
  };

  // Add package preset
  const addPackagePreset = async (preset: { title: string; items: { label: string; description: string; price: number }[] }) => {
    if (!user) return;
    const { data, error } = await supabase.from("service_option_groups").insert({
      service_id: service.id,
      user_id: user.id,
      title: preset.title,
      option_type: "radio",
      sort_order: groups.length,
    }).select().single();
    if (error || !data) return;
    const rows = preset.items.map((item, i) => ({
      group_id: data.id,
      user_id: user.id,
      label: item.label,
      description: item.description || "",
      price_modifier: item.price,
      sort_order: i,
    }));
    await supabase.from("service_option_items").insert(rows);
    fetchGroups();
    toast({ title: "Package added!" });
  };

  // Add custom package tier
  const addCustomTier = async (groupId: string) => {
    if (!user) return;
    const group = groups.find(g => g.id === groupId);
    await supabase.from("service_option_items").insert({
      group_id: groupId,
      user_id: user.id,
      label: "New Tier",
      sort_order: group?.items.length || 0,
    });
    fetchGroups();
  };

  // Update tier item
  const updateTierItem = async (id: string, updates: Partial<OptionItem>) => {
    await supabase.from("service_option_items").update(updates).eq("id", id);
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.map(i => i.id === id ? { ...i, ...updates } : i),
    })));
  };

  // Delete tier item
  const deleteTierItem = async (id: string) => {
    await supabase.from("service_option_items").delete().eq("id", id);
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.filter(i => i.id !== id),
    })));
  };

  // Delete entire group
  const deleteGroup = async (id: string) => {
    await supabase.from("service_option_groups").delete().eq("id", id);
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const presets = getPackagePresets(title);
  const existingGroupTitles = new Set(groups.map(g => g.title.toLowerCase()));

  const handleDelete = () => {
    onDelete(service.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h2 className="text-base font-bold text-foreground truncate pr-4">
          {title || "New Service"}
        </h2>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 pb-24 space-y-6">

          {/* ── Image + Title ── */}
          <div className="flex items-start gap-4">
            {/* Image */}
            <div className="shrink-0">
              {imageUrl ? (
                <div className="relative group">
                  <img src={imageUrl} alt={title} className="w-20 h-20 rounded-xl object-cover border border-border" />
                  <button
                    onClick={() => { setImageUrl(null); saveField("image_url", null); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors gap-1">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                    <>
                      <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                      <span className="text-[10px] text-muted-foreground/40">Photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }} />
                </label>
              )}
            </div>
            {/* Title input with suggestions */}
            <div className="flex-1 relative">
              <Label className="text-xs text-muted-foreground mb-1 block">Service Name</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="e.g. Full Detail"
                className="h-11 text-foreground font-semibold"
                autoFocus
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-border bg-popover shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map(s => (
                    <button
                      key={s}
                      onMouseDown={(e) => { e.preventDefault(); setTitle(s); setShowSuggestions(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Description ── */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's included…"
              className="text-foreground placeholder:text-muted-foreground/40 min-h-[70px]"
            />
          </div>

          {/* ── Base Price + Popular ── */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Base Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="h-11 text-foreground pl-7"
                />
              </div>
            </div>
            <button
              onClick={() => { setPopular(!popular); saveField("popular", !popular); }}
              className={`flex items-center gap-1.5 text-xs px-4 h-11 rounded-lg transition-colors font-medium ${popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              <Star className="w-3.5 h-3.5" /> Popular
            </button>
          </div>

          {/* ── Price Per Vehicle Type ── */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Price Per Vehicle Type</Label>
            <div className="rounded-xl border border-border overflow-hidden">
              {VEHICLE_TYPES.map((v, i) => (
                <div
                  key={v.key}
                  className={`flex items-center justify-between px-4 py-2.5 ${i !== VEHICLE_TYPES.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span className="text-sm text-foreground">{v.label}</span>
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                    <Input
                      type="number"
                      value={vehiclePricing[v.key]}
                      onChange={(e) => setVehiclePricing(prev => ({ ...prev, [v.key]: parseFloat(e.target.value) || 0 }))}
                      className="h-8 text-foreground text-sm pl-5 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/50 mt-1.5">Adjust pricing per vehicle size. Base price is for Sedan/Coupe.</p>
          </div>

          {/* ── Packages (Tiers) ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Packages & Options</Label>
              {loadingGroups && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
            </div>

            {/* Existing groups */}
            <div className="space-y-3">
              {groups.map(group => {
                const isOpen = expandedGroup === group.id;
                return (
                  <div key={group.id} className="rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedGroup(isOpen ? null : group.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <div>
                        <span className="text-sm font-semibold text-foreground">{group.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{group.items.length} tiers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                          className="text-muted-foreground/30 hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-3 space-y-2">
                        {group.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Input
                              value={item.label}
                              onChange={(e) => updateTierItem(item.id, { label: e.target.value })}
                              className="flex-1 h-9 text-foreground text-sm"
                              placeholder="Tier name"
                            />
                            <div className="relative w-20">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">+$</span>
                              <Input
                                type="number"
                                value={item.price_modifier}
                                onChange={(e) => updateTierItem(item.id, { price_modifier: parseFloat(e.target.value) || 0 })}
                                className="h-9 text-foreground text-sm pl-7 text-right"
                              />
                            </div>
                            <button
                              onClick={() => deleteTierItem(item.id)}
                              className="text-muted-foreground/30 hover:text-destructive transition-colors p-1 shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addCustomTier(group.id)}
                          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors pt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Tier
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Suggested packages (one-click add) */}
            {presets && presets.filter(p => !existingGroupTitles.has(p.title.toLowerCase())).length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Suggested packages
                </p>
                {presets.filter(p => !existingGroupTitles.has(p.title.toLowerCase())).map(preset => (
                  <button
                    key={preset.title}
                    onClick={() => addPackagePreset(preset)}
                    className="w-full text-left rounded-xl border border-dashed border-border hover:border-primary/40 p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{preset.title}</span>
                      <span className="text-xs text-primary flex items-center gap-1"><Plus className="w-3 h-3" /> Add</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{preset.items.map(i => i.label).join(" · ")}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Add custom package button */}
            {groups.length === 0 && !presets && (
              <button
                onClick={() => addPackagePreset({ title: "Package Level", items: [
                  { label: "Basic", description: "", price: 0 },
                  { label: "Standard", description: "", price: 50 },
                  { label: "Premium", description: "", price: 100 },
                ] })}
                className="w-full text-left rounded-xl border border-dashed border-border hover:border-primary/40 p-4 transition-colors mt-3"
              >
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Add Package Tiers
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">Basic · Standard · Premium</p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between shrink-0">
        <button
          onClick={handleDelete}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Service
        </button>
        <Button onClick={onClose} size="sm" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
          <Check className="w-4 h-4 mr-1" /> Done
        </Button>
      </div>
    </div>
  );
};

export default ServiceFullEditor;
