"use client";

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartIcon() {
  const { cart = [] } = useCart();
  
  const itemCount = Array.isArray(cart) ? cart.reduce((total, item) => total + (item?.quantity || 1), 0) : 0;

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-[#8B5CF6] text-white text-xs font-bold rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
}