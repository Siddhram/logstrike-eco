"use client";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    if (!stripe || !elements) {
      console.error("Stripe.js has not yet loaded.");
      return;
    }

    try {
      // Convert total to INR (assuming 1 USD = 83 INR)
      const amountInINR = parseFloat(total) * 83;

      // Send payment request to backend
      const response = await fetch("http://localhost:3001/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInINR }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'http://localhost:3000/order-success',
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert('Payment failed: ' + result.error.message);
      } else {
        onCheckout?.(); // Call the parent's onCheckout handler if provided
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert('Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

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
        <div className="mt-6 space-y-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#666666',
                  },
                },
                invalid: {
                  color: '#ff4444',
                },
              },
            }}
          />
          <Button 
            className="w-full bg-[#B146FF] hover:bg-[#9333EA] text-white" 
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}