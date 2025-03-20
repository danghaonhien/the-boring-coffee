export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  
  // Optional fields
  original_price?: number; // Price before discount
  discount_percentage?: number; // Percentage discount (e.g., 15 for 15% off)
  image_gallery?: string[]; // Array of additional image URLs
  rating?: number; // Rating from 0-5
  roast_level?: number; // 0-100 where 0 is lightest, 100 is darkest
  story?: string; // Product story/origin text
  how_to?: string[]; // Steps for how to use the product
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
};

export type Order = {
  id: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  payment_intent_id?: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
};

export type DiscountCode = {
  id: string;
  code: string;
  percentage: number;
  applicable_items: 'single' | 'multiple' | 'all';
  items?: string[]; // Array of product IDs if applicable_items is 'multiple'
  active: boolean;
  created_at: string;
  expires_at?: string; // Optional expiration date
}; 