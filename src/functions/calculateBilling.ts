import * as functions from 'firebase-functions';
import { db } from '../lib/firebase';

interface OrderItem {
  price: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export const calculateBilling = functions.https.onCall(async (data, context) => {
  try {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    const { items, shippingAddress } = data;
    
    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: OrderItem) => {
      return acc + (item.price * item.quantity);
    }, 0);

    // Calculate tax (assuming 8% tax rate)
    const taxRate = 0.08;
    const tax = subtotal * taxRate;

    // Calculate shipping
    // Free shipping for orders over $50, otherwise $10
    const shipping = subtotal > 50 ? 0 : 10;

    // Calculate total
    const total = subtotal + tax + shipping;

    // Create order object
    const order: Order = {
      items,
      subtotal,
      tax,
      shipping,
      total
    };

    // Save order to database
    await db.collection('orders').add({
      ...order,
      userId: context.auth.uid,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress
    });

    return {
      success: true,
      order: {
        ...order,
        formattedSubtotal: `$${subtotal.toFixed(2)}`,
        formattedTax: `$${tax.toFixed(2)}`,
        formattedShipping: `$${shipping.toFixed(2)}`,
        formattedTotal: `$${total.toFixed(2)}`
      }
    };

  } catch (error) {
    console.error('Error calculating billing:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to calculate billing'
    );
  }
});