"use client";

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
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
      </div>
    </div>
  );
}