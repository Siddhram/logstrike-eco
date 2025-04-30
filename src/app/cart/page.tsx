"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const calculateTotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#111111] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Button 
            onClick={() => router.push('/shop')}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div key={item?.id} className="bg-[#1A1A1A] p-4 rounded-lg mb-4 flex items-center gap-4">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item?.name}</h3>
                  <p className="text-[#8B5CF6]">${(item?.price || 0).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => item?.id && updateQuantity(item.id, Math.max(1, (item?.quantity || 1) - 1))}
                      className="text-white bg-[#333] px-2 rounded"
                    >
                      -
                    </button>
                    <span className="text-white">{item?.quantity || 1}</span>
                    <button
                      onClick={() => item?.id && updateQuantity(item.id, (item?.quantity || 1) + 1)}
                      className="text-white bg-[#333] px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => item?.id && removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-[#1A1A1A] p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}