import { notFound } from 'next/navigation';
import { formatPrice } from '../../../lib/utils';
import AddToCartButton from '../../../components/products/AddToCartButton';
import StarRating from '../../../components/products/StarRating';
import RoastMeter from '../../../components/products/RoastMeter';
import ProductReviews from '../../../components/products/ProductReviews';
import ProductImageSlider from '../../../components/products/ProductImageSlider';
import ProductStory from '../../../components/products/ProductStory';
import VietnamesePhinGuide from '../../../components/products/VietnamesePhinGuide';
import StickyProductFooter from '../../../components/products/StickyProductFooter';
import RecommendedProducts from '../../../components/products/RecommendedProducts';
import { getProductById, getRecommendedProducts } from '../../../lib/api/products';
import { Product } from '../../../types/database.types';

type ProductPageProps = {
  params: {
    id: string;
  };
};

// For local products which may have camelCase properties
type LocalProduct = Product & {
  roastLevel?: number;
  howTo?: string[];
};

export const revalidate = 3600; // Revalidate every hour

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    console.log(`Looking for product with ID: ${params.id}`);
    
    // Get product from the API (which now handles fallback to local data)
    const product = await getProductById(params.id);
    
    if (!product) {
      console.log(`Product not found in either source, returning 404`);
      notFound();
    }
    
    // Get recommended products (also handles fallback)
    const recommendedProducts = await getRecommendedProducts(params.id, 4);
    
    // Convert camelCase properties to snake_case if needed
    const normalizedProduct = {
      ...product,
      roast_level: (product as LocalProduct).roast_level || (product as LocalProduct).roastLevel,
      how_to: (product as LocalProduct).how_to || (product as LocalProduct).howTo
    };
    
    // Same for recommended products
    const normalizedRecommended = recommendedProducts.map(p => ({
      ...p,
      roast_level: (p as LocalProduct).roast_level || (p as LocalProduct).roastLevel,
      how_to: (p as LocalProduct).how_to || (p as LocalProduct).howTo
    }));

    return (
      <div className="bg-[#E8EDDF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProductImageSlider 
              images={normalizedProduct.image_gallery || [normalizedProduct.image_url]} 
              productName={normalizedProduct.name}
            />
          </div>
          <div>
            <h1 className="text-3xl sm:text-3xl font-extrabold text-[#242423]">{normalizedProduct.name}</h1>
            
            {/* Star Rating */}
            <div className="mt-2 flex items-center">
              <StarRating rating={normalizedProduct.rating || 0} />
            </div>
            
            {normalizedProduct.original_price && normalizedProduct.discount_percentage ? (
              <div className="mt-4 flex items-center gap-3">
                <p className="text-xl sm:text-2xl font-medium text-coffee-700">{formatPrice(normalizedProduct.price)}</p>
                <p className="text-lg line-through text-coffee-400">{formatPrice(normalizedProduct.original_price)}</p>
                <span className="bg-coffee-700 text-white text-sm px-2 py-0.5 rounded">
                  {normalizedProduct.discount_percentage}% OFF
                </span>
              </div>
            ) : (
              <p className="mt-4 text-xl sm:text-2xl text-[#242423]">{formatPrice(normalizedProduct.price)}</p>
            )}
            
            <div className="mt-6">
              <h2 className="text-lg sm:text-lg font-medium text-[#242423]">Use Case</h2>
              <p className="mt-2 text-base sm:text-md text-[#333533]">{normalizedProduct.description}</p>
              
              {/* Show RoastMeter only for coffee products */}
              {normalizedProduct.category === 'coffee' && normalizedProduct.roast_level !== undefined && (
                <div className="mt-6">
                  <RoastMeter roastLevel={normalizedProduct.roast_level} showLabels={true} />
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <AddToCartButton product={normalizedProduct} />
            </div>
            
            <div className="mt-8 border-t border-[#CFDBD5] pt-8">
              <h2 className="text-lg font-medium text-[#242423]">Details</h2>
              <div className="mt-4 space-y-4">
                <div className="flex">
                  <span className="w-1/3 text-[#5A5A46]">Category</span>
                  <span className="w-2/3 text-[#242423] capitalize">
                    {normalizedProduct.category.split('-').join(' ')}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-[#5A5A46]">Stock</span>
                  <span className="w-2/3 text-[#242423]">{normalizedProduct.stock} available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Story Section */}
        {normalizedProduct.story && (
          <div className="mt-16 border-t border-[#CFDBD5]">
            <ProductStory story={normalizedProduct.story} productName={normalizedProduct.name} />
          </div>
        )}
        
        {/* How To Section - Vietnamese Phin Guide */}
        <div className="mt-16 border-t border-[#CFDBD5]">
          <VietnamesePhinGuide />
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16 border-t border-[#CFDBD5] pt-10">
          <ProductReviews productId={normalizedProduct.id} productName={normalizedProduct.name} />
        </div>
        
        {/* Recommended Products Section */}
        <div className="mt-16 border-t border-[#CFDBD5]">
          <RecommendedProducts 
            currentProductId={normalizedProduct.id}
            products={normalizedRecommended}
            title="You Might Also Like"
          />
        </div>
      </div>
      
      {/* Sticky footer that appears when scrolling */}
      <StickyProductFooter product={normalizedProduct} />
      </div>
    );
  } catch (error) {
    console.error(`Error loading product ${params.id}:`, error);
    notFound();
  }
} 