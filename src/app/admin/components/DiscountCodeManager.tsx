import React from 'react';
import { Product } from '../../../types/database.types';

type DiscountCode = {
  id: string;
  code: string;
  percentage: number;
  applicable_items: 'single' | 'multiple' | 'all';
  items?: string[];
  active: boolean;
  expires_at?: string | null;
};

type DiscountCodeManagerProps = {
  discountCodes: DiscountCode[];
  newCode: string;
  setNewCode: (code: string) => void;
  newDiscount: number;
  setNewDiscount: (discount: number) => void;
  codeApplicability: 'single' | 'multiple' | 'all';
  setCodeApplicability: (applicability: 'single' | 'multiple' | 'all') => void;
  selectedItemsForCode: Set<string>;
  setSelectedItemsForCode: (items: Set<string>) => void;
  dbProducts: Product[];
  createDiscountCode: () => void;
  toggleDiscountStatus: (id: string) => void;
  deleteDiscountCode: (id: string) => void;
  loadingDiscountCodes: boolean;
};

const DiscountCodeManager: React.FC<DiscountCodeManagerProps> = ({
  discountCodes,
  newCode,
  setNewCode,
  newDiscount,
  setNewDiscount,
  codeApplicability,
  setCodeApplicability,
  selectedItemsForCode,
  setSelectedItemsForCode,
  dbProducts,
  createDiscountCode,
  toggleDiscountStatus,
  deleteDiscountCode,
  loadingDiscountCodes
}) => {
  return (
    <div className="mt-8 mb-6">
      <h2 className="text-xl font-semibold mb-4">Discount Code Management</h2>
      
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Create New Discount Code</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
            <input
              id="discount-code"
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. SUMMER20"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              aria-label="Discount code"
            />
          </div>
          
          <div>
            <label htmlFor="discount-percentage" className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
            <div className="relative">
              <input
                id="discount-percentage"
                type="number"
                min="1"
                max="100"
                value={newDiscount}
                onChange={(e) => setNewDiscount(Number(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                aria-label="Discount percentage"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="discount-applicability" className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
          <select
            id="discount-applicability"
            value={codeApplicability}
            onChange={(e) => setCodeApplicability(e.target.value as 'single' | 'multiple' | 'all')}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            aria-label="Discount applicability"
          >
            <option value="single">Single Item</option>
            <option value="multiple">Multiple Items</option>
            <option value="all">All Items</option>
          </select>
        </div>
        
        {codeApplicability === 'multiple' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Products</label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
              {dbProducts.map(product => (
                <div key={product.id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    checked={selectedItemsForCode.has(product.id)}
                    onChange={() => {
                      const newSelected = new Set(selectedItemsForCode);
                      if (newSelected.has(product.id)) {
                        newSelected.delete(product.id);
                      } else {
                        newSelected.add(product.id);
                      }
                      setSelectedItemsForCode(newSelected);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`product-${product.id}`} className="select-none">{product.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={createDiscountCode}
            className="px-4 py-2 bg-[#F5CB5C] text-[#333533] rounded hover:bg-[#F5CB5C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C]"
          >
            Create Discount Code
          </button>
        </div>
      </div>
      
      {/* Discount Codes Table */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Active Discount Codes</h3>
        <div className="overflow-x-auto">
          {loadingDiscountCodes ? (
            <div className="text-center py-4">Loading discount codes...</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Code</th>
                  <th className="px-4 py-2 border">Discount</th>
                  <th className="px-4 py-2 border">Applicable To</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discountCodes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 border text-center">No discount codes available</td>
                  </tr>
                ) : (
                  discountCodes.map(code => (
                    <tr key={code.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border font-medium">{code.code}</td>
                      <td className="px-4 py-2 border">{code.percentage}%</td>
                      <td className="px-4 py-2 border">
                        {code.applicable_items === 'all' 
                          ? 'All Products' 
                          : code.applicable_items === 'single' 
                            ? 'Single Product' 
                            : `${code.items?.length || 0} Products`}
                      </td>
                      <td className="px-4 py-2 border">
                        <span className={`px-2 py-1 rounded-full text-xs ${code.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {code.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDiscountStatus(code.id)}
                            className={`p-2 rounded ${code.active ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100'} transition-colors`}
                            title={code.active ? 'Deactivate code' : 'Activate code'}
                          >
                            {code.active ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => deleteDiscountCode(code.id)}
                            className="p-2 rounded text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete discount code"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountCodeManager; 