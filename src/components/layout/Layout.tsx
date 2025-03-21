'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import NewsletterModal from './NewsletterModal';
import ScrollToTopButton from './ScrollToTopButton';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <PromoBanner />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <NewsletterModal />
      <ScrollToTopButton />
    </div>
  );
} 