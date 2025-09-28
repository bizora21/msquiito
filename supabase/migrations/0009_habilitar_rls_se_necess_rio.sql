DO $$ 
DECLARE
  rls boolean;
BEGIN
  SELECT relrowsecurity INTO rls
  FROM pg_class c
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE c.relname = 'vendor_products' AND n.nspname = 'public';
  IF rls IS NULL THEN
    RAISE NOTICE 'vendor_products table not found to enable RLS';
  ELSIF NOT rls THEN
    EXECUTE 'ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY';
  END IF;
END
$$;