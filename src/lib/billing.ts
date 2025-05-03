import { getFunctions, httpsCallable } from 'firebase/functions';

export async function calculateOrderTotal(items: any[], shippingAddress: any) {
  try {
    const functions = getFunctions();
    const calculateBillingFunction = httpsCallable(functions, 'calculateBilling');
    
    const result = await calculateBillingFunction({
      items,
      shippingAddress
    });

    return result.data;
  } catch (error) {
    console.error('Error calculating total:', error);
    throw error;
  }
}