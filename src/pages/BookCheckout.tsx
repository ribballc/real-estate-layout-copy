import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2, User, Mail, Phone, MessageSquare } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingService { id: string; title: string; price: number; }
interface BookingVehicle { year: string; make: string; model: string; }
interface BookingAddon { id: string; title: string; price: number; }
interface BookingDateTime { date: string; time: string; }

const inputStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid hsl(210,40%,86%)",
  color: "hsl(222,47%,11%)",
  borderRadius: "0.75rem",
  padding: "0.625rem 0.75rem 0.625rem 2.5rem",
  fontSize: "0.875rem",
  width: "100%",
  minHeight: "44px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputFocusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "hsl(217,91%,50%)";
  e.target.style.boxShadow = "0 0 0 3px hsla(217,91%,50%,0.15)";
};
const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "hsl(210,40%,86%)";
  e.target.style.boxShadow = "none";
};

const BookCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [service, setService] = useState<BookingService | null>(null);
  const [vehicle, setVehicle] = useState<BookingVehicle | null>(null);
  const [addons, setAddons] = useState<BookingAddon[]>([]);
  const [dateTime, setDateTime] = useState<BookingDateTime | null>(null);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("booking_service");
      if (s) setService(JSON.parse(s));
      const v = sessionStorage.getItem("booking_vehicle");
      if (v) setVehicle(JSON.parse(v));
      const a = sessionStorage.getItem("booking_addons");
      if (a) setAddons(JSON.parse(a));
      const dt = sessionStorage.getItem("booking_datetime");
      if (dt) setDateTime(JSON.parse(dt));
    } catch { /* ignore */ }
  }, []);

  const servicePrice = service?.price || 0;
  const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = servicePrice + addonsTotal;

  const canSubmit = name.trim() && email.trim() && phone.trim() && dateTime && service;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-booking-notification", {
        body: {
          slug,
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          service_title: service!.title,
          service_price: totalPrice,
          booking_date: dateTime!.date,
          booking_time: dateTime!.time,
          vehicle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "",
          addons: addons.map((a) => a.title),
          notes: notes.trim(),
        },
      });
      if (error) throw error;
      sessionStorage.removeItem("booking_service");
      sessionStorage.removeItem("booking_vehicle");
      sessionStorage.removeItem("booking_addons");
      sessionStorage.removeItem("booking_datetime");
      setSuccess(true);
    } catch (err: any) {
      console.error("Booking error:", err);
      toast({ title: "Booking failed", description: err.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <BookingLayout activeStep={5}>
        <FadeIn delay={50}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "hsl(142,71%,94%)" }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: "hsl(142,71%,35%)" }} />
            </div>
            <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] mb-3" style={{ color: "hsl(222,47%,11%)" }}>
              Booking Confirmed!
            </h1>
            <p className="text-sm md:text-base max-w-md mb-2" style={{ color: "hsl(215,16%,47%)" }}>
              Thank you, {name}! Your appointment has been scheduled for{" "}
              <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>{dateTime?.date}</span> at{" "}
              <span className="font-semibold" style={{ color: "hsl(222,47%,11%)" }}>{dateTime?.time}</span>.
            </p>
            <p className="text-sm" style={{ color: "hsl(215,16%,47%)" }}>
              You'll receive a confirmation shortly. We look forward to seeing you!
            </p>
            <a
              href={`/site/${slug}`}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 min-h-[44px] transition-all"
              style={{ background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))", color: "white" }}
            >
              Back to Website
            </a>
          </div>
        </FadeIn>
      </BookingLayout>
    );
  }

  const labelStyle: React.CSSProperties = { color: "hsl(222,47%,11%)", fontWeight: 500, fontSize: "0.875rem" };
  const iconStyle: React.CSSProperties = { color: "hsl(215,16%,60%)", position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", pointerEvents: "none" };

  return (
    <BookingLayout activeStep={5}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] mb-8 md:mb-10" style={{ color: "hsl(222,47%,11%)" }}>
          Complete your booking
        </h1>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left — Contact form */}
        <div className="flex-1 space-y-5">
          <FadeIn delay={100}>
            <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: "hsl(222,47%,11%)" }}>Your Details</h2>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="space-y-1.5">
              <label style={labelStyle}>Full Name *</label>
              <div className="relative">
                <User style={iconStyle} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  maxLength={100}
                  style={inputStyle}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <div className="space-y-1.5">
              <label style={labelStyle}>Email *</label>
              <div className="relative">
                <Mail style={iconStyle} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  maxLength={255}
                  style={inputStyle}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="space-y-1.5">
              <label style={labelStyle}>Phone *</label>
              <div className="relative">
                <Phone style={iconStyle} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  maxLength={20}
                  style={inputStyle}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <div className="space-y-1.5">
              <label style={labelStyle}>Notes (optional)</label>
              <div className="relative">
                <MessageSquare style={{ ...iconStyle, top: "0.875rem", transform: "none" }} />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or things we should know..."
                  maxLength={1000}
                  style={{ ...inputStyle, minHeight: "100px", paddingTop: "0.75rem", resize: "vertical" }}
                  onFocus={inputFocusHandler as any}
                  onBlur={inputBlurHandler as any}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 min-h-[44px] transition-all duration-300 mt-2"
              style={
                canSubmit && !submitting
                  ? {
                      background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))",
                      color: "white",
                      boxShadow: "0 4px 12px hsla(217,91%,60%,0.3)",
                    }
                  : {
                      background: "hsl(210,40%,94%)",
                      color: "hsl(215,16%,60%)",
                      cursor: "not-allowed",
                    }
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </FadeIn>
        </div>

        {/* Right — Booking summary */}
        <FadeIn delay={150}>
          <div
            className="w-full lg:w-[320px] rounded-2xl p-6 space-y-4 h-fit lg:sticky lg:top-24"
            style={{
              background: "hsl(210,40%,97%)",
              border: "1px solid hsl(210,40%,90%)",
            }}
          >
            <h3 className="text-lg font-semibold" style={{ color: "hsl(222,47%,11%)" }}>Booking Summary</h3>

            {service && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "hsl(222,47%,20%)" }}>{service.title}</span>
                <span className="font-medium" style={{ color: "hsl(222,47%,11%)" }}>${servicePrice}</span>
              </div>
            )}

            {vehicle && (
              <div className="text-sm" style={{ color: "hsl(222,47%,20%)" }}>
                🚗 {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
            )}

            {addons.length > 0 && (
              <div className="space-y-1.5 pt-2" style={{ borderTop: "1px solid hsl(210,40%,90%)" }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215,16%,47%)" }}>Add-ons</span>
                {addons.map((a) => (
                  <div key={a.id} className="flex justify-between text-sm">
                    <span style={{ color: "hsl(222,47%,20%)" }}>{a.title}</span>
                    <span className="font-medium" style={{ color: "hsl(222,47%,11%)" }}>+${a.price}</span>
                  </div>
                ))}
              </div>
            )}

            {dateTime && (
              <div className="pt-2 text-sm" style={{ borderTop: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,20%)" }}>
                📅 {dateTime.date} at {dateTime.time}
              </div>
            )}

            <div className="pt-3 flex justify-between" style={{ borderTop: "1px solid hsl(210,40%,90%)" }}>
              <span className="font-bold" style={{ color: "hsl(222,47%,11%)" }}>Total</span>
              <span className="font-bold text-lg" style={{ color: "hsl(217,91%,40%)" }}>${totalPrice}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </BookingLayout>
  );
};

export default BookCheckout;
