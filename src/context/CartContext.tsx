'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types/database.types';
import { generateId } from '../lib/utils';
import { supabase } from '../lib/supabase';
import * as cartApi from '../lib/api/cart';

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for authenticated user on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      // If user logs in, fetch their cart
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserCart(session.user.id);
      }
      
      // If user logs out, just use local storage
      if (event === 'SIGNED_OUT') {
        loadCartFromLocalStorage();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load cart from localStorage
  const loadCartFromLocalStorage = () => {
    if (typeof window === 'undefined') return;
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  };

  // Save cart to localStorage
  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  // Fetch cart items from Supabase for authenticated users
  const fetchUserCart = async (userId: string) => {
    setIsLoading(true);
    try {
      const cartItems = await cartApi.fetchCartItems(userId);
      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      loadCartFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart from localStorage on initial render if not authenticated
  useEffect(() => {
    if (!user && typeof window !== 'undefined' && !isLoading) {
      loadCartFromLocalStorage();
    }
  }, [user, isLoading]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!user && typeof window !== 'undefined' && !isLoading) {
      saveCartToLocalStorage(items);
    }
  }, [items, user, isLoading]);
  
  // Add item to cart
  const addItem = async (product: Product, quantity: number) => {
    // Validate that quantity is a positive number
    const validQuantity = Math.max(1, quantity);
    
    // Use a unique transaction ID for logging
    const transactionId = generateId();
    console.log(`[${transactionId}] Adding ${validQuantity} of ${product.name} to cart`);
    
    if (user) {
      // For authenticated users, save to Supabase
      const success = await cartApi.addCartItem(user.id, product.id, validQuantity);
      
      if (success) {
        // Fetch updated cart to ensure UI is in sync with database
        await fetchUserCart(user.id);
      } else {
        // Fallback to local state update if API call fails
        updateLocalCart(product, validQuantity);
      }
    } else {
      // For guest users, update local state
      updateLocalCart(product, validQuantity);
    }
  };

  // Helper function to update local cart state
  const updateLocalCart = (product: Product, validQuantity: number) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product_id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update the existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + validQuantity,
        };
        
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          id: generateId(),
          user_id: user?.id || '',
          product_id: product.id,
          quantity: validQuantity,
          created_at: new Date().toISOString(),
          product,
        };
        
        return [...prevItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeItem = async (id: string) => {
    if (user) {
      const success = await cartApi.removeCartItem(id);
      
      if (success) {
        await fetchUserCart(user.id);
      } else {
        // Fallback to local state update
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
    } else {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    if (user) {
      const success = await cartApi.updateCartItemQuantity(id, quantity);
      
      if (success) {
        await fetchUserCart(user.id);
      } else {
        // Fallback to local state update
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (user) {
      const success = await cartApi.clearCart(user.id);
      
      if (success) {
        setItems([]);
      } else {
        // Fallback to local state update
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
} 