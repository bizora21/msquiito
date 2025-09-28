DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'vendor_products'
  ) THEN
    IF (SELECT relrowsecurity FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE c.relname = 'vendor_products' AND n.nspname = 'public') = false THEN
      EXECUTE 'ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY';
    END IF;
  ELSE
    RAISE NOTICE 'vendor_products table não existe ainda; ignorei o enable do RLS';
  END IF;
END
$$;