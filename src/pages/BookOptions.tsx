import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface OptionItem { id: string; label: string; description: string; price_modifier: number; sort_order: number; }
interface OptionGroup { id: string; title: string; description: string; option_type: string; required: boolean; sort_order: number; slider_min: number; slider_max: number; slider_step: number; slider_unit: string; slider_default: number; items: OptionItem[]; }

const BookOptions = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service") || "";
  const serviceName = searchParams.get("name") || "your service";

  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchOptions = async () => {
      if (!serviceId) { setLoading(false); return; }
      const { data: groupsData } = await supabase.from("service_option_groups").select("*").eq("service_id", serviceId).order("sort_order");
      if (!groupsData || groupsData.length === 0) { setLoading(false); navigate(`/site/${slug}/book/add-ons?service=${serviceId}`, { replace: true }); return; }
      const groupIds = groupsData.map((g) => g.id);
      const { data: itemsData } = await supabase.from("service_option_items").select("*").in("group_id", groupIds).order("sort_order");
      const enriched: OptionGroup[] = groupsData.map((g) => ({ ...g, slider_min: g.slider_min ?? 0, slider_max: g.slider_max ?? 100, slider_step: g.slider_step ?? 5, slider_unit: g.slider_unit ?? "%", slider_default: g.slider_default ?? 50, items: (itemsData || []).filter((i) => i.group_id === g.id) }));
      const sd: Record<string, number> = {};
      enriched.forEach((g) => { if (g.option_type === "slider") sd[g.id] = g.slider_default; });
      setSliderValues(sd); setGroups(enriched); setLoading(false);
    };
    fetchOptions();
  }, [serviceId, navigate]);

  const toggleCheckbox = (id: string) => setSelectedItems((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectRadio = (gid: string, iid: string) => setRadioSelections((p) => ({ ...p, [gid]: iid }));

  const canContinue = groups.every((g) => {
    if (!g.required) return true;
    if (g.option_type === "checkbox") return g.items.some((i) => selectedItems.has(i.id));
    if (g.option_type === "radio") return !!radioSelections[g.id];
    return true;
  });

  if (loading) {
    return (
      <BookingLayout activeStep={2}>
        <div className="flex justify-center py-20">
          <div className="w-5 h-5 rounded-full animate-spin" style={{ border: "2px solid hsl(217,91%,55%)", borderTopColor: "transparent" }} />
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout activeStep={2}>
      <FadeIn delay={40}>
        <h1 className="font-heading font-bold tracking-[-0.01em] leading-[1.2] mb-1" style={{ fontSize: 22, color: "hsl(222,47%,11%)" }}>
          Customize your {serviceName}
        </h1>
        <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", marginBottom: 20 }}>Select the options that apply</p>
      </FadeIn>

      <div className="space-y-5 mb-8">
        {groups.map((group, gi) => (
          <FadeIn key={group.id} delay={60 + gi * 50}>
            <div className="rounded-[14px] p-5 md:p-6" style={{ background: "white", border: "1px solid hsl(210,40%,90%)", boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)" }}>
              <h2 className="font-semibold mb-0.5" style={{ fontSize: 15, color: "hsl(222,47%,11%)" }}>
                {group.title}{group.required && <span style={{ color: "hsl(0,84%,55%)", marginLeft: 3 }}>*</span>}
              </h2>
              {group.description && <p className="mb-4" style={{ fontSize: 13, color: "hsl(215,16%,55%)" }}>{group.description}</p>}

              {(group.option_type === "checkbox" || group.option_type === "radio") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.items.map((item) => {
                    const isSel = group.option_type === "checkbox" ? selectedItems.has(item.id) : radioSelections[group.id] === item.id;
                    return (
                      <button key={item.id} onClick={() => group.option_type === "checkbox" ? toggleCheckbox(item.id) : selectRadio(group.id, item.id)}
                        className="text-left rounded-xl p-3.5 transition-all duration-150"
                        style={{ border: isSel ? "2px solid hsl(217,91%,55%)" : "1px solid hsl(210,40%,90%)", background: isSel ? "hsl(217,91%,98%)" : "white", boxShadow: isSel ? "0 0 0 3px hsla(217,91%,55%,0.1)" : undefined }}>
                        <div className="flex items-start gap-2.5">
                          <div className={`mt-0.5 w-[18px] h-[18px] flex items-center justify-center flex-shrink-0 ${group.option_type === "radio" ? "rounded-full" : "rounded"}`}
                            style={isSel ? { background: "hsl(217,91%,55%)", color: "white" } : { border: "2px solid hsl(210,40%,82%)" }}>
                            {isSel && <Check size={11} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block font-medium" style={{ fontSize: 14, color: "hsl(222,47%,11%)" }}>{item.label}</span>
                            {item.description && <p style={{ fontSize: 12, color: "hsl(215,16%,55%)", marginTop: 2 }}>{item.description}</p>}
                            {item.price_modifier > 0 && <span className="font-semibold inline-block mt-1" style={{ fontSize: 12, color: "hsl(217,91%,45%)" }}>+${item.price_modifier}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {group.option_type === "slider" && (
                <div className="space-y-3 mt-2">
                  <span className="text-xl font-bold" style={{ color: "hsl(222,47%,11%)" }}>{sliderValues[group.id] ?? group.slider_default}{group.slider_unit}</span>
                  <Slider value={[sliderValues[group.id] ?? group.slider_default]} onValueChange={([v]) => setSliderValues((p) => ({ ...p, [group.id]: v }))} min={group.slider_min} max={group.slider_max} step={group.slider_step} className="w-full" />
                  <div className="flex justify-between" style={{ fontSize: 12, color: "hsl(215,16%,55%)" }}>
                    <span>{group.slider_min}{group.slider_unit}</span><span>{group.slider_max}{group.slider_unit}</span>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/site/${slug}/book/vehicle`)} className="inline-flex items-center gap-2 font-semibold" style={{ height: 50, padding: "0 20px", borderRadius: 12, fontSize: 14, border: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,11%)", background: "white" }}>
          <ArrowLeft size={15} /> Back
        </button>
        <button onClick={() => navigate(`/site/${slug}/book/add-ons?service=${serviceId}`)} disabled={!canContinue} className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 font-bold" style={{
          height: 50, borderRadius: 12, fontSize: 15, padding: "0 24px",
          ...(canContinue ? { background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(224,91%,48%))", color: "white", boxShadow: "0 4px 16px hsla(217,91%,55%,0.35)" } : { background: "hsl(210,40%,92%)", color: "hsl(215,16%,60%)", cursor: "not-allowed", opacity: 0.45 }),
        }}>
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </BookingLayout>
  );
};

export default BookOptions;
