'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { createOrder } from '../../lib/api/orders';
import { supabase } from '../../lib/supabase';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();

      // Create order in Supabase
      const { success, orderId, error: orderError } = await createOrder(
        user?.id || null,
        items,
        {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        }
      );

      if (success && orderId) {
        // Clear the cart
        await clearCart();
        
        // Redirect to success page
        router.push(`/checkout/success?orderId=${orderId}`);
      } else {
        setError(orderError || 'Failed to create order. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const taxAmount = subtotal * 0.1; // 10% tax
  const shippingAmount = subtotal >= 5000 ? 0 : 500; // Free shipping over $50
  const totalAmount = subtotal + taxAmount + shippingAmount;

  return (
    <div className="bg-[#E8EDDF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-[#242423] mb-8">Checkout</h1>
        
        {error && (
          <div className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-[#E8EDDF] rounded-lg shadow-sm p-6 border border-[#CFDBD5]">
              <h2 className="text-lg font-medium text-[#242423] mb-4">Shipping Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#333533]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#333533]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-[#333533]">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#333533]">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-[#333533]">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-[#333533]">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-[#242423] mb-4">Payment Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-[#333533]">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-[#333533]">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/YY"
                          className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-[#333533]">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          className="mt-1 block w-full border border-[#CFDBD5] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#F5CB5C] focus:border-[#F5CB5C] bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F5CB5C] border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-[#242423] hover:bg-[#F5CB5C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5CB5C] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div>
            <div className="bg-[#E8EDDF] rounded-lg shadow-sm p-6 sticky top-8 border border-[#CFDBD5]">
              <h2 className="text-lg font-medium text-[#242423] mb-4">Order Summary</h2>
              <div className="divide-y divide-[#CFDBD5]">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#242423]">{item.product?.name}</p>
                      <p className="text-sm text-[#333533]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#242423]">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[#CFDBD5] pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-[#333533]">Subtotal</p>
                  <p className="text-sm font-medium text-[#242423]">{formatPrice(subtotal)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-[#333533]">Shipping</p>
                  <p className="text-sm font-medium text-[#242423]">
                    {shippingAmount === 0 ? 'Free' : formatPrice(shippingAmount)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-[#333533]">Tax (10%)</p>
                  <p className="text-sm font-medium text-[#242423]">{formatPrice(taxAmount)}</p>
                </div>
                <div className="flex justify-between pt-2">
                  <p className="text-base font-medium text-[#242423]">Total</p>
                  <p className="text-base font-medium text-[#242423]">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 