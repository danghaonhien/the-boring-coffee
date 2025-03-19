-- Run this SQL script in the Supabase SQL Editor to properly set up the database
-- This script configures Row Level Security and creates necessary functions

-- Check if tables exist, and create them if they don't
DO $$
BEGIN
    -- Create products table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        CREATE TABLE products (
            id UUID PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            name TEXT NOT NULL,
            description TEXT,
            price INTEGER NOT NULL,
            original_price INTEGER,
            discount_percentage INTEGER,
            image_url TEXT,
            image_gallery TEXT[],
            stock INTEGER NOT NULL DEFAULT 0,
            category TEXT,
            rating NUMERIC(3,1),
            roast_level INTEGER,
            story TEXT,
            how_to TEXT[]
        );
    END IF;
END;
$$;

-- First, create the function to get all products without RLS restrictions
CREATE OR REPLACE FUNCTION get_all_products()
RETURNS SETOF products
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM products;
$$;

-- Grant access to the functions for anonymous users
GRANT EXECUTE ON FUNCTION get_all_products TO anon;
GRANT EXECUTE ON FUNCTION get_all_products TO authenticated;

-- Set up RLS policy for direct table access
-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: First, drop all existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."products";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."products";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "public"."products";
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON "public"."products";
DROP POLICY IF EXISTS "Enable delete for anonymous users" ON "public"."products";

-- Create a policy to allow public read access to all products
CREATE POLICY "Enable read access for all users" 
ON "public"."products"
FOR SELECT 
TO public
USING (true);

-- Create a policy to allow anonymous users to insert products
CREATE POLICY "Enable insert for anonymous users" 
ON "public"."products"
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create a policy to allow authenticated users to insert products
CREATE POLICY "Enable insert for authenticated users only" 
ON "public"."products"
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create a policy to allow authenticated users to update products
CREATE POLICY "Enable update for authenticated users only" 
ON "public"."products"
FOR UPDATE 
TO authenticated
USING (true);

-- Create a policy to allow anonymous users to delete products
CREATE POLICY "Enable delete for anonymous users" 
ON "public"."products"
FOR DELETE 
TO anon
USING (true);

-- Add some test products (these will get inserted if there are no products)
INSERT INTO products (id, name, description, price, image_url, stock, category, rating, roast_level)
VALUES 
(gen_random_uuid(), 'Test Coffee', 'A test coffee product from SQL setup', 1499, '/products/test-coffee.jpg', 100, 'coffee', 4.5, 3)
ON CONFLICT (id) DO NOTHING; 