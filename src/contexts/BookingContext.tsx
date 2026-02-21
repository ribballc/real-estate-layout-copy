import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const BOOKING_STORAGE_KEY = "darker_booking_v1";
const BOOKING_SLUG_KEY = "darker_booking_slug";

export interface BookingService {
  id: string;
  title: string;
  price: number;
}

export interface BookingVehicle {
  year: string;
  make: string;
  model: string;
}

export interface BookingAddon {
  id: string;
  title: string;
  price: number;
}

export interface BookingDateTime {
  date: string;
  time: string;
}

export interface BookingState {
  service: BookingService | null;
  vehicle: BookingVehicle | null;
  /** All vehicles for this booking (vehicle is vehicles[0] for backward compat) */
  vehicles: BookingVehicle[];
  vehicleImageUrl: string | null;
  addons: BookingAddon[];
  dateTime: BookingDateTime | null;
}

const defaultState: BookingState = {
  service: null,
  vehicle: null,
  vehicles: [],
  vehicleImageUrl: null,
  addons: [],
  dateTime: null,
};

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadFromStorage(slug: string | null): BookingState {
  const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY);
  const legacyService = sessionStorage.getItem("booking_service");
  const legacyVehicle = sessionStorage.getItem("booking_vehicle");
  const legacyAddons = sessionStorage.getItem("booking_addons");
  const legacyDateTime = sessionStorage.getItem("booking_datetime");

  let service: BookingService | null = null;
  let vehicle: BookingVehicle | null = null;
  let vehicles: BookingVehicle[] = [];
  let vehicleImageUrl: string | null = null;
  let addons: BookingAddon[] = [];
  let dateTime: BookingDateTime | null = null;

  if (raw) {
    const parsed = parseJson<Partial<BookingState>>(raw, {});
    service = parsed.service && typeof parsed.service.id === "string" ? parsed.service : null;
    vehicle = parsed.vehicle && parsed.vehicle.year && parsed.vehicle.make && parsed.vehicle.model ? parsed.vehicle : null;
    if (Array.isArray(parsed.vehicles) && parsed.vehicles.length > 0) {
      vehicles = parsed.vehicles.filter((v) => v?.year && v?.make && v?.model);
      if (vehicles.length > 0 && !vehicle) vehicle = vehicles[0];
    }
    vehicleImageUrl = typeof parsed.vehicleImageUrl === "string" && parsed.vehicleImageUrl ? parsed.vehicleImageUrl : null;
    addons = Array.isArray(parsed.addons) ? parsed.addons.filter((a) => a?.id && typeof a.title === "string" && typeof a.price === "number") : [];
    dateTime = parsed.dateTime && parsed.dateTime.date && parsed.dateTime.time ? parsed.dateTime : null;
  }

  if (!service && legacyService) service = parseJson(legacyService, null);
  if (!vehicle && legacyVehicle) vehicle = parseJson(legacyVehicle, null);
  if (vehicles.length === 0 && vehicle) vehicles = [vehicle];
  if (addons.length === 0 && legacyAddons) addons = parseJson(legacyAddons, []);
  if (!dateTime && legacyDateTime) dateTime = parseJson(legacyDateTime, null);

  const storedSlug = sessionStorage.getItem(BOOKING_SLUG_KEY);
  if (slug && storedSlug && storedSlug !== slug) return defaultState;

  return { service, vehicle, vehicles, vehicleImageUrl, addons, dateTime };
}

function saveToStorage(slug: string | null, state: BookingState) {
  if (!slug) return;
  sessionStorage.setItem(BOOKING_SLUG_KEY, slug);
  sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(state));
}

function clearBookingStorage() {
  sessionStorage.removeItem(BOOKING_STORAGE_KEY);
  sessionStorage.removeItem(BOOKING_SLUG_KEY);
  ["booking_service", "booking_vehicle", "booking_vehicles", "booking_addons", "booking_datetime"].forEach((k) =>
    sessionStorage.removeItem(k)
  );
}

