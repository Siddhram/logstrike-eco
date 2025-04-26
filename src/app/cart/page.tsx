"use client";

import { useCart } from "@/context/CartContext";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const stripePromise = loadStripe("pk_test_51QEukkLBvhDT0PxxvAhPvkdUr3qJB8EE2JKBJvHnooYtysH018lh8I89iAYcUgdC3RCY5L6wPGjAGTGjBBFDAffc00RGdRDs5d");

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 49.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-[#111111] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-8">
            Your Shopping Cart
          </h1>
          <CartContent cartItems={cartItems} clearCart={clearCart} total={total} />
        </div>
      </div>
    </Elements>
  );
}

function CartContent({ cartItems, clearCart, total }) {
  const elements = useElements();
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const { updateQuantity, removeFromCart } = useCart();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const amountInINR = total * 83;
      const response = await fetch("http://localhost:3001/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInINR }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      if (!stripe || !elements) {
        throw new Error("Stripe.js has not yet loaded.");
      }

      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        clearCart();
        window.location.href = "/order-success";
      }
    } catch (error) {
      alert(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#8B5CF6]/20 p-6">
          {cartItems.length > 0 ? (
            <ul className="divide-y divide-[#8B5CF6]/20">
              {cartItems.map((item) => (
                <li key={item.id} className="py-6">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded-lg border border-[#8B5CF6]/20"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-[#8B5CF6] font-medium">{formatPrice(item.price)}</p>
                      <div className="flex items-center mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="px-4 text-white">{item.quantity}</span>
                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-auto text-red-600 hover:text-red-800"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-white">Your cart is empty.</p>
          )}
        </div>
        <div className="flex justify-between">
          <Link href="/products">
            <Button variant="outline" className="text-white border-[#8B5CF6] hover:bg-[#8B5CF6]/10">
              Continue Shopping
            </Button>
          </Link>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>
      <div>
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#8B5CF6]/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-white">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Shipping</span>
              <span>{total > 0 ? formatPrice(49.99) : "Free"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Tax</span>
              <span>{formatPrice(total * 0.08)}</span>
            </div>
            <div className="border-t border-[#8B5CF6]/20 pt-4 flex justify-between text-white">
              <span>Total</span>
              <span>{formatPrice(total + 49.99 + total * 0.08)}</span>
            </div>
          </div>
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: "white" },
                invalid: { color: "#9e2146" },
              },
            }}
            className="mt-6"
          />
          <Button
            className="w-full py-3 mt-6 bg-[#8B5CF6] text-white"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}