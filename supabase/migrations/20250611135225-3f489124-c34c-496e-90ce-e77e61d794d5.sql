
-- Create pharmacies table for pharmacy profiles
CREATE TABLE public.pharmacies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  barcode TEXT,
  category TEXT,
  manufacturer TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sale_items table
CREATE TABLE public.sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pharmacies
CREATE POLICY "Users can view their own pharmacy" ON public.pharmacies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pharmacy" ON public.pharmacies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pharmacy" ON public.pharmacies
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for customers (allow all authenticated users)
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert customers" ON public.customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update customers" ON public.customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete customers" ON public.customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for categories
CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON public.categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for products
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for suppliers
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert suppliers" ON public.suppliers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete suppliers" ON public.suppliers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for sales
CREATE POLICY "Authenticated users can view sales" ON public.sales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales" ON public.sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales" ON public.sales
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales" ON public.sales
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for sale_items
CREATE POLICY "Authenticated users can view sale_items" ON public.sale_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sale_items" ON public.sale_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sale_items" ON public.sale_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sale_items" ON public.sale_items
  FOR DELETE USING (auth.role() = 'authenticated');
