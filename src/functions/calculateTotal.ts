import * as functions from 'firebase-functions';

interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  taxRate: number;
}

interface BillResponse {
  totalAmount: number;
  totalTax: number;
  grandTotal: number;
}

export const calculateTotal = functions.https.onRequest((req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const cart: CartItem[] = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: 'Cart should be an array of products' });
    }

    let totalAmount = 0;
    let totalTax = 0;

    for (const item of cart) {
      // Validate item structure
      if (!item.unitPrice || !item.quantity || typeof item.taxRate !== 'number') {
        return res.status(400).json({ 
          error: `Invalid item format for product: ${item.name || 'Unknown'}`
        });
      }

      // Calculate item subtotal and tax
      const subtotal = item.unitPrice * item.quantity;
      const itemTax = subtotal * (item.taxRate / 100);

      totalAmount += subtotal;
      totalTax += itemTax;
    }

    // Calculate grand total
    const grandTotal = totalAmount + totalTax;

    // Round all values to 2 decimal places
    const response: BillResponse = {
      totalAmount: Number(totalAmount.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2))
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error calculating total:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});