import { supabase } from '../supabase';
import { Product } from '../../types/database.types';
import { products as localProducts } from '../../data/products';

// Helper function to check if Supabase is available
// Cache for Supabase products
let supabaseProductsCache: Product[] | null = null;
let supabaseConnectionAttempted = false;

/**
 * Validates the database schema to ensure it has all required columns
 */
async function validateProductSchema(): Promise<boolean> {
  try {
    console.log('Validating product schema...');
    
    // Fetch schema information for the products table
    const { error: schemaError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (schemaError) {
      console.error('Schema validation error:', schemaError);
      
      // Check if the error is about missing columns
      if (schemaError.message.includes('column') && schemaError.message.includes('does not exist')) {
        console.error('Database schema appears to be missing required columns. Please run the database migration script.');
        return false;
      }
      
      // Check if we have permission issues
      if (schemaError.code === '42501' || schemaError.message.includes('permission denied')) {
        console.error('Permission denied when accessing the products table. Check RLS policies.');
        return false;
      }
      
      // For other errors, we'll assume the schema might be okay but there's a different issue
      console.warn('Schema validation encountered an error, but it may not be schema-related:', schemaError);
      return true;
    }
    
    console.log('Product schema validation successful');
    return true;
  } catch (error) {
    console.error('Error validating product schema:', error);
    return false;
  }
}

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
    
    // Validate the schema first
    const isSchemaValid = await validateProductSchema();
    if (!isSchemaValid) {
      console.error('Skipping product sync due to schema validation failure');
      return false;
    }
    
    // Format products for Supabase
    const formattedProducts = localProducts.map(product => {
      try {
        // Create a properly typed object with defaults for required fields
        const formattedProduct: Product = {
          id: product.id,
          created_at: product.created_at || new Date().toISOString(),
          name: product.name || 'Unnamed Product',
          description: product.description || 'No description available',
          price: typeof product.price === 'number' ? product.price : 0,
          image_url: product.image_url || '/images/default-product.jpg',
          stock: typeof product.stock === 'number' ? product.stock : 10,
          category: product.category || 'coffee',
          image_gallery: product.image_gallery || [],
          how_to: product.how_to || []
        };
        
        // Explicitly handle roast_level
        if (typeof product.roast_level === 'string') {
          formattedProduct.roast_level = parseInt(product.roast_level, 10) || 50;
        } else if (product.roast_level === undefined && product.category === 'coffee') {
          // Set default roast level based on description if it's a coffee product
          if (product.description?.toLowerCase().includes('light')) {
            formattedProduct.roast_level = 20;
          } else if (product.description?.toLowerCase().includes('medium-light')) {
            formattedProduct.roast_level = 40;
          } else if (product.description?.toLowerCase().includes('medium-dark')) {
            formattedProduct.roast_level = 70;
          } else if (product.description?.toLowerCase().includes('medium')) {
            formattedProduct.roast_level = 50;
          } else if (product.description?.toLowerCase().includes('dark')) {
            formattedProduct.roast_level = 80;
          } else {
            formattedProduct.roast_level = 50; // Default to medium roast
          }
        } else if (typeof product.roast_level === 'number') {
          formattedProduct.roast_level = product.roast_level;
        } else {
          formattedProduct.roast_level = 50; // Default
        }
        
        // Handle any legacy data structure with different property names
        const legacyProduct = product as Record<string, unknown>;
        if (legacyProduct.roastLevel !== undefined) {
          const legacyRoastLevel = legacyProduct.roastLevel;
          formattedProduct.roast_level = typeof legacyRoastLevel === 'number' 
            ? legacyRoastLevel 
            : typeof legacyRoastLevel === 'string' 
              ? parseInt(legacyRoastLevel, 10) || 50
              : 50;
        }
        
        if (legacyProduct.howTo !== undefined && Array.isArray(legacyProduct.howTo)) {
          formattedProduct.how_to = legacyProduct.howTo as string[];
        }
        
        // Clean up any null values that should be arrays
        if (!formattedProduct.image_gallery) formattedProduct.image_gallery = [];
        if (!formattedProduct.how_to) formattedProduct.how_to = [];
        
        // Validate that all required fields are present
        const requiredFields = ['id', 'name', 'price', 'image_url', 'category'];
        const missingFields = requiredFields.filter(field => !formattedProduct[field as keyof Product]);
        
        if (missingFields.length > 0) {
          console.warn(`Product ${product.id} is missing required fields: ${missingFields.join(', ')}. Using defaults.`);
        }
        
        return formattedProduct;
      } catch (formatError) {
        console.error(`Error formatting product ${product.id}:`, formatError);
        // Return null for this product so we can filter it out
        return null;
      }
    }).filter(product => product !== null) as Product[]; // Filter out any null products
    
    if (formattedProducts.length === 0) {
      console.error('No valid products found to sync');
      return false;
    }
    
    // Insert products in batches to avoid request size limits
    const batchSize = 3; // Smaller batch size for better error isolation
    let successCount = 0;
    
    for (let i = 0; i < formattedProducts.length; i += batchSize) {
      const batch = formattedProducts.slice(i, i + batchSize);
      const batchNumber = Math.floor(i/batchSize) + 1;
      
      console.log(`Syncing batch ${batchNumber} (${batch.length} products)...`);
      
      try {
        // Log the actual data being sent for debugging
        console.log(`Batch ${batchNumber} data:`, JSON.stringify(batch.map(p => ({ id: p.id, name: p.name }))));
        
        const { error: insertError } = await supabase
          .from('products')
          .upsert(batch, { 
            onConflict: 'id',
            ignoreDuplicates: false // This ensures we update existing records
          });
          
        if (insertError) {
          console.error(`Error syncing batch ${batchNumber}:`, JSON.stringify({
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          }));
          
          // Try to handle common errors
          if (insertError.code === '23505') { // Duplicate key violation
            console.log(`Batch ${batchNumber} has duplicate keys, trying individual inserts`);
            
            // Try inserting products one by one
            for (const product of batch) {
              const { error: individualError } = await supabase
                .from('products')
                .upsert([product], { onConflict: 'id' });
                
              if (!individualError) {
                console.log(`Successfully synced product ${product.id}`);
                successCount++;
              } else {
                console.error(`Error syncing product ${product.id}:`, individualError);
              }
            }
          }
        } else {
          console.log(`Successfully synced batch ${batchNumber}`);
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error(`Error processing batch ${batchNumber}:`, batchError);
      }
      
      // Add a small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
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