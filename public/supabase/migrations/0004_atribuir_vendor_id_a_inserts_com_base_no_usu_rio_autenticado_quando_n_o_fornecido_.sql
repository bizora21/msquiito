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