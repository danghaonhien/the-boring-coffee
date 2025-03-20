'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import { formatPrice } from '../../../lib/utils';
import { getOrderById } from '../../../lib/api/orders';
import { Order, OrderItem } from '../../../types/database.types';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const { order, items, error: orderError } = await getOrderById(orderId);
        
        if (orderError || !order) {
          setError(orderError || 'Failed to load order details');
        } else {
          setOrder(order);
          setOrderItems(items || []);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#E8EDDF] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#242423]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#E8EDDF] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[#E8EDDF] rounded-lg shadow-sm p-8 text-center border border-[#CFDBD5]">
            <h1 className="text-3xl font-extrabold text-[#242423] mb-4">Order Error</h1>
            <p className="text-lg text-[#333533] mb-8">
              {error || 'Unable to find your order. Please contact support.'}
            </p>
            <Link
              href="/"
              className="inline-block bg-[#F5CB5C] border border-transparent rounded-md py-3 px-8 font-medium text-[#242423] hover:bg-[#F5CB5C]/90"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E8EDDF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#E8EDDF] rounded-lg shadow-sm p-8 border border-[#CFDBD5]">
          <div className="flex flex-col items-center mb-8 text-center">
            <FiCheckCircle className="h-16 w-16 text-[#F5CB5C] mb-4" />
            <h1 className="text-3xl font-extrabold text-[#242423] mb-4">Order Confirmed!</h1>
            <p className="text-lg text-[#333533]">
              Thank you for your purchase. We&apos;ve received your order and will process it right away.
            </p>
            <p className="text-[#333533] mt-2">
              A confirmation email has been sent to {order.customer_email}.
            </p>
          </div>

          <div className="border-t border-[#CFDBD5] pt-8 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#242423]">Order Details</h2>
              <span className="text-sm bg-[#F5CB5C] px-3 py-1 rounded-full">
                {order.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-[#242423] mb-2">Order Summary</h3>
                <p className="text-sm text-[#333533] mb-1">Order ID: {order.id}</p>
                <p className="text-sm text-[#333533] mb-1">
                  Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-[#333533]">
                  Payment: Completed
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-[#242423] mb-2">Shipping Information</h3>
                <p className="text-sm text-[#333533] mb-1">Name: {order.customer_name}</p>
                <p className="text-sm text-[#333533] mb-1">Email: {order.customer_email}</p>
                <p className="text-sm text-[#333533]">Address: {order.shipping_address}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-[#242423] mb-4">Order Items</h3>
              <div className="bg-white rounded-lg overflow-hidden border border-[#CFDBD5]">
                <div className="divide-y divide-[#CFDBD5]">
                  {orderItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 bg-[#CFDBD5] rounded-md overflow-hidden mr-4">
                        {item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-[#CFDBD5]">
                            <FiPackage className="h-8 w-8 text-[#333533]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[#242423]">
                          {item.product?.name || 'Product'}
                        </h4>
                        <p className="text-xs text-[#333533]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#242423]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-[#F5f6F6] p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#333533]">Subtotal</p>
                    <p className="font-medium text-[#242423]">{formatPrice(order.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#333533]">Shipping</p>
                    <p className="font-medium text-[#242423]">
                      {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#333533]">Tax</p>
                    <p className="font-medium text-[#242423]">{formatPrice(order.tax)}</p>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t border-[#CFDBD5]">
                    <p className="font-medium text-[#242423]">Total</p>
                    <p className="font-medium text-[#242423]">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-block bg-[#F5CB5C] border border-transparent rounded-md py-3 px-8 font-medium text-[#242423] hover:bg-[#F5CB5C]/90"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 