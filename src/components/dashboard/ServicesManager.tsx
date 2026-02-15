import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Star } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
  sort_order: number;
}

const ServicesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    if (!user) return;
    const { data } = await supabase.from("services").select("*").eq("user_id", user.id).order("sort_order");
    if (data) setServices(data as Service[]);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, [user]);

  const addService = async () => {
    if (!user) return;
    const { error } = await supabase.from("services").insert({ user_id: user.id, title: "New Service", sort_order: services.length });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchServices();
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

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <Button onClick={addService} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  value={service.title}
                  onChange={(e) => updateService(service.id, { title: e.target.value })}
                  onBlur={() => updateService(service.id, { title: service.title })}
                  className="h-10 bg-white/5 border-white/10 text-white font-semibold focus-visible:ring-accent"
                />
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(service.id, { description: e.target.value })}
                  placeholder="Description…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent min-h-[60px]"
                />
                <div className="flex items-center gap-3">
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
    </div>
  );
};

export default ServicesManager;
