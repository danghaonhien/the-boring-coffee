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

export default function AdminPage() {
  const [message, setMessage] = useState<string>('');
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    checkProducts();
  }, []);
  
  const checkProducts = async () => {
    // Try the RPC function first
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_products');
      
      if (!rpcError && rpcData) {
        setDbProducts(rpcData);
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
        setDbProducts(data);
      } else {
        console.error('Direct query error:', error);
      }
    } catch (error) {
      console.error('Query Error:', error);
    }
  };
  
  const importProducts = async () => {
    setMessage('Starting import...');
    setStatusMessages([]);
    
    let successCount = 0;
    
    for (const product of products) {
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
    
    setMessage(`Import complete. Added ${successCount} of ${products.length} products.`);
    checkProducts();
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products in Database: {dbProducts.length}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Stock</th>
              </tr>
            </thead>
            <tbody>
              {dbProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.category}</td>
                  <td className="px-4 py-2 border">${(product.price / 100).toFixed(2)}</td>
                  <td className="px-4 py-2 border">{product.stock}</td>
                </tr>
              ))}
              {dbProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 border text-center">
                    No products found in database
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Import Products</h2>
        <p className="mb-4">
          This will import all products from the local data into your Supabase database.
        </p>
        <button
          onClick={importProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Import {products.length} Products
        </button>
        
        {message && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded">
            {message}
          </div>
        )}
        
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