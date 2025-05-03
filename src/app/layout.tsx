import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import Header from '@/components/layout/Header';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Chip Store - Premium AI Hardware",
  description: "Your one-stop shop for all AI hardware needs. We provide the latest and most efficient AI chips for all your machine learning projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
