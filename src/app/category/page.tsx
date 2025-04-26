"use client";

import { useEffect, useState, use } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  stock?: number;
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap the params Promise
  const unwrappedParams = use(params);
  const category = unwrappedParams.category;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Find the category document
        const categoryRef = collection(db, 'categories');
        const categoryQuery = query(categoryRef, where('name', '==', category));
        const categoryDocs = await getDocs(categoryQuery);
        
        if (categoryDocs.empty) {
          setProducts([]);
          return;
        }
        
        const categoryId = categoryDocs.docs[0].id;
        const productsCollection = collection(db, `categories/${categoryId}/products`);
        const productsSnapshot = await getDocs(productsCollection);
        
        const productsData = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            category: category,
            rating: data.rating,
            stock: data.stock
          } as Product;
        });
        
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{category} Products</h1>
      
      {products.length > 0 ? (
        <ProductCarousel 
          title={`Featured ${category} Products`} 
          products={products} 
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found in this category</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse All Products
          </button>
        </div>
      )}
    </div>
  );
}