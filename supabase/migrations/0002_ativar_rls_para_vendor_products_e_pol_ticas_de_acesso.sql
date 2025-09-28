ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendor_products_read_all" ON public.vendor_products FOR SELECT USING (true);

CREATE POLICY "vendor_products_insert" ON public.vendor_products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "vendor_products_update" ON public.vendor_products FOR UPDATE USING (vendor_id = auth.uid()) WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "vendor_products_delete" ON public.vendor_products FOR DELETE USING (vendor_id = auth.uid());