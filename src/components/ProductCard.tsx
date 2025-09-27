import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import type { Product } from "@/lib/sample-data";
import { useCart } from "@/hooks/use-cart";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const onAdd = () => {
    add(product.id, 1);
    showSuccess("Adicionado ao carrinho");
  };

  return (
    <article className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-500">
      <Link 
        to={`/produto/${product.id}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        aria-label={`Ver detalhes do produto ${product.name}`}
      >
        <img
          src={product.image || "/placeholder.svg"}
          alt={`Imagem do produto ${product.name}`}
          loading="lazy"
          className="w-full h-44 object-contain rounded-md"
        />
        <h3 className="mt-3 font-medium text-slate-800">{product.name}</h3>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900" aria-label={`Preço: ${product.price} meticais`}>
            MT {product.price}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Star size={14} className="text-yellow-500" aria-hidden="true" />
            <span aria-label={`Avaliação: ${product.rating ?? "não avaliado"}`}>
              {product.rating ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={onAdd} 
            size="sm" 
            className="flex items-center gap-2"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <ShoppingCart size={14} aria-hidden="true" />
            Adicionar
          </Button>
        </div>
      </div>
    </article>
  );
}