import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Sparkles,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  slider_min: number;
  slider_max: number;
  slider_step: number;
  slider_unit: string;
  slider_default: number;
  items: OptionItem[];
}

interface ServiceOptionsManagerProps {
  serviceId: string;
  serviceName: string;
  onClose: () => void;
}

// Suggested option presets by service type
const SUGGESTED_OPTIONS: Record<string, { title: string; type: string; description: string; items: { label: string; description: string; price: number }[] }[]> = {
  "full detail": [
    { title: "Package Level", type: "radio", description: "Choose your detail package", items: [
      { label: "Standard Detail", description: "Full wash, vacuum, basic interior wipe-down", price: 0 },
      { label: "Premium Detail", description: "Clay bar, polish, leather conditioning, deep clean", price: 75 },
      { label: "Ultimate Detail", description: "Paint correction, ceramic spray, engine bay, everything", price: 150 },
    ]},
    { title: "Vehicle Size", type: "radio", description: "Select your vehicle size", items: [
      { label: "Sedan / Coupe", description: "", price: 0 },
      { label: "SUV / Truck", description: "", price: 30 },
      { label: "XL / Van", description: "", price: 60 },
    ]},
  ],
  "interior detail": [
    { title: "Package Level", type: "radio", description: "Choose your interior package", items: [
      { label: "Basic Interior", description: "Vacuum, wipe-down, windows", price: 0 },
      { label: "Deep Clean", description: "Steam clean, shampoo, leather conditioning", price: 50 },
      { label: "Full Restoration", description: "Stain removal, odor elimination, UV protection", price: 100 },
    ]},
  ],
  "exterior detailing": [
    { title: "Package Level", type: "radio", description: "Choose your exterior package", items: [
      { label: "Wash & Wax", description: "Hand wash, dry, spray wax", price: 0 },
      { label: "Clay & Polish", description: "Clay bar treatment, single-stage polish", price: 60 },
      { label: "Full Correction", description: "Multi-stage paint correction, sealant", price: 150 },
    ]},
  ],
  "ceramic coating": [
    { title: "Coating Package", type: "radio", description: "Select your coating level", items: [
      { label: "1-Year Coating", description: "Entry-level ceramic protection", price: 0 },
      { label: "3-Year Coating", description: "Professional grade ceramic coating", price: 200 },
      { label: "5-Year Coating", description: "Premium multi-layer ceramic coating", price: 500 },
    ]},
  ],
  "window tint": [
    { title: "Tint Package", type: "radio", description: "Choose your tint type", items: [
      { label: "Standard Dyed", description: "Basic heat and UV rejection", price: 0 },
      { label: "Carbon Film", description: "Superior heat rejection, no fade", price: 50 },
      { label: "Ceramic Film", description: "Best clarity, max heat rejection", price: 120 },
    ]},
    { title: "Windows", type: "checkbox", description: "Select which windows to tint", items: [
      { label: "Front 2 Windows", description: "", price: 0 },
      { label: "Rear 3 Windows", description: "", price: 30 },
      { label: "Windshield Strip", description: "", price: 25 },
      { label: "Full Windshield", description: "", price: 80 },
    ]},
  ],
  "paint protection film": [
    { title: "Coverage Area", type: "radio", description: "Select PPF coverage", items: [
      { label: "Partial Front", description: "Hood edge, fenders, mirrors", price: 0 },
      { label: "Full Front", description: "Full hood, bumper, fenders, mirrors", price: 300 },
      { label: "Full Body", description: "Complete vehicle wrap in PPF", price: 2000 },
    ]},
  ],
  "vinyl wrap": [
    { title: "Wrap Coverage", type: "radio", description: "Select wrap area", items: [
      { label: "Accent Wrap", description: "Roof, mirrors, trim pieces", price: 0 },
      { label: "Partial Wrap", description: "Partial panels and accents", price: 500 },
      { label: "Full Wrap", description: "Complete vehicle color change", price: 1500 },
    ]},
  ],
};

