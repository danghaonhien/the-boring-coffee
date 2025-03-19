export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_gallery?: string[]; // Array of additional image URLs
  stock: number;
  category: string;
  rating?: number; // Rating from 0-5
  roastLevel?: number; // 0-100 where 0 is lightest, 100 is darkest
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
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
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