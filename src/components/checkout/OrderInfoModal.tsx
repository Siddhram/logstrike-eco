"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface OrderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderInfo: OrderInfo) => void;
}

export interface OrderInfo {
  order_type: number;
  invoice_number: string;
  pickup_location?: string;
  channel_id: number;
  order_date: string;
  payment_method: string;
  shipping_charges: number;
  giftwrap_charges: number;
  transaction_charges: number;
  total_discount: number;
  package_length: number;
  package_breadth: number;
  package_height: number;
  package_weight: number;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_email?: string;
  shipping_phone?: string;
}

export function OrderInfoModal({ isOpen, onClose, onSubmit }: OrderInfoModalProps) {
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    order_type: 1,
    invoice_number: '',
    pickup_location: '',
    channel_id: 1,
    order_date: new Date().toISOString().split('T')[0],
    payment_method: 'Prepaid',
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    package_length: 10,
    package_breadth: 10,
    package_height: 5,
    package_weight: 0.5,
    billing_customer_name: '',
    billing_last_name: '',
    billing_address: '',
    billing_city: '',
    billing_pincode: '',
    billing_state: '',
    billing_country: 'India',
    billing_email: '',
    billing_phone: '',
    shipping_is_billing: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setOrderInfo(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setOrderInfo(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setOrderInfo(prev => ({
        ...prev,
        [name]: name === 'order_type' || name === 'channel_id' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(orderInfo);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl border border-[#B146FF]/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Order Information</h2>
        
        <div className="mb-6 flex justify-between">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 mx-1 rounded ${
                i + 1 <= currentStep ? 'bg-[#B146FF]' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Basic Order Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order_type" className="block text-sm font-medium text-gray-300 mb-1">
                    Order Type*
                  </label>
                  <select
                    id="order_type"
                    name="order_type"
                    value={orderInfo.order_type}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  >
                    <option value={1}>Forward Order</option>
                    <option value={2}>Return Order</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-300 mb-1">
                    Invoice Number*
                  </label>
                  <input
                    type="text"
                    id="invoice_number"
                    name="invoice_number"
                    value={orderInfo.invoice_number}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    placeholder="Enter invoice number"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="order_date" className="block text-sm font-medium text-gray-300 mb-1">
                    Order Date*
                  </label>
                  <input
                    type="date"
                    id="order_date"
                    name="order_date"
                    value={orderInfo.order_date}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="channel_id" className="block text-sm font-medium text-gray-300 mb-1">
                    Channel ID*
                  </label>
                  <select
                    id="channel_id"
                    name="channel_id"
                    value={orderInfo.channel_id}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  >
                    <option value={1}>Website</option>
                    <option value={2}>Marketplace</option>
                    <option value={3}>Social Media</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="payment_method" className="block text-sm font-medium text-gray-300 mb-1">
                    Payment Method*
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    value={orderInfo.payment_method}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  >
                    <option value="Prepaid">Prepaid</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-300 mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    id="pickup_location"
                    name="pickup_location"
                    value={orderInfo.pickup_location}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    placeholder="Enter pickup location"
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Billing Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billing_customer_name" className="block text-sm font-medium text-gray-300 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="billing_customer_name"
                    name="billing_customer_name"
                    value={orderInfo.billing_customer_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_last_name" className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="billing_last_name"
                    name="billing_last_name"
                    value={orderInfo.billing_last_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="billing_address" className="block text-sm font-medium text-gray-300 mb-1">
                    Address*
                  </label>
                  <textarea
                    id="billing_address"
                    name="billing_address"
                    value={orderInfo.billing_address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_city" className="block text-sm font-medium text-gray-300 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="billing_city"
                    name="billing_city"
                    value={orderInfo.billing_city}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_pincode" className="block text-sm font-medium text-gray-300 mb-1">
                    Pincode*
                  </label>
                  <input
                    type="text"
                    id="billing_pincode"
                    name="billing_pincode"
                    value={orderInfo.billing_pincode}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_state" className="block text-sm font-medium text-gray-300 mb-1">
                    State*
                  </label>
                  <input
                    type="text"
                    id="billing_state"
                    name="billing_state"
                    value={orderInfo.billing_state}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_country" className="block text-sm font-medium text-gray-300 mb-1">
                    Country*
                  </label>
                  <input
                    type="text"
                    id="billing_country"
                    name="billing_country"
                    value={orderInfo.billing_country}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="billing_email"
                    name="billing_email"
                    value={orderInfo.billing_email}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    id="billing_phone"
                    name="billing_phone"
                    value={orderInfo.billing_phone}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shipping_is_billing"
                      name="shipping_is_billing"
                      checked={orderInfo.shipping_is_billing}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#B146FF]"
                    />
                    <label htmlFor="shipping_is_billing" className="ml-2 text-white">
                      Shipping address is same as billing
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              {!orderInfo.shipping_is_billing && (
                <>
                  <h3 className="text-lg font-medium text-white">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shipping_customer_name" className="block text-sm font-medium text-gray-300 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        id="shipping_customer_name"
                        name="shipping_customer_name"
                        value={orderInfo.shipping_customer_name || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_last_name" className="block text-sm font-medium text-gray-300 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        id="shipping_last_name"
                        name="shipping_last_name"
                        value={orderInfo.shipping_last_name || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-300 mb-1">
                        Address*
                      </label>
                      <textarea
                        id="shipping_address"
                        name="shipping_address"
                        value={orderInfo.shipping_address || ''}
                        onChange={handleChange}
                        rows={2}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-300 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        id="shipping_city"
                        name="shipping_city"
                        value={orderInfo.shipping_city || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_pincode" className="block text-sm font-medium text-gray-300 mb-1">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        id="shipping_pincode"
                        name="shipping_pincode"
                        value={orderInfo.shipping_pincode || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-300 mb-1">
                        State*
                      </label>
                      <input
                        type="text"
                        id="shipping_state"
                        name="shipping_state"
                        value={orderInfo.shipping_state || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-300 mb-1">
                        Country*
                      </label>
                      <input
                        type="text"
                        id="shipping_country"
                        name="shipping_country"
                        value={orderInfo.shipping_country || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="shipping_email"
                        name="shipping_email"
                        value={orderInfo.shipping_email || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone*
                      </label>
                      <input
                        type="tel"
                        id="shipping_phone"
                        name="shipping_phone"
                        value={orderInfo.shipping_phone || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                        required={!orderInfo.shipping_is_billing}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <h3 className="text-lg font-medium text-white mt-6">Package & Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shipping_charges" className="block text-sm font-medium text-gray-300 mb-1">
                    Shipping Charges
                  </label>
                  <input
                    type="number"
                    id="shipping_charges"
                    name="shipping_charges"
                    value={orderInfo.shipping_charges}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="giftwrap_charges" className="block text-sm font-medium text-gray-300 mb-1">
                    Gift Wrap Charges
                  </label>
                  <input
                    type="number"
                    id="giftwrap_charges"
                    name="giftwrap_charges"
                    value={orderInfo.giftwrap_charges}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="transaction_charges" className="block text-sm font-medium text-gray-300 mb-1">
                    Transaction Charges
                  </label>
                  <input
                    type="number"
                    id="transaction_charges"
                    name="transaction_charges"
                    value={orderInfo.transaction_charges}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="total_discount" className="block text-sm font-medium text-gray-300 mb-1">
                    Total Discount
                  </label>
                  <input
                    type="number"
                    id="total_discount"
                    name="total_discount"
                    value={orderInfo.total_discount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-3 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Package Dimensions</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label htmlFor="package_length" className="block text-xs text-gray-400 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        id="package_length"
                        name="package_length"
                        value={orderInfo.package_length}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full p-2 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="package_breadth" className="block text-xs text-gray-400 mb-1">
                        Breadth (cm)
                      </label>
                      <input
                        type="number"
                        id="package_breadth"
                        name="package_breadth"
                        value={orderInfo.package_breadth}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full p-2 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="package_height" className="block text-xs text-gray-400 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        id="package_height"
                        name="package_height"
                        value={orderInfo.package_height}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full p-2 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="package_weight" className="block text-xs text-gray-400 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="package_weight"
                        name="package_weight"
                        value={orderInfo.package_weight}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        className="w-full p-2 bg-[#111111] border border-[#B146FF]/20 rounded-md text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                onClick={prevStep}
                className="bg-transparent border border-[#B146FF]/20 text-white hover:bg-[#B146FF]/10"
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onClose}
                className="bg-transparent border border-[#B146FF]/20 text-white hover:bg-[#B146FF]/10"
              >
                Cancel
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-[#B146FF] hover:bg-[#9333EA] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#B146FF] hover:bg-[#9333EA] text-white"
              >
                Continue to Checkout
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}