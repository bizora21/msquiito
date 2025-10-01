import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Added
import { Label } from "@/components/ui/label"; // Added

import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import NotFound from "./pages/NotFound";
import Produtos from "./pages/Produtos";
import Produto from "./pages/Produto";
import Servicos from "./pages/Servicos";
import Servico from "./pages/Servico";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import RegisterClient from "./pages/RegisterClient";
import VendorRegister from "./pages/VendorRegister";
import ServiceProviderRegister from "./pages/ServiceProviderRegister";
import DashboardClient from "./pages/DashboardClient";
import DashboardVendor from "./pages/DashboardVendor";
import DashboardProvider from "./pages/DashboardProvider";
import DashboardAdmin from "./pages/DashboardAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./components/AuthProvider";

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produto/:id" element={<Produto />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/servico/:id" element={<Servico />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cliente/register" element={<RegisterClient />} />
            <Route path="/vendedor/register" element={<VendorRegister />} />
            <Route path="/prestador/register" element={<ServiceProviderRegister />} />
            {/* Rotas protegidas */}
            <Route path="/dashboard/cliente" element={<ProtectedRoute roles={["client"]}><DashboardClient /></ProtectedRoute>} />
            <Route path="/dashboard/vendedor" element={<ProtectedRoute roles={["vendor"]}><DashboardVendor /></ProtectedRoute>} />
            <Route path="/dashboard/prestador" element={<ProtectedRoute roles={["provider"]}><DashboardProvider /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute roles={["admin"]}><DashboardAdmin /></ProtectedRoute>} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;