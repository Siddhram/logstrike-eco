"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";

interface Category {
  id: string;
  name: string;
  image?: string;
  productCount: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // First, get all products
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        // Extract categories and count products in each category
        const categoryMap = new Map<string, number>();
        productsSnapshot.docs.forEach(doc => {
          const product = doc.data();
          if (product.category) {
            const category = product.category.toLowerCase();
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          }
        });
        
        // Convert to array of category objects
        const categoryArray = Array.from(categoryMap.entries()).map(([name, count]) => ({
          id: name,
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          image: "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c=", // Default image
          productCount: count
        }));
        
        setCategories(categoryArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const navigateToCategory = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No categories found</p>
          <button
            onClick={() => router.push('/product')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigateToCategory(category.id)}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">{category.name}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{category.productCount} products</span>
                  <span className="text-blue-600 text-sm">View all →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}