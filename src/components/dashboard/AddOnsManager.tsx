import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface AddOn { id: string; service_id: string; title: string; description: string; price: number; }
interface Service { id: string; title: string; }

const AddOnsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");

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

  const addAddOn = async () => {
    if (!user || !selectedService) return;
    const { error } = await supabase.from("add_ons").insert({ user_id: user.id, service_id: selectedService, title: "New Add-on", sort_order: addOns.filter(a => a.service_id === selectedService).length });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { const { data } = await supabase.from("add_ons").select("*").eq("user_id", user.id).order("sort_order"); if (data) setAddOns(data as AddOn[]); }
  };

  const updateAddOn = async (id: string, updates: Partial<AddOn>) => {
    await supabase.from("add_ons").update(updates).eq("id", id);
    setAddOns((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAddOn = async (id: string) => {
    await supabase.from("add_ons").delete().eq("id", id);
    setAddOns((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  const filtered = addOns.filter((a) => a.service_id === selectedService);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add-ons</h2>
      {services.length === 0 ? (
        <p className="text-white/30 text-sm">Create services first to add add-ons.</p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <Label className="text-white/50 text-sm shrink-0">Service:</Label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="h-10 rounded-lg bg-white/5 border border-white/10 text-white px-3 text-sm flex-1"
            >
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <Button onClick={addAddOn} size="sm" className="gap-2 shrink-0" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="space-y-3">
            {filtered.map((addon) => (
              <div key={addon.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Input value={addon.title} onChange={(e) => updateAddOn(addon.id, { title: e.target.value })} className="flex-1 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
                <div className="flex items-center gap-1">
                  <span className="text-white/40 text-sm">$</span>
                  <Input type="number" value={addon.price} onChange={(e) => updateAddOn(addon.id, { price: parseFloat(e.target.value) || 0 })} className="w-24 h-9 bg-white/5 border-white/10 text-white focus-visible:ring-accent" />
                </div>
                <button onClick={() => deleteAddOn(addon.id)} className="text-white/30 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
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
