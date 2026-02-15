import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Book from "./pages/Book";
import BookVehicle from "./pages/BookVehicle";
import BookAddOns from "./pages/BookAddOns";
import BookOptions from "./pages/BookOptions";
import BookBooking from "./pages/BookBooking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import BusinessInfoForm from "./components/dashboard/BusinessInfoForm";
import SocialMediaForm from "./components/dashboard/SocialMediaForm";
import ServicesManager from "./components/dashboard/ServicesManager";
import PhotosManager from "./components/dashboard/PhotosManager";
import TestimonialsManager from "./components/dashboard/TestimonialsManager";
import CalendarManager from "./components/dashboard/CalendarManager";
import AccountSettings from "./components/dashboard/AccountSettings";
import CustomersManager from "./components/dashboard/CustomersManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book" element={<Book />} />
            <Route path="/book/vehicle" element={<BookVehicle />} />
            <Route path="/book/options" element={<BookOptions />} />
            <Route path="/book/add-ons" element={<BookAddOns />} />
            <Route path="/book/booking" element={<BookBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<BusinessInfoForm />} />
              <Route path="calendar" element={<CalendarManager />} />
              <Route path="customers" element={<CustomersManager />} />
              <Route path="social" element={<SocialMediaForm />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="photos" element={<PhotosManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="account" element={<AccountSettings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
