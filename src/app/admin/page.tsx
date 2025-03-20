'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { products } from '../../data/products';
import { Product } from '../../types/database.types';

// Supabase client
// These environment variables need to be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
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
  const [dbProducts, setDbProducts] = useState<ProductWithSales[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Connection status state
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  
  // Filtering state
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const [filterStock, setFilterStock] = useState<number | ''>('');
  
  // Sorting state
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'asc' });
  
  // Categories for filtering
  const [categories, setCategories] = useState<string[]>([]);
  
  // Add state to track collapsed state for each widget
  const [collapsedWidgets, setCollapsedWidgets] = useState<{ [key: string]: boolean }>({
    importProducts: false,
    connectionStatus: false,
    salesPerformance: false,
    productRankings: false,
  });
  
  // Add state for selected products
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  
  // Change import button to dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Add state for active category in import dropdown
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
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
    setConnectionStatus('checking');
    
    // Try the RPC function first
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_products');
      
      if (!rpcError && rpcData) {
        // Add mock sales data for demonstration
        const productsWithSales = addSalesData(rpcData);
        setDbProducts(productsWithSales);
        setConnectionStatus('connected');
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
        setConnectionStatus('connected');
      } else {
        console.error('Direct query error:', error);
        setConnectionStatus('failed');
      }
    } catch (error) {
      console.error('Query Error:', error);
      setConnectionStatus('failed');
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
  
  // Function to toggle product selection
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
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
  
  // Function to toggle widget collapse state
  const toggleWidgetCollapse = (widget: string) => {
    setCollapsedWidgets(prev => ({
      ...prev,
      [widget]: !prev[widget],
    }));
  };

  // Add select all functionality
  const toggleSelectAll = () => {
    if (selectedProducts.size === dbProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(dbProducts.map(p => p.id)));
    }
  };

  // Change import button to dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* Main grid layout for widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Widget 1: SEO Tracking */}
        <div className="p-4 border rounded-lg bg-white shadow-sm h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              SEO Tracking
            </span>
            <button
              onClick={() => toggleWidgetCollapse('seoTracking')}
              className="text-sm text-gray-500 hover:text-gray-700"
              title="Toggle SEO Tracking"
            >
              <svg className={`w-5 h-5 transform transition-transform ${collapsedWidgets.seoTracking ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </h2>
          {collapsedWidgets.seoTracking ? (
            <div className="text-gray-600">Summary: SEO metrics overview.</div>
          ) : (
            <div className="mb-4">
              <p className="mb-2 text-gray-600">
                Track your SEO performance metrics and insights.
              </p>
              {/* Additional SEO tracking content can be added here */}
            </div>
          )}
        </div>
        
        {/* Widget 2: Connection Status */}
        <div className="p-4 border rounded-lg bg-white shadow-sm h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM6.293 6.707a1 1 0 010-1.414l.7-.7a1 1 0 111.414 1.414l-.7.7a1 1 0 01-1.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM13.707 13.707a1 1 0 010-1.414l.7-.7a1 1 0 111.414 1.414l-.7.7a1 1 0 01-1.414 0zM3 11a1 1 0 100-2h1a1 1 0 100 2H3zM6.293 13.707a1 1 0 010-1.414l.7-.7a1 1 0 111.414 1.414l-.7.7a1 1 0 01-1.414 0zM11 17a1 1 0 10-2 0v1a1 1 0 102 0v-1zM13.707 6.707a1 1 0 010-1.414l.7-.7a1 1 0 111.414 1.414l-.7.7a1 1 0 01-1.414 0zM16 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
              </svg>
              Connection Status
            </span>
            <button
              onClick={() => toggleWidgetCollapse('connectionStatus')}
              className="text-sm text-gray-500 hover:text-gray-700"
              title="Toggle Connection Status"
            >
              <svg className={`w-5 h-5 transform transition-transform ${collapsedWidgets.connectionStatus ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </h2>
          {collapsedWidgets.connectionStatus ? (
            <div className="text-gray-600">Summary: {dbProducts.length} products loaded</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[230px]">
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-medium">Checking connection...</span>
                </div>
              ) : connectionStatus === 'connected' ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-green-700 mb-2">Connected to Supabase</h3>
                  <p className="text-gray-600">Database is working correctly</p>
                  <p className="text-gray-500 mt-2">{dbProducts.length} products loaded</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-red-700 mb-2">Connection Failed</h3>
                  <p className="text-gray-600 mb-4">Unable to connect to Supabase database</p>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={checkProducts}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        // This would typically open documentation or run a fix script
                        setMessage('Running database setup script... Please wait.');
                        setTimeout(() => {
                          checkProducts();
                          setMessage('Database setup completed. Testing connection...');
                        }, 1500);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                    >
                      Fix Connection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Widget 3: Sales Performance */}
        <div className="p-4 border rounded-lg bg-white shadow-sm h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
              </svg>
              Sales Performance
            </span>
            <button
              onClick={() => toggleWidgetCollapse('salesPerformance')}
              className="text-sm text-gray-500 hover:text-gray-700"
              title="Toggle Sales Performance"
            >
              <svg className={`w-5 h-5 transform transition-transform ${collapsedWidgets.salesPerformance ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </h2>
          {collapsedWidgets.salesPerformance ? (
            <div className="text-gray-600">Summary: Total revenue ${dbProducts.reduce((total, product) => total + ((product.sales || 0) * product.price), 0)}</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* Total sales */}
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Total Items Sold</p>
                    <h3 className="text-3xl font-bold text-indigo-900 mt-1">
                      {formatNumber(dbProducts.reduce((total, product) => total + (product.sales || 0), 0))}
                    </h3>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Revenue */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-emerald-900 mt-1">
                      {formatCurrency(dbProducts.reduce((total, product) => total + ((product.sales || 0) * product.price), 0))}
                    </h3>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Average order value */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Average Order Value</p>
                    <h3 className="text-3xl font-bold text-blue-900 mt-1">
                      {formatCurrency(
                        dbProducts.reduce((total, product) => total + ((product.sales || 0) * product.price), 0) / 
                        Math.max(1, dbProducts.reduce((count, product) => count + (product.sales || 0), 0))
                      )}
                    </h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Widget 4: Product Rankings */}
        <div className="p-4 border rounded-lg bg-white shadow-sm h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              Product Rankings
            </span>
            <button
              onClick={() => toggleWidgetCollapse('productRankings')}
              className="text-sm text-gray-500 hover:text-gray-700"
              title="Toggle Product Rankings"
            >
              <svg className={`w-5 h-5 transform transition-transform ${collapsedWidgets.productRankings ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </h2>
          {collapsedWidgets.productRankings ? (
            <div className="text-gray-600">Summary: Top 3 products sold the most</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* Top Performers */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-700 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Top Performers
                </h3>
                
                <div className="space-y-3">
                  {[...dbProducts]
                    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                    .slice(0, 3)
                    .map((product, index) => (
                      <div key={`top-${product.id}`} className="flex items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 font-bold rounded-full mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">{formatNumber(product.sales || 0)} sold</p>
                            <p className="text-sm font-medium text-green-700">{formatCurrency((product.sales || 0) * product.price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Worst Performers */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-red-700 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Needing Attention
                </h3>
                
                <div className="space-y-3">
                  {[...dbProducts]
                    .filter(p => p.stock > 0) // Only include products that are in stock
                    .sort((a, b) => (a.sales || 0) - (b.sales || 0))
                    .slice(0, 3)
                    .map((product, index) => (
                      <div key={`low-${product.id}`} className="flex items-center p-3 bg-red-50 border border-red-100 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 font-bold rounded-full mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.name}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">Only {formatNumber(product.sales || 0)} sold</p>
                            <p className="text-sm font-medium text-red-700">{formatNumber(product.stock)} in stock</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters and Products Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          Products Management
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
                      setShowDropdown(false);
                      const selectedProductNames = [...selectedProducts].map(id => 
                        products.find(p => p.id === id)?.name || id
                      ).join(", ");
                      setMessage(`${selectedProducts.size} products imported: ${selectedProductNames}`);
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const newStock = prompt(`Update stock for ${product.name}:`, product.stock.toString());
                            if (newStock !== null) {
                              const stockValue = parseInt(newStock);
                              if (!isNaN(stockValue) && stockValue >= 0) {
                                updateStock(product.id, stockValue);
                              }
                            }
                          }}
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
      </div>
    </div>
  );
} 
