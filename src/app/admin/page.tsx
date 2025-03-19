'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { products } from '../../data/products';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../types/database.types';

// Supabase client
const supabaseUrl = 'https://tvmghxxoodjbjwhbvyir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bWdoeHhvb2RqYmp3aGJ2eWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTU3NDcsImV4cCI6MjA1Nzk5MTc0N30.4L2RE6FUjY9f9IWhG51ehvqeaNV3Zcnsu3sBlzj7134';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define type for sorting options
type SortOption = {
  field: keyof Product | 'sales';
  direction: 'asc' | 'desc';
};

// Extend the Product type with sales data
type ProductWithSales = Product & {
  sales?: number;
  salesRank?: 'top' | 'low' | null;
};

// Helper functions for formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount / 100);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function AdminPage() {
  const [message, setMessage] = useState<string>('');
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [dbProducts, setDbProducts] = useState<ProductWithSales[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showProductsList, setShowProductsList] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState<boolean>(false);
  
  // Filtering state
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const [filterStock, setFilterStock] = useState<number | ''>('');
  
  // Sorting state
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'asc' });
  
  // Categories for filtering
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    checkProducts();
  }, []);
  
  // Update categories whenever products are loaded
  useEffect(() => {
    if (dbProducts.length > 0) {
      const uniqueCategories = Array.from(new Set(dbProducts.map(p => p.category)));
      setCategories(uniqueCategories);
    }
  }, [dbProducts]);
  
  const checkProducts = async () => {
    setLoading(true);
    
    // Try the RPC function first
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_products');
      
      if (!rpcError && rpcData) {
        // Add mock sales data for demonstration
        const productsWithSales = addSalesData(rpcData);
        setDbProducts(productsWithSales);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('RPC Error:', error);
    }
    
    // Fallback to direct query
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (!error && data) {
        // Add mock sales data for demonstration
        const productsWithSales = addSalesData(data);
        setDbProducts(productsWithSales);
      } else {
        console.error('Direct query error:', error);
      }
    } catch (error) {
      console.error('Query Error:', error);
    }
    
    setLoading(false);
  };
  
  // Function to add mock sales data to products
  const addSalesData = (products: Product[]): ProductWithSales[] => {
    const productsWithSales = products.map(product => {
      // Generate mock sales based on stock and price (just for demonstration)
      // In a real app, you would fetch this from your orders table
      const baseSales = Math.floor(Math.random() * 100);
      const stockFactor = Math.max(0, 100 - product.stock) / 100;
      const sales = Math.floor(baseSales * (1 + stockFactor));
      
      return {
        ...product,
        sales
      };
    });
    
    // Sort by sales to determine rankings
    const sortedBySales = [...productsWithSales].sort((a, b) => 
      (b.sales || 0) - (a.sales || 0)
    );
    
    // Mark top 20% as top sellers and bottom 20% as low sellers
    const topCount = Math.max(1, Math.floor(sortedBySales.length * 0.2));
    const topSellers = new Set(sortedBySales.slice(0, topCount).map(p => p.id));
    const lowSellers = new Set(sortedBySales.slice(-topCount).map(p => p.id));
    
    return productsWithSales.map(product => ({
      ...product,
      salesRank: topSellers.has(product.id) ? 'top' : lowSellers.has(product.id) ? 'low' : null
    }));
  };
  
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };
  
  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      // If all are selected, clear selection
      setSelectedProducts(new Set());
    } else {
      // Otherwise select all
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };
  
  const importProducts = async () => {
    setMessage('Starting import...');
    setStatusMessages([]);
    setIsImporting(true);
    
    let successCount = 0;
    const productsToImport = selectedProducts.size > 0 
      ? products.filter(p => selectedProducts.has(p.id)) 
      : products;
    
    for (const product of productsToImport) {
      // Create a copy of the product with a new UUID
      const newProduct = {
        ...product,
        id: uuidv4()
      };
      
      const addStatus = `Adding ${product.name}...`;
      setStatusMessages(prev => [...prev, addStatus]);
      
      try {
        const { error } = await supabase
          .from('products')
          .insert(newProduct);
          
        if (error) {
          const errorMsg = `Error adding ${product.name}: ${error.message}`;
          setStatusMessages(prev => [...prev, errorMsg]);
        } else {
          successCount++;
          const successMsg = `✅ Successfully added ${product.name}`;
          setStatusMessages(prev => [...prev, successMsg]);
        }
      } catch (error: unknown) {
        const errorMsg = `Exception adding ${product.name}: ${error instanceof Error ? error.message : String(error)}`;
        setStatusMessages(prev => [...prev, errorMsg]);
      }
    }
    
    setMessage(`Import complete. Added ${successCount} of ${productsToImport.length} products.`);
    setIsImporting(false);
    checkProducts();
  };
  
  const deleteProduct = async (productId: string, productName: string) => {
    // First check if this is a confirmation
    if (deleteConfirm !== productId) {
      setDeleteConfirm(productId);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id: productId });
        
      if (error) {
        setMessage(`Error deleting ${productName}: ${error.message}`);
      } else {
        setMessage(`Successfully deleted ${productName}`);
        // Refresh the product list
        checkProducts();
      }
    } catch (error: unknown) {
      setMessage(`Exception deleting ${productName}: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Reset confirmation state
    setDeleteConfirm(null);
  };
  
  const updateStock = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .match({ id: productId });
        
      if (error) {
        setMessage(`Error updating stock: ${error.message}`);
      } else {
        // Update locally to avoid a full refresh
        setDbProducts(prev => 
          prev.map(p => p.id === productId ? {...p, stock: newStock} : p)
        );
        setMessage(`Stock updated successfully`);
      }
    } catch (error: unknown) {
      setMessage(`Exception updating stock: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Apply filters to the product list
  const filteredProducts = dbProducts.filter(product => {
    // Filter by category if set
    if (filterCategory && product.category !== filterCategory) return false;
    
    // Filter by name if set
    if (filterName && !product.name.toLowerCase().includes(filterName.toLowerCase())) return false;
    
    // Filter by stock if set
    if (filterStock !== '' && product.stock < filterStock) return false;
    
    return true;
  });
  
  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption.field === 'price') {
      // Sort numerically for price
      return sortOption.direction === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    } else if (sortOption.field === 'stock') {
      // Sort numerically for stock
      const aStock = a.stock || 0;
      const bStock = b.stock || 0;
      return sortOption.direction === 'asc' 
        ? aStock - bStock 
        : bStock - aStock;
    } else if (sortOption.field === 'sales') {
      // Sort numerically for sales
      const aSales = a.sales || 0;
      const bSales = b.sales || 0;
      return sortOption.direction === 'asc' 
        ? aSales - bSales 
        : bSales - aSales;
    } else {
      // Sort alphabetically for other fields
      const aValue = String(a[sortOption.field] || '');
      const bValue = String(b[sortOption.field] || '');
      return sortOption.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });
  
  // Handle sorting change
  const handleSortChange = (field: keyof Product | 'sales') => {
    if (sortOption.field === field) {
      // Toggle direction if same field
      setSortOption({
        field,
        direction: sortOption.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Default to ascending for new field
      setSortOption({ field, direction: 'asc' });
    }
  };
  
  // Group products by category for the collapsible list
  const productsByCategory = products.reduce<Record<string, Product[]>>((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded">
          {message}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products in Database: {dbProducts.length}</h2>
        
        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{dbProducts.length}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                {dbProducts.filter(p => p.category === 'coffee').length} coffees, {dbProducts.filter(p => p.category === 'coffee-kit').length} accessories
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {formatNumber(dbProducts.reduce((total, product) => total + (product.sales || 0), 0))}
                </h3>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Revenue: {formatCurrency(dbProducts.reduce((total, product) => total + ((product.sales || 0) * product.price), 0))}
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Top Seller</p>
                {(() => {
                  const topProduct = [...dbProducts].sort((a, b) => (b.sales || 0) - (a.sales || 0))[0];
                  return topProduct ? (
                    <>
                      <h3 className="text-lg font-bold text-gray-900 mt-1 truncate max-w-[180px]">{topProduct.name}</h3>
                      <p className="text-sm text-gray-500">{topProduct.sales} units</p>
                    </>
                  ) : (
                    <h3 className="text-lg font-bold text-gray-900 mt-1">None</h3>
                  );
                })()}
              </div>
              <div className="p-2 bg-yellow-50 rounded-full">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock Alert</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {dbProducts.filter(product => product.stock < 10).length}
                </h3>
              </div>
              <div className="p-2 bg-red-50 rounded-full">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                {dbProducts.filter(product => product.stock === 0).length} products out of stock
              </p>
            </div>
          </div>
        </div>
        
        {/* Add Restock Recommendations after Performance Overview */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Restock Recommendations</h3>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
              {dbProducts.filter(p => p.stock < 10 && (p.sales || 0) > 20).length} items
            </span>
          </div>
          
          {dbProducts.filter(p => p.stock < 10 && (p.sales || 0) > 20).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dbProducts
                .filter(p => p.stock < 10 && (p.sales || 0) > 20)
                .sort((a, b) => (a.stock || 0) - (b.stock || 0))
                .slice(0, 3)
                .map(product => (
                  <div key={`restock-${product.id}`} className="flex items-center p-2 border border-red-100 rounded bg-red-50">
                    <div className="flex-shrink-0 mr-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-red-700">Stock: {product.stock}</p>
                        <p className="text-sm text-gray-500">Sales: {product.sales}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No restock recommendations at this time</p>
          )}
        </div>
        
        {/* Filters */}
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
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
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
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading products...</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th 
                    className="px-4 py-2 border cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('name')}
                  >
                    Name {sortOption.field === 'name' && (sortOption.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    className="px-4 py-2 border cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('category')}
                  >
                    Category {sortOption.field === 'category' && (sortOption.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    className="px-4 py-2 border cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('price')}
                  >
                    Price {sortOption.field === 'price' && (sortOption.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    className="px-4 py-2 border cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('stock')}
                  >
                    Stock {sortOption.field === 'stock' && (sortOption.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th 
                    className="px-4 py-2 border cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('sales')}
                  >
                    Sales {sortOption.field === 'sales' && (sortOption.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 border">{product.name}</td>
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
                      <div className="flex items-center gap-2">
                        <span>{formatNumber(product.sales || 0)}</span>
                        {product.salesRank === 'top' && (
                          <div className="flex items-center">
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                              </svg>
                              Top
                            </span>
                          </div>
                        )}
                        {product.salesRank === 'low' && (
                          <div className="flex items-center">
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                              Low
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex items-center">
                        <button
                          onClick={() => deleteProduct(product.id, product.name)}
                          className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600 min-w-[80px]"
                        >
                          {deleteConfirm === product.id ? 'Confirm' : 'Delete'}
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
      </div>
      
      {/* Import Products Section */}
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Import Products</h2>
        
        <div className="mb-4">
          <p className="mb-2">
            Import products from the local data into your Supabase database.
          </p>
          
          {/* Toggle products list button */}
          <button
            onClick={() => setShowProductsList(!showProductsList)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded mb-4"
            aria-label={`${showProductsList ? 'Hide' : 'Show'} products list`}
          >
            <span className="transform transition-transform duration-200" style={{ 
              display: 'inline-block',
              transform: showProductsList ? 'rotate(90deg)' : 'rotate(0deg)' 
            }}>
              ▶
            </span>
            {showProductsList ? 'Hide' : 'Show'} Products to Import ({products.length})
          </button>
          
          {/* Collapsible products list */}
          <div 
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ 
              maxHeight: showProductsList ? '600px' : '0px',
              opacity: showProductsList ? 1 : 0,
              marginBottom: showProductsList ? '1rem' : '0'
            }}
          >
            <div className="border rounded bg-white p-2 mb-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
              <div className="mb-2 px-2 py-1 bg-gray-100 rounded sticky top-0 z-10">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === products.length}
                    onChange={toggleSelectAll}
                    className="mr-2"
                  />
                  <span className="font-medium">Select All Products</span>
                </label>
              </div>
              
              {/* Products by Category */}
              {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                <div key={category} className="mb-4">
                  <h3 className="font-medium text-gray-700 px-2 py-1 bg-gray-100 rounded mb-2">
                    {category} ({categoryProducts.length})
                  </h3>
                  <ul className="ml-2 space-y-1">
                    {categoryProducts.map(product => (
                      <li key={product.id} className="flex items-center">
                        <label className="flex items-center cursor-pointer flex-1 hover:bg-gray-50 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="mr-2"
                          />
                          <span className="flex-1">{product.name}</span>
                          <span className="text-gray-500 text-sm">${(product.price / 100).toFixed(2)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
                    
          {/* Import buttons */}
          <div className="flex gap-2">
            <button
              onClick={importProducts}
              disabled={isImporting}
              className={`px-4 py-2 text-white rounded ${
                isImporting
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isImporting 
                ? 'Importing...' 
                : selectedProducts.size > 0
                  ? `Import Selected (${selectedProducts.size})`                  : `Import All (${products.length})`
              }
            </button>
            
            {selectedProducts.size > 0 && (
              <button
                onClick={() => setSelectedProducts(new Set())}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={isImporting}
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
        
        {statusMessages.length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-2">Import Status:</h3>
            <ul className="space-y-1">
              {statusMessages.map((msg, index) => (
                <li key={index} className={msg.includes('Error') ? 'text-red-600' : ''}>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
        <button
          onClick={checkProducts}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Database Connection
        </button>
      </div>
    </div>
  );
} 
