import React from 'react';

type SidebarProps = {
  activeTab: 'home' | 'products' | 'orders';
  setActiveTab: (tab: 'home' | 'products' | 'orders') => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4 font-bold text-lg">Dashboard</div>
      <button 
        onClick={() => setActiveTab('home')} 
        className={`p-4 text-left ${activeTab === 'home' ? 'bg-gray-700' : ''}`}
      >
        Home
      </button>
      <button 
        onClick={() => setActiveTab('products')} 
        className={`p-4 text-left ${activeTab === 'products' ? 'bg-gray-700' : ''}`}
      >
        Products
      </button>
      <button 
        onClick={() => setActiveTab('orders')} 
        className={`p-4 text-left ${activeTab === 'orders' ? 'bg-gray-700' : ''}`}
      >
        Orders
      </button>
    </div>
  );
};

export default Sidebar; 