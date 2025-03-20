
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Pricing from "./pages/Pricing";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/layout/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <AuthGuard requireAuth={false}>
                {/* Conditionally render Dashboard for logged in users or Landing for guests */}
                <RootRouteHandler />
              </AuthGuard>
            } />
            <Route path="/auth/login" element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            } />
            <Route path="/auth/register" element={
              <AuthGuard requireAuth={false}>
                <Register />
              </AuthGuard>
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <PharmacyDashboard />
              </AuthGuard>
            } />
            <Route path="/inventory" element={
              <AuthGuard>
                <Inventory />
              </AuthGuard>
            } />
            <Route path="/sales" element={
              <AuthGuard>
                <Sales />
              </AuthGuard>
            } />
            <Route path="/reports" element={
              <AuthGuard>
                <Reports />
              </AuthGuard>
            } />
            <Route path="/customers" element={
              <AuthGuard>
                <Customers />
              </AuthGuard>
            } />
            <Route path="/products" element={
              <AuthGuard>
                <Products />
              </AuthGuard>
            } />
            <Route path="/suppliers" element={
              <AuthGuard>
                <Suppliers />
              </AuthGuard>
            } />
            <Route path="/pricing" element={
              <AuthGuard>
                <Pricing />
              </AuthGuard>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Helper component to decide what to render on the root route
const RootRouteHandler = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharma-600"></div>
      </div>
    );
  }
  
  // If user is logged in, show dashboard, otherwise show landing page
  return user ? <PharmacyDashboard /> : <Landing />;
};

import { useAuth } from "./contexts/AuthContext";

export default App;
