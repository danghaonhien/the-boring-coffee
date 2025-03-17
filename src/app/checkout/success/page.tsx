import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and will process it right away.
        </p>
        <p className="text-gray-500 mb-8">
          A confirmation email has been sent to your email address.
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 