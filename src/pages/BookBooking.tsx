import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfTomorrow } from "date-fns";
import type { BusinessData } from "@/hooks/useBusinessData";

const MORNING_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
const AFTERNOON_SLOTS = ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BookBooking = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [bookedTimes, setBookedTimes] = useState<Set<string>>(new Set());
  const stripRef = useRef<HTMLDivElement>(null);

  // Generate 14 days starting tomorrow
  const days = useMemo(() => {
    const tomorrow = startOfTomorrow();
    return Array.from({ length: 14 }, (_, i) => addDays(tomorrow, i));
  }, []);

  // Fetch blocked days
  useEffect(() => {
    const fetchBlockedDays = async () => {
      const { data } = await supabase.from("blocked_days").select("blocked_date");
      if (data) setBlockedDates(new Set(data.map(d => d.blocked_date)));
    };
    fetchBlockedDays();
  }, []);

  // Fetch booked times for selected date
  useEffect(() => {
    if (!selectedDate) { setBookedTimes(new Set()); return; }
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const fetchBooked = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", dateStr)
        .in("status", ["confirmed", "pending"]);
      if (data) {
        const times = new Set(data.map(b => {
          // Convert "HH:mm:ss" to "H:MM AM/PM"
          const [h, m] = b.booking_time.split(":");
          const hour = parseInt(h);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${h12}:${m} ${ampm}`;
        }));
        setBookedTimes(times);
      }
    };
    fetchBooked();
  }, [selectedDate]);

  const isBlocked = (date: Date) => blockedDates.has(format(date, "yyyy-MM-dd"));

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      sessionStorage.setItem("booking_datetime", JSON.stringify({
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
      }));
      navigate(`/site/${slug}/book/checkout`);
    }
  };

  const canContinue = !!(selectedDate && selectedTime);

  const renderSlot = (time: string) => {
    const booked = bookedTimes.has(time);
    const isSelected = selectedTime === time;
    return (
      <button
        key={time}
        onClick={() => !booked && setSelectedTime(time)}
        disabled={booked}
        className={`h-[44px] rounded-full text-sm font-medium transition-all duration-200 ${
          booked
            ? "bg-muted text-muted-foreground/40 line-through cursor-not-allowed border border-transparent"
            : isSelected
              ? "text-white shadow-md border border-transparent"
              : "bg-card text-foreground border border-border hover:border-accent/50"
        }`}
        style={isSelected ? { background: "hsl(217,91%,60%)", boxShadow: "0 4px 12px hsla(217,91%,60%,0.3)" } : undefined}
      >
        {time}
      </button>
    );
  };

  return (
    <BookingLayout activeStep={4}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-2">
          Pick a date & time
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Select when you'd like to come in</p>
      </FadeIn>

      {/* Date strip */}
      <FadeIn delay={100}>
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 no-scrollbar"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {days.map((day) => {
            const blocked = isBlocked(day);
            const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  if (blocked) return;
                  setSelectedDate(day);
                  setSelectedTime(null);
                }}
                disabled={blocked}
                className={`flex flex-col items-center justify-center shrink-0 w-[60px] h-[72px] rounded-2xl text-center transition-all duration-200 ${
                  blocked
                    ? "opacity-30 cursor-not-allowed bg-muted"
                    : isSelected
                      ? "text-white scale-105 shadow-lg"
                      : "bg-card border border-border text-foreground hover:border-accent/50"
                }`}
                style={{
                  scrollSnapAlign: "start",
                  ...(isSelected ? { background: "hsl(217,91%,60%)", boxShadow: "0 4px 16px hsla(217,91%,60%,0.35)" } : {}),
                }}
              >
                <span className={`text-[11px] font-medium leading-none ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                  {DAY_LABELS[day.getDay()]}
                </span>
                <span className={`text-lg font-bold leading-none mt-1 ${isSelected ? "text-white" : ""}`}>
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      {/* Selected date label */}
      {selectedDate && (
        <FadeIn delay={0}>
          <p className="text-sm font-semibold text-foreground mt-3 mb-6">
            {format(selectedDate, "EEEE, MMMM d")}
          </p>
        </FadeIn>
      )}

      {/* Time slots — fade in after date selection */}
      {selectedDate && (
        <FadeIn delay={80}>
          <div className="space-y-5">
            {/* Morning */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Morning</p>
              <div className="grid grid-cols-3 gap-2.5">
                {MORNING_SLOTS.map(renderSlot)}
              </div>
            </div>

            {/* Afternoon */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Afternoon</p>
              <div className="grid grid-cols-3 gap-2.5">
                {AFTERNOON_SLOTS.map(renderSlot)}
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Sticky CTA */}
      {canContinue && (
        <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto z-30 md:z-auto bg-background/80 backdrop-blur-lg md:backdrop-blur-none md:bg-transparent border-t border-border md:border-none px-4 py-3 md:p-0 md:mt-8">
          <div className="flex items-center gap-3 max-w-screen-lg mx-auto md:mx-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors min-h-[48px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold min-h-[48px] text-white transition-all shadow-lg"
              style={{ background: "hsl(217,91%,60%)", boxShadow: "0 4px 12px hsla(217,91%,60%,0.3)" }}
            >
              Continue to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {canContinue && <div className="h-20 md:h-0" />}
    </BookingLayout>
  );
};

export default BookBooking;
