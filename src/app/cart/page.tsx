"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';

export default function CartPage() {
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace('$', '')) 
        : item.price;
      return total + (price || 0) * (item?.quantity || 1);
    }, 0);
  };

  const getSelectedItems = () => {
    return cart.filter(item => selectedItems.has(item.id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    if (selectedItems.size === 0) {
      alert('Please select items to checkout');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Get selected items from cart
      const itemsToCheckout = getSelectedItems();
      const total = calculateTotal(itemsToCheckout);
      
      // Create a new document in the selected_items subcollection
      const orderData = {
        items: itemsToCheckout,
        total: total,
        createdAt: new Date(),
        status: 'pending'
      };
      
      // Add to the user's selected_items subcollection
      const userDocRef = doc(db, 'users', user.uid);
      const selectedItemsCollectionRef = collection(userDocRef, 'selected_items');
      const docRef = await addDoc(selectedItemsCollectionRef, orderData);
      
      // Redirect to checkout page with the order ID
      router.push(`/checkout?orderId=${docRef.id}`);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#111111] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Button 
            onClick={() => router.push('/products')}
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.size === cart.length}
              onChange={() => {
                if (selectedItems.size === cart.length) {
                  setSelectedItems(new Set());
                } else {
                  setSelectedItems(new Set(cart.map(item => item.id)));
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
            <span className="ml-2 text-white">Select All</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div key={item?.id} className="bg-[#1A1A1A] p-4 rounded-lg mb-4 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleToggleSelect(item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
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
                <span>Subtotal ({selectedItems.size || cart.length} items)</span>
                <span>
                  ${(selectedItems.size > 0 
                    ? calculateTotal(getSelectedItems())
                    : calculateTotal(cart)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>
                    ${(selectedItems.size > 0 
                      ? calculateTotal(getSelectedItems())
                      : calculateTotal(cart)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white disabled:opacity-50"
              onClick={handleCheckout}
              disabled={selectedItems.size === 0 || isProcessing}
            >
              {isProcessing 
                ? 'Processing...' 
                : selectedItems.size > 0 
                  ? `Checkout Selected (${selectedItems.size} items)`
                  : 'Select items to Checkout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}