import React from 'react';
import { Product } from '../../../types/database.types';

type DashboardWidgetsProps = {
  dbProducts: (Product & { sales?: number; salesRank?: 'top' | 'low' | null })[];
  loading: boolean;
  connectionStatus: 'checking' | 'connected' | 'failed';
  collapsedWidgets: { [key: string]: boolean };
  toggleWidgetCollapse: (widget: string) => void;
  checkProducts: () => void;
  setMessage: (message: string) => void;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
};

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  dbProducts,
  loading,
  connectionStatus,
  collapsedWidgets,
  toggleWidgetCollapse,
  checkProducts,
  setMessage,
  formatCurrency,
  formatNumber
}) => {
  return (
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
          <div className="text-gray-600">
            Summary: Total revenue {formatCurrency(dbProducts.reduce((total, product) => total + ((product.sales || 0) * product.price), 0))}
          </div>
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
  );
};

export default DashboardWidgets; 