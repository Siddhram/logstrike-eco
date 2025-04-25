"use client";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

export function CartSummary({
  subtotal,
  shipping,
  tax,
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
      const amountInINR = total * 83;

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
        onCheckout(); // Call the parent's onCheckout handler
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert('Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>Subtotal</div>
          <div>{formatPrice(subtotal)}</div>
        </div>
        
        <div className="flex justify-between">
          <div>Shipping</div>
          <div>{shipping === 0 ? "Free" : formatPrice(shipping)}</div>
        </div>
        
        <div className="flex justify-between">
          <div>Tax</div>
          <div>{formatPrice(tax)}</div>
        </div>
        
        <div className="border-t pt-4 flex justify-between font-medium text-lg">
          <div>Total</div>
          <div>{formatPrice(total)}</div>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <Button className="w-full py-6" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}