# Supabase Setup Guide for The Boring Coffee

This guide will help you properly set up your Supabase database for The Boring Coffee application.

## Prerequisites

1. Create a [Supabase](https://supabase.com/) account if you don't have one already
2. Create a new Supabase project
3. Keep your Supabase URL and anon key handy for configuration

## Environment Setup

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and update the Supabase variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Schema Setup

You have two options to set up the database schema:

### Option 1: Using SQL Editor (recommended for development)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `/sql/schema.sql` from this repository
4. Paste it into a new SQL query and run it
5. Verify that your tables were created successfully

### Option 2: Using Migration Scripts (recommended for production)

For a more structured approach, you can use migration scripts:

1. Install the Supabase CLI
2. Run the following commands:
   ```bash
   npm run db:setup
   ```

## Common Issues and Solutions

### Issue: "Error syncing batch 1: {}"

This error typically occurs when:

1. **Schema mismatch**: The database schema doesn't match what the application expects
   - Solution: Run the SQL schema script as described above

2. **Permission issues**: Row Level Security (RLS) policies are preventing writes
   - Solution: Temporarily disable RLS for testing or check that you're properly authenticated

3. **Data format issues**: Data being sent doesn't match column constraints
   - Solution: Check the product data format and ensure it matches the schema

### Issue: No products showing in the application

If you're not seeing any products in the application, try the following:

1. Go to the Admin page and click "Debug Database Connection"
2. If connection fails:
   - Check your environment variables
   - Make sure your IP is allowlisted in Supabase if you're using IP restrictions
   - Check the browser console for more detailed error messages

3. To manually seed products:
   - Go to Admin page 
   - Click "Try Simplified Import"
   - Select products to import
   - Click "Import Selected"

## Database Schema

The application uses the following tables:

1. **products** - Stores product information
2. **cart_items** - Stores items in user carts
3. **orders** - Stores order information
4. **order_items** - Stores items in orders

See the `/sql/schema.sql` file for the complete schema definition.

## Testing Your Setup

After completing the setup, you can verify everything is working:

1. Start the application:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/products
3. You should see product listings fetched from your Supabase database
4. Try adding items to cart and checking out to test the complete flow 