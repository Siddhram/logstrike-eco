"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login page with return URL
      router.push(`/login?redirect=/product/${product.id}`);
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#B146FF]/20 transition-all hover:border-[#B146FF]/40 hover:shadow-lg hover:shadow-[#B146FF]/5">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-medium text-white mb-2 hover:text-[#B146FF] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[#B146FF] font-bold mb-4">${product.price.toFixed(2)}</p>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-[#B146FF] hover:bg-[#9333EA] text-white"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}