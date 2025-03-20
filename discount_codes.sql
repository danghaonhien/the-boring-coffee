-- First, add a role column to the users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'customer';
    END IF;
END $$;

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  percentage INTEGER NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  applicable_items TEXT NOT NULL CHECK (applicable_items IN ('single', 'multiple', 'all')),
  items JSONB,  -- Store array of product IDs as JSONB
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookup by code
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);

-- Create index for active codes
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(active);

-- Add RLS (Row Level Security) policies
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all discount codes
CREATE POLICY admin_manage_discount_codes
  ON discount_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));
  
-- Allow all users to view active discount codes
CREATE POLICY view_active_discount_codes
  ON discount_codes
  FOR SELECT
  TO authenticated
  USING (active = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- Create function to validate a discount code
CREATE OR REPLACE FUNCTION validate_discount_code(code_str TEXT, product_ids TEXT[] DEFAULT NULL)
RETURNS TABLE (
  valid BOOLEAN,
  discount_percentage INTEGER,
  message TEXT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH code_check AS (
    SELECT 
      c.id,
      c.percentage,
      c.applicable_items,
      c.items
    FROM discount_codes c
    WHERE 
      c.code = code_str 
      AND c.active = TRUE
      AND (c.expires_at IS NULL OR c.expires_at > NOW())
    LIMIT 1
  )
  SELECT 
    CASE WHEN cc.id IS NOT NULL THEN TRUE ELSE FALSE END,
    COALESCE(cc.percentage, 0),
    CASE
      WHEN cc.id IS NULL THEN 'Invalid or expired discount code'
      WHEN cc.applicable_items = 'single' AND (product_ids IS NULL OR array_length(product_ids, 1) != 1) 
        THEN 'This code can only be applied to a single product'
      WHEN cc.applicable_items = 'multiple' AND (product_ids IS NULL OR array_length(product_ids, 1) < 1)
        THEN 'Product selection required for this discount code'
      WHEN cc.applicable_items = 'multiple' AND NOT(
        (SELECT COUNT(*) FROM unnest(product_ids) p_id 
         WHERE p_id IN (SELECT jsonb_array_elements_text(cc.items)))
        = array_length(product_ids, 1))
        THEN 'One or more selected products are not eligible for this discount'
      ELSE 'Discount code applied successfully'
    END
  FROM code_check cc;
END;
$$;

-- Add a helper function to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(user_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE users
  SET role = 'admin'
  WHERE id = user_id;
END;
$$;