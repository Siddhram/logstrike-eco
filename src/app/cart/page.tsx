"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCart } from '@/context/CartContext';
import { auth } from '@/lib/firebase';
import { Loader } from "@/components/ui/Loader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const router = useRouter();
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [billDetails, setBillDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const calculateBill = async () => {
    try {
      const selectedProducts = getSelectedItems();
      const cartItems = selectedProducts.map(item => ({
        name: item.name,
        unitPrice: parseFloat(item.price.toString()),
        quantity: item.quantity || 1
      }));
  
      const response = await fetch('YOUR_CLOUD_FUNCTION_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems,
          shippingCharge: 0,
          giftwrapCharge: 0
        })
      });
  
      const data = await response.json();
      setBillDetails(data);
    } catch (error) {
      console.error('Error calculating bill:', error);
    }
  };

  // Add this effect to recalculate when selected items change
  useEffect(() => {
    if (selectedItems.size > 0) {
      calculateBill();
    } else {
      setBillDetails(null);
    }
  }, [selectedItems, cart]);

  useEffect(() => {
    if (cart.length > 0) {
      calculateBill();
    }
  }, [cart]);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setIsProcessing(true);
      const selectedProducts = getSelectedItems();
      
      if (selectedProducts.length === 0) {
        alert('Please select items to checkout');
        return;
      }

      // Create order in your database
      const orderData = {
        userId: user.uid,
        items: selectedProducts,
        total: billDetails?.total || 0,
        status: 'pending'
      };

      router.push('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSelectedItems = () => {
    return cart.filter(item => selectedItems.has(item.id));
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-white">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/product')}
              className="bg-[#B146FF] hover:bg-[#9333EA] text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#111111] p-4 rounded-xl border border-[#B146FF]/20"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-400"
                    />
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-[#1a1a1a] border border-[#B146FF]/20 rounded text-white"
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Elements stripe={stripePromise}>
                <CartSummary
                  subtotal={billDetails?.subtotal || "0.00"}
                  tax={billDetails?.tax || "0.00"}
                  shipping={billDetails?.shipping || "0.00"}
                  giftwrap={billDetails?.giftwrap || "0.00"}
                  total={billDetails?.total || "0.00"}
                  onCheckout={handleCheckout}
                />
              </Elements>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }
}