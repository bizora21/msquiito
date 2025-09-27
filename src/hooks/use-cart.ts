import * as React from "react";
import { products, type Product } from "@/lib/sample-data";

export type CartItem = {
  id: string;
  qty: number;
};

type CartState = CartItem[];

const CART_KEY = "lr_cart";

function readCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartState) : [];
  } catch {
    return [];
  }
}

function writeCart(data: CartState) {
  localStorage.setItem(CART_KEY, JSON.stringify(data));
}

export function useCart() {
  const [items, setItems] = React.useState<CartState>(() => readCart());

  React.useEffect(() => {
    writeCart(items);
  }, [items]);

  const add = (productId: string, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === productId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { id: productId, qty }];
    });
  };

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return remove(productId);
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, qty } : i)));
  };

  const clear = () => setItems([]);

  const enriched = items
    .map((i) => {
      const p = products.find((p) => p.id === i.id);
      if (!p) return undefined;
      return { product: p as Product, qty: i.qty, subtotal: (p?.price || 0) * i.qty };
    })
    .filter(Boolean) as { product: Product; qty: number; subtotal: number }[];

  const total = enriched.reduce((sum, i) => sum + i.subtotal, 0);

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, add, remove, updateQty, clear, enriched, total, count };
}