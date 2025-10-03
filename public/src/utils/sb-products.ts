import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/sample-data";

export type SbVendorProduct = Product & {
  vendor_id?: string | null;
  stock?: number | null;
  created_at?: string;
  updated_at?: string;
};

export async function listPublicVendorProducts(): Promise<SbVendorProduct[]> {
  const { data, error } = await supabase
    .from("vendor_products")
    .select("*")
  .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as SbVendorProduct[];
}

export async function listMyVendorProducts(userId: string): Promise<SbVendorProduct[]> {
  const { data, error } = await supabase
    .from("vendor_products")
    .select("*")
    .eq("vendor_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as SbVendorProduct[];
}

export async function getVendorProductById(id: string): Promise<SbVendorProduct | null> {
  const { data, error } = await supabase
    .from("vendor_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as SbVendorProduct) || null;
}

export async function insertVendorProduct(p: Omit<SbVendorProduct, "id" | "created_at" | "updated_at" | "vendor_id">) {
  const { data, error } = await supabase
    .from("vendor_products")
    .insert(p as any)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as SbVendorProduct;
}

export async function updateVendorProductById(id: string, changes: Partial<SbVendorProduct>) {
  const { data, error } = await supabase
    .from("vendor_products")
    .update(changes as any)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as SbVendorProduct;
}

export async function deleteVendorProductById(id: string) {
  const { error } = await supabase.from("vendor_products").delete().eq("id", id);
  if (error) throw error;
}