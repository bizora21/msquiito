import { products as sampleProducts, type Product } from "@/lib/sample-data";
import { getVendorProducts } from "@/utils/vendor-products";

export function getAllProducts(): Product[] {
  const vendor = getVendorProducts();
  // garantir compatibilidade de tipos
  const vendorAsProducts: Product[] = vendor.map((v) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    image: v.image,
    rating: v.rating,
    category: v.category,
    description: v.description,
  }));
  return [...vendorAsProducts, ...sampleProducts];
}

export function getAnyProductById(id?: string): Product | undefined {
  if (!id) return undefined;
  const vendor = getVendorProducts().find((p) => p.id === id);
  if (vendor) return vendor;
  return sampleProducts.find((p) => p.id === id);
}