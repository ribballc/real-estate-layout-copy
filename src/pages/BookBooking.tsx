import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import StickyBookingCTA from "@/components/StickyBookingCTA";
import { useBooking } from "@/contexts/BookingContext";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfTomorrow, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfToday } from "date-fns";

const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const BookBooking = () => {
  const navigate = useNavigate();
  const { slug, dateTime, setDateTime } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    dateTime?.date ? new Date(dateTime.date + "T12:00:00") : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(() => dateTime?.time ?? null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [bookedTimes, setBookedTimes] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(startOfTomorrow()));

  const today = useMemo(() => startOfToday(), []);

  useEffect(() => {
    supabase.from("blocked_days").select("blocked_date").then(({ data }) => {
      if (data) setBlockedDates(new Set(data.map(d => d.blocked_date)));
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) { setBookedTimes(new Set()); return; }
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    supabase.from("bookings").select("booking_time").eq("booking_date", dateStr).in("status", ["confirmed", "pending"]).then(({ data }) => {
      if (data) {
        setBookedTimes(new Set(data.map(b => {
          const [h, m] = b.booking_time.split(":");
          const hour = parseInt(h);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${h12}:${m} ${ampm}`;
        })));
      }
    });
  }, [selectedDate]);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const padding = getDay(start);
    return { days, padding };
  }, [currentMonth]);

  const isUnavailable = (d: Date) => isBefore(d, today) || blockedDates.has(format(d, "yyyy-MM-dd"));
  const isToday = (d: Date) => isSameDay(d, today);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setDateTime({ date: format(selectedDate, "yyyy-MM-dd"), time: selectedTime });
      navigate(`/site/${slug}/book/checkout`);
    }
  };

  const canContinue = !!(selectedDate && selectedTime);

  return (
    <BookingLayout activeStep={4}>
      <FadeIn delay={40}>
        <h1 className="font-heading font-bold tracking-[-0.01em] leading-[1.2] mb-1" style={{ fontSize: 22, color: "hsl(222,47%,11%)" }}>
          Pick a date & time
        </h1>
        <p style={{ fontSize: 14, color: "hsl(215,16%,55%)", marginBottom: 20 }}>Select when you'd like to come in</p>
      </FadeIn>

      {/* Calendar */}
      <FadeIn delay={60}>
        <div className="rounded-[14px] p-4 md:p-5 mb-5" style={{ background: "white", border: "1px solid hsl(210,40%,90%)", boxShadow: "0 2px 12px hsla(0,0%,0%,0.06)" }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="public-touch-target flex items-center justify-center min-w-[44px] min-h-[44px]" style={{ width: 44, height: 44, borderRadius: 8, border: "1px solid hsl(210,40%,88%)", background: "white" }}>
              <ChevronLeft size={16} style={{ color: "hsl(217,91%,50%)" }} />
            </button>
            <span className="font-semibold" style={{ fontSize: 15, color: "hsl(222,47%,11%)" }}>{format(currentMonth, "MMMM yyyy")}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="public-touch-target flex items-center justify-center min-w-[44px] min-h-[44px]" style={{ width: 44, height: 44, borderRadius: 8, border: "1px solid hsl(210,40%,88%)", background: "white" }}>
              <ChevronRight size={16} style={{ color: "hsl(217,91%,50%)" }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center py-1" style={{ fontSize: 11, fontWeight: 600, color: "hsl(215,16%,55%)" }}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: calendarDays.padding }).map((_, i) => <div key={`pad-${i}`} />)}
            {calendarDays.days.map((day) => {
              const unavail = isUnavailable(day);
              const isSel = selectedDate && isSameDay(day, selectedDate);
              const isT = isToday(day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => { if (!unavail) { setSelectedDate(day); setSelectedTime(null); } }}
                  disabled={unavail}
                  className="flex items-center justify-center transition-all duration-150"
                  style={{
                    width: "100%", aspectRatio: "1", minHeight: 44, borderRadius: 8, fontSize: 14,
                    fontWeight: isT || isSel ? 700 : 400,
                    ...(unavail
                      ? { color: "hsl(215,16%,75%)", cursor: "not-allowed" }
                      : isSel
                      ? { background: "hsl(217,91%,55%)", color: "white" }
                      : { color: "hsl(222,47%,11%)" }),
                    textDecoration: isT && !isSel ? "underline" : undefined,
                    textUnderlineOffset: 3,
                  }}
                  onMouseEnter={(e) => { if (!unavail && !isSel) e.currentTarget.style.background = "hsl(217,91%,96%)"; }}
                  onMouseLeave={(e) => { if (!unavail && !isSel) e.currentTarget.style.background = "transparent"; }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Time slots */}
      {selectedDate && (
        <FadeIn delay={60}>
          <p className="font-semibold mb-3" style={{ fontSize: 13, color: "hsl(222,47%,11%)" }}>
            {format(selectedDate, "EEEE, MMMM d")}
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-6">
            {TIME_SLOTS.map((time) => {
              const booked = bookedTimes.has(time);
              const isSel = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => !booked && setSelectedTime(time)}
                  disabled={booked}
                  className="text-center transition-all duration-150"
                  style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                    ...(booked
                      ? { background: "hsl(210,40%,97%)", border: "1px solid hsl(210,40%,88%)", color: "hsl(215,16%,75%)", cursor: "not-allowed", textDecoration: "line-through" }
                      : isSel
                      ? { background: "hsl(217,91%,55%)", color: "white", border: "1px solid transparent" }
                      : { background: "hsl(210,40%,97%)", border: "1px solid hsl(210,40%,88%)", color: "hsl(222,47%,20%)" }),
                  }}
                  onMouseEnter={(e) => { if (!booked && !isSel) e.currentTarget.style.borderColor = "hsl(217,91%,65%)"; }}
                  onMouseLeave={(e) => { if (!booked && !isSel) e.currentTarget.style.borderColor = "hsl(210,40%,88%)"; }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </FadeIn>
      )}

      {/* CTA */}
      <StickyBookingCTA>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="public-touch-target inline-flex items-center gap-2 font-semibold min-w-[44px]" style={{ height: 50, padding: "0 20px", borderRadius: 12, fontSize: 14, border: "1px solid hsl(210,40%,90%)", color: "hsl(222,47%,11%)", background: "white" }}>
            <ArrowLeft size={15} /> Back
          </button>
          <button onClick={handleContinue} disabled={!canContinue} className="public-touch-target flex-1 md:flex-none inline-flex items-center justify-center gap-2 font-bold min-h-[44px]" style={{
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

export default BookBooking;
