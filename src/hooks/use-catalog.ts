import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { listPublicVendorProducts, type SbVendorProduct } from "@/utils/sb-products";
import { products as sampleProducts, type Product } from "@/lib/sample-data";

export function useCatalog() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["catalog", "vendor_products_public"],
    queryFn: async () => {
      const vendor = await listPublicVendorProducts();
      // compat com Product
      const vendorAsProducts: Product[] = (vendor || []).map((v: SbVendorProduct) => ({
        id: v.id!,
        name: v.name,
        price: Number(v.price),
        image: v.image || undefined,
        rating: v.rating ? Number(v.rating) : undefined,
        category: v.category || undefined,
        description: v.description || undefined,
      }));
      return [...vendorAsProducts, ...sampleProducts];
    },
  });

  return { items: data || [], isLoading, isError, error, refetch };
}