import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import ClientLayout from "../components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Boring Coffee",
  description: "Simple, consistent, and reliable coffee for the tech community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We use ClientLayout to conditionally apply the main layout based on the route
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
