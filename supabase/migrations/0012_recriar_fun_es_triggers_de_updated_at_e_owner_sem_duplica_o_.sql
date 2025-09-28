DROP TRIGGER IF EXISTS vendor_products_update_ts ON public.vendor_products;
DROP FUNCTION IF EXISTS public.update_vendor_product_updated_at();
DROP TRIGGER IF EXISTS vendor_products_before_insert ON public.vendor_products;
DROP FUNCTION IF EXISTS public.set_vendor_id_on_insert();

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

CREATE OR REPLACE FUNCTION public.set_vendor_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vendor_id IS NULL THEN
    NEW.vendor_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendor_products_before_insert
BEFORE INSERT ON public.vendor_products
FOR EACH ROW EXECUTE FUNCTION public.set_vendor_id_on_insert();