"use client";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface CartSummaryProps {
  subtotal: string;
  tax: string;
  shipping: string;
  giftwrap: string;
  total: string;
  onCheckout?: () => void;
}

export function CartSummary({
  subtotal,
  tax,
  shipping,
  giftwrap,
  total,
  onCheckout
}: CartSummaryProps) {
  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#B146FF]/20">
      <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Tax</span>
          <span>${tax}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Shipping</span>
          <span>${shipping}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Gift Wrap</span>
          <span>${giftwrap}</span>
        </div>
        <div className="border-t border-[#B146FF]/20 pt-3">
          <div className="flex justify-between font-bold text-white">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      {onCheckout && (
        <div className="mt-6">
          <Button 
            className="w-full bg-[#B146FF] hover:bg-[#9333EA] text-white" 
            onClick={onCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}