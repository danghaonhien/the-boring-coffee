import { supabase } from '../supabase';
import { Product } from '../../types/database.types';
import { products as localProducts } from '../../data/products';

// Helper function to check if Supabase is available
// Cache for Supabase products
let supabaseProductsCache: Product[] | null = null;

export async function checkSupabaseConnection(): Promise<boolean> {

  try {
    console.log('Testing Supabase connection...');
    
    //  We only care about the error, not the data
    const { error } = await supabase.from('products').select('count');
    
    if (error) {
      // Check specifically for row level security error
      if (error.code === '42501') {
        console.error('Supabase RLS policy error. You need to enable read access to products table');
        // Try the anonymous SQL approach without RLS
        try {
          console.log('Attempting to use a different approach to access products...');
          const { data: productsData, error: productsError } = await supabase
            .rpc('get_all_products');
          
          if (!productsError && productsData && productsData.length > 0) {
            console.log('Successfully connected to Supabase using RPC');
            return true;
          }
        } catch (rpcError) {
          console.error('RPC approach failed:', rpcError);
        }
        
        return false;
      }
      
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
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
      .select('count');
    
    // If there was an error or no products, initialize with local data
    if (error || !data || data.length === 0) {
      console.log('No products in Supabase or error accessing them, initializing from local data');
      
      // Initialize Supabase cache with local products
      supabaseProductsCache = [...localProducts];
      
      // Try to insert products into Supabase - this might fail due to RLS but that's ok
      try {
        console.log('Attempting to insert local products into Supabase');
        
        // Format products for Supabase
        const formattedProducts = localProducts.map(product => {
          // Create a properly typed object
          const formattedProduct: Product = {
            ...product,
            created_at: product.created_at || new Date().toISOString(),
            image_gallery: product.image_gallery || [],
            roast_level: product.roast_level || undefined,
            how_to: product.how_to || []
          };
          
          // Handle any legacy data structure with different property names
          const legacyProduct = product as Record<string, unknown>;
          if (legacyProduct.roastLevel !== undefined) {
            formattedProduct.roast_level = legacyProduct.roastLevel as number | undefined;
          }
          if (legacyProduct.howTo !== undefined) {
            formattedProduct.how_to = legacyProduct.howTo as string[];
          }
          
          return formattedProduct;
        });
        
        await supabase
          .from('products')
          .upsert(formattedProducts, { onConflict: 'id' });
          
        console.log('Inserted local products into Supabase');
      } catch (insertError) {
        console.error('Error inserting products to Supabase:', insertError);
        // This is fine, we'll use local data
      }
    } else {
      console.log(`Supabase has ${data.length} products`);
    }
  } catch (error) {
    console.error('Error ensuring product data:', error);
    // Default to local products in case of any error
    supabaseProductsCache = [...localProducts];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  // First check if Supabase is available
  const supabaseAvailable = await checkSupabaseConnection();
  
  if (!supabaseAvailable) {
    console.log('Supabase not available, returning local products');
    return localProducts;
  }
  
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
            return rpcData;
          }
        } catch (rpcError) {
          console.error('RPC approach failed:', rpcError);
        }
      }
      
      return localProducts;
    }
    
    if (!data || data.length === 0) {
      console.log('No products found in Supabase, returning local products');
      return localProducts;
    }
    
    console.log(`Retrieved ${data.length} products from Supabase`);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return localProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  // First check if Supabase is available
  const supabaseAvailable = await checkSupabaseConnection();
  
  if (!supabaseAvailable) {
    console.log(`Supabase not available, looking for product ${id} in local data`);
    return localProducts.find(p => p.id === id) || null;
  }
  
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
        return localProducts.find(p => p.id === id) || null;
      }
      
      // For any other error, try local data
      console.log(`Error fetching from Supabase, trying local data for product ${id}`);
      return localProducts.find(p => p.id === id) || null;
    }
    
    console.log(`Product data retrieved from Supabase:`, data ? 'Product found' : 'No product found');
    return data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    console.log(`Falling back to local data for product ${id}`);
    return localProducts.find(p => p.id === id) || null;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // First check if Supabase is available
  const supabaseAvailable = await checkSupabaseConnection();
  
  if (!supabaseAvailable) {
    console.log(`Supabase not available, filtering local products by category ${category}`);
    return localProducts.filter(p => p.category === category);
  }
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.log(`Error fetching products by category ${category}, using local data`);
      return localProducts.filter(p => p.category === category);
    }
    
    if (!data || data.length === 0) {
      console.log(`No products found in category ${category} in Supabase, using local data`);
      return localProducts.filter(p => p.category === category);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return localProducts.filter(p => p.category === category);
  }
}

export async function getRecommendedProducts(currentProductId: string, limit = 4): Promise<Product[]> {
  // First check if Supabase is available
  const supabaseAvailable = await checkSupabaseConnection();
  
  if (!supabaseAvailable) {
    console.log(`Supabase not available, getting recommended products from local data`);
    return localProducts.filter(p => p.id !== currentProductId).slice(0, limit);
  }
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', currentProductId)
      .limit(limit);
    
    if (error || !data || data.length === 0) {
      console.log(`Error or no recommended products found in Supabase, using local data`);
      return localProducts.filter(p => p.id !== currentProductId).slice(0, limit);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return localProducts.filter(p => p.id !== currentProductId).slice(0, limit);
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  // First check if Supabase is available
  const supabaseAvailable = await checkSupabaseConnection();
  
  if (!supabaseAvailable) {
    console.log(`Supabase not available, searching local products for "${query}"`);
    const lowerQuery = query.toLowerCase();
    return localProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    
    if (error || !data || data.length === 0) {
      console.log(`Error or no results when searching Supabase for "${query}", using local data`);
      const lowerQuery = query.toLowerCase();
      return localProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    return data;
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    const lowerQuery = query.toLowerCase();
    return localProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
} 