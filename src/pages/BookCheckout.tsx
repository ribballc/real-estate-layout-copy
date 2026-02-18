import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2, User, Mail, Phone, MessageSquare, Lock, ShieldCheck, Zap, Clock } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingService { id: string; title: string; price: number; }
interface BookingVehicle { year: string; make: string; model: string; }
interface BookingAddon { id: string; title: string; price: number; }
interface BookingDateTime { date: string; time: string; }

const inputStyle: React.CSSProperties = {
  width: "100%", minHeight: 46, padding: "11px 14px 11px 40px",
  borderRadius: 10, fontSize: 14, outline: "none",
  background: "white", border: "1px solid hsl(210,40%,86%)", color: "hsl(222,47%,11%)",
  transition: "border-color 0.15s, box-shadow 0.15s",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "hsl(217,91%,55%)"; e.target.style.boxShadow = "0 0 0 3px hsla(217,91%,55%,0.12)"; };
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "hsl(210,40%,86%)"; e.target.style.boxShadow = "none"; };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "hsl(215,16%,55%)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
const iconPos: React.CSSProperties = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,60%)", pointerEvents: "none" };

const BookCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false); const [success, setSuccess] = useState(false);
  const [service, setService] = useState<BookingService | null>(null);
  const [vehicle, setVehicle] = useState<BookingVehicle | null>(null);
  const [addons, setAddons] = useState<BookingAddon[]>([]);
  const [dateTime, setDateTime] = useState<BookingDateTime | null>(null);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("booking_service"); if (s) setService(JSON.parse(s));
      const v = sessionStorage.getItem("booking_vehicle"); if (v) setVehicle(JSON.parse(v));
      const a = sessionStorage.getItem("booking_addons"); if (a) setAddons(JSON.parse(a));
      const dt = sessionStorage.getItem("booking_datetime"); if (dt) setDateTime(JSON.parse(dt));
    } catch {}
  }, []);

  const servicePrice = service?.price || 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const totalPrice = servicePrice + addonsTotal;
  const canSubmit = name.trim() && email.trim() && phone.trim() && dateTime && service;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-booking-notification", {
        body: { slug, customer_name: name.trim(), customer_email: email.trim(), customer_phone: phone.trim(), service_title: service!.title, service_price: totalPrice, booking_date: dateTime!.date, booking_time: dateTime!.time, vehicle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "", addons: addons.map((a) => a.title), notes: notes.trim() },
      });
      if (error) throw error;
      sessionStorage.removeItem("booking_service"); sessionStorage.removeItem("booking_vehicle"); sessionStorage.removeItem("booking_addons"); sessionStorage.removeItem("booking_datetime");
      setSuccess(true);
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <BookingLayout activeStep={5}>
        <FadeIn delay={50}>
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: "hsl(142,71%,94%)" }}>
              <CheckCircle2 size={28} style={{ color: "hsl(142,71%,35%)" }} />
            </div>
            <h1 className="font-heading font-bold tracking-[-0.01em] mb-2" style={{ fontSize: 24, color: "hsl(222,47%,11%)" }}>Booking Confirmed!</h1>
            <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", maxWidth: 380, lineHeight: 1.6 }}>
              Thank you, {name}! Your appointment is on <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>{dateTime?.date}</span> at <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>{dateTime?.time}</span>. You'll receive a confirmation shortly.
            </p>
            <a href={`/site/${slug}`} className="mt-6 inline-flex items-center gap-2 font-bold" style={{ height: 46, padding: "0 24px", borderRadius: 10, fontSize: 14, background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(224,91%,48%))", color: "white" }}>
              Back to Website
            </a>
          </div>
        </FadeIn>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout activeStep={5}>
      <FadeIn delay={40}>
        <h1 className="font-heading font-bold tracking-[-0.01em] leading-[1.2] mb-6" style={{ fontSize: 22, color: "hsl(222,47%,11%)" }}>
          Complete your booking
        </h1>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 space-y-5">
          {/* Section header */}
          <FadeIn delay={60}>
            <div style={{ ...labelStyle, borderBottom: "1px solid hsl(210,40%,92%)", paddingBottom: 8, marginBottom: 14 }}>Contact Details</div>
          </FadeIn>

          {[
            { label: "Full Name", icon: User, val: name, set: setName, ph: "John Doe", type: "text", max: 100 },
            { label: "Email", icon: Mail, val: email, set: setEmail, ph: "john@example.com", type: "email", max: 255 },
            { label: "Phone", icon: Phone, val: phone, set: setPhone, ph: "(555) 123-4567", type: "tel", max: 20 },
          ].map(({ label, icon: Ic, val, set, ph, type, max }, idx) => (
            <FadeIn key={label} delay={80 + idx * 30}>
              <div className="space-y-1">
                <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(222,47%,11%)" }}>{label} *</label>
                <div className="relative">
                  <Ic size={15} style={iconPos} />
                  <input type={type} value={val} onChange={(e) => set(e.target.value)} placeholder={ph} maxLength={max} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={170}>
            <div className="space-y-1">
              <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(222,47%,11%)" }}>Notes (optional)</label>
              <div className="relative">
                <MessageSquare size={15} style={{ ...iconPos, top: 16, transform: "none" }} />
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requests..." maxLength={1000} style={{ ...inputStyle, minHeight: 90, paddingTop: 12, resize: "vertical" }} onFocus={onFocus as any} onBlur={onBlur as any} />
              </div>
            </div>
          </FadeIn>

          {/* Submit */}
          <FadeIn delay={200}>
            <button onClick={handleSubmit} disabled={!canSubmit || submitting}
              className="w-full inline-flex items-center justify-center gap-2 font-bold transition-all duration-150"
              style={{
                height: 52, borderRadius: 12, fontSize: 16,
                ...(canSubmit && !submitting
                  ? { background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(224,91%,48%))", color: "white", boxShadow: "0 4px 20px hsla(217,91%,55%,0.4)" }
                  : { background: "hsl(210,40%,92%)", color: "hsl(215,16%,60%)", cursor: "not-allowed", opacity: 0.45 }),
              }}
              onMouseEnter={(e) => { if (canSubmit && !submitting) e.currentTarget.style.filter = "brightness(1.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
              onMouseDown={(e) => { if (canSubmit) e.currentTarget.style.transform = "scale(0.99)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {submitting ? (<><Loader2 size={16} className="animate-spin" /> Processing...</>) : (<><Lock size={16} /> Confirm & Book</>)}
            </button>
          </FadeIn>

          {/* Trust row */}
          <FadeIn delay={220}>
            <div className="flex items-center justify-center gap-5 pt-2 flex-wrap">
              {[
                { icon: ShieldCheck, text: "SSL Secured" },
                { icon: Clock, text: "No-show protection" },
                { icon: Zap, text: "Instant confirmation" },
              ].map(({ icon: Ic, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Ic size={13} style={{ color: "hsl(142,71%,45%)" }} />
                  <span style={{ fontSize: 12, color: "hsl(215,16%,55%)" }}>{text}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Summary */}
        <FadeIn delay={100}>
          <div className="w-full lg:w-[300px] h-fit lg:sticky lg:top-[76px] rounded-xl p-[18px] space-y-3" style={{ background: "hsl(210,40%,97%)", border: "1px solid hsl(210,40%,90%)" }}>
            <div style={{ ...labelStyle, borderBottom: "1px solid hsl(210,40%,92%)", paddingBottom: 8, marginBottom: 10 }}>Order Summary</div>

            {service && (
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span style={{ color: "hsl(222,47%,20%)" }}>{service.title}</span>
                <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>${servicePrice}</span>
              </div>
            )}

            {vehicle && (
              <div style={{ fontSize: 13, color: "hsl(222,47%,20%)" }}>🚗 {vehicle.year} {vehicle.make} {vehicle.model}</div>
            )}

            {addons.length > 0 && (
              <div className="space-y-1 pt-2" style={{ borderTop: "1px solid hsl(210,40%,90%)" }}>
                {addons.map((a) => (
                  <div key={a.id} className="flex justify-between" style={{ fontSize: 13 }}>
                    <span style={{ color: "hsl(222,47%,20%)" }}>{a.title}</span>
                    <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>+${a.price}</span>
                  </div>
                ))}
              </div>
            )}

            {dateTime && (
              <div className="pt-2" style={{ borderTop: "1px solid hsl(210,40%,90%)", fontSize: 13, color: "hsl(222,47%,20%)" }}>
                📅 {dateTime.date} at {dateTime.time}
              </div>
            )}

            <div className="flex justify-between items-baseline pt-3" style={{ borderTop: "1px solid hsl(210,40%,90%)", marginTop: 12 }}>
              <span className="font-bold" style={{ fontSize: 16, color: "hsl(222,47%,11%)" }}>Total</span>
              <span className="font-bold" style={{ fontSize: 20, color: "hsl(217,91%,45%)" }}>${totalPrice}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </BookingLayout>
  );
};

export default BookCheckout;
