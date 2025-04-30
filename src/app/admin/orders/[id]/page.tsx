"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!order) {
    return <div className="text-red-500">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#111111] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Order #{order.order_id}
            </h1>
            <p className="text-gray-400">Placed on {order.order_date}</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
              onClick={() => window.print()}
            >
              Print Invoice
            </Button>
            <Button
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              onClick={() => {/* Update status logic */}}
            >
              Update Status
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
            <h2 className="text-lg font-medium text-white mb-4">Billing Information</h2>
            <div className="space-y-2 text-gray-400">
              <p>{order.billing_customer_name} {order.billing_last_name}</p>
              <p>{order.billing_address}</p>
              <p>{order.billing_city}, {order.billing_state} {order.billing_pincode}</p>
              <p>{order.billing_country}</p>
              <p>Email: {order.billing_email}</p>
              <p>Phone: {order.billing_phone}</p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
            <h2 className="text-lg font-medium text-white mb-4">Shipping Information</h2>
            <div className="space-y-2 text-gray-400">
              {order.shipping_is_billing ? (
                <p>Same as billing address</p>
              ) : (
                <>
                  <p>{order.shipping_customer_name} {order.shipping_last_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
                  <p>{order.shipping_country}</p>
                  <p>Email: {order.shipping_email}</p>
                  <p>Phone: {order.shipping_phone}</p>
                </>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20 md:col-span-2">
            <h2 className="text-lg font-medium text-white mb-4">Order Items</h2>
            <table className="min-w-full divide-y divide-[#8B5CF6]/20">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">HSN</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B5CF6]/20">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-white">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.hsn}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 text-right">{item.units}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 text-right">${item.selling_price}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 text-right">
                      ${(item.selling_price * item.units).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
            <h2 className="text-lg font-medium text-white mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${order.sub_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>${order.shipping_charges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Gift Wrap</span>
                <span>${order.giftwrap_charges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Transaction Fee</span>
                <span>${order.transaction_charges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Discount</span>
                <span>-${order.total_discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-medium pt-2 border-t border-[#8B5CF6]/20">
                <span>Total</span>
                <span>${(
                  order.sub_total +
                  order.shipping_charges +
                  order.giftwrap_charges +
                  order.transaction_charges -
                  order.total_discount
                ).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
            <h2 className="text-lg font-medium text-white mb-4">Package Details</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-400">
              <div>
                <p className="text-sm">Dimensions</p>
                <p className="text-white">{order.length}×{order.breadth}×{order.height} cm</p>
              </div>
              <div>
                <p className="text-sm">Weight</p>
                <p className="text-white">{order.weight} kg</p>
              </div>
              <div>
                <p className="text-sm">Payment Method</p>
                <p className="text-white">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-sm">Invoice Number</p>
                <p className="text-white">{order.invoice_number}</p>
              </div>
              {order.pickup_location && (
                <div className="col-span-2">
                  <p className="text-sm">Pickup Location</p>
                  <p className="text-white">{order.pickup_location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}