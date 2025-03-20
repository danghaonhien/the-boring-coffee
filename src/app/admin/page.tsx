'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { products } from '../../data/products';
import { Product } from '../../types/database.types';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import ProductManagement from './components/ProductManagement';
import DiscountCodeManager from './components/DiscountCodeManager';

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

// Update the DiscountCode type to match the database type
type DiscountCode = {
  id: string;
  code: string;
  percentage: number;
  applicable_items: 'single' | 'multiple' | 'all';
  items?: string[];
  active: boolean;
  expires_at?: string | null;
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
  
  // Add state for discount codes
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [newCode, setNewCode] = useState<string>('');
  const [newDiscount, setNewDiscount] = useState<number>(10);
  const [codeApplicability, setCodeApplicability] = useState<'single' | 'multiple' | 'all'>('all');
  const [selectedItemsForCode, setSelectedItemsForCode] = useState<Set<string>>(new Set());
  
  // Add state to track loading status for discount codes
  const [loadingDiscountCodes, setLoadingDiscountCodes] = useState(false);
  
  // Add a new state to track the active tab
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'orders'>('home');

  // Properly initialize the admin page with Supabase data
  useEffect(() => {
    const initializeAdminPage = async () => {
      try {
        // Try to sync products to Supabase first (in case there are new local products)
        const { syncProductsToSupabase } = await import('../../lib/api/products');
        await syncProductsToSupabase();
        
        // Then check database connection/products
        await debugDatabaseConnection();
        await checkProducts();
      } catch (error) {
        console.error('Error initializing admin page:', error);
        setMessage('Error initializing admin page. Please check console for details.');
      }
    };
    
    initializeAdminPage();
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
    if (selectedProducts.size === sortedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(sortedProducts.map(p => p.id)));
    }
  };

  // Change import button to dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Add function to update product details
  const updateProduct = async (productId: string, productName: string) => {
    try {
      // Find the product in the local state
      const product = dbProducts.find(p => p.id === productId);
      if (!product) return;
      
      // Here you would normally open a modal with a form, but we'll use a simple prompt
      const newName = prompt(`Update name for ${productName}:`, productName);
      if (newName === null) return;
      
      // Show loading message
      setMessage(`Updating ${productName}...`);
      
      // Update in database
      const { error } = await supabase
        .from('products')
        .update({ name: newName })
        .match({ id: productId });
        
      if (error) {
        setMessage(`Error updating product: ${error.message}`);
      } else {
        // Update locally to avoid a full refresh
        setDbProducts(prev => 
          prev.map(p => p.id === productId ? {...p, name: newName} : p)
        );
        setMessage(`Product updated successfully`);
      }
    } catch (error: unknown) {
      setMessage(`Exception updating product: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Load discount codes on initial load
  useEffect(() => {
    if (connectionStatus === 'connected') {
      loadDiscountCodes();
    }
  }, [connectionStatus]);

  // Function to load discount codes from database
  const loadDiscountCodes = async () => {
    setLoadingDiscountCodes(true);
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        setMessage(`Error loading discount codes: ${error.message}`);
      } else {
        // Transform data to match local state structure
        const formattedCodes = data.map(code => ({
          id: code.id,
          code: code.code,
          percentage: code.percentage,
          applicable_items: code.applicable_items as 'single' | 'multiple' | 'all',
          items: code.items ? code.items as string[] : undefined,
          active: code.active,
          expires_at: code.expires_at
        }));
        setDiscountCodes(formattedCodes);
      }
    } catch (error: unknown) {
      setMessage(`Exception loading discount codes: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingDiscountCodes(false);
    }
  };

  // Update the create discount code function to save to database
  const createDiscountCode = async () => {
    if (!newCode.trim()) {
      setMessage('Please enter a valid discount code');
      return;
    }
    
    try {
      setMessage('Creating discount code...');
      
      // Create database record
      const { data, error } = await supabase
        .from('discount_codes')
        .insert({
          code: newCode.toUpperCase().trim(),
          percentage: newDiscount,
          applicable_items: codeApplicability,
          items: codeApplicability === 'multiple' ? Array.from(selectedItemsForCode) : null,
          active: true
        })
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') { // Duplicate code error
          setMessage(`A discount code with the name "${newCode.toUpperCase().trim()}" already exists.`);
        } else {
          setMessage(`Error creating discount code: ${error.message}`);
        }
        return;
      }
      
      // Format the new code and add it to state
      const newCodeEntry: DiscountCode = {
        id: data.id,
        code: data.code,
        percentage: data.percentage,
        applicable_items: data.applicable_items,
        items: data.items,
        active: data.active
      };
      
      setDiscountCodes(prev => [newCodeEntry, ...prev]);
      setMessage(`Discount code ${newCodeEntry.code} created successfully`);
      
      // Reset form
      setNewCode('');
      setNewDiscount(10);
      setCodeApplicability('all');
      setSelectedItemsForCode(new Set());
    } catch (error: unknown) {
      setMessage(`Exception creating discount code: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Update the toggle discount status function to update database
  const toggleDiscountStatus = async (id: string) => {
    try {
      // Find the current code to toggle
      const codeToToggle = discountCodes.find(code => code.id === id);
      if (!codeToToggle) return;
      
      const newStatus = !codeToToggle.active;
      
      // Update in database
      const { error } = await supabase
        .from('discount_codes')
        .update({ active: newStatus })
        .eq('id', id);
        
      if (error) {
        setMessage(`Error updating discount code: ${error.message}`);
        return;
      }
      
      // Update locally
      setDiscountCodes(
        discountCodes.map(code => 
          code.id === id ? { ...code, active: newStatus } : code
        )
      );
      
      setMessage(`Discount code ${codeToToggle.code} ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: unknown) {
      setMessage(`Exception updating discount code: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Update the delete discount code function to delete from database
  const deleteDiscountCode = async (id: string) => {
    try {
      // Find the code to delete for messaging
      const codeToDelete = discountCodes.find(code => code.id === id);
      if (!codeToDelete) return;
      
      // Delete from database
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);
        
      if (error) {
        setMessage(`Error deleting discount code: ${error.message}`);
        return;
      }
      
      // Update locally
      setDiscountCodes(discountCodes.filter(code => code.id !== id));
      setMessage(`Discount code ${codeToDelete.code} deleted successfully`);
    } catch (error: unknown) {
      setMessage(`Exception deleting discount code: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Fix the import button click handler to actually import to Supabase
  const importSelectedProducts = async () => {
    if (selectedProducts.size === 0) {
      setMessage('No products selected for import.');
      return;
    }

    try {
      setMessage('Importing selected products...');
      
      // Get selected products from the products array with proper UUID formatting
      const productsToImport = products
        .filter(product => selectedProducts.has(product.id))
        .map(product => {
          // Convert numeric IDs to valid UUIDs
          let formattedId = product.id;
          if (/^\d+$/.test(product.id)) {
            // If ID is purely numeric, convert to UUID format
            const paddedId = product.id.padStart(12, '0');
            formattedId = `00000000-0000-0000-0000-${paddedId}`;
          }
          
          return {
            id: formattedId,
            name: product.name,
            description: product.description || '',
            price: product.price,
            image_url: product.image_url || '',
            stock: product.stock || 10,
            category: product.category,
            created_at: new Date().toISOString()
          };
        });
      
      console.log('Attempting to import products:', productsToImport);
      
      // Import products one by one for better error handling
      let successCount = 0;
      const errorMessages = [];
      
      for (const product of productsToImport) {
        try {
          const { error } = await supabase
            .from('products')
            .insert([product]);
          
          if (error) {
            console.error(`Error importing ${product.name}:`, error);
            errorMessages.push(`${product.name}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Exception importing ${product.name}:`, err);
          errorMessages.push(`${product.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
      
      // Refresh products list to show newly added products
      await checkProducts();
      
      // Clear selection and close dropdown
      setSelectedProducts(new Set());
      setShowDropdown(false);
      
      // Success/failure message
      if (successCount === productsToImport.length) {
        setMessage(`Successfully imported all ${successCount} products.`);
      } else if (successCount > 0) {
        setMessage(`Partially successful: Imported ${successCount} out of ${productsToImport.length} products. 
          Errors: ${errorMessages.slice(0, 3).join('; ')}${errorMessages.length > 3 ? '...' : ''}`);
      } else {
        setMessage(`Failed to import any products. Errors: ${errorMessages.slice(0, 3).join('; ')}${errorMessages.length > 3 ? '...' : ''}`);
      }
    } catch (error) {
      console.error('Exception importing products:', error);
      setMessage(`Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Add a debug database connection function
  const debugDatabaseConnection = async () => {
    try {
      setMessage('Checking database connection and structure...');
      
      // Check if the products table exists
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .limit(1);
        
      if (error) {
        console.error('Error accessing products table:', error);
        setMessage(`Database issue: ${error.message || JSON.stringify(error)}`);
        return;
      }
      
      console.log('Products table exists and is accessible:', data);
      
      // Try to get the database schema for products table
      // This is just for debugging purposes
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_schema_info');
      
      if (rpcError) {
        console.log('Cannot get schema, trying direct query');
        // Try other debugging approaches
        const testUuid = '00000000-0000-0000-0000-000000000001';
        const { error: testError } = await supabase
          .from('products')
          .insert([{
            id: testUuid,
            name: 'Test Product',
            description: 'Test description',
            price: 999,
            image_url: '/test.jpg',
            stock: 1,
            category: 'test',
            created_at: new Date().toISOString()
          }]);
          
        if (testError) {
          console.log('Test insert failed:', testError);
          if (testError.message.includes('uuid')) {
            setMessage('Confirmed: Database requires UUID format for product IDs. The import has been fixed to handle this.');
          } else {
            setMessage(`Test import failed: ${testError.message}`);
          }
        } else {
          // Clean up the test product
          await supabase.from('products').delete().eq('id', testUuid);
          setMessage('Database connection is working correctly. Test import succeeded.');
        }
      } else {
        console.log('Database schema info:', rpcData);
        setMessage('Database connection and schema check successful. See console for details.');
      }
    } catch (error) {
      console.error('Database debug error:', error);
      setMessage(`Database check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-4 overflow-auto">
        {/* {message && (
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
        )} */}
        
        {activeTab === 'home' && (
          <HomePage 
            dbProducts={dbProducts}
            loading={loading}
            connectionStatus={connectionStatus}
            collapsedWidgets={collapsedWidgets}
            toggleWidgetCollapse={toggleWidgetCollapse}
            checkProducts={checkProducts}
            setMessage={setMessage}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        )}
        
        {activeTab === 'products' && (
          <ProductManagement 
            dbProducts={dbProducts}
            loading={loading}
            message={message}
            setMessage={setMessage}
            categories={categories}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterName={filterName}
            setFilterName={setFilterName}
            filterStock={filterStock}
            setFilterStock={setFilterStock}
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
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            products={products}
            setSelectedProducts={setSelectedProducts}
            importSelectedProducts={importSelectedProducts}
            debugDatabaseConnection={debugDatabaseConnection}
            formatNumber={formatNumber}
          />
        )}
        
        {activeTab === 'orders' && (
          <DiscountCodeManager 
            discountCodes={discountCodes}
            newCode={newCode}
            setNewCode={setNewCode}
            newDiscount={newDiscount}
            setNewDiscount={setNewDiscount}
            codeApplicability={codeApplicability}
            setCodeApplicability={setCodeApplicability}
            selectedItemsForCode={selectedItemsForCode}
            setSelectedItemsForCode={setSelectedItemsForCode}
            dbProducts={dbProducts}
            createDiscountCode={createDiscountCode}
            toggleDiscountStatus={toggleDiscountStatus}
            deleteDiscountCode={deleteDiscountCode}
            loadingDiscountCodes={loadingDiscountCodes}
          />
        )}
      </div>
    </div>
  );
} 