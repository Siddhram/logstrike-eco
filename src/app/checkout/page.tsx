"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { OrderInfo } from '@/components/checkout/OrderInfoModal';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutData {
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  orderInfo?: OrderInfo;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          router.push('/login?redirect=/checkout');
          return;
        }
        
        // Get checkout data from localStorage
        const storedData = localStorage.getItem('checkoutItems');
        if (!storedData) {
          setError('No items selected for checkout');
          return;
        }
        
        const parsedData = JSON.parse(storedData);
        setCheckoutData(parsedData);
      } catch (err) {
        console.error('Error loading checkout data:', err);
        setError('Failed to load checkout details');
      } finally {
        setLoading(false);
      }
    };
    
    loadCheckoutData();
  }, [router]);

  const handleCompleteOrder = async () => {
    if (!checkoutData || !shippingAddress) {
      alert('Please fill in shipping address');
      return;
    }

    try {
      setIsProcessing(true);
      const user = auth.currentUser;
      
      if (!user) {
        router.push('/login?redirect=/checkout');
        return;
      }
      
      // Create order in Firestore
      const orderData = {
        userId: user.uid,
        items: checkoutData.items,
        total: checkoutData.total,
        subtotal: checkoutData.subtotal,
        tax: checkoutData.tax,
        shipping: checkoutData.shipping,
        shippingAddress,
        paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
        
        // Add order info fields
        order_type: checkoutData.orderInfo?.order_type || 1,
        invoice_number: checkoutData.orderInfo?.invoice_number || '',
        pickup_location: checkoutData.orderInfo?.pickup_location || '',
        channel_id: checkoutData.orderInfo?.channel_id || 1,
        order_date: checkoutData.orderInfo?.order_date || new Date().toISOString().split('T')[0],
        payment_method: checkoutData.orderInfo?.payment_method || 'Prepaid',
        
        // Billing information
        billing_customer_name: checkoutData.orderInfo?.billing_customer_name || '',
        billing_last_name: checkoutData.orderInfo?.billing_last_name || '',
        billing_address: checkoutData.orderInfo?.billing_address || '',
        billing_city: checkoutData.orderInfo?.billing_city || '',
        billing_pincode: checkoutData.orderInfo?.billing_pincode || '',
        billing_state: checkoutData.orderInfo?.billing_state || '',
        billing_country: checkoutData.orderInfo?.billing_country || '',
        billing_email: checkoutData.orderInfo?.billing_email || '',
        billing_phone: checkoutData.orderInfo?.billing_phone || '',
        
        // Shipping information (if different from billing)
        shipping_is_billing: checkoutData.orderInfo?.shipping_is_billing || true,
        shipping_customer_name: checkoutData.orderInfo?.shipping_customer_name || '',
        shipping_last_name: checkoutData.orderInfo?.shipping_last_name || '',
        shipping_address: checkoutData.orderInfo?.shipping_address || '',
        shipping_city: checkoutData.orderInfo?.shipping_city || '',
        shipping_pincode: checkoutData.orderInfo?.shipping_pincode || '',
        shipping_state: checkoutData.orderInfo?.shipping_state || '',
        shipping_country: checkoutData.orderInfo?.shipping_country || '',
        shipping_email: checkoutData.orderInfo?.shipping_email || '',
        shipping_phone: checkoutData.orderInfo?.shipping_phone || '',
        
        // Package and charges
        shipping_charges: checkoutData.orderInfo?.shipping_charges || 0,
        giftwrap_charges: checkoutData.orderInfo?.giftwrap_charges || 0,
        transaction_charges: checkoutData.orderInfo?.transaction_charges || 0,
        total_discount: checkoutData.orderInfo?.total_discount || 0,
        package_length: checkoutData.orderInfo?.package_length || 10,
        package_breadth: checkoutData.orderInfo?.package_breadth || 10,
        package_height: checkoutData.orderInfo?.package_height || 5,
        package_weight: checkoutData.orderInfo?.package_weight || 0.5,
      };
      
      // Add to orders collection
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);
      
      // Clear checkout data
      localStorage.removeItem('checkoutItems');
      
      alert('Order placed successfully!');
      router.push('/');
    } catch (err) {
      console.error('Error completing order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111111] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push('/cart')}>Return to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#B146FF]/20">
              <h2 className="text-xl font-semibold mb-4 text-white">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    placeholder="Enter your full shipping address"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#B146FF]/20">
              <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="credit_card"
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="h-4 w-4 text-[#B146FF]"
                  />
                  <label htmlFor="credit_card" className="ml-2 text-white">
                    Credit Card
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="paypal"
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="h-4 w-4 text-[#B146FF]"
                  />
                  <label htmlFor="paypal" className="ml-2 text-white">
                    PayPal
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#B146FF]/20">
              <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {checkoutData?.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.name} x {item.quantity || 1}
                    </span>
                    <span className="text-white">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Order Info */}
              {checkoutData?.orderInfo && (
                <div className="space-y-2 border-t border-[#B146FF]/20 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-white">Order Information</h3>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Order Type: {checkoutData.orderInfo.order_type === 1 ? 'Forward' : 'Return'}</p>
                    <p>Invoice: {checkoutData.orderInfo.invoice_number}</p>
                    <p>Order Date: {checkoutData.orderInfo.order_date}</p>
                    <p>Payment: {checkoutData.orderInfo.payment_method}</p>
                    
                    <div className="mt-2">
                      <p className="text-white text-xs mb-1">Billing Address:</p>
                      <p>{checkoutData.orderInfo.billing_customer_name} {checkoutData.orderInfo.billing_last_name}</p>
                      <p>{checkoutData.orderInfo.billing_address}</p>
                      <p>{checkoutData.orderInfo.billing_city}, {checkoutData.orderInfo.billing_state} {checkoutData.orderInfo.billing_pincode}</p>
                      <p>{checkoutData.orderInfo.billing_country}</p>
                      <p>Email: {checkoutData.orderInfo.billing_email}</p>
                      <p>Phone: {checkoutData.orderInfo.billing_phone}</p>
                    </div>
                    
                    {!checkoutData.orderInfo.shipping_is_billing && checkoutData.orderInfo.shipping_address && (
                      <div className="mt-2">
                        <p className="text-white text-xs mb-1">Shipping Address:</p>
                        <p>{checkoutData.orderInfo.shipping_customer_name} {checkoutData.orderInfo.shipping_last_name}</p>
                        <p>{checkoutData.orderInfo.shipping_address}</p>
                        <p>{checkoutData.orderInfo.shipping_city}, {checkoutData.orderInfo.shipping_state} {checkoutData.orderInfo.shipping_pincode}</p>
                        <p>{checkoutData.orderInfo.shipping_country}</p>
                        <p>Email: {checkoutData.orderInfo.shipping_email}</p>
                        <p>Phone: {checkoutData.orderInfo.shipping_phone}</p>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <p className="text-white text-xs mb-1">Package Details:</p>
                      <p>Dimensions: {checkoutData.orderInfo.package_length}cm × {checkoutData.orderInfo.package_breadth}cm × {checkoutData.orderInfo.package_height}cm</p>
                      <p>Weight: {checkoutData.orderInfo.package_weight}kg</p>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-white text-xs mb-1">Additional Charges:</p>
                      <p>Shipping: ${checkoutData.orderInfo.shipping_charges.toFixed(2)}</p>
                      <p>Gift Wrap: ${checkoutData.orderInfo.giftwrap_charges.toFixed(2)}</p>
                      <p>Transaction: ${checkoutData.orderInfo.transaction_charges.toFixed(2)}</p>
                      <p>Discount: ${checkoutData.orderInfo.total_discount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Order Totals */}
              <div className="space-y-2 border-t border-[#B146FF]/20 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${checkoutData?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Tax</span>
                  <span className="text-white">${checkoutData?.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white">${checkoutData?.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-[#B146FF]/20">
                  <span className="text-white">Total</span>
                  <span className="text-white">${checkoutData?.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <div className="mt-6">
                <Button
                  className="w-full bg-[#B146FF] hover:bg-[#9333EA] text-white"
                  onClick={handleCompleteOrder}
                  disabled={isProcessing || !shippingAddress}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}