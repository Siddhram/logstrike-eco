"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: any;
  status: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          router.push('/auth/login?redirect=/checkout');
          return;
        }
        
        if (!orderId) {
          setError('No order ID provided');
          return;
        }
        
        // Fetch the order from the user's selected_items subcollection
        const userDocRef = doc(db, 'users', user.uid);
        const orderDocRef = doc(collection(userDocRef, 'selected_items'), orderId);
        const orderDoc = await getDoc(orderDocRef);
        
        if (orderDoc.exists()) {
          setOrder({
            id: orderDoc.id,
            ...orderDoc.data()
          } as Order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, router]);

  const handleCompleteOrder = async () => {
    // Implementation for completing the order
    // This would update the order status and redirect to a success page
    alert('Order placed successfully!');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#111111] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || 'No order found'}
          </h2>
          <Button 
            onClick={() => router.push('/cart')}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          >
            Return to Cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111111] to-[#1A1A1A] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-purple-500 pb-4 inline-block">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Billing & Shipping Details */}
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                Customer Information
              </h2>
              
              {/* Billing Information */}
              <div className="mb-6">
                <h4 className="text-[#8B5CF6] text-sm font-medium mb-3 border-b border-gray-700 pb-2">Billing Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-xs mb-1">Address</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="Street Address"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">City</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">State</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="State/Province"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="Postal/ZIP Code"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Country</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipping Same as Billing Toggle */}
              <div className="flex items-center mb-4 p-3 bg-[#252525] rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  id="shipping_is_billing"
                  className="h-4 w-4 text-[#8B5CF6] rounded focus:ring-purple-500"
                  defaultChecked={true}
                />
                <label htmlFor="shipping_is_billing" className="ml-2 text-white text-sm">
                  Shipping address same as billing
                </label>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#252525] p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="hidden"
                  />
                  <label htmlFor="credit_card" className="flex flex-col items-center cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${paymentMethod === 'credit_card' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">Credit Card</span>
                  </label>
                </div>
                
                <div className="bg-[#252525] p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="hidden"
                  />
                  <label htmlFor="paypal" className="flex flex-col items-center cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${paymentMethod === 'paypal' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">PayPal</span>
                  </label>
                </div>
                
                <div className="bg-[#252525] p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="hidden"
                  />
                  <label htmlFor="cash" className="flex flex-col items-center cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${paymentMethod === 'cash' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Shipping Details */}
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                Shipping Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Shipping Charges</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="0.00"
                    defaultValue="0.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Giftwrap Charges</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#252525] text-white p-3 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="0.00"
                    defaultValue="0.00"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-[#252525] rounded-lg border border-gray-700">
                <h3 className="text-white text-sm font-medium mb-3">Package Dimensions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Length (cm)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#333] text-white p-2 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="0"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Breadth (cm)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#333] text-white p-2 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="0"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Height (cm)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#333] text-white p-2 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="0"
                      defaultValue="10"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#333] text-white p-2 rounded-lg text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      placeholder="0"
                      defaultValue="0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-gray-800 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-gray-700">Order Summary</h2>
              
              {/* Order Information */}
              <div className="mb-4 p-4 bg-[#252525] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Order ID:</span>
                  <span className="text-white text-sm font-medium">{order.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Order Date:</span>
                  <span className="text-white text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Items ({order.items.length})</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {order.items.map((item) => {
                    const quantity = item.quantity || 1;
                    const itemTotal = item.price * quantity;
                    
                    return (
                      <div key={item.id} className="flex gap-3 p-3 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] transition">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-medium">{item.name}</h4>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-400 text-xs">Qty: {quantity}</span>
                            <span className="text-white text-sm">${item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-400 text-xs">Subtotal:</span>
                            <span className="text-purple-400 text-sm font-medium">${itemTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Price Summary */}
              <div className="bg-[#252525] p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${calculateOrderTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${(calculateOrderTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-purple-400 font-bold text-xl">
                    ${(calculateOrderTotal() + calculateOrderTotal() * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Free shipping on all orders</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Secure payment processing</span>
                </div>
              </div>
              
              {/* Complete Order Button */}
              <Button 
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white py-4 rounded-lg font-medium text-lg shadow-lg disabled:opacity-50 transition-all duration-300"
                onClick={handleCompleteOrder}
                disabled={isProcessing || !shippingAddress}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Complete Order'
                )}
              </Button>
              
              <p className="text-gray-400 text-xs text-center mt-4">
                By completing your purchase, you agree to our <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Add this helper function to calculate the total
  function calculateOrderTotal() {
    if (!order || !order.items) return 0;
    
    return order.items.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + (item.price * quantity);
    }, 0);
  }
}