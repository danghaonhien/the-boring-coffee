-- This file contains the SQL schema for the Boring Coffee database
-- You can run this file in Supabase SQL Editor to create the necessary tables

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,  -- Stored in cents
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  original_price INTEGER,  -- Stored in cents
  discount_percentage INTEGER,
  image_gallery TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 1),  -- Rating from 0-5 with one decimal place
  roast_level INTEGER,   -- 0-100 where 0 is lightest, 100 is darkest
  story TEXT,            -- Product story/origin text
  how_to TEXT[] DEFAULT '{}'  -- Steps for how to use the product
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT quantity_greater_than_zero CHECK (quantity > 0)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal INTEGER NOT NULL,
  tax INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  payment_intent_id TEXT
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,  -- Price at time of order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT quantity_greater_than_zero CHECK (quantity > 0)
);

-- Create Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products - everyone can read, only authenticated users with admin role can modify
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT USING (true);

CREATE POLICY "Products can be inserted by authenticated users with admin role" 
  ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Products can be updated by authenticated users with admin role" 
  ON products FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Products can be deleted by authenticated users with admin role" 
  ON products FOR DELETE USING (auth.uid() IS NOT NULL);

-- Cart items - users can only access their own cart items
CREATE POLICY "Users can view their own cart items" 
  ON cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
  ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
  ON cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders - users can only access their own orders
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own orders" 
  ON orders FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Order items - users can view order items for their orders
CREATE POLICY "Users can view their own order items" 
  ON order_items FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

CREATE POLICY "Users can insert their own order items" 
  ON order_items FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

-- Create function to get all products (in case RLS is causing issues)
CREATE OR REPLACE FUNCTION get_all_products()
RETURNS SETOF products
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM products;
$$; 