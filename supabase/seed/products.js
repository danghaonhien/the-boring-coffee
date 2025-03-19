import { createClient } from '@supabase/supabase-js';
import { products } from '../../src/data/products.ts';

// Replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
  console.log(`Seeding ${products.length} products to Supabase...`);
  
  // Format the products to match the Supabase schema
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
    roast_level: product.roastLevel || null, // note the camelCase to snake_case conversion
    story: product.story || null,
    how_to: product.howTo || [] // note the camelCase to snake_case conversion
  }));

  // Insert data in batches of 20 to avoid request size limits
  const batchSize = 20;
  for (let i = 0; i < formattedProducts.length; i += batchSize) {
    const batch = formattedProducts.slice(i, i + batchSize);
    console.log(`Uploading batch ${i/batchSize + 1} (${batch.length} products)...`);
    
    const { error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding batch ${i/batchSize + 1}:`, error);
    } else {
      console.log(`Successfully uploaded batch ${i/batchSize + 1}`);
    }
  }
  
  console.log('Seeding complete!');
}

seedProducts().catch(error => {
  console.error('Error seeding products:', error);
  process.exit(1);
}); 