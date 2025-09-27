import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "react-router-dom";

export default function CartDrawer({ open, onOpenChange }: { open?: boolean; onOpenChange?: (o: boolean) => void }) {
  const { enriched, updateQty, remove, total } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {enriched.length === 0 ? (
            <div className="text-sm text-slate-500">Seu carrinho está vazio.</div>
          ) : (
            enriched.map(({ product, qty, subtotal }) => (
              <div key={product.id} className="flex items-center gap-3 border-b pb-3">
                <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-14 h-14 object-contain rounded" loading="lazy" />
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{product.name}</div>
                  <div className="text-xs text-slate-500">MT {product.price} • Subtotal: MT {subtotal}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => updateQty(product.id, Number(e.target.value))}
                      className="w-16 border rounded px-2 py-1 text-sm"
                    />
                    <Button variant="ghost" size="icon" onClick={() => remove(product.id)} aria-label="Remover">
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Total</div>
            <div className="text-lg font-semibold">MT {total}</div>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-4">Finalizar Compra</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}