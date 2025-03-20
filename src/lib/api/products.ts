import { supabase } from '../supabase';
import { Product } from '../../types/database.types';
import { products as localProducts } from '../../data/products';

// Helper function to check if Supabase is available
// Cache for Supabase products
let supabaseProductsCache: Product[] | null = null;
let supabaseConnectionAttempted = false;

export async function checkSupabaseConnection(): Promise<boolean> {
  // If we've already successfully connected, return true
  if (supabaseProductsCache !== null && supabaseProductsCache.length > 0) {
    return true;
  }

  // If we've already attempted a connection and failed, don't keep trying
  if (supabaseConnectionAttempted) {
    return false;
  }

  try {
    console.log('Testing Supabase connection...');
    
    // We only care about the error, not the data
    const { error } = await supabase.from('products').select('count');
    
    if (error) {
      // Check specifically for row level security error
      if (error.code === '42501') {
        console.error('Supabase RLS policy error. You need to enable read access to products table');
        // Try the anonymous SQL approach without RLS
        try {
          console.log('Attempting to use a different approach to access products...');
          const { data: productsData, error: rpcError } = await supabase
            .rpc('get_all_products');
          
          if (!rpcError && productsData && productsData.length > 0) {
            console.log('Successfully connected to Supabase using RPC');
            supabaseConnectionAttempted = true;
            return true;
          }
        } catch (rpcError) {
          console.error('RPC approach failed:', rpcError);
        }
        
        supabaseConnectionAttempted = true;
        return false;
      }
      
      console.error('Supabase connection test failed:', error);
      supabaseConnectionAttempted = true;
      return false;
    }
    
    console.log('Supabase connection test successful');
    supabaseConnectionAttempted = true;
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    supabaseConnectionAttempted = true;
    return false;
  }
}

export async function syncProductsToSupabase(): Promise<boolean> {
  try {
    console.log('Syncing local products to Supabase...');
    
    // Format products for Supabase
    const formattedProducts = localProducts.map(product => {
      // Create a properly typed object
      const formattedProduct: Product = {
        ...product,
        created_at: product.created_at || new Date().toISOString(),
        image_gallery: product.image_gallery || [],
        how_to: product.how_to || []
      };
      
      // Explicitly handle roast_level
      if (typeof product.roast_level === 'string') {
        formattedProduct.roast_level = parseInt(product.roast_level, 10);
      } else if (product.roast_level === undefined && product.category === 'coffee') {
        // Set default roast level based on description if it's a coffee product
        if (product.description.toLowerCase().includes('light')) {
          formattedProduct.roast_level = 20;
        } else if (product.description.toLowerCase().includes('medium-light')) {
          formattedProduct.roast_level = 40;
        } else if (product.description.toLowerCase().includes('medium-dark')) {
          formattedProduct.roast_level = 70;
        } else if (product.description.toLowerCase().includes('medium')) {
          formattedProduct.roast_level = 50;
        } else if (product.description.toLowerCase().includes('dark')) {
          formattedProduct.roast_level = 80;
        } else {
          formattedProduct.roast_level = 50; // Default to medium roast
        }
      } else {
        formattedProduct.roast_level = product.roast_level;
      }
      
      // Handle any legacy data structure with different property names
      const legacyProduct = product as Record<string, unknown>;
      if (legacyProduct.roastLevel !== undefined) {
        formattedProduct.roast_level = Number(legacyProduct.roastLevel);
      }
      if (legacyProduct.howTo !== undefined) {
        formattedProduct.how_to = legacyProduct.howTo as string[];
      }
      
      return formattedProduct;
    });
    
    // Insert products in batches to avoid request size limits
    const batchSize = 5;
    let successCount = 0;
    
    for (let i = 0; i < formattedProducts.length; i += batchSize) {
      const batch = formattedProducts.slice(i, i + batchSize);
      console.log(`Syncing batch ${Math.floor(i/batchSize) + 1} (${batch.length} products)...`);
      
      const { error: insertError } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'id' });
        
      if (insertError) {
        console.error(`Error syncing batch ${Math.floor(i/batchSize) + 1}:`, insertError);
      } else {
        console.log(`Successfully synced batch ${Math.floor(i/batchSize) + 1}`);
        successCount += batch.length;
      }
    }
    
    console.log(`Completed syncing ${successCount} of ${formattedProducts.length} products to Supabase`);
    return successCount > 0;
  } catch (error) {
    console.error('Error syncing products to Supabase:', error);
    return false;
  }
}

