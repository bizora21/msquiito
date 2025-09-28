import * as React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import VendorProductManager from "@/components/VendorProductManager";
import { getVendorProducts } from "@/utils/vendor-products";
import HomeButton from "@/components/HomeButton";

function Content() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const fn = () => setCount(getVendorProducts().length);
    fn();
    const id = setInterval(fn, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="pt-24 max-w-6xl mx-auto px-4 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <HomeButton />
      <h1 className="text-2xl font-semibold">Dashboard do Vendedor</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-white border rounded-md p-4 animate-in fade-in-50">
          <div className="text-xs text-slate-500">Produtos cadastrados</div>
          <div className="text-2xl font-bold">{count}</div>
        </div>
        <div className="bg-white border rounded-md p-4 animate-in fade-in-50">
          <div className="text-xs text-slate-500">Pedidos</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white border rounded-md p-4 animate-in fade-in-50">
          <div className="text-xs text-slate-500">Avaliações</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white border rounded-md p-4 animate-in fade-in-50">
          <div className="text-xs text-slate-500">Cupons ativos</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <VendorProductManager />
    </main>
  );
}

export default function DashboardVendor() {
  return (
    <ProtectedRoute roles={["vendor"]}>
      <Content />
    </ProtectedRoute>
  );
}