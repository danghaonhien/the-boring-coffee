-- Check if the auth schema and users table exist
DO $$
BEGIN
    -- Add role column to auth.users table if it doesn't exist
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'auth' AND table_name = 'users'
    ) THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'role'
        ) THEN
            ALTER TABLE auth.users ADD COLUMN role TEXT;
        END IF;
    END IF;

    -- Check for users table in public schema
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
    ) THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
        ) THEN
            ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'customer';
        END IF;
    ELSE
        -- Create users table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.users (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT NOT NULL,
            role TEXT DEFAULT 'customer',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create function to add a user to the public.users table after auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (new.id, new.email, 'customer')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or replace function to assign admin role
CREATE OR REPLACE FUNCTION create_admin_user(user_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.users
  SET role = 'admin'
  WHERE id = user_id;
END;
$$; 