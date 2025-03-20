import { supabase } from '../supabase';
import { CartItem, Order, OrderItem } from '../../types/database.types';
import { generateId } from '../utils';

// Create a new order in Supabase
export async function createOrder(
  userId: string | null, 
  items: CartItem[], 
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Generate a unique order ID
    const orderId = generateId();
    
    // Calculate totals
    const subtotal = items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
    
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const shipping = subtotal >= 5000 ? 0 : 500; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    // Create the order in Supabase
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      user_id: userId || null,
      status: 'processing',
      subtotal,
      tax,
      shipping,
      total,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      shipping_address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}`,
      payment_intent_id: `demo_${Date.now()}`, // In a real app, this would be a Stripe Payment Intent ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return { success: false, error: orderError.message };
    }
    
    // Create order items
    const orderItems = items.map(item => ({
      id: generateId(),
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
      created_at: new Date().toISOString(),
    }));
    
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return { success: false, error: itemsError.message };
    }
    
    return { success: true, orderId };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get a single order by ID
export async function getOrderById(
  orderId: string
): Promise<{ order?: Order; items?: OrderItem[]; error?: string }> {
  try {
    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError) {
      console.error('Error fetching order:', orderError);
      return { error: orderError.message };
    }
    
    // Get the order items with product details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return { order, error: itemsError.message };
    }
    
    return { order, items: orderItems };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Get all orders for a user
export async function getUserOrders(
  userId: string
): Promise<{ orders?: Order[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user orders:', error);
      return { error: error.message };
    }
    
    return { orders: data };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 