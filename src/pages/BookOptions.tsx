import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface OptionItem {
  id: string;
  label: string;
  description: string;
  price_modifier: number;
  sort_order: number;
}

interface OptionGroup {
  id: string;
  title: string;
  description: string;
  option_type: string; // 'checkbox' | 'radio' | 'slider'
  required: boolean;
  sort_order: number;
  slider_min: number;
  slider_max: number;
  slider_step: number;
  slider_unit: string;
  slider_default: number;
  items: OptionItem[];
}

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

      const { data: groupsData } = await supabase
        .from("service_option_groups")
        .select("*")
        .eq("service_id", serviceId)
        .order("sort_order");

      if (!groupsData || groupsData.length === 0) {
        setLoading(false);
        // No options configured — skip to add-ons
        navigate(`/site/${slug}/book/add-ons?service=${serviceId}`, { replace: true });
        return;
      }

      const groupIds = groupsData.map((g) => g.id);
      const { data: itemsData } = await supabase
        .from("service_option_items")
        .select("*")
        .in("group_id", groupIds)
        .order("sort_order");

      const enriched: OptionGroup[] = groupsData.map((g) => ({
        ...g,
        slider_min: g.slider_min ?? 0,
        slider_max: g.slider_max ?? 100,
        slider_step: g.slider_step ?? 5,
        slider_unit: g.slider_unit ?? "%",
        slider_default: g.slider_default ?? 50,
        items: (itemsData || []).filter((i) => i.group_id === g.id),
      }));

      // Init slider defaults
      const sliderDefaults: Record<string, number> = {};
      enriched.forEach((g) => {
        if (g.option_type === "slider") sliderDefaults[g.id] = g.slider_default;
      });
      setSliderValues(sliderDefaults);
      setGroups(enriched);
      setLoading(false);
    };
    fetchOptions();
  }, [serviceId, navigate]);

  const toggleCheckbox = (itemId: string) =>
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });

  const selectRadio = (groupId: string, itemId: string) =>
    setRadioSelections((prev) => ({ ...prev, [groupId]: itemId }));

  const canContinue = groups.every((g) => {
    if (!g.required) return true;
    if (g.option_type === "checkbox") return g.items.some((i) => selectedItems.has(i.id));
    if (g.option_type === "radio") return !!radioSelections[g.id];
    return true; // slider always has a value
  });

  if (loading) {
    return (
      <BookingLayout activeStep={2}>
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout activeStep={2}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-2 md:mb-3">
          Customize your {serviceName}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mb-8 md:mb-10 max-w-xl">
          Select the options that apply to your service.
        </p>
      </FadeIn>

      <div className="space-y-8 mb-10">
        {groups.map((group, gi) => (
          <FadeIn key={group.id} delay={100 + gi * 80}>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                {group.title}
                {group.required && <span className="text-red-400 ml-1">*</span>}
              </h2>
              {group.description && (
                <p className="text-sm text-muted-foreground mb-5">{group.description}</p>
              )}

              {/* Checkbox / Radio items */}
              {(group.option_type === "checkbox" || group.option_type === "radio") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.items.map((item) => {
                    const isSelected =
                      group.option_type === "checkbox"
                        ? selectedItems.has(item.id)
                        : radioSelections[group.id] === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          group.option_type === "checkbox"
                            ? toggleCheckbox(item.id)
                            : selectRadio(group.id, item.id)
                        }
                        className={`relative text-left rounded-xl p-4 border transition-all duration-200 ${
                          isSelected
                            ? "border-accent bg-accent/5 shadow-[0_0_12px_hsla(217,91%,60%,0.15)]"
                            : "border-border hover:border-accent/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 w-5 h-5 rounded-${group.option_type === "radio" ? "full" : "md"} flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected
                                ? "bg-accent text-accent-foreground"
                                : "border-2 border-muted-foreground/30"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                            )}
                            {item.price_modifier > 0 && (
                              <span className="text-xs font-semibold text-accent mt-1 inline-block">
                                +${item.price_modifier}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Slider */}
              {group.option_type === "slider" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">
                      {sliderValues[group.id] ?? group.slider_default}
                      {group.slider_unit}
                    </span>
                  </div>
                  <Slider
                    value={[sliderValues[group.id] ?? group.slider_default]}
                    onValueChange={([val]) =>
                      setSliderValues((prev) => ({ ...prev, [group.id]: val }))
                    }
                    min={group.slider_min}
                    max={group.slider_max}
                    step={group.slider_step}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{group.slider_min}{group.slider_unit}</span>
                    <span>{group.slider_max}{group.slider_unit}</span>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Navigation */}
      <FadeIn delay={50}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/site/${slug}/book/vehicle`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => navigate(`/site/${slug}/book/add-ons?service=${serviceId}`)}
            disabled={!canContinue}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] transition-all ${
              canContinue
                ? "bg-accent text-accent-foreground hover:brightness-105"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </FadeIn>
    </BookingLayout>
  );
};

export default BookOptions;
