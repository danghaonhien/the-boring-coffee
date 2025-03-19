// Script to seed products into Supabase
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Supabase credentials
const supabaseUrl = 'https://tvmghxxoodjbjwhbvyir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bWdoeHhvb2RqYmp3aGJ2eWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTU3NDcsImV4cCI6MjA1Nzk5MTc0N30.4L2RE6FUjY9f9IWhG51ehvqeaNV3Zcnsu3sBlzj7134';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample products to add to the database
const products = [
  {
    id: uuidv4(),
    name: "Boring Blend",
    description: "Our signature blend. Nothing fancy, just good reliable coffee.",
    price: 1499,
    original_price: 1899,
    discount_percentage: 21,
    image_url: "/products/boring-blend.jpg",
    image_gallery: ["/products/boring-blend-1.jpg", "/products/boring-blend-2.jpg"],
    stock: 100,
    category: "coffee",
    rating: 4.8,
    roast_level: 3,
    story: "This is our original blend that started it all. Sourced from high-altitude farms in Colombia and Ethiopia, our beans are carefully selected for consistency and reliability.",
    how_to: ["Grind to medium coarseness", "Use 2 tablespoons per 6oz of water", "Brew at 200°F for 4 minutes", "Enjoy black or with minimal additions"]
  },
  {
    id: uuidv4(),
    name: "Mundane Espresso",
    description: "A predictable, consistent espresso that never surprises.",
    price: 1599,
    image_url: "/products/mundane-espresso.jpg",
    image_gallery: ["/products/mundane-espresso-1.jpg", "/products/mundane-espresso-2.jpg"],
    stock: 85,
    category: "coffee",
    rating: 4.6,
    roast_level: 4,
    story: "This is our classic espresso roast, designed for those who appreciate consistency over excitement. Sourced from Brazilian farms known for their dependable quality.",
    how_to: ["Grind to fine powder", "Use 18-20g of coffee", "Extract for 25-30 seconds", "Enjoy as espresso or use as base for milk drinks"]
  },
  {
    id: uuidv4(),
    name: "Regular Joe",
    description: "As average as it gets. The perfect everyday coffee.",
    price: 1299,
    image_url: "/products/regular-joe.jpg",
    image_gallery: ["/products/regular-joe-1.jpg", "/products/regular-joe-2.jpg"],
    stock: 120,
    category: "coffee",
    rating: 4.3,
    roast_level: 2,
    story: "Our Regular Joe is the most unpretentious coffee we offer. Sourced from various regions to create a perfectly middle-of-the-road flavor profile that works every day.",
    how_to: ["Grind to medium", "Use any brewing method", "Follow standard instructions", "Drink any way you like"]
  },
  {
    id: uuidv4(),
    name: "Standard Pour-Over Kit",
    description: "Everything you need for a consistent pour-over experience.",
    price: 2999,
    image_url: "/products/standard-pourover.jpg",
    image_gallery: ["/products/standard-pourover-1.jpg", "/products/standard-pourover-2.jpg"],
    stock: 45,
    category: "coffee-kit",
    rating: 4.7
  },
  {
    id: uuidv4(),
    name: "Reliable French Press",
    description: "A sturdy, no-nonsense French press that gets the job done.",
    price: 1899,
    image_url: "/products/reliable-frenchpress.jpg",
    image_gallery: ["/products/reliable-frenchpress-1.jpg", "/products/reliable-frenchpress-2.jpg"],
    stock: 60,
    category: "coffee-kit",
    rating: 4.5
  }
];

async function seedProducts() {
  console.log(`Seeding ${products.length} products to Supabase...`);
  
  for (const product of products) {
    console.log(`Adding product: ${product.name}`);
    
    try {
      // Use the RPC function to insert products
      const { error } = await supabase.rpc('insert_product', {
        product_id: product.id,
        product_name: product.name,
        product_description: product.description,
        product_price: product.price,
        product_original_price: product.original_price || null,
        product_discount_percentage: product.discount_percentage || null,
        product_image_url: product.image_url,
        product_image_gallery: product.image_gallery || null,
        product_stock: product.stock,
        product_category: product.category,
        product_rating: product.rating,
        product_roast_level: product.roast_level || null,
        product_story: product.story || null,
        product_how_to: product.how_to || null
      });
      
      if (error) {
        throw error;
      }
      
      console.log(`Successfully added ${product.name}`);
    } catch (error) {
      console.error(`Error adding ${product.name}:`, error);
      
      // If the RPC function fails, try direct table access as fallback
      console.log(`Trying fallback direct insert for ${product.name}...`);
      const { error: fallbackError } = await supabase
        .from('products')
        .upsert(product);
        
      if (fallbackError) {
        console.error(`Fallback also failed:`, fallbackError);
      } else {
        console.log(`Fallback insert succeeded for ${product.name}`);
      }
    }
  }
  
  console.log('Seed complete. Checking products in database...');
  
  // Verify products were added
  const { data, error } = await supabase.rpc('get_all_products');
  
  if (error) {
    console.error('Error checking products:', error);
    
    // Try fallback direct table access
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('products')
      .select('id, name');
      
    if (fallbackError) {
      console.error('Fallback check also failed:', fallbackError);
    } else if (fallbackData) {
      console.log(`Found ${fallbackData.length} products in database:`);
      fallbackData.forEach(p => console.log(`- ${p.name} (${p.id})`));
    }
  } else if (data) {
    console.log(`Found ${data.length} products in database:`);
    data.forEach(p => console.log(`- ${p.name} (${p.id})`));
  }
}

seedProducts().catch(error => {
  console.error('Unexpected error:', error);
}); 