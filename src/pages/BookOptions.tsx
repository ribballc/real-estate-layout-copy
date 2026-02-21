import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import VehicleIllustration from "@/components/VehicleIllustration";
import { Slider } from "@/components/ui/slider";
import { useBooking } from "@/contexts/BookingContext";
import { supabase } from "@/integrations/supabase/client";

interface OptionItem { id: string; label: string; description: string; price_modifier: number; sort_order: number; }
interface OptionGroup { id: string; title: string; description: string; option_type: string; required: boolean; sort_order: number; slider_min: number; slider_max: number; slider_step: number; slider_unit: string; slider_default: number; items: OptionItem[]; }

const WRAP_RENDER_MS = 2200;

const WRAP_COLORS = [
  { name: "Gloss Black", hex: "#0a0a0a" },
  { name: "Matte Black", hex: "#1a1a1a" },
  { name: "Satin Black", hex: "#252525" },
  { name: "Gloss White", hex: "#f5f5f5" },
  { name: "Matte White", hex: "#e8e8e8" },
  { name: "Satin Grey", hex: "#6b7280" },
  { name: "Nardo Grey", hex: "#6b6b6b" },
  { name: "Gloss Red", hex: "#b91c1c" },
  { name: "Matte Army Green", hex: "#374151" },
  { name: "Midnight Blue", hex: "#1e3a5f" },
  { name: "Gloss Blue", hex: "#1d4ed8" },
  { name: "Champagne", hex: "#a8a29e" },
  { name: "Matte PPF Clear", hex: "rgba(255,255,255,0.03)" },
];

