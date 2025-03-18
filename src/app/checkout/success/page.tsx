import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[#E8EDDF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#E8EDDF] rounded-lg shadow-sm p-8 text-center border border-[#CFDBD5]">
          <div className="flex justify-center mb-4">
            <FiCheckCircle className="h-16 w-16 text-[#F5CB5C]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#242423] mb-4">Order Successful!</h1>
          <p className="text-lg text-[#333533] mb-8">
            Thank you for your purchase. We&apos;ve received your order and will process it right away.
          </p>
          <p className="text-[#333533] mb-8">
            A confirmation email has been sent to your email address.
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