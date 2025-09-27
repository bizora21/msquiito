import React from "react";
import ProductCard from "./ProductCard";
import { getAllProducts } from "@/lib/catalog";

export default function ProductGrid({ limit }: { limit?: number }) {
  const items = getAllProducts();
  const list = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Produtos populares</h2>
          <a href="/produtos" className="text-sm text-blue-600 hover:underline">Ver todos</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {list.map((p) => (
            <div key={p.id} className="animate-in fade-in-50">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}