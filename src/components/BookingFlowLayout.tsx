import { Outlet } from "react-router-dom";
import { BookingProvider } from "@/contexts/BookingContext";

export default function BookingFlowLayout() {
  return (
    <BookingProvider>
      <Outlet />
    </BookingProvider>
  );
}
