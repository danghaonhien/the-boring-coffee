import Link from 'next/link';
import { products } from '../data/products';
import ProductGrid from '../components/products/ProductGrid';
import ProductSlider from '../components/products/ProductSlider';

export default function Home() {
  // Get featured products (first 3)
  const featuredProducts = products.slice(0, 3);
  
  // Get new products (Lightmode and Darkmode)
  const newProducts = products.filter(p => p.id === '1' || p.id === '2');

  return (
    <div>
      {/* Hero section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Boring Coffee
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Simple, consistent, and reliable coffee for the tech community.
            No fancy names, just great coffee that works every time.
          </p>
          <div className="mt-10">
            <Link
              href="/products"
              className="inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* New products slider section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">New Products</h2>
          <p className="text-gray-500">Drag to explore</p>
        </div>
        <ProductSlider products={newProducts} />
      </div>

      {/* Featured products section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
        <ProductGrid products={featuredProducts} />
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-white border border-gray-300 rounded-md py-2 px-8 font-medium text-gray-700 hover:bg-gray-50"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Why Choose The Boring Coffee?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tech-Inspired</h3>
              <p className="text-gray-600">
                Coffee names and flavors inspired by the tech world, designed for developers and tech enthusiasts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Consistent Quality</h3>
              <p className="text-gray-600">
                Like a well-written function, our coffee delivers the same great experience every single time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ethically Sourced</h3>
              <p className="text-gray-600">
                We believe in open-source principles and transparent supply chains for all our coffee beans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 