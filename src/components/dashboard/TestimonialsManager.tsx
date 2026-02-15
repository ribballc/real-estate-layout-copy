import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Star } from "lucide-react";

interface Testimonial { id: string; author: string; content: string; rating: number; }

const TestimonialsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Testimonial[]>([]);

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from("testimonials").select("*").eq("user_id", user.id).order("created_at");
    if (data) setItems(data as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  const add = async () => {
    if (!user) return;
    const { error } = await supabase.from("testimonials").insert({ user_id: user.id, author: "Customer Name", content: "Great service!" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetch();
  };

  const update = async (id: string, updates: Partial<Testimonial>) => {
    await supabase.from("testimonials").update(updates).eq("id", id);
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Testimonials</h2>
        <Button onClick={add} size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" }}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input value={t.author} onChange={(e) => update(t.id, { author: e.target.value })} placeholder="Author name" className="h-9 bg-white/5 border-white/10 text-white font-medium focus-visible:ring-accent" />
                <Textarea value={t.content} onChange={(e) => update(t.id, { content: e.target.value })} placeholder="Testimonial text…" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent min-h-[60px]" />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => update(t.id, { rating: star })} className="transition-colors">
                      <Star className={`w-4 h-4 ${star <= t.rating ? "fill-accent text-accent" : "text-white/20"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => remove(t.id)} className="text-white/30 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-white/30 py-8 text-sm">No testimonials yet.</p>}
      </div>
    </div>
  );
};

export default TestimonialsManager;
