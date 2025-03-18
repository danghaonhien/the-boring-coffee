'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage, since cart is now a modal
    router.push('/');
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
} 