import Link from 'next/link';
import ProductGrid from '../components/products/ProductGrid';
import ProductSlider from '../components/products/ProductSlider';
import CategoryProductGrid from '../components/products/CategoryProductGrid';
import AboutUsSection from '../components/about/AboutUsSection';
import ReviewsSection from '../components/reviews/ReviewsSection';
// Import products only for fallback
import { products } from '../data/products';

export default async function Home() {
  // Ensure we're connected to Supabase and have product data
  const { ensureProductData, getAllProducts } = await import('../lib/api/products');
  
  try {
    // Initialize and sync product data with Supabase
    await ensureProductData();
    
    // Get all products from Supabase (with fallback to cache/local if needed)
    const allProducts = await getAllProducts();
    
    // Filter products by category
    const coffeeProducts = allProducts.filter(product => product.category === 'coffee');
    const equipmentProducts = allProducts.filter(product => product.category === 'coffee-kit');
    
    // Get featured products (first 3)
    const featuredProducts = allProducts.slice(0, 3);
    
    // Get new products (Lightmode and Darkmode) with fallback
    let newProducts = allProducts.filter(p => p.id === '1' || p.id === '2');
    
    // If we couldn't find the specific products, use the first 2 coffee products as a fallback
    if (newProducts.length < 2 && coffeeProducts.length >= 2) {
      console.log('Using fallback products for the slider (first 2 coffee products)');
      newProducts = coffeeProducts.slice(0, 2);
    } else if (newProducts.length < 2) {
      // If we still don't have enough products, use the first 2 products of any type
      console.log('Using fallback products for the slider (first 2 products of any type)');
      newProducts = allProducts.slice(0, Math.min(2, allProducts.length));
    }
    
    // Make sure we have valid data before rendering
    if (!newProducts || newProducts.length === 0 || !newProducts[0]) {
      console.error('No valid products available for the slider');
      // Use local data as ultimate fallback
      newProducts = await import('../data/products').then(m => {
        return [m.products[0], m.products[1]]; 
      });
    }

    return (
      <div className="bg-[#E8EDDF]">
        {/* Hero section */}
        <div className="relative bg-[#242423]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[#242423]" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#E8EDDF] sm:text-5xl lg:text-6xl">
              The Boring Coffee
            </h1>
            <p className="mt-6 text-xl text-[#E8EDDF] max-w-3xl">
              Simple, consistent, and reliable coffee for the tech community.
              No fancy names, just great coffee that works every time.
            </p>
            <div className="mt-10">
              <Link
                href="/products"
                className="inline-block bg-[#F5CB5C] border border-transparent rounded-md py-3 px-8 font-medium text-[#242423] hover:bg-[#F5CB5C]/90 transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* New products slider section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#CFDBD5]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl font-display font-bold text-[#242423]">New Products</h2>
            {/* <p className="text-[#333533]">Drag to explore</p> */}
          </div>
          <ProductSlider products={newProducts} />
        </div>

        {/* Featured products section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#CFDBD5]">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#242423] mb-8">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block bg-[#E8EDDF] border border-[#CFDBD5] rounded-md py-2 px-8 font-medium text-[#242423] hover:bg-[#F5CB5C]"
            >
              View All Products
            </Link>
          </div>
        </div>
        
        {/* Coffee section */}
        <CategoryProductGrid 
          products={coffeeProducts} 
          title="Coffee"
          viewAllLink="/products?category=coffee"
        />
        
        {/* Coffee Kit section */}
        <CategoryProductGrid 
          products={equipmentProducts} 
          title="Coffee Kit"
          viewAllLink="/products?category=coffee-kit"
        />
        
        {/* About Us section */}
        <AboutUsSection />

        {/* Customer Reviews section */}
        <ReviewsSection />
      </div>
    );
  } catch (error) {
    console.error('Error fetching product data:', error);
    return (
      <div className="bg-[#E8EDDF]">
        {/* Hero section */}
        <div className="relative bg-[#242423]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[#242423]" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#E8EDDF] sm:text-5xl lg:text-6xl">
              The Boring Coffee
            </h1>
            <p className="mt-6 text-xl text-[#E8EDDF] max-w-3xl">
              Simple, consistent, and reliable coffee for the tech community.
              No fancy names, just great coffee that works every time.
            </p>
            <div className="mt-10">
              <Link
                href="/products"
                className="inline-block bg-[#F5CB5C] border border-transparent rounded-md py-3 px-8 font-medium text-[#242423] hover:bg-[#F5CB5C]/90 transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* New products slider section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#CFDBD5]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-5xl font-display font-bold text-[#242423]">New Products</h2>
            {/* <p className="text-[#333533]">Drag to explore</p> */}
          </div>
          <ProductSlider products={products.slice(0, 3)} />
        </div>

        {/* Featured products section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#CFDBD5]">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#242423] mb-8">Featured Products</h2>
          <ProductGrid products={products.slice(0, 3)} />
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block bg-[#E8EDDF] border border-[#CFDBD5] rounded-md py-2 px-8 font-medium text-[#242423] hover:bg-[#F5CB5C]"
            >
              View All Products
            </Link>
          </div>
        </div>
        
        {/* Coffee section */}
        <CategoryProductGrid 
          products={products.filter(p => p.category === 'coffee')} 
          title="Coffee"
          viewAllLink="/products?category=coffee"
        />
        
        {/* Coffee Kit section */}
        <CategoryProductGrid 
          products={products.filter(p => p.category === 'coffee-kit')} 
          title="Coffee Kit"
          viewAllLink="/products?category=coffee-kit"
        />
        
        {/* About Us section */}
        <AboutUsSection />

        {/* Customer Reviews section */}
        <ReviewsSection />
      </div>
    );
  }
} 