# The Boring Coffee

A modern e-commerce website for a fictional coffee brand designed for developers and tech enthusiasts. Built with Next.js, TypeScript, and Tailwind CSS.

## Connecting to Supabase (Important!)

Follow these steps to properly connect the application to Supabase:

### Step 1: Setup Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.io/) and log in
2. Open your project (URL: https://tvmghxxoodjbjwhbvyir.supabase.co)
3. Go to the "SQL Editor" section
4. Copy the **entire contents** of the `supabase-setup.sql` file from this project
5. Paste it into the SQL Editor and run it
6. You should see a success message

This script does three important things:
- Creates a function that can bypass Row Level Security
- Sets up proper RLS policies for the products table
- Creates an RPC function to safely insert products
- Adds a test product (optional)

### Step 2: Import Products Using Admin Panel

The admin panel provides flexible options for importing products to your Supabase database:

1. Start your Next.js app:
   ```bash
   npm run dev
   ```

2. Navigate to the admin panel at:
   ```
   http://localhost:3000/admin
   ```

3. Import products in several ways:
   - **Bulk Import**: Click "Import All" to add all local products at once
   - **Selective Import**: Expand the product list, select specific items, then click "Import Selected"
   - **Categorized Selection**: Products are grouped by category for easier selection

4. The collapsible product list shows:
   - Product names and prices
   - Category groupings
   - Selection checkboxes with "Select All" option
   - Running count of selected items

5. You can also use the "Test Database Connection" button to verify your Supabase connection.

### Step 3: Manage Inventory with the Admin Panel

The admin panel now includes comprehensive inventory management features:

1. **Filtering**: Filter products by:
   - Category
   - Product name (search)
   - Minimum stock level

2. **Sorting**: Click on column headers to sort by:
   - Name
   - Category
   - Price
   - Stock

3. **Stock Management**: Update stock quantities directly in the table
   - Changes are saved automatically when you click away

4. **Product Deletion**: Remove products with a two-step confirmation process
   - Click "Delete" once to confirm
   - Click "Confirm Delete" to permanently remove the product

These features make it easy to manage your inventory and keep track of product stock levels without needing to access the Supabase dashboard directly.

### Step 4: Restart Your App

After setting up Supabase and importing products, restart your Next.js development server:

```bash
npm run dev
```

Now your app should properly connect to Supabase and display the products from your database.

### Troubleshooting

If you encounter connection issues:

1. Run the diagnostics script to test your Supabase connection:
   ```bash
   node test-supabase.js
   ```
   
2. Check that you've run the SQL setup script properly
3. Verify that your Supabase project is active and the URL/key are correct
4. Try reimporting products using the admin panel

## Features

### Product Display & Management
- **Dynamic Product Slider**: Interactive product comparisons with draggable divider
- **Product Image Gallery**: Multi-image slider for product detail pages
- **Roast Level Meter**: Visual indicator for coffee roast intensity
- **Product Cards**: Clean, responsive cards with hover effects and quick-add functionality
- **Product Categories**: Organized product sections for coffee and equipment
- **Product Stories**: Detailed origin stories for each coffee product
- **Vietnamese Phin Guide**: Step-by-step brewing instructions with images

### Shopping Experience
- **Interactive Cart**: Fully-functional shopping cart with add/remove capabilities
- **Cart Modal**: Slide-in modal showing cart contents and subtotal
- **Progress Bar**: Visual indicator of progress toward free shipping
- **Recommended Products**: Personalized product recommendations in cart
- **Quantity Controls**: Intuitive interface for adjusting product quantities
- **Sticky Cart Footer**: Cart summary that appears when scrolling product pages
- **Contextual Buttons**: "Add to Cart" changes to "Continue" when product is in cart

### UI/UX Features
- **Responsive Design**: Mobile-first layout that works across all devices
- **Sticky Navigation**: Header with scroll detection and dynamic styling
- **AboutUs Cards**: Compelling brand story with interactive cards
- **Review System**: Product reviews with star ratings
- **Hover Effects**: Subtle animations for better user engagement
- **Category Filtering**: Allows users to browse products by category
- **Smart Sliders**: Responsive product sliders with navigation controls

### Technical Implementation
- **Next.js App Router**: Modern routing with server and client components
- **TypeScript**: Type-safe code throughout the application
- **Tailwind CSS**: Custom design system with consistent brand colors
- **State Management**: React Context API for cart functionality
- **Local Storage**: Persistent cart data between sessions
- **Responsive Images**: Optimized loading with Next.js Image component
- **Dynamic Imports**: Efficient code splitting for better performance
- **Client-Side Interactivity**: Smooth transitions and animations
- **Custom Hooks**: Reusable logic for cart and UI interactions

## Recent Updates & Enhancements

- Added detailed product stories and brewing guides
- Implemented "Continue to Cart" functionality for better user flow
- Created a sticky product footer that appears when scrolling
- Enhanced cart modal with product recommendations slider
- Developed a roast meter to visualize coffee intensity
- Improved mobile responsiveness for all components
- Added multi-image galleries for product detail pages
- Implemented hover-to-add functionality on product cards
- Created an "About Us" section with compelling brand story
- Added product reviews with star rating system

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context API for cart functionality
- **UI Components**: Custom-built components with animations
- **Image Optimization**: Next.js Image component for optimized loading
- **Icons**: React Icons library

## Project Structure

```
the-boring-coffee/
├── app/                  # Next.js App Router
│   ├── products/         # Product pages
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── about/            # About section components
│   ├── cart/             # Cart-related components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── products/         # Product-related components
│   └── reviews/          # Review components
├── context/              # React Context providers
├── data/                 # Static data (products, reviews)
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── images/           # Product and site images
└── types/                # TypeScript type definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Integrating Supabase

This project uses Supabase for backend functionality, including product data storage, user authentication, and cart management. Follow these steps to set up Supabase for your development environment:

### 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Create a new project with a name (e.g., "the-boring-coffee")
3. Note your project URL and anon public key (you'll need these later)

### 2. Set Up Database Tables

Run the following SQL queries in the Supabase SQL Editor to create the necessary tables:

```sql
-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Users Table (Extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT
);

-- Cart Items Table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_intent_id TEXT
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Seed Product Data

Use the provided script to load your product data into Supabase:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Create a seed data script
mkdir -p supabase/seed
touch supabase/seed/products.js

# Run the seed script (after adding product data to it)
node supabase/seed/products.js
```

Create the `products.js` script with your product data based on your local data. Sample code:

```javascript
import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products.js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
  // Convert data format if needed
  const formattedProducts = products.map(product => ({
    id: product.id,
    created_at: product.created_at,
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.original_price || null,
    discount_percentage: product.discount_percentage || null,
    image_url: product.image_url,
    image_gallery: product.image_gallery || [],
    stock: product.stock,
    category: product.category,
    rating: product.rating || null,
    roast_level: product.roastLevel || null,
    story: product.story || null,
    how_to: product.howTo || []
  }));

  // Insert data
  const { data, error } = await supabase
    .from('products')
    .upsert(formattedProducts, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded products table');
  }
}

