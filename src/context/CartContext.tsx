"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  cartCount: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  
  const getCartKey = () => {
    return `cart_${user?.uid || 'guest'}`;
  };

  // Load cart from localStorage on mount or when user changes
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]); // Reset cart if no saved cart found for this user
    }
  }, [user]); // Re-run when user changes

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
  }, [cart, user]);

  const getDistinctItemCount = () => {
    return cart.length; // This will return the number of unique items
  };

  // Modified addToCart function to check authentication
  const addToCart = (item: CartItem) => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page
      router.push('/login?redirect=/cart');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // If item already exists, increase quantity
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
      } else {
        // If item doesn't exist, add it to cart
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      cartCount: cart.reduce((total, item) => total + (item.quantity || 1), 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);