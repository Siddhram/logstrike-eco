"use client";

import { useCart, CartItem } from '@/context/CartContext';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from '@/components/ui/Button';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
const stripePromise = loadStripe('pk_test_51QEukkLBvhDT0PxxvAhPvkdUr3qJB8EE2JKBJvHnooYtysH018lh8I89iAYcUgdC3RCY5L6wPGjAGTGjBBFDAffc00RGdRDs5d');

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Calculate total amount
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 49.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <Elements stripe={stripePromise}>
      <CartContent 
        cartItems={cartItems}
        clearCart={clearCart}
        total={total}
      />
    </Elements>
  );
}

const CartContent = ({
  cartItems,
  clearCart,
  total
}: {
  cartItems: CartItem[],
  clearCart: () => void,
  total: number
}) => {
  const elements = useElements();
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const { updateQuantity, removeFromCart } = useCart();

  // Add this helper function
  const handleQuantityUpdate = (item: CartItem, newQuantity: number) => {
    updateQuantity(item.id, newQuantity, item.category)
      .catch(error => {
        console.error('Error updating quantity:', error);
        alert(error.message);
      });
  };

  const handlePayment = async () => {
    setLoading(true);
    
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
      if (!stripe || !elements) {
        throw new Error('Stripe.js has not yet loaded.');
      }
  
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
  
      if (result.error) {
        throw new Error(result.error.message);
      }
  
      if (result.paymentIntent.status === "succeeded") {
        // Update product quantities in Firebase
        await Promise.all(cartItems.map(async (item) => {
          const productRef = doc(db, `categories/${item.category}/products`, item.id);
          await updateDoc(productRef, {
            stock: increment(-item.quantity)
          });
        }));
  
        clearCart();
        window.location.href = '/order-success';
      }
    } catch (error) {
      alert('Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-6">
                    <div className="flex items-center">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-black">
                            <h3>{item.name}</h3>
                            <p className="ml-4">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <p className="text-black">Qty</p>
                            <div className="flex items-center border rounded-md">
                              <button
                                className="px-2 py-1 text-black hover:text-gray-800"
                                onClick={() => handleQuantityUpdate(item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-2 py-1">{item.quantity}</span>
                              <button
                                className="px-2 py-1 text-black hover:text-gray-800"
                                onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="font-medium text-black hover:text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-between">
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>Subtotal</div>
                <div>{formatPrice(total)}</div>
              </div>
              
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{total > 0 ? formatPrice(49.99) : "Free"}</div>
              </div>
              
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatPrice(total * 0.08)}</div>
              </div>
              
              <div className="border-t pt-4 flex justify-between font-medium text-lg text-black">
                <div>Total</div>
                <div>{formatPrice(total + 49.99 + (total * 0.08))}</div>
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
              <Button 
                className="w-full py-6" 
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
