import { useQuery } from "@tanstack/react-query";
import { getVendorProductById } from "@/utils/sb-products";
import { getProductById } from "@/lib/sample-data";

export function useProductById(id?: string) {
  const q = useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const sb = await getVendorProductById(id);
      if (sb) {
        return {
          id: sb.id!,
          name: sb.name,
          price: Number(sb.price),
          image: sb.image || undefined,
          rating: sb.rating ? Number(sb.rating) : undefined,
          category: sb.category || undefined,
          description: sb.description || undefined,
        };
      }
      // fallback: sample
      return getProductById(id) || null;
    },
  });

  return { product: q.data || null, isLoading: q.isLoading };
}