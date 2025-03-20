import React from 'react';
import { Product } from '../../../types/database.types';

type ProductWithSales = Product & {
  sales?: number;
  salesRank?: 'top' | 'low' | null;
};

type ProductsTableProps = {
  dbProducts: ProductWithSales[];
  loading: boolean;
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
  formatNumber: (num: number) => string;
};

const ProductsTable: React.FC<ProductsTableProps> = ({
  dbProducts,
  loading,
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
  setDbProducts}) => {
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === sortedProducts.length && sortedProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="mr-2"
                    title="Select all products"
                    aria-label="Select all products"
                  />
                  <span className="cursor-pointer" onClick={() => handleSortChange('name')}>
                    Name {sortOption.field === 'name' && (sortOption.direction === 'asc' ? '▲' : '▼')}
                  </span>
                </div>
              </th>
              <th className="px-4 py-2 border cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('category')}>
                Category {sortOption.field === 'category' && (sortOption.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 border cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('price')}>
                Price {sortOption.field === 'price' && (sortOption.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 border cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('stock')}>
                Stock {sortOption.field === 'stock' && (sortOption.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 border cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('sales')}>
                Sales {sortOption.field === 'sales' && (sortOption.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border group">
                  <div className="flex items-center">
                    <div className="w-5 mr-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className={`${selectedProducts.has(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                        title={`Select ${product.name}`}
                        aria-label={`Select ${product.name}`}
                      />
                    </div>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 border">{product.category}</td>
                <td className="px-4 py-2 border">${(product.price / 100).toFixed(2)}</td>
                <td className="px-4 py-2 border">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={product.stock}
                      onChange={(e) => {
                        const newStock = parseInt(e.target.value);
                        if (!isNaN(newStock) && newStock >= 0) {
                          // Update local state immediately for responsive UI
                          setDbProducts(prev => 
                            prev.map(p => p.id === product.id ? {...p, stock: newStock} : p)
                          );
                        }
                      }}
                      onBlur={(e) => {
                        const newStock = parseInt(e.target.value);
                        if (!isNaN(newStock) && newStock >= 0) {
                          updateStock(product.id, newStock);
                        }
                      }}
                      className="w-20 p-1 border rounded text-center"
                      aria-label={`Change stock quantity for ${product.name}`}
                    />
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  {product.sales || 0}
                  {product.salesRank === 'top' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Top
                    </span>
                  )}
                  {product.salesRank === 'low' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Low
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProduct(product.id, product.name)}
                      className="p-2 rounded text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Update product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id, product.name)}
                      className={`p-2 rounded ${deleteConfirm === product.id ? 'text-white bg-red-500' : 'text-red-600 hover:bg-red-100'} transition-colors`}
                      title="Delete product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-2 border text-center">
                  {dbProducts.length === 0
                    ? 'No products found in database'
                    : 'No products match the current filters'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsTable; 