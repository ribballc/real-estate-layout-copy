import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useOutletContext } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";

// Eagerly loaded pages (above the fold / critical path)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages (code-split)
const DeluxeLanding = React.lazy(() => import("./pages/DeluxeLanding"));
const Loading = React.lazy(() => import("./pages/Loading"));
const Generating = React.lazy(() => import("./pages/Generating"));
const Preview = React.lazy(() => import("./pages/Preview"));
const Book = React.lazy(() => import("./pages/Book"));
const BookVehicle = React.lazy(() => import("./pages/BookVehicle"));
const BookAddOns = React.lazy(() => import("./pages/BookAddOns"));
const BookOptions = React.lazy(() => import("./pages/BookOptions"));
const BookBooking = React.lazy(() => import("./pages/BookBooking"));
const BookCheckout = React.lazy(() => import("./pages/BookCheckout"));
const PublicEstimate = React.lazy(() => import("./pages/PublicEstimate"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

// Lazy-loaded dashboard components
const DashboardLayout = React.lazy(() => import("./components/dashboard/DashboardLayout"));
const HomeDashboard = React.lazy(() => import("./components/dashboard/HomeDashboard"));
const BusinessInfoForm = React.lazy(() => import("./components/dashboard/BusinessInfoForm"));
const ServicesManager = React.lazy(() => import("./components/dashboard/ServicesManager"));
const PhotosManager = React.lazy(() => import("./components/dashboard/PhotosManager"));
const TestimonialsManager = React.lazy(() => import("./components/dashboard/TestimonialsManager"));
const CalendarManager = React.lazy(() => import("./components/dashboard/CalendarManager"));
const JobsManager = React.lazy(() => import("./components/dashboard/JobsManager"));
const EstimatesManager = React.lazy(() => import("./components/dashboard/EstimatesManager"));
const AccountSettings = React.lazy(() => import("./components/dashboard/AccountSettings"));
const CustomersManager = React.lazy(() => import("./components/dashboard/CustomersManager"));
const OfferLabManager = React.lazy(() => import("./components/dashboard/OfferLabManager"));
const WebsitePage = React.lazy(() => import("./components/dashboard/WebsitePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — don't refetch fresh data
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(215, 50%, 10%)" }}>
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(217,91%,60%)", borderTopColor: "transparent" }} />
      <p className="text-sm" style={{ color: "hsla(0,0%,100%,0.4)" }}>Loading…</p>
    </div>
  </div>
);

// Wrapper to pass outlet context (chatbotRef) as prop to WebsitePage
const WebsitePageRoute = React.forwardRef<any>((_props, _ref) => {
  const ctx = useOutletContext<{ chatbotRef?: any; isDark?: boolean } | null>();
  return (
    <Suspense fallback={<PageLoader />}>
      <WebsitePage chatbotRef={ctx?.chatbotRef} isDark={ctx?.isDark ?? false} />
    </Suspense>
  );
});
WebsitePageRoute.displayName = "WebsitePageRoute";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/loading" element={<ProtectedRoute><Loading /></ProtectedRoute>} />
                <Route path="/generating" element={<ProtectedRoute><Generating /></ProtectedRoute>} />
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
                  <Route path="offer-lab" element={<OfferLabManager />} />
                  <Route path="account" element={<AccountSettings />} />
                </Route>
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/site/:slug" element={<DeluxeLanding />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
