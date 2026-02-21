import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Plus } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import { useBooking } from "@/contexts/BookingContext";

interface AddOn { id: string; title: string; description: string; price: number; popular?: boolean; }

/** Map service title to add-on category so only relevant upsells show (no interior add-ons for tint, etc.) */
function getAddOnCategoryForService(serviceTitle: string): string {
  const t = serviceTitle.toLowerCase();
  if (t.includes("interior") && !t.includes("exterior")) return "interior";
  if (t.includes("exterior") || t.includes("wash") || t.includes("hand wash")) return "exterior";
  if (t.includes("ceramic") || t.includes("coat") || t.includes("ppf") || t.includes("paint protection")) return "ceramic";
  if (t.includes("tint") || t.includes("window")) return "tint";
  if (t.includes("wrap") || t.includes("vinyl")) return "wrap";
  if (t.includes("full") || t.includes("detail")) return "full";
  return "full";
}

const addOnsByService: Record<string, AddOn[]> = {
  interior: [
    { id: "leather-conditioning", title: "Leather Conditioning", description: "Premium conditioner to restore & protect leather seats and trim.", price: 60, popular: true },
    { id: "odor-elimination", title: "Odor Elimination", description: "Ozone treatment to neutralize stubborn odors.", price: 75 },
    { id: "fabric-protection", title: "Fabric Protection", description: "Stain-resistant coating for upholstery and carpets.", price: 50 },
    { id: "steam-clean", title: "Steam Cleaning", description: "Deep steam extraction for carpets and crevices.", price: 80 },
    { id: "dashboard-uv", title: "Dashboard UV Protection", description: "UV protectant to prevent cracking and fading.", price: 35 },
  ],
  exterior: [
    { id: "clay-bar", title: "Clay Bar Treatment", description: "Remove contaminants for a glass-smooth finish.", price: 80, popular: true },
    { id: "wheel-ceramic", title: "Wheel Ceramic Coat", description: "Ceramic coating for wheels & calipers.", price: 120 },
    { id: "trim-restore", title: "Trim Restoration", description: "Restore faded black plastic trim.", price: 45 },
    { id: "headlight-restore", title: "Headlight Restoration", description: "Sand, polish, and seal cloudy headlights.", price: 65, popular: true },
    { id: "rain-repel", title: "Rain Repellent Coating", description: "Hydrophobic windshield treatment.", price: 40 },
  ],
  full: [
    { id: "clay-bar", title: "Clay Bar Treatment", description: "Remove contaminants for a glass-smooth finish.", price: 80, popular: true },
    { id: "leather-conditioning", title: "Leather Conditioning", description: "Premium conditioner for leather seats.", price: 60 },
    { id: "headlight-restore", title: "Headlight Restoration", description: "Sand, polish, and seal cloudy headlights.", price: 65, popular: true },
    { id: "engine-bay", title: "Engine Bay Detail", description: "Degrease, dress, and protect your engine bay.", price: 90 },
    { id: "odor-elimination", title: "Odor Elimination", description: "Ozone treatment to neutralize odors.", price: 75 },
    { id: "rain-repel", title: "Rain Repellent Coating", description: "Hydrophobic windshield treatment.", price: 40 },
  ],
  ceramic: [
    { id: "paint-correction-1", title: "Single-Stage Paint Correction", description: "One-step polish to remove light swirls.", price: 200, popular: true },
    { id: "paint-correction-2", title: "Two-Stage Paint Correction", description: "Compound + polish for deeper scratches.", price: 350 },
    { id: "wheel-ceramic", title: "Wheel Ceramic Coat", description: "Ceramic protection for wheels & calipers.", price: 120 },
    { id: "glass-ceramic", title: "Glass Ceramic Coat", description: "Ceramic coating for all glass surfaces.", price: 100 },
    { id: "trim-ceramic", title: "Trim Ceramic Coat", description: "Protect plastic and rubber trim.", price: 80 },
  ],
  tint: [
    { id: "tint-warranty", title: "Extended Warranty", description: "Extended coverage on tint work.", price: 25 },
    { id: "tint-ceramic", title: "Ceramic Tint Upgrade", description: "Premium heat rejection and clarity.", price: 80, popular: true },
  ],
  wrap: [
    { id: "wrap-ppf", title: "PPF on Hood & Bumper", description: "Paint protection on high-impact areas.", price: 150 },
    { id: "wrap-ceramic", title: "Ceramic Over Wrap", description: "Protect and gloss your wrap.", price: 200, popular: true },
  ],
};
const defaultAddOns: AddOn[] = addOnsByService.full;