export async function ensureProductData(): Promise<void> {
  try {
    console.log('Ensuring product data is available...');
    
    // First check if we already have cached products
    if (supabaseProductsCache !== null && supabaseProductsCache.length > 0) {
      console.log('Product data already cached');
      return;
    }
    
    // Try to get products from Supabase first
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    // If there was an error or no products, initialize with local data
    if (error || !data || data.length === 0) {
      console.log('No products in Supabase or error accessing them, initializing with local data');
      
      // Initialize Supabase cache with local products
      supabaseProductsCache = [...localProducts];
      
      // Try to sync products to Supabase
      const synced = await syncProductsToSupabase();
      
      if (synced) {
        // If sync was successful, try to get products from Supabase again
        const { data: refreshedData, error: refreshError } = await supabase
          .from('products')
          .select('*');
          
        if (!refreshError && refreshedData && refreshedData.length > 0) {
          console.log(`Retrieved ${refreshedData.length} products from Supabase after sync`);
          supabaseProductsCache = refreshedData;
        }
      }
    } else {
      console.log(`Supabase has ${data.length} products`);
      supabaseProductsCache = data;
    }
  } catch (error) {
    console.error('Error ensuring product data:', error);
    // Default to local products in case of any error
    supabaseProductsCache = [...localProducts];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  // First ensure product data is initialized
  await ensureProductData();
  
  try {
    console.log('Fetching all products from Supabase');
    
    // Try the direct approach first
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Supabase error fetching products:', JSON.stringify({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }));
      
      // If we get a security policy error, we can try using an RPC if it exists
      if (error.code === '42501') {
        try {
          console.log('Attempting to use RPC to bypass RLS...');
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_all_products');
            
          if (!rpcError && rpcData && rpcData.length > 0) {
            console.log(`Retrieved ${rpcData.length} products from Supabase via RPC`);
            
            // Validate each product object to ensure it has required fields
            const validProducts = validateProducts(rpcData);
            return validProducts;
          }
        } catch (rpcError) {
          console.error('RPC approach failed:', rpcError);
        }
      }
      
      // Try to use cached products if available
      if (supabaseProductsCache && supabaseProductsCache.length > 0) {
        console.log('Using cached products', supabaseProductsCache.length);
        return validateProducts(supabaseProductsCache);
      }
      
      // Use local products as last resort
      console.log('Using local products due to Supabase error');
      return validateProducts(localProducts);
    }
    
    if (!data || data.length === 0) {
      console.log('No products found in Supabase, returning cached or local products');
      
      // Try to use cached products if available
      if (supabaseProductsCache && supabaseProductsCache.length > 0) {
        return validateProducts(supabaseProductsCache);
      }
      
      // Use local products as last resort
      return validateProducts(localProducts);
    }
    
    console.log(`Retrieved ${data.length} products from Supabase`);
    // Update the cache with the latest data
    supabaseProductsCache = data;
    
    // Validate products before returning
    return validateProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Try to use cached products if available
    if (supabaseProductsCache && supabaseProductsCache.length > 0) {
      return validateProducts(supabaseProductsCache);
    }
    
    // Use local products as last resort
    return validateProducts(localProducts);
  }
}

