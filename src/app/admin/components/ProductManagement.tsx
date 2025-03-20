import React from 'react';
import { Product } from '../../../types/database.types';
import ProductFilters from './ProductFilters';
import ProductsTable from './ProductsTable';

type ProductWithSales = Product & {
  sales?: number;
  salesRank?: 'top' | 'low' | null;
};

type ProductManagementProps = {
  dbProducts: ProductWithSales[];
  loading: boolean;
  message: string;
  setMessage: (message: string) => void;
  categories: string[];
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterName: string;
  setFilterName: (name: string) => void;
  filterStock: number | '';
  setFilterStock: (stock: number | '') => void;
  sortedProducts: ProductWithSales[];
  sortOption: {
    field: keyof Product | 'sales';
    direction: 'asc' | 'desc';
  };
  handleSortChange: (field: keyof Product | 'sales') => void;
  selectedProducts: Set<string>;
  toggleProductSelection: (productId: string) => void;
  toggleSelectAll: () => void;
  updateStock: (productId: string, newStock: number) => void;
  updateProduct: (productId: string, productName: string) => void;
  deleteProduct: (productId: string, productName: string) => void;
  deleteConfirm: string | null;
  setDbProducts: React.Dispatch<React.SetStateAction<ProductWithSales[]>>;
  showDropdown: boolean;
  toggleDropdown: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  products: Product[];
  setSelectedProducts: (selected: Set<string>) => void;
  importSelectedProducts: () => void;
  debugDatabaseConnection: () => void;
  formatNumber: (num: number) => string;
};

const ProductManagement: React.FC<ProductManagementProps> = ({
  dbProducts,
  loading,
  message,
  setMessage,
  categories,
  filterCategory,
  setFilterCategory,
  filterName,
  setFilterName,
  filterStock,
  setFilterStock,
  sortedProducts,
  sortOption,
  handleSortChange,
  selectedProducts,
  toggleProductSelection,
  toggleSelectAll,
  updateStock,
  updateProduct,
  deleteProduct,
  deleteConfirm,
  setDbProducts,
  showDropdown,
  toggleDropdown,
  activeCategory,
  setActiveCategory,
  products,
  setSelectedProducts,
  importSelectedProducts,
  debugDatabaseConnection,
  formatNumber
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        Products Management
        <div className="flex space-x-2">
          <button
            onClick={debugDatabaseConnection}
            className="px-4 py-2 text-gray-700 rounded bg-gray-200 hover:bg-gray-300 shadow-md transition duration-300 ease-in-out transform hover:scale-105 mr-2"
            title="Debug Database Connection"
          >
            Debug Connection
          </button>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 text-[#333533] rounded bg-[#F5CB5C] hover:bg-primary-dark shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              title="Import Products"
            >
              Import Products
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xs shadow-lg z-300">
                <div className="p-4">
                  <div className="flex mb-4 space-x-0">
                    <button
                      onClick={() => setActiveCategory('All')}
                      className={`px-4 py-2 h-8 text-sm rounded-xs ${activeCategory === 'All' ? 'bg-[#333533] text-[#CFDBD5]' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out transform hover:scale-105`}
                    >
                      All
                    </button>

                    
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 h-8 text-sm rounded-xs ${activeCategory === category ? 'bg-[#333533] text-[#CFDBD5]' : 'bg-gray-200 text-gray-700'} transition duration-300 ease-in-out transform hover:scale-105`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="flex mb-4 justify-between">
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {`${selectedProducts.size}/${products.length} selected`}
                  </div>
                  <button
                    onClick={() => setSelectedProducts(new Set())}
                    className="text-sm text-[#333533] font-light hover:underline mb-2 cursor-pointer"
                  >
                    Clear All
                  </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    title="Search products"
                    aria-label="Search products"
                    className="w-full px-4 py-3 text-sm font-light mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary transition duration-300 ease-in-out transform hover:scale-105"
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {products.filter(p => (activeCategory === 'All' || p.category === activeCategory) && p.name.toLowerCase().includes(filterName.toLowerCase())).map(product => (
                      <li key={product.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm font-light">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="mr-2"
                          title={`Select ${product.name}`}
                          aria-label={`Select ${product.name}`}
                        />
                        {product.name}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      toggleDropdown();
                      importSelectedProducts();
                    }}
                    className={`w-full mt-4 px-4 py-3 rounded ${selectedProducts.size === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#F5CB5C] text-[#333533] hover:bg-[#F5CB5C]'} transition duration-300 ease-in-out transform hover:scale-105`}
                    disabled={selectedProducts.size === 0}
                  >
                    Import Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded flex justify-between items-center">
          <span>{message}</span>
          <button 
            onClick={() => setMessage('')} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      
      {/* Filters */}
      <ProductFilters 
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterName={filterName}
        setFilterName={setFilterName}
        filterStock={filterStock}
        setFilterStock={setFilterStock}
      />
      
      {/* Products Table */}
      <ProductsTable 
        dbProducts={dbProducts}
        loading={loading}
        sortedProducts={sortedProducts}
        sortOption={sortOption}
        handleSortChange={handleSortChange}
        selectedProducts={selectedProducts}
        toggleProductSelection={toggleProductSelection}
        toggleSelectAll={toggleSelectAll}
        updateStock={updateStock}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        deleteConfirm={deleteConfirm}
        setDbProducts={setDbProducts}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default ProductManagement; 