const BookOptions = () => {
  const navigate = useNavigate();
  const { slug, service, vehicle, vehicleImageUrl } = useBooking();
  const serviceId = service?.id ?? "";
  const serviceName = service?.title ?? "your service";

  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [wrapColor, setWrapColor] = useState(WRAP_COLORS[0]);
  const [wrapRevealReady, setWrapRevealReady] = useState(false);
  const wrapRenderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTintService = useMemo(() => {
    const n = serviceName.toLowerCase();
    if (n.includes("tint")) return true;
    return groups.some((g) => g.option_type === "slider" && (g.title.toLowerCase().includes("tint") || (g.slider_unit === "%" && g.slider_max <= 100)));
  }, [serviceName, groups]);

  const isWrapService = useMemo(() => {
    const n = serviceName.toLowerCase();
    return n.includes("wrap") || n.includes("vinyl");
  }, [serviceName]);

  const tintSliderGroup = useMemo(() => groups.find((g) => g.option_type === "slider" && (g.title.toLowerCase().includes("tint") || g.slider_unit === "%")), [groups]);
  const tintValue = tintSliderGroup ? (sliderValues[tintSliderGroup.id] ?? tintSliderGroup.slider_default) : 50;
  const showVisualizer = vehicle && (isTintService || isWrapService);

  useEffect(() => {
    if (!showVisualizer || !isWrapService) return;
    setWrapRevealReady(false);
    wrapRenderTimeoutRef.current = setTimeout(() => setWrapRevealReady(true), WRAP_RENDER_MS);
    return () => {
      if (wrapRenderTimeoutRef.current) clearTimeout(wrapRenderTimeoutRef.current);
    };
  }, [showVisualizer, isWrapService]);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!serviceId) { setLoading(false); return; }
      const { data: groupsData } = await supabase.from("service_option_groups").select("*").eq("service_id", serviceId).order("sort_order");
      if (!groupsData || groupsData.length === 0) { setLoading(false); if (slug) navigate(`/site/${slug}/book/add-ons`, { replace: true }); return; }
      const groupIds = groupsData.map((g) => g.id);
      const { data: itemsData } = await supabase.from("service_option_items").select("*").in("group_id", groupIds).order("sort_order");
      const enriched: OptionGroup[] = groupsData.map((g) => ({ ...g, slider_min: g.slider_min ?? 0, slider_max: g.slider_max ?? 100, slider_step: g.slider_step ?? 5, slider_unit: g.slider_unit ?? "%", slider_default: g.slider_default ?? 50, items: (itemsData || []).filter((i) => i.group_id === g.id) }));
      const sd: Record<string, number> = {};
      enriched.forEach((g) => { if (g.option_type === "slider") sd[g.id] = g.slider_default; });
      setSliderValues(sd); setGroups(enriched); setLoading(false);
    };
    fetchOptions();
  }, [serviceId, navigate, slug]);

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

      {showVisualizer && (
        <FadeIn delay={60}>
          <div className="rounded-[14px] overflow-hidden mb-6" style={{ background: "white", border: "1px solid hsl(210,40%,90%)", boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)" }}>
            <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(210,40%,92%)" }}>
              <span className="text-sm font-semibold" style={{ color: "hsl(222,47%,11%)" }}>
                {vehicle?.year} {vehicle?.make} {vehicle?.model} — Preview
              </span>
            </div>
            <div className="relative flex flex-col items-center justify-center p-4 md:p-6" style={{ minHeight: 240 }}>
              {isWrapService && !wrapRevealReady ? (
                <div className="w-full max-w-[380px] rounded-xl overflow-hidden flex flex-col items-center justify-center py-12 px-6" style={{ background: "linear-gradient(180deg, hsl(210,40%,98%) 0%, hsl(210,35%,95%) 100%)", minHeight: 200 }}>
                  <div className="w-12 h-12 rounded-full border-2 border-t-[var(--site-primary,hsl(217,91%,55%))] border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
                  <p className="font-semibold text-base mb-1" style={{ color: "hsl(222,47%,11%)" }}>Rendering your wrap</p>
                  <p className="text-sm" style={{ color: "hsl(215,16%,50%)" }}>Same car, your color — one moment</p>
                  <div className="mt-6 w-full max-w-[280px] h-1 rounded-full overflow-hidden" style={{ background: "hsl(210,40%,90%)" }}>
                    <div className="wrap-progress-bar h-full rounded-full max-w-full" style={{ background: "var(--site-primary, hsl(217,91%,55%))", width: "100%" }} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-[380px] rounded-xl overflow-hidden" style={{ aspectRatio: "2/1", background: "hsl(210,40%,94%)" }}>
                  <div className={`absolute inset-0 flex items-center justify-center ${isWrapService ? "wrap-reveal-animation" : ""}`}>
                    {vehicleImageUrl ? (
                      <img src={vehicleImageUrl} alt="" className="absolute inset-0 w-full h-full object-contain" />
                    ) : (
                      <VehicleIllustration className="w-full h-full object-contain" bodyColor="hsl(210,20%,85%)" />
                    )}
                  </div>
                  {isTintService && (
                    <div className="absolute inset-0 pointer-events-none transition-opacity duration-200" style={{ background: "#0a0a0a", opacity: 1 - tintValue / 100 }} aria-hidden />
                  )}
                  {isWrapService && wrapColor.hex !== "rgba(255,255,255,0.03)" && (
                    <div className="absolute inset-0 pointer-events-none transition-colors duration-300" style={{ background: wrapColor.hex, opacity: 0.52, mixBlendMode: "multiply" }} aria-hidden />
                  )}
                  {isWrapService && wrapColor.hex === "rgba(255,255,255,0.03)" && (
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(255,255,255,0.12)" }} aria-hidden />
                  )}
                </div>
              )}
              {isWrapService && wrapRevealReady && (
                <div className="mt-4 w-full max-w-[380px]">
                  <label className="block text-xs font-medium mb-2" style={{ color: "hsl(215,16%,55%)" }}>Wrap color</label>
                  <select
                    value={wrapColor.name}
                    onChange={(e) => setWrapColor(WRAP_COLORS.find((c) => c.name === e.target.value) ?? WRAP_COLORS[0])}
                    className="w-full rounded-xl border px-4 py-3 text-base min-h-[44px]"
                    style={{ borderColor: "hsl(210,40%,88%)", color: "hsl(222,47%,11%)", background: "white" }}
                  >
                    {WRAP_COLORS.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2 overflow-x-auto pb-1">
                    {WRAP_COLORS.slice(0, 8).map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setWrapColor(c)}
                        className="public-touch-target rounded-lg border-2 transition-all min-w-[44px] min-h-[44px] flex-shrink-0"
                        style={{
                          background: c.hex.startsWith("rgba") ? "hsl(210,40%,92%)" : c.hex,
                          borderColor: wrapColor.name === c.name ? "hsl(217,91%,55%)" : "hsl(210,40%,85%)",
                          boxShadow: wrapColor.name === c.name ? "0 0 0 2px hsla(217,91%,55%,0.3)" : undefined,
                        }}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              {isTintService && tintSliderGroup && (
                <p className="mt-3 text-sm font-medium" style={{ color: "hsl(215,16%,50%)" }}>
                  {tintValue}% VLT — how dark your windows will look
                </p>
              )}
            </div>
          </div>
          <style>{`
            .wrap-progress-bar { transform-origin: left; animation: wrapProgress 2.2s ease-in-out forwards; }
            @keyframes wrapProgress {
              0% { transform: scaleX(0); }
              100% { transform: scaleX(1); }
            }
            .wrap-reveal-animation {
              animation: wrapReveal 0.8s ease-out forwards;
            }
            @keyframes wrapReveal {
              0% { clip-path: inset(0 100% 0 0); opacity: 0.6; }
              100% { clip-path: inset(0 0 0 0); opacity: 1; }
            }
          `}</style>
        </FadeIn>
      )}

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
                      <button key={item.id} type="button" onClick={() => group.option_type === "checkbox" ? toggleCheckbox(item.id) : selectRadio(group.id, item.id)}
                        className="public-touch-target text-left rounded-xl p-3.5 min-h-[44px] transition-all duration-150"
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
                  <Slider
                    value={[sliderValues[group.id] ?? group.slider_default]}
                    onValueChange={([v]) => setSliderValues((p) => ({ ...p, [group.id]: v }))}
                    min={group.slider_min}
                    max={group.slider_max}
                    step={group.slider_step}
                    className="w-full [&_[role=slider]]:min-w-[44px] [&_[role=slider]]:min-h-[44px] [&_[role=slider]]:-ml-3"
                  />
                  <div className="flex justify-between" style={{ fontSize: 12, color: "hsl(215,16%,55%)" }}>
                    <span>{group.slider_min}{group.slider_unit}</span><span>{group.slider_max}{group.slider_unit}</span>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      <StickyBookingCTA>
        <div className="flex items-center gap-3">
          <button onClick={() => slug && navigate(`/site/${slug}/book/vehicle`)} className="public-touch-target inline-flex items-center gap-2 font-semibold min-w-[44px]" style={{ height: 50, padding: "0 20px", borderRadius: 12, fontSize: 14, border: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,11%)", background: "white" }}>
            <ArrowLeft size={15} /> Back
          </button>
          <button onClick={() => slug && navigate(`/site/${slug}/book/add-ons`)} disabled={!canContinue} className="public-touch-target flex-1 md:flex-none inline-flex items-center justify-center gap-2 font-bold min-h-[44px]" style={{
            height: 50, borderRadius: 12, fontSize: 15, padding: "0 24px",
            ...(canContinue ? { background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(224,91%,48%))", color: "white", boxShadow: "0 4px 16px hsla(217,91%,55%,0.35)" } : { background: "hsl(210,40%,92%)", color: "hsl(215,16%,60%)", cursor: "not-allowed", opacity: 0.45 }),
          }}>
            Continue <ArrowRight size={15} />
          </button>
        </div>
      </StickyBookingCTA>
    </BookingLayout>
  );
};

export default BookOptions;
