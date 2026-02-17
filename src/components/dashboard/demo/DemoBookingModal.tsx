import { useState, useMemo } from "react";
import { X, Check, ChevronRight, ChevronLeft, Calendar, Clock, User, CreditCard, Star } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  popular: boolean;
}

interface AddOn {
  id: string;
  title: string;
  price: number;
}

interface HourRow {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  services: Service[];
  addOns: AddOn[];
  hours: HourRow[];
  accent: string;
  accentGrad: string;
  isDark: boolean;
  preSelectedService?: Service | null;
}

const STEPS = [
  { label: "Service", icon: Star },
  { label: "Date & Time", icon: Calendar },
  { label: "Details", icon: User },
  { label: "Confirm", icon: CreditCard },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

function generateTimeSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur < end) {
    const hh = Math.floor(cur / 60);
    const mm = cur % 60;
    slots.push(`${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`);
    cur += 60;
  }
  return slots;
}

const DemoBookingModal = ({ open, onClose, services, addOns, hours, accent, accentGrad, isDark, preSelectedService }: BookingModalProps) => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(preSelectedService || null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [confirmed, setConfirmed] = useState(false);

  const bg = isDark ? "#000" : "#fff";
  const fg = isDark ? "#fff" : "#111";
  const cardBg = isDark ? "hsl(0 0% 5%)" : "hsl(0 0% 97%)";
  const borderClr = isDark ? "hsl(0 0% 20%)" : "hsl(0 0% 85%)";
  const mutedFg = isDark ? "hsl(0 0% 65%)" : "hsl(0 0% 40%)";
  const goldIconColor = isDark ? "#000" : "#fff";

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();

  const isDateAvailable = (date: Date) => {
    if (date < today) return false;
    const h = hours.find(h => h.day_of_week === date.getDay());
    return h ? !h.is_closed : false;
  };

  const timeSlotsForDate = selectedDate
    ? (() => {
        const h = hours.find(hr => hr.day_of_week === selectedDate.getDay());
        if (!h || h.is_closed) return [];
        return generateTimeSlots(h.open_time, h.close_time);
      })()
    : [];

  const toggleAddOn = (id: string) => {
    const next = new Set(selectedAddOns);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedAddOns(next);
  };

  const totalPrice = useMemo(() => {
    let total = selectedService?.price || 0;
    addOns.filter(a => selectedAddOns.has(a.id)).forEach(a => total += a.price);
    return total;
  }, [selectedService, selectedAddOns, addOns]);

  const canNext = step === 0 ? !!selectedService : step === 1 ? !!selectedDate && !!selectedTime : step === 2 ? true : true;

  const handleNext = () => {
    if (step === 3) {
      setConfirmed(true);
      return;
    }
    if (canNext) setStep(step + 1);
  };

  const handleClose = () => {
    setStep(0);
    setSelectedService(preSelectedService || null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedAddOns(new Set());
    setConfirmed(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: bg, color: fg, animation: "demoFadeInUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl" style={{ background: bg, borderBottom: `1px solid ${borderClr}` }}>
          <h3 className="text-lg font-bold">Book Your Service</h3>
          <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: cardBg }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        {!confirmed && (
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${borderClr}` }}>
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i <= step ? accentGrad : cardBg,
                    color: i <= step ? goldIconColor : mutedFg,
                    border: `1px solid ${i <= step ? accent : borderClr}`,
                  }}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:inline" style={{ color: i <= step ? fg : mutedFg }}>{s.label}</span>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 mx-1" style={{ color: mutedFg }} />}
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-5">
          {confirmed ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "hsl(142 71% 45%)", animation: "demoPulse 1s ease-out" }}>
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-sm mb-6" style={{ color: mutedFg }}>
                ✓ Demo booking successful! This would send a real confirmation email and SMS reminder.
              </p>
              <div className="rounded-xl p-4 text-left space-y-2 text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                <div className="flex justify-between"><span style={{ color: mutedFg }}>Service</span><span className="font-semibold">{selectedService?.title}</span></div>
                <div className="flex justify-between"><span style={{ color: mutedFg }}>Date</span><span className="font-semibold">{selectedDate && `${DAYS[selectedDate.getDay()]}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`}</span></div>
                <div className="flex justify-between"><span style={{ color: mutedFg }}>Time</span><span className="font-semibold">{selectedTime && formatTime(selectedTime)}</span></div>
                <div className="flex justify-between pt-2 font-bold text-base" style={{ borderTop: `1px solid ${borderClr}` }}>
                  <span>Total</span><span style={{ color: accent }}>${totalPrice}</span>
                </div>
              </div>
              <button onClick={handleClose} className="mt-6 h-11 px-8 rounded-xl text-sm font-bold" style={{ background: accentGrad, color: goldIconColor }}>
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Step 0: Service */}
              {step === 0 && (
                <div className="space-y-3">
                  <h4 className="text-base font-bold mb-4">Choose Your Service</h4>
                  {services.map(svc => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{
                        background: cardBg,
                        border: `2px solid ${selectedService?.id === svc.id ? accent : borderClr}`,
                        boxShadow: selectedService?.id === svc.id ? `0 0 0 3px ${accent}20` : "none",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold">{svc.title}</h5>
                            {svc.popular && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: accentGrad, color: goldIconColor }}>Popular</span>}
                          </div>
                          <p className="text-xs mt-1" style={{ color: mutedFg }}>{svc.description?.slice(0, 60)}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className="text-xl font-black" style={{ color: accent }}>${svc.price}</span>
                          {selectedService?.id === svc.id && (
                            <div className="w-5 h-5 rounded-full mt-1 mx-auto flex items-center justify-center" style={{ background: accent }}>
                              <Check className="w-3 h-3" style={{ color: goldIconColor }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Discount banner */}
                  <div className="rounded-xl p-3 text-center text-xs font-semibold" style={{ background: `${accent}10`, border: `1px dashed ${accent}`, color: accent }}>
                    💰 Save 10% when you book 2+ services!
                  </div>
                </div>
              )}

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div>
                  <h4 className="text-base font-bold mb-4">Pick a Date & Time</h4>
                  <div className="rounded-xl p-4 mb-4" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} className="p-1"><ChevronLeft className="w-5 h-5" style={{ color: mutedFg }} /></button>
                      <span className="font-bold text-sm">{MONTHS[calMonth]} {calYear}</span>
                      <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} className="p-1"><ChevronRight className="w-5 h-5" style={{ color: mutedFg }} /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2" style={{ color: mutedFg }}>
                      {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d} className="font-semibold py-1">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const date = new Date(calYear, calMonth, i + 1);
                        const avail = isDateAvailable(date);
                        const isSel = selectedDate?.toDateString() === date.toDateString();
                        return (
                          <button key={i} disabled={!avail} onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                            className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-medium transition-all"
                            style={{
                              background: isSel ? accentGrad : "transparent",
                              color: isSel ? goldIconColor : avail ? fg : mutedFg,
                              opacity: avail ? 1 : 0.3,
                              cursor: avail ? "pointer" : "not-allowed",
                            }}
                          >{i + 1}</button>
                        );
                      })}
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="rounded-xl p-4" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                      <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: accent }} />
                        {DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
                      </h5>
                      {timeSlotsForDate.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlotsForDate.map(t => (
                            <button key={t} onClick={() => setSelectedTime(t)}
                              className="py-2.5 rounded-lg text-xs font-semibold transition-all"
                              style={{
                                background: selectedTime === t ? accentGrad : "transparent",
                                color: selectedTime === t ? goldIconColor : fg,
                                border: `1px solid ${selectedTime === t ? accent : borderClr}`,
                              }}
                            >{formatTime(t)}</button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: mutedFg }}>No slots available.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Details & Add-ons */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold">Your Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="First Name *" readOnly className="px-3 py-2.5 rounded-lg text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }} />
                    <input type="text" placeholder="Last Name *" readOnly className="px-3 py-2.5 rounded-lg text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }} />
                  </div>
                  <input type="email" placeholder="Email *" readOnly className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }} />
                  <input type="tel" placeholder="Phone *" readOnly className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Vehicle Make" readOnly className="px-3 py-2.5 rounded-lg text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }} />
                    <input type="text" placeholder="Vehicle Model" readOnly className="px-3 py-2.5 rounded-lg text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}`, color: fg }} />
                  </div>

                  {addOns.length > 0 && (
                    <>
                      <h4 className="text-base font-bold pt-2">Add-on Services</h4>
                      <div className="space-y-2">
                        {addOns.map(ao => (
                          <label
                            key={ao.id}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                            style={{
                              background: cardBg,
                              border: `1px solid ${selectedAddOns.has(ao.id) ? accent : borderClr}`,
                            }}
                            onClick={() => toggleAddOn(ao.id)}
                          >
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                              style={{
                                background: selectedAddOns.has(ao.id) ? accentGrad : "transparent",
                                border: `2px solid ${selectedAddOns.has(ao.id) ? accent : borderClr}`,
                              }}
                            >
                              {selectedAddOns.has(ao.id) && <Check className="w-3 h-3" style={{ color: goldIconColor }} />}
                            </div>
                            <span className="text-sm flex-1">{ao.title}</span>
                            <span className="text-sm font-bold" style={{ color: accent }}>+${ao.price}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div>
                  <h4 className="text-base font-bold mb-4">Review Your Booking</h4>
                  <div className="rounded-xl p-4 space-y-3 text-sm" style={{ background: cardBg, border: `1px solid ${borderClr}` }}>
                    <div className="flex justify-between"><span style={{ color: mutedFg }}>Service</span><span className="font-semibold">{selectedService?.title}</span></div>
                    <div className="flex justify-between"><span style={{ color: mutedFg }}>Date</span><span className="font-semibold">{selectedDate && `${DAYS[selectedDate.getDay()]}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`}</span></div>
                    <div className="flex justify-between"><span style={{ color: mutedFg }}>Time</span><span className="font-semibold">{selectedTime && formatTime(selectedTime)}</span></div>
                    {selectedAddOns.size > 0 && (
                      <div className="flex justify-between"><span style={{ color: mutedFg }}>Add-ons</span><span className="font-semibold">{addOns.filter(a => selectedAddOns.has(a.id)).map(a => a.title).join(", ")}</span></div>
                    )}
                    <div className="flex justify-between pt-3 text-lg font-bold" style={{ borderTop: `1px solid ${borderClr}` }}>
                      <span>Total</span><span style={{ color: accent }}>${totalPrice}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-xs" style={{ color: mutedFg }}>
                    <p>💳 Payment will be collected after service completion</p>
                    <p>📧 Confirmation will be sent to your email</p>
                    <p>📱 You'll receive SMS reminders</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!confirmed && (
          <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 rounded-b-2xl" style={{ background: bg, borderTop: `1px solid ${borderClr}` }}>
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className="h-10 px-5 rounded-xl text-sm font-semibold transition-opacity"
              style={{ opacity: step > 0 ? 1 : 0.3, color: fg, border: `1px solid ${borderClr}` }}
              disabled={step === 0}
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              {selectedService && <span className="text-sm font-bold" style={{ color: accent }}>${totalPrice}</span>}
              <button
                onClick={handleNext}
                className="h-10 px-6 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  background: canNext ? accentGrad : cardBg,
                  color: canNext ? goldIconColor : mutedFg,
                  cursor: canNext ? "pointer" : "not-allowed",
                }}
                disabled={!canNext}
              >
                {step === 3 ? "Confirm Booking" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoBookingModal;
