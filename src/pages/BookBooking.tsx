import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfTomorrow } from "date-fns";

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

  const days = useMemo(() => {
    const tomorrow = startOfTomorrow();
    return Array.from({ length: 14 }, (_, i) => addDays(tomorrow, i));
  }, []);

  useEffect(() => {
    const fetchBlockedDays = async () => {
      const { data } = await supabase.from("blocked_days").select("blocked_date");
      if (data) setBlockedDates(new Set(data.map(d => d.blocked_date)));
    };
    fetchBlockedDays();
  }, []);

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
        className="h-[44px] rounded-full text-sm font-medium transition-all duration-200"
        style={
          booked
            ? {
                background: "hsl(210,40%,94%)",
                color: "hsl(215,16%,60%)",
                textDecoration: "line-through",
                cursor: "not-allowed",
                border: "1px solid transparent",
              }
            : isSelected
            ? {
                background: "hsl(217,91%,50%)",
                color: "white",
                boxShadow: "0 4px 12px hsla(217,91%,50%,0.3)",
                border: "1px solid transparent",
              }
            : {
                background: "white",
                color: "hsl(222,47%,11%)",
                border: "1px solid hsl(210,40%,90%)",
              }
        }
      >
        {time}
      </button>
    );
  };

  return (
    <BookingLayout activeStep={4}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] mb-2" style={{ color: "hsl(222,47%,11%)" }}>
          Pick a date & time
        </h1>
        <p className="text-sm mb-8" style={{ color: "hsl(215,16%,47%)" }}>Select when you'd like to come in</p>
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
                className="flex flex-col items-center justify-center shrink-0 w-[60px] h-[72px] rounded-2xl text-center transition-all duration-200"
                style={{
                  scrollSnapAlign: "start",
                  ...(blocked
                    ? { opacity: 0.3, cursor: "not-allowed", background: "hsl(210,40%,94%)" }
                    : isSelected
                    ? {
                        background: "hsl(217,91%,50%)",
                        color: "white",
                        transform: "scale(1.05)",
                        boxShadow: "0 4px 16px hsla(217,91%,50%,0.35)",
                      }
                    : {
                        background: "white",
                        border: "1px solid hsl(210,40%,90%)",
                      }),
                }}
              >
                <span
                  className="text-[11px] font-medium leading-none"
                  style={{ color: isSelected ? "hsla(0,0%,100%,0.7)" : "hsl(215,16%,47%)" }}
                >
                  {DAY_LABELS[day.getDay()]}
                </span>
                <span
                  className="text-lg font-bold leading-none mt-1"
                  style={{ color: isSelected ? "white" : "hsl(222,47%,11%)" }}
                >
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
          <p className="text-sm font-semibold mt-3 mb-6" style={{ color: "hsl(222,47%,11%)" }}>
            {format(selectedDate, "EEEE, MMMM d")}
          </p>
        </FadeIn>
      )}

      {/* Time slots */}
      {selectedDate && (
        <FadeIn delay={80}>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215,16%,47%)" }}>Morning</p>
              <div className="grid grid-cols-3 gap-2.5">
                {MORNING_SLOTS.map(renderSlot)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "hsl(215,16%,47%)" }}>Afternoon</p>
              <div className="grid grid-cols-3 gap-2.5">
                {AFTERNOON_SLOTS.map(renderSlot)}
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Sticky CTA */}
      {canContinue && (
        <div
          className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto z-30 md:z-auto md:bg-transparent px-4 py-3 md:p-0 md:mt-8"
          style={{
            background: "hsla(0,0%,100%,0.85)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid hsl(210,40%,90%)",
          }}
        >
          <div className="flex items-center gap-3 max-w-screen-lg mx-auto md:mx-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[48px] transition-colors"
              style={{ border: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,11%)", background: "white" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold min-h-[48px] transition-all"
              style={{
                background: "linear-gradient(135deg, hsl(217,91%,60%), hsl(217,91%,50%))",
                color: "white",
                boxShadow: "0 4px 12px hsla(217,91%,60%,0.3)",
              }}
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
