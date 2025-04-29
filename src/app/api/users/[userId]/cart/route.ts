import { NextResponse } from 'next/server';
import { collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get user's cart items
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get the user's cart document
    const cartDoc = await getDoc(doc(db, `users/${userId}/cart/cartItems`));
    
    if (!cartDoc.exists()) {
      return NextResponse.json({ items: [] });
    }
    
    return NextResponse.json(cartDoc.data());
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

// Update user's cart
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { items } = await request.json();
    
    // Update the cart document
    await setDoc(doc(db, `users/${userId}/cart/cartItems`), {
      items,
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Clear user's cart
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Delete the cart document
    await deleteDoc(doc(db, `users/${userId}/cart/cartItems`));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}