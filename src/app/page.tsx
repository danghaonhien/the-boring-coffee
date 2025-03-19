import Link from 'next/link';
import { products } from '../data/products';
import ProductGrid from '../components/products/ProductGrid';
import ProductSlider from '../components/products/ProductSlider';
import CategoryProductGrid from '../components/products/CategoryProductGrid';
import AboutUsSection from '../components/about/AboutUsSection';
import ReviewsSection from '../components/reviews/ReviewsSection';

export default function Home() {
  // Get featured products (first 3)
  const featuredProducts = products.slice(0, 3);
  
  // Get new products (Lightmode and Darkmode)
  const newProducts = products.filter(p => p.id === '1' || p.id === '2');

  // Get coffee products
  const coffeeProducts = products.filter(p => p.category === 'coffee');
  
  // Get coffee kit products
  const coffeeKitProducts = products.filter(p => p.category === 'coffee-kit');

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
        products={coffeeKitProducts} 
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