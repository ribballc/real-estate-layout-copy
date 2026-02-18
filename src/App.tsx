import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useOutletContext } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import DeluxeLanding from "./pages/DeluxeLanding";
import Loading from "./pages/Loading";
import Preview from "./pages/Preview";
import Book from "./pages/Book";
import BookVehicle from "./pages/BookVehicle";
import BookAddOns from "./pages/BookAddOns";
import BookOptions from "./pages/BookOptions";
import BookBooking from "./pages/BookBooking";
import BookCheckout from "./pages/BookCheckout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import HomeDashboard from "./components/dashboard/HomeDashboard";
import BusinessInfoForm from "./components/dashboard/BusinessInfoForm";
import ServicesManager from "./components/dashboard/ServicesManager";
import PhotosManager from "./components/dashboard/PhotosManager";
import TestimonialsManager from "./components/dashboard/TestimonialsManager";
import CalendarManager from "./components/dashboard/CalendarManager";
import JobsManager from "./components/dashboard/JobsManager";
import EstimatesManager from "./components/dashboard/EstimatesManager";
import PublicEstimate from "./pages/PublicEstimate";
import AccountSettings from "./components/dashboard/AccountSettings";
import CustomersManager from "./components/dashboard/CustomersManager";
import WebsitePage from "./components/dashboard/WebsitePage";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper to pass outlet context (chatbotRef) as prop to WebsitePage
const WebsitePageRoute = () => {
  const ctx = useOutletContext<{ chatbotRef?: any } | null>();
  return <WebsitePage chatbotRef={ctx?.chatbotRef} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/loading" element={<ProtectedRoute><Loading /></ProtectedRoute>} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/site/:slug/book" element={<Book />} />
            <Route path="/site/:slug/book/vehicle" element={<BookVehicle />} />
            <Route path="/site/:slug/book/options" element={<BookOptions />} />
            <Route path="/site/:slug/book/add-ons" element={<BookAddOns />} />
            <Route path="/site/:slug/book/booking" element={<BookBooking />} />
            <Route path="/site/:slug/book/checkout" element={<BookCheckout />} />
            <Route path="/estimate/:id" element={<PublicEstimate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<HomeDashboard />} />
              <Route path="business" element={<BusinessInfoForm />} />
              <Route path="website" element={<WebsitePageRoute />} />
              <Route path="calendar" element={<CalendarManager />} />
              <Route path="jobs" element={<JobsManager />} />
              <Route path="estimates" element={<EstimatesManager />} />
              <Route path="customers" element={<CustomersManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="photos" element={<PhotosManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="account" element={<AccountSettings />} />
            </Route>
            <Route path="/site/:slug" element={<DeluxeLanding />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
