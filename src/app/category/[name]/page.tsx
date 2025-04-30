"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { use } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

export default function CategoryPage() {
  const params = use(useParams());
  const categoryName = params.name as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        
        const categoryDoc = categoriesSnapshot.docs.find(
          doc => doc.data().name.toLowerCase() === categoryName.toLowerCase()
        );

        if (categoryDoc) {
          const productsRef = collection(db, `categories/${categoryDoc.id}/products`);
          const productsSnapshot = await getDocs(productsRef);
          
          const productsData = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            category: categoryName
          })) as Product[];
          
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

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
    return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {categoryName} Products
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border border-[#8B5CF6]/20 rounded-lg p-6 bg-[#1A1A1A] hover:border-[#8B5CF6]/50 transition-all duration-300">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-white">{product.name}</h2>
              <p className="text-gray-400 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-[#8B5CF6]">
                  ${product.price.toLocaleString()}
                </p>
                <button className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}