// Match service name to suggestions
function getSuggestions(serviceName: string) {
  const key = serviceName.toLowerCase().trim();
  for (const [k, v] of Object.entries(SUGGESTED_OPTIONS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

const ServiceOptionsManager = ({ serviceId, serviceName, onClose }: ServiceOptionsManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customType, setCustomType] = useState("radio");

  const suggestions = getSuggestions(serviceName);

  const fetchGroups = async () => {
    if (!user) return;
    const { data: groupsData } = await supabase
      .from("service_option_groups")
      .select("*")
      .eq("service_id", serviceId)
      .eq("user_id", user.id)
      .order("sort_order");

    if (!groupsData) { setLoading(false); return; }

    const groupIds = groupsData.map((g) => g.id);
    let items: OptionItem[] = [];
    if (groupIds.length > 0) {
      const { data } = await supabase
        .from("service_option_items")
        .select("*")
        .in("group_id", groupIds)
        .order("sort_order");
      items = (data || []) as OptionItem[];
    }

    setGroups(
      groupsData.map((g) => ({
        ...g,
        slider_min: g.slider_min ?? 0,
        slider_max: g.slider_max ?? 100,
        slider_step: g.slider_step ?? 5,
        slider_unit: g.slider_unit ?? "%",
        slider_default: g.slider_default ?? 50,
        items: items.filter((i) => i.group_id === g.id),
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchGroups(); }, [user, serviceId]);

  const addGroup = async (title: string, type: string, presetItems?: { label: string; description: string; price: number }[]) => {
    if (!user) return;
    const { data, error } = await supabase.from("service_option_groups").insert({
      service_id: serviceId,
      user_id: user.id,
      title,
      option_type: type,
      sort_order: groups.length,
    }).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }

    // If preset items, add them
    if (presetItems && presetItems.length > 0 && data) {
      const rows = presetItems.map((item, i) => ({
        group_id: data.id,
        user_id: user.id,
        label: item.label,
        description: item.description || "",
        price_modifier: item.price,
        sort_order: i,
      }));
      await supabase.from("service_option_items").insert(rows);
    }
    fetchGroups();
  };

  const addCustomGroup = async () => {
    if (!customTitle.trim()) return;
    await addGroup(customTitle.trim(), customType);
    setCustomTitle("");
    setCustomType("radio");
    setShowAddDialog(false);
  };

  const updateGroup = async (id: string, updates: Partial<OptionGroup>) => {
    const { items, ...dbUpdates } = updates as any;
    const { error } = await supabase.from("service_option_groups").update(dbUpdates).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGroup = async (id: string) => {
    const { error } = await supabase.from("service_option_groups").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const addItem = async (groupId: string) => {
    if (!user) return;
    const group = groups.find((g) => g.id === groupId);
    const { error } = await supabase.from("service_option_items").insert({
      group_id: groupId,
      user_id: user.id,
      label: "New Option",
      sort_order: group?.items.length || 0,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchGroups();
  };

  const updateItem = async (id: string, updates: Partial<OptionItem>) => {
    const { error } = await supabase.from("service_option_items").update(updates).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          items: g.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }))
      );
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("service_option_items").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          items: g.items.filter((i) => i.id !== id),
        }))
      );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  const existingTitles = new Set(groups.map(g => g.title.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Options for {serviceName}</h3>
          <p className="text-sm text-muted-foreground">
            Add packages and options your customers can choose from.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddDialog(true)} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add Option
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Done
          </Button>
        </div>
      </div>

      {/* Add Option Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Option to {serviceName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            {/* Suggested Options */}
            {suggestions && suggestions.filter(s => !existingTitles.has(s.title.toLowerCase())).length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Suggested for {serviceName}
                </Label>
                <div className="space-y-2">
                  {suggestions.filter(s => !existingTitles.has(s.title.toLowerCase())).map((s) => (
                    <button
                      key={s.title}
                      onClick={() => { addGroup(s.title, s.type, s.items); setShowAddDialog(false); }}
                      className="w-full text-left rounded-lg border border-border bg-muted/50 hover:bg-accent/10 p-3 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-foreground">{s.title}</span>
                        <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">{s.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{s.items.length} options included</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Option */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">Build Your Own</Label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomGroup()}
                placeholder="Option name (e.g. Package Level, Add-ons)"
                className="text-foreground"
                autoFocus={!suggestions}
              />
              <Select value={customType} onValueChange={setCustomType}>
                <SelectTrigger className="text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio">Single choice (pick one)</SelectItem>
                  <SelectItem value="checkbox">Multi-select (pick many)</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addCustomGroup} className="w-full" disabled={!customTitle.trim()} style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
                Create Option
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {groups.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground/50 text-sm mb-3">
            No options yet. Add packages or choices for customers.
          </p>
          {suggestions && (
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="outline"
              size="sm"
              className="gap-2 text-foreground"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> View Suggested Options
            </Button>
          )}
        </div>
      )}

      {groups.map((group) => {
        const isExpanded = expandedGroup === group.id;
        return (
          <div
            key={group.id}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Group header */}
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedGroup(isExpanded ? null : group.id)}>
              <GripVertical className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground">{group.title}</span>
                <span className="ml-2 text-xs text-muted-foreground capitalize">
                  ({group.option_type})
                  {group.required && " · Required"}
                  {group.option_type !== "slider" && ` · ${group.items.length} options`}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                className="text-muted-foreground/30 hover:text-destructive transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-border p-4 space-y-4">
                {/* Group settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Group Title</Label>
                    <Input
                      value={group.title}
                      onChange={(e) => updateGroup(group.id, { title: e.target.value })}
                      className="h-9 text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Select
                      value={group.option_type}
                      onValueChange={(val) => updateGroup(group.id, { option_type: val })}
                    >
                      <SelectTrigger className="h-9 text-foreground text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkbox">Checkbox (multi-select)</SelectItem>
                        <SelectItem value="radio">Radio (single-select)</SelectItem>
                        <SelectItem value="slider">Slider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Description (optional)</Label>
                  <Input
                    value={group.description}
                    onChange={(e) => updateGroup(group.id, { description: e.target.value })}
                    placeholder="e.g. Select your preferred package"
                    className="h-9 text-foreground text-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={group.required}
                    onCheckedChange={(val) => updateGroup(group.id, { required: val })}
                  />
                  <Label className="text-sm text-muted-foreground">Required</Label>
                </div>

                {/* Slider config */}
                {group.option_type === "slider" && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-border">
                    <div>
                      <Label className="text-xs text-muted-foreground">Min</Label>
                      <Input type="number" value={group.slider_min} onChange={(e) => updateGroup(group.id, { slider_min: parseInt(e.target.value) || 0 })} className="h-8 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max</Label>
                      <Input type="number" value={group.slider_max} onChange={(e) => updateGroup(group.id, { slider_max: parseInt(e.target.value) || 100 })} className="h-8 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Step</Label>
                      <Input type="number" value={group.slider_step} onChange={(e) => updateGroup(group.id, { slider_step: parseInt(e.target.value) || 1 })} className="h-8 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Unit</Label>
                      <Input value={group.slider_unit} onChange={(e) => updateGroup(group.id, { slider_unit: e.target.value })} className="h-8 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Default</Label>
                      <Input type="number" value={group.slider_default} onChange={(e) => updateGroup(group.id, { slider_default: parseInt(e.target.value) || 0 })} className="h-8 text-foreground text-sm" />
                    </div>
                  </div>
                )}

                {/* Items list (checkbox/radio only) */}
                {(group.option_type === "checkbox" || group.option_type === "radio") && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground font-semibold">Options</Label>
                      <Button onClick={() => addItem(group.id)} size="sm" variant="ghost" className="h-7 text-xs gap-1 text-accent">
                        <Plus className="w-3 h-3" /> Add Option
                      </Button>
                    </div>
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <Input
                            value={item.label}
                            onChange={(e) => updateItem(item.id, { label: e.target.value })}
                            placeholder="Label"
                            className="h-8 text-foreground text-sm"
                          />
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            placeholder="Description (optional)"
                            className="h-8 text-foreground text-sm"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">+$</span>
                            <Input
                              type="number"
                              value={item.price_modifier}
                              onChange={(e) => updateItem(item.id, { price_modifier: parseFloat(e.target.value) || 0 })}
                              className="h-8 text-foreground text-sm w-20"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-muted-foreground/30 hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {group.items.length === 0 && (
                      <p className="text-xs text-muted-foreground/40 text-center py-3">No options yet</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ServiceOptionsManager;
