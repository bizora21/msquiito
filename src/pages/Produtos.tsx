import React from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "@/components/ProductGrid";
import HomeButton from "@/components/HomeButton";

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
    <main className="pt-24 min-h-screen bg-gradient-to-b from-emerald-50/60 to-transparent">
      <div className="max-w-5xl mx-auto px-4">
        <HomeButton />
        <ProductGrid />
      </div>
    </main>
  );
}