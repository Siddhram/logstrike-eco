"use client";

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
}

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProductClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (categoryFilter) {
          const categoriesRef = collection(db, 'categories');
          const categoriesSnapshot = await getDocs(categoriesRef);
          const categoryDoc = categoriesSnapshot.docs.find(
            doc => doc.data().name.toLowerCase() === categoryFilter.toLowerCase()
          );

          if (categoryDoc) {
            const productsRef = collection(db, `categories/${categoryDoc.id}/products`);
            const productsSnapshot = await getDocs(productsRef);
            const productsData = productsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              category: categoryFilter
            }));
            setProducts(productsData);
          }
        } else {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111111]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#8B5CF6]/20 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-[#8B5CF6] rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-[#8B5CF6] text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111111] py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          {categoryFilter ? `${categoryFilter} Products` : 'Our Products'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}