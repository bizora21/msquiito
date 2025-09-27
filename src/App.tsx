import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Produtos from "./pages/Produtos";
import Produto from "./pages/Produto";
import VendorRegister from "./pages/VendorRegister";
import ServiceProviderRegister from "./pages/ServiceProviderRegister";
import Servicos from "./pages/Servicos";
import Servico from "./pages/Servico";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import RegisterClient from "./pages/RegisterClient";
import DashboardClient from "./pages/DashboardClient";
import DashboardVendor from "./pages/DashboardVendor";
import DashboardProvider from "./pages/DashboardProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servico/:id" element={<Servico />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cliente/register" element={<RegisterClient />} />
          <Route path="/vendedor/register" element={<VendorRegister />} />
          <Route path="/prestador/register" element={<ServiceProviderRegister />} />
          <Route
            path="/dashboard/cliente"
            element={
              <ProtectedRoute roles={["client"]}>
                <DashboardClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vendedor"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <DashboardVendor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/prestador"
            element={
              <ProtectedRoute roles={["provider"]}>
                <DashboardProvider />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;