const BookAddOns = () => {
  const navigate = useNavigate();
  const { slug, service, addons: contextAddons, setAddons } = useBooking();
  const category = service?.title ? getAddOnCategoryForService(service.title) : "full";
  const addOns = addOnsByService[category] ?? defaultAddOns;
  const [selected, setSelected] = useState<Set<string>>(() => {
    const ids = (addOnsByService[category] ?? defaultAddOns).map((a) => a.id);
    return new Set(contextAddons.map((a) => a.id).filter((id) => ids.includes(id)));
  });

  const toggle = (id: string) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const total = addOns.filter((a) => selected.has(a.id)).reduce((s, a) => s + a.price, 0);

  const handleContinue = () => {
    if (!slug) return;
    const sel = addOns.filter((a) => selected.has(a.id)).map((a) => ({ id: a.id, title: a.title, price: a.price }));
    setAddons(sel);
    navigate(`/site/${slug}/book/booking`);
  };

  return (
    <BookingLayout activeStep={3}>
      <FadeIn delay={40}>
        <h1 className="font-heading font-bold tracking-[-0.01em] leading-[1.2] mb-1" style={{ fontSize: 22, color: "hsl(222,47%,11%)" }}>
          Enhance your detail
        </h1>
        <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", marginBottom: 20 }}>
          Optional add-ons — skip if you're happy with the base
        </p>
      </FadeIn>

      <div className="space-y-2.5 mb-8">
        {addOns.map((addon, i) => {
          const isSel = selected.has(addon.id);
          return (
            <FadeIn key={addon.id} delay={60 + i * 35}>
              <button
                onClick={() => toggle(addon.id)}
                className="w-full text-left flex items-center gap-3.5 transition-all duration-150"
                style={{
                  background: isSel ? "hsl(217,91%,98%)" : "white",
                  border: isSel ? "2px solid hsl(217,91%,55%)" : "1px solid hsl(210,40%,90%)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  boxShadow: isSel ? "0 0 0 3px hsla(217,91%,55%,0.12)" : undefined,
                }}
              >
                {/* Indicator */}
                <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0" style={isSel ? { background: "hsl(217,91%,55%)", color: "white" } : { border: "1.5px solid hsl(210,40%,82%)" }}>
                  {isSel ? <Check size={12} /> : <Plus size={12} style={{ color: "hsl(215,16%,65%)" }} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate" style={{ fontSize: 14, color: "hsl(222,47%,11%)" }}>{addon.title}</span>
                    {addon.popular && (
                      <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "hsl(217,91%,96%)", color: "hsl(217,91%,45%)" }}>Popular</span>
                    )}
                  </div>
                  <span className="block truncate" style={{ fontSize: 12, color: "hsl(215,16%,55%)", marginTop: 1 }}>{addon.description}</span>
                </div>

                {/* Price */}
                <span className="font-semibold flex-shrink-0" style={{ fontSize: 14, color: "hsl(217,91%,45%)" }}>+${addon.price}</span>
              </button>
            </FadeIn>
          );
        })}
      </div>

      {/* Summary */}
      {selected.size > 0 && (
        <FadeIn delay={20}>
          <div className="mb-4 px-1" style={{ fontSize: 13, color: "hsl(215,16%,55%)" }}>
            {selected.size} add-on{selected.size > 1 ? "s" : ""} · <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>+${total}</span>
          </div>
        </FadeIn>
      )}

      <StickyBookingCTA>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="public-touch-target inline-flex items-center gap-2 font-semibold min-w-[44px]" style={{ height: 50, padding: "0 20px", borderRadius: 12, fontSize: 14, border: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,11%)", background: "white" }}>
            <ArrowLeft size={15} /> Back
          </button>
          <button onClick={handleContinue} className="public-touch-target flex-1 md:flex-none inline-flex items-center justify-center gap-2 font-bold min-h-[44px]" style={{
            height: 50, borderRadius: 12, fontSize: 15, padding: "0 24px",
            background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(224,91%,48%))", color: "white", boxShadow: "0 4px 16px hsla(217,91%,55%,0.35)",
          }}>
            {selected.size > 0 ? "Continue" : "Skip"} <ArrowRight size={15} />
          </button>
        </div>
      </StickyBookingCTA>
    </BookingLayout>
  );
};

export default BookAddOns;
