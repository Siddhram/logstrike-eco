import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { toast } from 'sonner';

export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const addToCartWithNotification = (product: any) => {
    context.addToCart(product);
    toast.success('Added to cart!');
  };

  const removeFromCartWithNotification = (id: string) => {
    context.removeFromCart(id);
    toast.success('Removed from cart!');
  };

  return {
    ...context,
    addToCart: addToCartWithNotification,
    removeFromCart: removeFromCartWithNotification,
  };
}