import { supabase } from '../supabase';
import { CartItem, Product } from '../../types/database.types';

export async function fetchCartItems(userId: string): Promise<CartItem[]> {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        user_id,
        product_id,
        quantity,
        created_at,
        products:product_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Format the data to match our CartItem type
    const formattedItems: CartItem[] = data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      product: item.products as unknown as Product,
    }));

    return formattedItems;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

export async function addCartItem(userId: string, productId: string, quantity: number): Promise<boolean> {
  try {
    // Check if item already exists in cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (existingItems && existingItems.length > 0) {
      // Update existing item
      const existingItem = existingItems[0];
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Add new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
        });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return false;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return false;
  }
}

export async function removeCartItem(itemId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return false;
  }
}

export async function clearCart(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
} 