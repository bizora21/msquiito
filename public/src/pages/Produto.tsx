import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import HomeButton from "@/components/HomeButton";
import { useProductById } from "@/hooks/use-product-by-id";

export default function Produto() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading } = useProductById(id);

  React.useEffect(() => {
    if (product) {
      document.title = `${product.name} — LojaRápida`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", product.description || "");
    }
  }, [product]);

  if (isLoading) {
    return (
      <main className="pt-24 min-h-screen bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
        <div className="max-w-4xl mx-auto px-4">
          <HomeButton />
          <div className="bg-white border rounded-md p-6">
            <div className="h-80 bg-gray-100 rounded-md animate-pulse" />
            <div className="mt-4 h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
        <div className="max-w-4xl mx-auto px-4">
          <HomeButton />
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Produto não encontrado</h2>
            <Link to="/produtos" className="text-blue-600 mt-4 inline-block">Voltar aos produtos</Link>
          </div>
        </div>
      </div>
    );
  }

  const onOrder = () => {
    showSuccess("Pedido confirmado (pagamento na entrega)");
  };

  return (
    <main className="pt-24 bg-gradient-to-b from-emerald-50/60 to-transparent animated-green">
      <div className="max-w-4xl mx-auto px-4">
        <HomeButton />
        <div className="bg-white border rounded-md p-6 animate-in fade-in-50">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-md">
              <img src={product.image || "/placeholder.svg"} alt={product.name} loading="lazy" className="w-full h-80 object-contain rounded-md" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <div className="mt-2 text-slate-700">{product.description}</div>
              <div className="mt-4 text-2xl font-bold">MT {product.price}</div>

              <div className="mt-6 flex gap-3">
                <Button onClick={onOrder}>Comprar (Pagamento na entrega)</Button>
                <Button variant="outline">Contactar Vendedor</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}