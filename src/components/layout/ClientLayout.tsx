'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  // If it's the admin page, render the children directly without the Layout wrapper
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // Otherwise, wrap with the Layout component that includes Header and Footer
  return <Layout>{children}</Layout>;
} 