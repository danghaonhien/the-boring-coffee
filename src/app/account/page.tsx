'use client';

import { useState } from 'react';
import { FiUser, FiPackage, FiHeart, FiSettings } from 'react-icons/fi';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would authenticate with Supabase here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // In a real app, you would sign out with Supabase here
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center mb-6">
            <FiUser className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign In</h1>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
                onClick={() => {
                  // In a real app, you would redirect to a sign-up page
                  alert('Sign up functionality would be implemented here');
                }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">John Doe</h2>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
              </div>
            </div>
            <nav className="divide-y divide-gray-200">
              <button
                type="button"
                className={`w-full text-left px-6 py-4 flex items-center ${
                  activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser className="h-5 w-5 mr-3" />
                Profile
              </button>
              <button
                type="button"
                className={`w-full text-left px-6 py-4 flex items-center ${
                  activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <FiPackage className="h-5 w-5 mr-3" />
                Orders
              </button>
              <button
                type="button"
                className={`w-full text-left px-6 py-4 flex items-center ${
                  activeTab === 'favorites' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                <FiHeart className="h-5 w-5 mr-3" />
                Favorites
              </button>
              <button
                type="button"
                className={`w-full text-left px-6 py-4 flex items-center ${
                  activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <FiSettings className="h-5 w-5 mr-3" />
                Settings
              </button>
              <button
                type="button"
                className="w-full text-left px-6 py-4 flex items-center text-gray-700"
                onClick={handleLogout}
              >
                <svg
                  className="h-5 w-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </nav>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Profile Information</h2>
                <p className="text-gray-500 mb-6">
                  Update your account information and manage your preferences.
                </p>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        defaultValue="John"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        defaultValue="Doe"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue="john.doe@example.com"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      className="bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Order History</h2>
                <p className="text-gray-500 mb-6">
                  View and track your recent orders.
                </p>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="p-4 text-center text-gray-500">
                    You haven't placed any orders yet.
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Favorites</h2>
                <p className="text-gray-500 mb-6">
                  Products you've saved for later.
                </p>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="p-4 text-center text-gray-500">
                    You haven't saved any products yet.
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Account Settings</h2>
                <p className="text-gray-500 mb-6">
                  Manage your account settings and preferences.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Password</h3>
                    <button
                      type="button"
                      className="bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Change Password
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
                    <div className="flex items-center">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                        Receive email notifications about new products and promotions
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 