// Helper function to validate product objects
function validateProducts(products: unknown[]): Product[] {
  if (!Array.isArray(products)) {
    console.warn('validateProducts: Input is not an array, returning empty array');
    return [];
  }
  
  return products.filter(product => {
    // Check if product is an object
    if (!product || typeof product !== 'object') {
      console.warn('validateProducts: Found invalid product (not an object)');
      return false;
    }
    
    const p = product as Partial<Product>;
    
    // Check for required fields
    const hasRequiredFields = 
      typeof p.id === 'string' && 
      typeof p.name === 'string' && 
      typeof p.price === 'number';
    
    if (!hasRequiredFields) {
      console.warn('validateProducts: Found product missing required fields', p.id || 'unknown');
      return false;
    }
    
    // Ensure all products have an image_url
    if (!p.image_url) {
      console.warn(`validateProducts: Product is missing image_url, using default`, p.id);
      p.image_url = '/images/default-product.jpg';
    }
    
    // Ensure all products have a description
    if (!p.description) {
      console.warn(`validateProducts: Product is missing description, using default`, p.id);
      p.description = `${p.name} - A quality product from The Boring Coffee`;
    }
    
    // Ensure products have a category
    if (!p.category) {
      console.warn(`validateProducts: Product is missing category, using default`, p.id);
      p.category = 'coffee';
    }
    
    return true;
  }) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  // First ensure product data is initialized
  await ensureProductData();
  
  try {
    console.log(`Attempting to fetch product with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Supabase error fetching product ID ${id}:`, JSON.stringify({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }));
      
      // For specific error types, we might want to handle differently
      if (error.code === 'PGRST116') {
        // This is the "no rows returned" error from Supabase
        console.log(`No product found with ID ${id} in Supabase, trying local data`);
        
        // Try from cache first if available
        if (supabaseProductsCache) {
          const cachedProduct = supabaseProductsCache.find(p => p.id === id);
          if (cachedProduct) return cachedProduct;
        }
        
        // Fall back to local data if needed
        return localProducts.find(p => p.id === id) || null;
      }
      
      // For any other error, try local data
      console.log(`Error fetching from Supabase, trying local data for product ${id}`);
      
      // Try from cache first if available
      if (supabaseProductsCache) {
        const cachedProduct = supabaseProductsCache.find(p => p.id === id);
        if (cachedProduct) return cachedProduct;
      }
      
      return localProducts.find(p => p.id === id) || null;
    }
    
    console.log(`Product data retrieved from Supabase:`, data ? 'Product found' : 'No product found');
    return data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    console.log(`Falling back to local data for product ${id}`);
    
    // Try from cache first if available
    if (supabaseProductsCache) {
      const cachedProduct = supabaseProductsCache.find(p => p.id === id);
      if (cachedProduct) return cachedProduct;
    }
    
    return localProducts.find(p => p.id === id) || null;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // First ensure product data is initialized
  await ensureProductData();
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.log(`Error fetching products by category ${category}, using cached or local data`);
      
      // Try from cache first if available
      if (supabaseProductsCache) {
        return supabaseProductsCache.filter(p => p.category === category);
      }
      
      return localProducts.filter(p => p.category === category);
    }
    
    if (!data || data.length === 0) {
      console.log(`No products found in category ${category} in Supabase, using cached or local data`);
      
      // Try from cache first if available
      if (supabaseProductsCache) {
        return supabaseProductsCache.filter(p => p.category === category);
      }
      
      return localProducts.filter(p => p.category === category);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    
    // Try from cache first if available
    if (supabaseProductsCache) {
      return supabaseProductsCache.filter(p => p.category === category);
    }
    
    return localProducts.filter(p => p.category === category);
  }
}

export async function getRecommendedProducts(currentProductId: string, limit = 4): Promise<Product[]> {
  // First ensure product data is initialized
  await ensureProductData();
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', currentProductId)
      .limit(limit);
    
    if (error || !data || data.length === 0) {
      console.log('Error or no recommended products found in Supabase, using cached or local data');
      
      // Try from cache first if available
      if (supabaseProductsCache) {
        return validateProducts(supabaseProductsCache.filter(p => p.id !== currentProductId).slice(0, limit));
      }
      
      return validateProducts(localProducts.filter(p => p.id !== currentProductId).slice(0, limit));
    }
    
    return validateProducts(data);
  } catch (error: unknown) {
    console.error('Error fetching recommended products:', error);
    
    // Try from cache first if available
    if (supabaseProductsCache) {
      return validateProducts(supabaseProductsCache.filter(p => p.id !== currentProductId).slice(0, limit));
    }
    
    return validateProducts(localProducts.filter(p => p.id !== currentProductId).slice(0, limit));
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  // First ensure product data is initialized
  await ensureProductData();
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    
    if (error || !data || data.length === 0) {
      console.log(`Error or no results when searching Supabase for "${query}", using cached or local data`);
      const lowerQuery = query.toLowerCase();
      
      // Try from cache first if available
      if (supabaseProductsCache) {
        return validateProducts(supabaseProductsCache.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) || 
          p.description.toLowerCase().includes(lowerQuery)
        ));
      }
      
      return validateProducts(localProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      ));
    }
    
    return validateProducts(data);
  } catch (error: unknown) {
    console.error(`Error searching products with query "${query}":`, error);
    const lowerQuery = query.toLowerCase();
    
    // Try from cache first if available
    if (supabaseProductsCache) {
      return validateProducts(supabaseProductsCache.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      ));
    }
    
    return validateProducts(localProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    ));
  }
}