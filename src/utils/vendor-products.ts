import { type Product } from "@/lib/sample-data";

export type VendorProduct = Product & {
  stock?: number;
  createdAt: string;
  updatedAt: string;
};

const KEY = "lr_vendor_products";

export function getVendorProducts(): VendorProduct[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as VendorProduct[]) : [];
  } catch {
    return [];
  }
}

function saveVendorProducts(list: VendorProduct[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addVendorProduct(p: Omit<VendorProduct, "createdAt" | "updatedAt">) {
  const list = getVendorProducts();
  const now = new Date().toISOString();
  const item: VendorProduct = { ...p, createdAt: now, updatedAt: now };
  saveVendorProducts([item, ...list]);
}

export function updateVendorProduct(id: string, changes: Partial<VendorProduct>) {
  const list = getVendorProducts();
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return;
  const now = new Date().toISOString();
  list[idx] = { ...list[idx], ...changes, updatedAt: now };
  saveVendorProducts(list);
}

export function removeVendorProduct(id: string) {
  const list = getVendorProducts().filter((x) => x.id !== id);
  saveVendorProducts(list);
}