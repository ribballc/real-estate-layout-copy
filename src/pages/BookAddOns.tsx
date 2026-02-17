import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ArrowRight, Check, Plus } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";

/* ═══════════════════════════════════════════════════════
   CMS-READY CONFIG — replace with DB/API data later
   ═══════════════════════════════════════════════════════ */

interface AddOn {
  id: string;
  title: string;
  description: string;
  price: number;
  popular?: boolean;
}

/** Add-ons keyed by service id (matches services in Book.tsx) */
const addOnsByService: Record<string, AddOn[]> = {
  interior: [
    { id: "leather-conditioning", title: "Leather Conditioning", description: "Premium conditioner to restore & protect leather seats and trim.", price: 60, popular: true },
    { id: "odor-elimination", title: "Odor Elimination", description: "Ozone treatment to neutralize stubborn odors from pets, smoke, and spills.", price: 75 },
    { id: "fabric-protection", title: "Fabric Protection", description: "Stain-resistant coating for upholstery and carpets.", price: 50 },
    { id: "steam-clean", title: "Steam Cleaning", description: "Deep steam extraction for carpets, mats, and hard-to-reach crevices.", price: 80 },
    { id: "dashboard-uv", title: "Dashboard UV Protection", description: "UV protectant to prevent cracking and fading on all interior plastics.", price: 35 },
  ],
  exterior: [
    { id: "clay-bar", title: "Clay Bar Treatment", description: "Remove embedded contaminants for a glass-smooth finish before polish.", price: 80, popular: true },
    { id: "wheel-ceramic", title: "Wheel Ceramic Coat", description: "Ceramic coating for wheels & calipers to repel brake dust and road grime.", price: 120 },
    { id: "trim-restore", title: "Trim Restoration", description: "Restore faded black plastic trim to a rich, factory-fresh look.", price: 45 },
    { id: "headlight-restore", title: "Headlight Restoration", description: "Sand, polish, and seal cloudy or yellowed headlights.", price: 65, popular: true },
    { id: "rain-repel", title: "Rain Repellent Coating", description: "Hydrophobic windshield & glass treatment for improved visibility.", price: 40 },
  ],
  full: [
    { id: "clay-bar", title: "Clay Bar Treatment", description: "Remove embedded contaminants for a glass-smooth finish before polish.", price: 80, popular: true },
    { id: "leather-conditioning", title: "Leather Conditioning", description: "Premium conditioner to restore & protect leather seats and trim.", price: 60 },
    { id: "headlight-restore", title: "Headlight Restoration", description: "Sand, polish, and seal cloudy or yellowed headlights.", price: 65, popular: true },
    { id: "engine-bay", title: "Engine Bay Detail", description: "Full degrease, dress, and protect for a showroom-quality engine bay.", price: 90 },
    { id: "odor-elimination", title: "Odor Elimination", description: "Ozone treatment to neutralize stubborn odors from pets, smoke, and spills.", price: 75 },
    { id: "rain-repel", title: "Rain Repellent Coating", description: "Hydrophobic windshield & glass treatment for improved visibility.", price: 40 },
  ],
  ceramic: [
    { id: "paint-correction-1", title: "Single-Stage Paint Correction", description: "One-step machine polish to remove light swirls before ceramic application.", price: 200, popular: true },
    { id: "paint-correction-2", title: "Two-Stage Paint Correction", description: "Compound + polish for deeper scratches and heavy swirl removal.", price: 350 },
    { id: "wheel-ceramic", title: "Wheel Ceramic Coat", description: "Extend ceramic protection to wheels & calipers.", price: 120 },
    { id: "glass-ceramic", title: "Glass Ceramic Coat", description: "Ceramic coating for all glass surfaces — hydrophobic rain repellent built in.", price: 100 },
    { id: "trim-ceramic", title: "Trim Ceramic Coat", description: "Protect plastic and rubber trim with a dedicated ceramic layer.", price: 80 },
  ],
};

/** Fallback if an unknown service is passed */
const defaultAddOns: AddOn[] = addOnsByService.full;

/* ═══════════════════════════════════════════════════════ */

const BookAddOns = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service") || "full";
  const addOns = addOnsByService[serviceId] ?? defaultAddOns;

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const total = addOns
    .filter((a) => selected.has(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <BookingLayout activeStep={3}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-2 md:mb-3">
          Enhance your detail
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mb-8 md:mb-10 max-w-xl">
          Recommended add-ons for your selected service. Pick as many as you'd like — skip if you're happy with the base package.
        </p>
      </FadeIn>

      {/* Add-on cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {addOns.map((addon, i) => {
          const isSelected = selected.has(addon.id);
          return (
            <FadeIn key={addon.id} delay={100 + i * 60}>
              <button
                onClick={() => toggle(addon.id)}
                className={`group relative w-full text-left rounded-2xl p-6 min-h-[180px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  isSelected
                    ? "ring-2 ring-accent shadow-[0_12px_32px_hsla(217,91%,60%,0.2)]"
                    : "hover:shadow-[0_12px_32px_hsla(217,91%,60%,0.12)]"
                }`}
                style={{
                  background: "linear-gradient(135deg, hsl(215 50% 10%) 0%, hsl(217 33% 17%) 100%)",
                }}
              >
                {addon.popular && (
                  <span className="absolute -top-3 right-4 text-[11px] font-semibold px-3 py-1 rounded-md uppercase tracking-[0.06em] bg-accent text-accent-foreground">
                    Popular
                  </span>
                )}

                {/* Selection indicator */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "border border-primary-foreground/20"
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-primary-foreground/40" />}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-primary-foreground mb-1.5 pr-8">{addon.title}</h3>
                  <p className="text-sm text-primary-foreground/60 leading-relaxed">{addon.description}</p>
                </div>

                <div className="mt-4">
                  <span className="text-lg font-bold text-accent">+${addon.price}</span>
                </div>
              </button>
            </FadeIn>
          );
        })}
      </div>

      {/* Summary + Continue */}
      <FadeIn delay={50}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={() => {
              const selectedAddOns = addOns.filter(a => selected.has(a.id)).map(a => ({ id: a.id, title: a.title, price: a.price }));
              sessionStorage.setItem("booking_addons", JSON.stringify(selectedAddOns));
              navigate(`/site/${slug}/book/booking`);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 min-h-[44px] transition-all duration-300 hover:gap-3"
            style={{
              background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
              color: "hsl(0 0% 100%)",
              boxShadow: "0 4px 12px hsla(217, 91%, 60%, 0.3)",
            }}
          >
            {selected.size > 0 ? "Continue with Add-ons" : "Skip Add-ons"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {selected.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selected.size} add-on{selected.size > 1 ? "s" : ""} selected · <span className="font-semibold text-foreground">+${total}</span>
            </span>
          )}
        </div>
      </FadeIn>
    </BookingLayout>
  );
};

export default BookAddOns;
