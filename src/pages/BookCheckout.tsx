import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, User, Mail, Phone, MessageSquare, Lock, ShieldCheck, Zap, Clock, RefreshCw, Calendar, ChevronLeft, Pencil } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import { useBooking } from "@/contexts/BookingContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BOOKING, BOOKING_CTA_GRADIENT, BOOKING_CTA_SHADOW } from "@/lib/bookingTheme";

interface BookingService { id: string; title: string; price: number; }
interface BookingVehicle { year: string; make: string; model: string; }
interface BookingAddon { id: string; title: string; price: number; }
interface BookingDateTime { date: string; time: string; }

const inputStyle: React.CSSProperties = {
  width: "100%", minHeight: 48, padding: "12px 14px 12px 40px",
  borderRadius: 10, fontSize: 16, outline: "none",
  background: BOOKING.surface, border: `1px solid ${BOOKING.border}`, color: BOOKING.text,
  transition: "border-color 0.15s, box-shadow 0.15s",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = BOOKING.primary; e.target.style.boxShadow = "0 0 0 3px hsla(217, 91%, 52%, 0.14)"; };
const onBlurDefault = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = BOOKING.border; e.target.style.boxShadow = "none"; };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: BOOKING.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
const orderSummaryCardStyle: React.CSSProperties = { background: BOOKING.summaryBg, border: `1px solid ${BOOKING.summaryBorder}`, boxShadow: BOOKING.summaryShadow };
const iconPos: React.CSSProperties = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,60%)", pointerEvents: "none" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { service, vehicle, vehicles, addons, dateTime, clearBooking } = useBooking();
  const displayVehicles = vehicles.length > 0 ? vehicles : (vehicle ? [vehicle] : []);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false); const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const [confirmedAt, setConfirmedAt] = useState<{ date: string; time: string } | null>(null);

  const servicePrice = service?.price || 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  const totalPrice = servicePrice + addonsTotal;

  const nameValid = name.trim().length >= 2;
  const emailValid = EMAIL_RE.test(email.trim());
  const phoneValid = phone.replace(/\D/g, "").length >= 10;
  const canSubmit = nameValid && emailValid && phoneValid && dateTime && service;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const vehicleList = displayVehicles.map((v) => `${v.year} ${v.make} ${v.model}`).join("; ");
      const { error } = await supabase.functions.invoke("send-booking-notification", {
        body: { slug, customer_name: name.trim(), customer_email: email.trim(), customer_phone: phone.trim(), service_title: service!.title, service_price: totalPrice, booking_date: dateTime!.date, booking_time: dateTime!.time, vehicle: vehicleList, vehicles: displayVehicles.map((v) => `${v.year} ${v.make} ${v.model}`), addons: addons.map((a) => a.title), notes: notes.trim() },
      });
      if (error) throw error;
      setConfirmedAt(dateTime ? { date: dateTime.date, time: dateTime.time } : null);
      clearBooking();
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.message || "Something went wrong. Please try again.";
      setSubmitError(msg);
      toast({ title: "Booking failed", description: msg, variant: "destructive" });
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
              Thank you, {name}! Your appointment is on {confirmedAt ? (<><span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>{confirmedAt.date}</span> at <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>{confirmedAt.time}</span></>) : "the selected date and time"}. You'll receive a confirmation shortly.
            </p>
            <a href={`/site/${slug}`} className="mt-6 inline-flex items-center gap-2 font-bold" style={{ height: 46, padding: "0 24px", borderRadius: 10, fontSize: 14, background: BOOKING_CTA_GRADIENT, color: "white" }}>
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

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Form column */}
        <div className="flex-1 space-y-5 order-2 lg:order-1">
          {/* Section header */}
          <FadeIn delay={60}>
            <div style={{ ...labelStyle, borderBottom: "1px solid hsl(210,40%,92%)", paddingBottom: 8, marginBottom: 14 }}>Contact Details</div>
          </FadeIn>

          {[
            { label: "Full Name", icon: User, val: name, set: setName, ph: "John Doe", type: "text", max: 100, autoComplete: "name", valid: nameValid, touchedKey: "name" as const, errMsg: "Enter at least 2 characters" },
            { label: "Email", icon: Mail, val: email, set: setEmail, ph: "john@example.com", type: "email", max: 255, autoComplete: "email", valid: emailValid, touchedKey: "email" as const, errMsg: "Enter a valid email" },
            { label: "Phone", icon: Phone, val: phone, set: setPhone, ph: "(555) 123-4567", type: "tel", max: 20, autoComplete: "tel", valid: phoneValid, touchedKey: "phone" as const, errMsg: "Enter at least 10 digits" },
          ].map(({ label, icon: Ic, val, set, ph, type, max, autoComplete, valid, touchedKey, errMsg }, idx) => (
            <FadeIn key={label} delay={80 + idx * 30}>
              <div className="space-y-1">
                <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(222,47%,11%)" }}>{label} *</label>
                <div className="relative">
                  <Ic size={15} style={iconPos} />
                  <input
                    type={type}
                    value={val}
                    onChange={(e) => { set(e.target.value); setSubmitError(null); }}
                    onBlur={(e) => {
                      setTouched((t) => ({ ...t, [touchedKey]: true }));
                      if (valid) onBlurDefault(e);
                      else { e.target.style.borderColor = "hsl(0,84%,60%)"; e.target.style.boxShadow = "0 0 0 1px hsl(0,84%,60%)"; }
                    }}
                    placeholder={ph}
                    maxLength={max}
                    autoComplete={autoComplete}
                    style={{ ...inputStyle, ...(touched[touchedKey] && !valid ? { borderColor: "hsl(0,84%,60%)", boxShadow: "0 0 0 1px hsl(0,84%,60%)" } : {}) }}
                    onFocus={onFocus}
                  />
                </div>
                {touched[touchedKey] && !valid && <p style={{ fontSize: 12, color: "hsl(0,84%,50%)", marginTop: 4 }}>{errMsg}</p>}
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={170}>
            <div className="space-y-1">
              <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(222,47%,11%)" }}>Notes (optional)</label>
              <div className="relative">
                <MessageSquare size={15} style={{ ...iconPos, top: 16, transform: "none" }} />
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requests..." maxLength={1000} style={{ ...inputStyle, minHeight: 90, paddingTop: 12, resize: "vertical" }} onFocus={onFocus as any} onBlur={onBlurDefault} />
              </div>
            </div>
          </FadeIn>

          {/* Order summary on mobile: visible above CTA with spacing */}
          <div className="lg:hidden mt-4 mb-5 rounded-xl p-4 space-y-3 overflow-visible" style={orderSummaryCardStyle}>
            <div style={{ ...labelStyle, borderBottom: "1px solid hsl(210,40%,92%)", paddingBottom: 8, marginBottom: 6 }}>Order Summary</div>
            {service && (
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span style={{ color: "hsl(222,47%,20%)" }}>{service.title}</span>
                <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>${servicePrice}</span>
              </div>
            )}
            {displayVehicles.length > 0 && (
              <div className="space-y-1" style={{ fontSize: 13, color: "hsl(222,47%,20%)" }}>
                {displayVehicles.map((v, i) => (
                  <div key={i}>🚗 {v.year} {v.make} {v.model}</div>
                ))}
              </div>
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
            <div className="flex justify-between items-baseline pt-3" style={{ borderTop: "1px solid hsl(210,40%,90%)", marginTop: 8 }}>
              <span className="font-bold" style={{ fontSize: 16, color: "hsl(222,47%,11%)" }}>Total</span>
              <span className="font-bold" style={{ fontSize: 18, color: BOOKING.primaryMuted }}>${totalPrice}</span>
            </div>
          </div>

          {/* Submit error + retry */}
          {submitError && (
            <FadeIn delay={0}>
              <div className="rounded-xl p-4 mb-4 flex flex-col gap-3" style={{ background: "hsl(0,84%,97%)", border: "1px solid hsl(0,84%,85%)" }}>
                <p className="text-sm" style={{ color: "hsl(0,84%,35%)" }}>{submitError}</p>
                <div className="flex flex-wrap gap-2">
                  {(submitError.toLowerCase().includes("no longer available") || submitError.toLowerCase().includes("time slot")) && (
                    <button onClick={() => { setSubmitError(null); slug && navigate(`/site/${slug}/book/booking`); }} className="public-touch-target inline-flex items-center gap-2 font-semibold" style={{ minHeight: 44, padding: "0 16px", borderRadius: 8, fontSize: 13, background: BOOKING.primary, color: "white" }}>
                      <Calendar size={14} /> Choose different time
                    </button>
                  )}
                  <button onClick={() => { setSubmitError(null); handleSubmit(); }} disabled={submitting} className="public-touch-target inline-flex items-center gap-2 font-semibold" style={{ minHeight: 44, padding: "0 16px", borderRadius: 8, fontSize: 13, background: "hsl(0,84%,45%)", color: "white" }}>
                    <RefreshCw size={14} className={submitting ? "animate-spin" : ""} /> Retry
                  </button>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Back / change links + Submit + Trust — edit links close together, compact padding */}
          <StickyBookingCTA>
            <FadeIn delay={200}>
              <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2">
                <button type="button" onClick={() => slug && navigate(`/site/${slug}/book`)} className="public-touch-target inline-flex items-center gap-1.5 font-medium min-h-[40px] px-2 -ml-2 rounded-lg shrink-0" style={{ fontSize: 13, color: "hsl(215,16%,55%)" }} aria-label="Back">
                  <ChevronLeft size={18} /> Back
                </button>
                <div className="flex items-center gap-2 flex-wrap justify-end min-w-0">
                  <button type="button" onClick={() => slug && navigate(`/site/${slug}/book`)} className="public-touch-target inline-flex items-center gap-1 font-medium min-h-[40px] px-2 rounded-lg shrink-0" style={{ fontSize: 13, color: BOOKING.primary }}>
                    <Pencil size={14} /> Change service
                  </button>
                  <button type="button" onClick={() => slug && navigate(`/site/${slug}/book/vehicle`)} className="public-touch-target inline-flex items-center gap-1 font-medium min-h-[40px] px-2 rounded-lg shrink-0" style={{ fontSize: 13, color: BOOKING.primary }}>
                    <Pencil size={14} /> Change vehicle
                  </button>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                className="public-touch-target w-full inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 min-h-[52px]"
                style={{
                  height: 52, borderRadius: 12, fontSize: 16,
                  ...(canSubmit && !submitting
                    ? { background: BOOKING_CTA_GRADIENT, color: "white", boxShadow: BOOKING_CTA_SHADOW }
                    : { background: BOOKING.borderLight, color: BOOKING.textMuted, cursor: "not-allowed", opacity: 0.45 }),
                }}
                onMouseEnter={(e) => { if (canSubmit && !submitting) e.currentTarget.style.filter = "brightness(1.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
                onMouseDown={(e) => { if (canSubmit) e.currentTarget.style.transform = "scale(0.99)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                {submitting ? (<><Loader2 size={16} className="animate-spin" /> Processing...</>) : (<><Lock size={16} /> Confirm & Book</>)}
              </button>
              <div className="flex items-center justify-center gap-5 pt-3 flex-wrap">
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
          </StickyBookingCTA>
        </div>

        {/* Summary — desktop only; on mobile summary is inline after notes */}
        <FadeIn delay={100} className="hidden lg:block order-2 lg:order-2 w-full lg:w-[300px]">
          <div className="h-fit lg:sticky lg:top-[76px] rounded-xl p-[18px] space-y-3 overflow-visible" style={orderSummaryCardStyle}>
            <div style={{ ...labelStyle, borderBottom: "1px solid hsl(210,40%,92%)", paddingBottom: 8, marginBottom: 10 }}>Order Summary</div>

            {service && (
              <div className="flex justify-between" style={{ fontSize: 14 }}>
                <span style={{ color: "hsl(222,47%,20%)" }}>{service.title}</span>
                <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>${servicePrice}</span>
              </div>
            )}

            {displayVehicles.length > 0 && (
              <div className="space-y-1" style={{ fontSize: 13, color: "hsl(222,47%,20%)" }}>
                {displayVehicles.map((v, i) => (
                  <div key={i}>🚗 {v.year} {v.make} {v.model}</div>
                ))}
              </div>
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
              <span className="font-bold" style={{ fontSize: 20, color: BOOKING.primaryMuted }}>${totalPrice}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </BookingLayout>
  );
};

export default BookCheckout;
