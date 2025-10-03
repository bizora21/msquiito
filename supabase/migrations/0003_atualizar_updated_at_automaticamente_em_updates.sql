CREATE OR REPLACE FUNCTION public.update_vendor_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendor_products_update_ts
BEFORE UPDATE ON public.vendor_products
FOR EACH ROW EXECUTE FUNCTION public.update_vendor_product_updated_at();