import { notFound } from 'next/navigation';
import { products } from '../../../data/products';
import { formatPrice } from '../../../lib/utils';
import AddToCartButton from '../../../components/products/AddToCartButton';
import StarRating from '../../../components/products/StarRating';
import RoastMeter from '../../../components/products/RoastMeter';
import ProductReviews from '../../../components/products/ProductReviews';
import ProductImageSlider from '../../../components/products/ProductImageSlider';
import ProductStory from '../../../components/products/ProductStory';
import VietnamesePhinGuide from '../../../components/products/VietnamesePhinGuide';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#E8EDDF]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductImageSlider 
            images={product.image_gallery || [product.image_url]} 
            productName={product.name}
          />
        </div>
        <div>
          <h1 className="text-3xl sm:text-3xl font-extrabold text-[#242423]">{product.name}</h1>
          
          {/* Star Rating */}
          <div className="mt-2 flex items-center">
            <StarRating rating={product.rating || 0} />
            {/* <span className="ml-2 text-sm text-[#333533]">
              {product.rating?.toFixed(1)} out of 5
            </span> */}
          </div>
          
          <p className="mt-4 text-xl sm:text-2xl text-[#242423]">{formatPrice(product.price)}</p>
          <div className="mt-6">
            <h2 className="text-lg sm:text-lg font-medium text-[#242423]">Use Case</h2>
            <p className="mt-2 text-base sm:text-md text-[#333533]">{product.description}</p>
            
            {/* Show RoastMeter only for coffee products */}
            {product.category === 'coffee' && product.roastLevel !== undefined && (
              <div className="mt-6">
                {/* <h3 className="text-md font-medium text-[#242423] mb-2">Roast Level</h3> */}
                <RoastMeter roastLevel={product.roastLevel} showLabels={true} />
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          
          <div className="mt-8 border-t border-[#CFDBD5] pt-8">
            <h2 className="text-lg font-medium text-[#242423]">Details</h2>
            <div className="mt-4 space-y-4">
              <div className="flex">
                <span className="w-1/3 text-[#5A5A46]">Category</span>
                <span className="w-2/3 text-[#242423] capitalize">
                  {product.category.split('-').join(' ')}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/3 text-[#5A5A46]">Stock</span>
                <span className="w-2/3 text-[#242423]">{product.stock} available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Story Section */}
      {product.story && (
        <div className="mt-16 border-t border-[#CFDBD5]">
          <ProductStory story={product.story} productName={product.name} />
        </div>
      )}
      
      {/* How To Section - Vietnamese Phin Guide */}
      <div className="mt-16 border-t border-[#CFDBD5]">
        <VietnamesePhinGuide />
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16 border-t border-[#CFDBD5] pt-10">
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
    </div>
    </div>
  );
} 