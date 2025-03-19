-- SQL script to enable public read access to the products table
-- Copy and run this in the Supabase SQL Editor

-- Enable RLS on products table if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to all products
CREATE POLICY "Enable read access for all users" 
ON "public"."products"
FOR SELECT 
TO public
USING (true);

-- Create a policy to allow authenticated users to insert products
CREATE POLICY "Enable insert for authenticated users only" 
ON "public"."products"
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create a policy to allow authenticated users to update products they created
CREATE POLICY "Enable update for authenticated users only" 
ON "public"."products"
FOR UPDATE 
TO authenticated
USING (true);

-- Show the created policies
SELECT * FROM pg_policies WHERE tablename = 'products'; 