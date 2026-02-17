import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Clock, Ban } from "lucide-react";
import BookingLayout from "@/components/BookingLayout";
import FadeIn from "@/components/FadeIn";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

const BookBooking = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchBlockedDays = async () => {
      const { data } = await supabase
        .from("blocked_days")
        .select("blocked_date");
      if (data) {
        setBlockedDates(new Set(data.map(d => d.blocked_date)));
      }
    };
    fetchBlockedDays();
  }, []);

  const isDateBlocked = (date: Date) => {
    return blockedDates.has(format(date, "yyyy-MM-dd"));
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate(`/site/${slug}/book/checkout`);
    }
  };

  return (
    <BookingLayout activeStep={4}>
      <FadeIn delay={50}>
        <h1 className="font-heading text-[28px] md:text-[40px] font-bold tracking-[-0.015em] leading-[1.2] text-foreground mb-8 md:mb-10">
          Choose a slot
        </h1>
      </FadeIn>

      <div className="space-y-8">
        <FadeIn delay={100}>
          <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground">
            Time Slot
          </h2>
        </FadeIn>

        <div className="flex flex-col md:flex-row gap-8">
          <FadeIn delay={150}>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Select a Date</h3>
              <div className="rounded-2xl border border-border bg-card p-4 inline-block">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date && !isDateBlocked(date)) {
                      setSelectedDate(date);
                    }
                  }}
                  disabled={(date) => date < new Date() || isDateBlocked(date)}
                  className="pointer-events-auto"
                />
              </div>
            </div>
          </FadeIn>

          {selectedDate && (
            <FadeIn delay={50}>
              <div className="space-y-3 md:pt-0">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  Select a Time
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? "border-accent bg-accent/10 text-accent ring-1 ring-accent"
                          : "border-border bg-card text-foreground hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        {selectedDate && selectedTime && (
          <FadeIn delay={50}>
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 min-h-[44px] transition-all duration-300 hover:gap-3"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
                color: "hsl(0 0% 100%)",
                boxShadow: "0 4px 12px hsla(217, 91%, 60%, 0.3)",
              }}
            >
              Continue to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        )}
      </div>
    </BookingLayout>
  );
};

export default BookBooking;
