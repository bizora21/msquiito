-- Extensão necessária para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Garante o schema public (normalmente já existe)
CREATE SCHEMA IF NOT EXISTS public;

-- Cria a tabela se não existir
CREATE TABLE IF NOT EXISTS public.vendor_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  rating NUMERIC,
  category TEXT,
  description TEXT,
  stock INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendor_products_vendor_id_idx ON public.vendor_products (vendor_id);

-- Habilita Row Level Security
ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;

-- (Re)cria políticas de forma segura
DROP POLICY IF EXISTS vendor_products_read_all ON public.vendor_products;
CREATE POLICY vendor_products_read_all ON public.vendor_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS vendor_products_insert ON public.vendor_products;
CREATE POLICY vendor_products_insert ON public.vendor_products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS vendor_products_update ON public.vendor_products;
CREATE POLICY vendor_products_update ON public.vendor_products
  FOR UPDATE USING (vendor_id = auth.uid()) WITH CHECK (vendor_id = auth.uid());

DROP POLICY IF EXISTS vendor_products_delete ON public.vendor_products;
CREATE POLICY vendor_products_delete ON public.vendor_products
  FOR DELETE USING (vendor_id = auth.uid());

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_vendor_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendor_products_update_ts ON public.vendor_products;
CREATE TRIGGER vendor_products_update_ts
BEFORE UPDATE ON public.vendor_products
FOR EACH ROW EXECUTE FUNCTION public.update_vendor_product_updated_at();

-- Função para atribuir vendor_id em inserts quando não fornecido
CREATE OR REPLACE FUNCTION public.set_vendor_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vendor_id IS NULL THEN
    NEW.vendor_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendor_products_before_insert ON public.vendor_products;
CREATE TRIGGER vendor_products_before_insert
BEFORE INSERT ON public.vendor_products
FOR EACH ROW EXECUTE FUNCTION public.set_vendor_id_on_insert();

-- (Opcional) tabela profiles mínima (não sobrescreve se já existir)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'cliente',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função idempotente para criar perfil na signup (opcional)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, COALESCE(NEW.user_metadata ->> 'full_name', NEW.user_metadata ->> 'name', NEW.email), NEW.email)
    ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();