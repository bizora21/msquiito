import React from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "@/components/ProductGrid";

export default function Produtos() {
  const location = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    document.title = q ? `Pesquisar: ${q} — LojaRápida` : "Produtos — LojaRápida";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Explore produtos locais e ofertas em LojaRápida.");
    }
  }, [location.search]);

  return (
    <main className="pt-24 min-h-screen">
      <ProductGrid />
    </main>
  );
}