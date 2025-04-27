"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CartItem {  // Add export keyword
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string; // Add category field
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, category: string) => Promise<void>; // Updated interface
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        cart: [],
        createdAt: new Date().toISOString()
      });
      setCartItems([]);
    } else {
      setCartItems(userDoc.data().cart || []);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (item: CartItem) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document exists, create if it doesn't
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          cart: [],
          createdAt: new Date().toISOString()
        });
      }
  
      // First, find the correct category for the product
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      let productDoc;
      
      for (const categoryDoc of categoriesSnapshot.docs) {
        const productRef = doc(db, `categories/${categoryDoc.id}/products`, item.id);
        productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
          break;
        }
      }
  
      if (!productDoc || !productDoc.exists()) {
        throw new Error('Product not found in any category');
      }
  
      const productData = productDoc.data();
      if (item.quantity > (productData.stock || 0)) {
        throw new Error('Not enough stock');
      }
  
      // Check if product already exists in cart
      const existingItem = cartItems.find(i => i.id === item.id);
      const updatedCart = existingItem 
        ? cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
        : [...cartItems, item];
  
      await updateDoc(userRef, {
        cart: updatedCart
      });
  
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const item = cartItems.find(i => i.id === id);
    
    if (item) {
      await updateDoc(userRef, {
        cart: arrayRemove(item)
      });
      setCartItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const updateQuantity = async (id: string, quantity: number, category: string) => { // Added category parameter
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const productRef = doc(db, `categories/${category}/products`, id); // Use category parameter
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();
    if (quantity > (productData.stock || 0)) {
      throw new Error('Not enough stock');
    }

    await updateDoc(userRef, {
      cart: cartItems.map(i => i.id === id ? { ...i, quantity } : i)
    });

    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
};

  const clearCart = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      cart: []
    });
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext) as CartContextType;