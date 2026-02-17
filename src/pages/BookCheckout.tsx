import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2, User, Mail, Phone, MessageSquare } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingService {
  id: string;
  title: string;
  price: number;
}

interface BookingVehicle {
  year: string;
  make: string;
  model: string;
}

interface BookingAddon {
  id: string;
  title: string;
  price: number;
}

interface BookingDateTime {
  date: string;
  time: string;
}

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
    } catch {
      // ignore parse errors
    }
  }, []);

  const servicePrice = service?.price || 0;
  const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = servicePrice + addonsTotal;

  const canSubmit = name.trim() && email.trim() && phone.trim() && dateTime && service;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-booking-notification", {
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

      // Clear session storage
      sessionStorage.removeItem("booking_service");
      sessionStorage.removeItem("booking_vehicle");
      sessionStorage.removeItem("booking_addons");
      sessionStorage.removeItem("booking_datetime");

      setSuccess(true);
    } catch (err: any) {
      console.error("Booking error:", err);
      toast({
        title: "Booking failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <BookingLayout activeStep={5}>
        <FadeIn delay={50}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-3">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mb-2">
              Thank you, {name}! Your appointment has been scheduled for{" "}
              <span className="font-semibold text-foreground">{dateTime?.date}</span> at{" "}
              <span className="font-semibold text-foreground">{dateTime?.time}</span>.
            </p>
            <p className="text-muted-foreground text-sm">
              You'll receive a confirmation shortly. We look forward to seeing you!
            </p>
            <a
              href={`/site/${slug}`}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 min-h-[44px] bg-accent text-accent-foreground hover:brightness-105 transition-all"
            >
              Back to Website
            </a>
          </div>
        </FadeIn>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout activeStep={5}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-8 md:mb-10">
          Complete your booking
        </h1>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left — Contact form */}
        <div className="flex-1 space-y-5">
          <FadeIn delay={100}>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Your Details</h2>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10"
                  maxLength={100}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="pl-10"
                  maxLength={255}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="pl-10"
                  maxLength={20}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Notes (optional)</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or things we should know..."
                  className="pl-10 min-h-[100px]"
                  maxLength={1000}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 min-h-[44px] transition-all duration-300 mt-2 ${
                canSubmit && !submitting
                  ? "bg-accent text-accent-foreground hover:brightness-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
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
          <div className="w-full lg:w-[320px] rounded-2xl border border-border bg-card p-6 space-y-4 h-fit lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold text-foreground">Booking Summary</h3>

            {service && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{service.title}</span>
                <span className="font-medium text-foreground">${servicePrice}</span>
              </div>
            )}

            {vehicle && (
              <div className="text-sm text-muted-foreground">
                🚗 {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
            )}

            {addons.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add-ons</span>
                {addons.map((a) => (
                  <div key={a.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{a.title}</span>
                    <span className="font-medium text-foreground">+${a.price}</span>
                  </div>
                ))}
              </div>
            )}

            {dateTime && (
              <div className="pt-2 border-t border-border text-sm text-muted-foreground">
                📅 {dateTime.date} at {dateTime.time}
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-accent">${totalPrice}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </BookingLayout>
  );
};

export default BookCheckout;
