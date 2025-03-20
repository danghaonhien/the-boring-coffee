import React from 'react';

type ProductFiltersProps = {
  categories: string[];
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterName: string;
  setFilterName: (name: string) => void;
  filterStock: number | '';
  setFilterStock: (stock: number | '') => void;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filterCategory,
  setFilterCategory,
  filterName,
  setFilterName,
  filterStock,
  setFilterStock
}) => {
  return (
    <div className="mb-6 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Filter Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <select 
              id="category-filter"
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="product-name-filter" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              id="product-name-filter"
              type="text" 
              value={filterName} 
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="min-stock-filter" className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V3a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              id="min-stock-filter"
              type="number" 
              value={filterStock} 
              onChange={(e) => setFilterStock(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Min stock..."
              min="0"
              className="block w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            setFilterCategory('');
            setFilterName('');
            setFilterStock('');
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters; 