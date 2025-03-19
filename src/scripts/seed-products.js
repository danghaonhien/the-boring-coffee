// This script imports local product data into your Supabase database
// Run this with: node src/scripts/seed-products.mjs

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Load products from local data file
async function loadLocalProducts() {
  try {
    // Read the products.ts file as text
    const productsFilePath = path.join(__dirname, '..', 'data', 'products.ts');
    const fileContent = fs.readFileSync(productsFilePath, 'utf8');

    // Extract the array part using regex (this is a simple approach)
    const match = fileContent.match(/export const products\s*=\s*(\[[\s\S]*\]);/);
    if (!match || !match[1]) {
      throw new Error('Could not extract products array from file');
    }

    // Convert the string to a JS object using a safer alternative to eval
    const productsJson = match[1]
      .replace(/(\w+):/g, '"$1":') // Convert property names to quoted strings
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/'/g, '"'); // Replace single quotes with double quotes

    return JSON.parse(productsJson);
  } catch (error) {
    console.error('Error loading local products:', error);
    throw error;
  }
}

// Seed products to Supabase
async function seedProducts() {
  try {
    console.log('Loading local products...');
    const localProducts = await loadLocalProducts();
    console.log(`Found ${localProducts.length} products in local data`);

    // Format the products to match the Supabase schema
    const formattedProducts = localProducts.map(product => ({
      id: product.id,
      created_at: new Date().toISOString(),
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
      roast_level: product.roastLevel || null, // note the camelCase to snake_case conversion
      story: product.story || null,
      how_to: product.howTo || [] // note the camelCase to snake_case conversion
    }));

    // Insert data in batches to avoid request size limits
    const batchSize = 20;
    for (let i = 0; i < formattedProducts.length; i += batchSize) {
      const batch = formattedProducts.slice(i, i + batchSize);
      console.log(`Uploading batch ${Math.floor(i/batchSize) + 1} (${batch.length} products)...`);
      
      const { error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error seeding batch ${Math.floor(i/batchSize) + 1}:`, error);
      } else {
        console.log(`Successfully uploaded batch ${Math.floor(i/batchSize) + 1}`);
      }
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts(); 