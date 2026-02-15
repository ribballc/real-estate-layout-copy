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
  Settings2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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

const ServiceOptionsManager = ({ serviceId, serviceName, onClose }: ServiceOptionsManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

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

  const addGroup = async () => {
    if (!user) return;
    const { error } = await supabase.from("service_option_groups").insert({
      service_id: serviceId,
      user_id: user.id,
      title: "New Option Group",
      sort_order: groups.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchGroups();
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Options for {serviceName}</h3>
          <p className="text-sm text-muted-foreground">
            Add option groups like window positions, tint percentage, etc.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addGroup} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
            <Plus className="w-4 h-4" /> Add Group
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Done
          </Button>
        </div>
      </div>

      {groups.length === 0 && (
        <p className="text-center text-muted-foreground/50 py-8 text-sm">
          No option groups yet. Add one to let customers customize this service.
        </p>
      )}

      {groups.map((group) => {
        const isExpanded = expandedGroup === group.id;
        return (
          <div
            key={group.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
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
                className="text-muted-foreground/30 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-white/10 p-4 space-y-4">
                {/* Group settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Group Title</Label>
                    <Input
                      value={group.title}
                      onChange={(e) => updateGroup(group.id, { title: e.target.value })}
                      className="h-9 bg-white/5 border-white/10 text-foreground text-sm focus-visible:ring-accent"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Select
                      value={group.option_type}
                      onValueChange={(val) => updateGroup(group.id, { option_type: val })}
                    >
                      <SelectTrigger className="h-9 bg-white/5 border-white/10 text-foreground text-sm">
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
                    placeholder="e.g. Select all windows that apply"
                    className="h-9 bg-white/5 border-white/10 text-foreground text-sm focus-visible:ring-accent"
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
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-white/5">
                    <div>
                      <Label className="text-xs text-muted-foreground">Min</Label>
                      <Input type="number" value={group.slider_min} onChange={(e) => updateGroup(group.id, { slider_min: parseInt(e.target.value) || 0 })} className="h-8 bg-white/5 border-white/10 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max</Label>
                      <Input type="number" value={group.slider_max} onChange={(e) => updateGroup(group.id, { slider_max: parseInt(e.target.value) || 100 })} className="h-8 bg-white/5 border-white/10 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Step</Label>
                      <Input type="number" value={group.slider_step} onChange={(e) => updateGroup(group.id, { slider_step: parseInt(e.target.value) || 1 })} className="h-8 bg-white/5 border-white/10 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Unit</Label>
                      <Input value={group.slider_unit} onChange={(e) => updateGroup(group.id, { slider_unit: e.target.value })} className="h-8 bg-white/5 border-white/10 text-foreground text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Default</Label>
                      <Input type="number" value={group.slider_default} onChange={(e) => updateGroup(group.id, { slider_default: parseInt(e.target.value) || 0 })} className="h-8 bg-white/5 border-white/10 text-foreground text-sm" />
                    </div>
                  </div>
                )}

                {/* Items list (checkbox/radio only) */}
                {(group.option_type === "checkbox" || group.option_type === "radio") && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground font-semibold">Options</Label>
                      <Button onClick={() => addItem(group.id)} size="sm" variant="ghost" className="h-7 text-xs gap-1 text-accent">
                        <Plus className="w-3 h-3" /> Add Option
                      </Button>
                    </div>
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-2.5">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <Input
                            value={item.label}
                            onChange={(e) => updateItem(item.id, { label: e.target.value })}
                            placeholder="Label"
                            className="h-8 bg-white/5 border-white/10 text-foreground text-sm"
                          />
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            placeholder="Description (optional)"
                            className="h-8 bg-white/5 border-white/10 text-foreground text-sm"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">+$</span>
                            <Input
                              type="number"
                              value={item.price_modifier}
                              onChange={(e) => updateItem(item.id, { price_modifier: parseFloat(e.target.value) || 0 })}
                              className="h-8 bg-white/5 border-white/10 text-foreground text-sm w-20"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-muted-foreground/30 hover:text-red-400 transition-colors p-1"
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