interface BookingContextValue extends BookingState {
  slug: string | null;
  setService: (s: BookingService | null) => void;
  setVehicle: (v: BookingVehicle | null) => void;
  addVehicle: (v: BookingVehicle) => void;
  removeVehicle: (index: number) => void;
  setVehicleImageUrl: (url: string | null) => void;
  setAddons: (a: BookingAddon[]) => void;
  setDateTime: (d: BookingDateTime | null) => void;
  clearBooking: () => void;
  totalPrice: number;
  servicePrice: number;
  addonsTotal: number;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export function useBookingOptional() {
  return useContext(BookingContext);
}

const BOOKING_STEPS = [
  { path: "/book", step: 0, requires: [] },
  { path: "/book/vehicle", step: 1, requires: ["service"] },
  { path: "/book/options", step: 2, requires: ["service", "vehicle"] },
  { path: "/book/add-ons", step: 3, requires: ["service"] },
  { path: "/book/booking", step: 4, requires: ["service"] },
  { path: "/book/checkout", step: 5, requires: ["service", "dateTime"] },
];

function getRequiredStep(pathname: string): number {
  const match = BOOKING_STEPS.find((s) => pathname.endsWith(s.path) || pathname.includes(s.path + "?"));
  return match?.step ?? 0;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const [state, setState] = useState<BookingState>(() => loadFromStorage(slug || null));

  useEffect(() => {
    setState(loadFromStorage(slug || null));
  }, [slug]);

  const persist = useCallback(
    (next: BookingState) => {
      setState(next);
      saveToStorage(slug || null, next);
      // Legacy keys for backward compatibility during migration
      if (next.service) sessionStorage.setItem("booking_service", JSON.stringify(next.service));
      else sessionStorage.removeItem("booking_service");
      if (next.vehicle) sessionStorage.setItem("booking_vehicle", JSON.stringify(next.vehicle));
      else sessionStorage.removeItem("booking_vehicle");
      if (next.vehicles?.length) sessionStorage.setItem("booking_vehicles", JSON.stringify(next.vehicles));
      sessionStorage.setItem("booking_addons", JSON.stringify(next.addons));
      if (next.dateTime) sessionStorage.setItem("booking_datetime", JSON.stringify(next.dateTime));
      else sessionStorage.removeItem("booking_datetime");
    },
    [slug]
  );

  const setService = useCallback(
    (s: BookingService | null) => persist({ ...state, service: s }),
    [state, persist]
  );
  const setVehicle = useCallback(
    (v: BookingVehicle | null) => persist({
      ...state,
      vehicle: v,
      vehicles: v ? [v] : [],
      ...(v ? {} : { vehicleImageUrl: null }),
    }),
    [state, persist]
  );
  const addVehicle = useCallback(
    (v: BookingVehicle) => persist({
      ...state,
      vehicles: [...state.vehicles, v],
      vehicle: state.vehicle ?? v,
    }),
    [state, persist]
  );
  const removeVehicle = useCallback(
    (index: number) => {
      const next = state.vehicles.filter((_, i) => i !== index);
      persist({
        ...state,
        vehicles: next,
        vehicle: next[0] ?? null,
        vehicleImageUrl: next.length === 0 ? null : state.vehicleImageUrl,
      });
    },
    [state, persist]
  );
  const setVehicleImageUrl = useCallback(
    (url: string | null) => persist({ ...state, vehicleImageUrl: url }),
    [state, persist]
  );
  const setAddons = useCallback(
    (a: BookingAddon[]) => persist({ ...state, addons: a }),
    [state, persist]
  );
  const setDateTime = useCallback(
    (d: BookingDateTime | null) => persist({ ...state, dateTime: d }),
    [state, persist]
  );

  const clearBooking = useCallback(() => {
    setState(defaultState);
    clearBookingStorage();
  }, []);

  const totalPrice = (state.service?.price ?? 0) + state.addons.reduce((s, a) => s + a.price, 0);
  const servicePrice = state.service?.price ?? 0;
  const addonsTotal = state.addons.reduce((s, a) => s + a.price, 0);

  const value = useMemo(
    () => ({
      ...state,
      slug,
      setService,
      setVehicle,
      addVehicle,
      removeVehicle,
      setVehicleImageUrl,
      setAddons,
      setDateTime,
      clearBooking,
      totalPrice,
      servicePrice,
      addonsTotal,
    }),
    [state, slug, setService, setVehicle, addVehicle, removeVehicle, setVehicleImageUrl, setAddons, setDateTime, clearBooking, totalPrice, servicePrice, addonsTotal]
  );

  useEffect(() => {
    const step = getRequiredStep(pathname);
    const steps = BOOKING_STEPS;
    if (step > 0 && slug) {
      const stepDef = steps[step];
      if (stepDef) {
        const hasService = !!state.service;
        const hasVehicle = !!state.vehicle;
        const hasDateTime = !!state.dateTime;
        if (stepDef.requires.includes("service") && !hasService) {
          navigate(`/site/${slug}/book`, { replace: true });
          return;
        }
        if (stepDef.requires.includes("vehicle") && !hasVehicle) {
          navigate(`/site/${slug}/book/vehicle`, { replace: true });
          return;
        }
        if (stepDef.requires.includes("dateTime") && !hasDateTime) {
          navigate(`/site/${slug}/book/booking`, { replace: true });
          return;
        }
      }
    }
  }, [pathname, slug, state.service, state.vehicle, state.dateTime, navigate]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