seedProducts();
```

### 4. Set Up Environment Variables

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 6. Create Supabase Client

Create a file at `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 7. Update Data Fetching Logic

Replace local data imports with Supabase queries. For example:

```typescript
// Before:
import { products } from '../data/products';

// After:
import { supabase } from '../lib/supabase';

async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}
```

### 8. Update Cart Context to Use Supabase

Modify the CartContext to store and retrieve cart items from Supabase when users are authenticated, while still supporting local storage for guest users.

### 9. Test the Integration

Run the development server and ensure all functionality works with the Supabase backend.

## Supabase Row Level Security (RLS) Setup

If you see the message "Using sample product data" on the products page, it means you need to configure Row Level Security (RLS) in Supabase to allow public read access to the products table.

### How to Fix RLS Policy for Products Table

1. Go to [Supabase Dashboard](https://app.supabase.io/) and select your project
2. Navigate to **Authentication → Policies**
3. Find the "products" table
4. Click "New Policy"
5. Select "Create a policy from scratch"
6. Set the following:
   - Policy Name: "Enable read access for all users"
   - Target roles: public
   - Definition: for SELECT using (true)
7. Click Save

Alternatively, you can run this SQL in the Supabase SQL Editor:

```sql
CREATE POLICY "Enable read access for all users" 
ON "public"."products"
FOR SELECT 
TO public
USING (true);
```

After setting up the policy, refresh your application to use the database instead of local data.

## Seeding Product Data

If your Supabase database doesn't have any products, you can seed it with sample data:

```bash
# Run the seed script
node seed-products.js
```

## Discount Codes Setup

To enable the discount codes feature, you need to run the SQL script in `discount_codes.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor tab
3. Create a new query
4. Copy and paste the contents of `discount_codes.sql`
5. Run the query to create the discount_codes table and related functions

Once the script is executed, the discount code functionality in the admin dashboard will be fully connected to your database.

## Setting Up Admin Users

After setting up the discount codes table, you'll need to assign the admin role to users who should have permission to manage discount codes:

1. First, create a user through the normal registration process or use an existing user
2. In your Supabase SQL Editor, run the following query to make a user an admin:

```sql
-- Replace the UUID with your user's ID
SELECT create_admin_user('your-user-id-here');
```

3. You can find a user's ID by viewing the "Users" section in the Supabase dashboard
4. Once a user has the admin role, they'll be able to manage discount codes in the admin panel

To verify a user is an admin, you can run:

```sql
SELECT * FROM users WHERE role = 'admin';
```

Only users with the admin role can create, update, and delete discount codes.

## Admin Authentication System

The admin dashboard now includes a complete authentication system using Supabase. This ensures that only authorized users can access the admin functionality, including discount code management.

### Setting Up Admin Authentication

1. **Access the Admin Sign-Up Page**:
   - Navigate to `/auth` in your browser
   - Use the sign-up form to create an account

2. **Assign Admin Role**:
   - New users do not automatically have admin privileges
   - After a user signs up, you'll need to manually assign them the admin role using the SQL function
   - Run the following query in your Supabase SQL Editor:
   ```sql
   SELECT create_admin_user('user-id-from-supabase');
   ```

3. **Admin Authentication Flow**:
   - When signing in at `/auth`, the system checks if the user has admin privileges
   - Only users with the "admin" role can access the admin dashboard
   - Non-admin users will see an error message

4. **Security Features**:
   - Row Level Security (RLS) ensures that only admins can manage discount codes
   - Middleware protection prevents unauthorized access to admin routes
   - Secure sign-out functionality included in the admin interface

The authentication system uses Next.js middleware to protect admin routes and integrates seamlessly with Supabase Auth.

## Fixing User Role Management

If you encounter an error about the "role" column not existing when trying to create an admin user, follow these steps:

### Step 1: Run the Fix Script

1. Go to your Supabase SQL Editor
2. Create a new query
3. Copy and paste the contents of the `fix_users_table.sql` file
4. Run the query to set up the correct table structure

This script will:
- Check for the existence of the users table in the public schema
- Add a role column if it doesn't exist
- Create a trigger to automatically add new auth users to the public.users table
- Fix the admin user creation function

### Step 2: Set Up Your Admin User

After running the fix script, you can create an admin user:

1. Sign up for an account at `/auth`
2. Find your user ID in the Supabase Authentication dashboard
3. Run the following query in the SQL Editor:

```sql
SELECT create_admin_user('your-user-id-here');
```

4. Sign in with your credentials at `/auth`
5. You should now have access to the admin dashboard

### Step 3: Verify Admin Status

You can verify that a user has admin privileges by running:

```sql
SELECT * FROM public.users WHERE role = 'admin';
```

This should show all users with admin privileges in your system.
