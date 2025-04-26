"use client";

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { collection, getDocs, query, orderBy, limit, startAfter, getCountFromServer } from 'firebase/firestore';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const productsPerPage = 2; // Number of products per page

  const handleProductClick = (id: string) => {
    router.push(`/product/${id}`);
  };

  // Function to fetch total number of products
  const fetchTotalProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getCountFromServer(productsCollection);
      const total = snapshot.data().count;
      setTotalPages(Math.ceil(total / productsPerPage));
    } catch (err) {
      console.error("Error fetching total products:", err);
    }
  };

  // Function to fetch products for the current page
  const fetchProducts = async (pageNumber = 1, pageSize = productsPerPage) => {
    setLoading(true);
    try {
      console.log(`Fetching products for page ${pageNumber}...`);
      let productsQuery;
      
      if (pageNumber === 1) {
        // First page
        productsQuery = query(
          collection(db, 'products'),
          orderBy('name'),
          limit(pageSize)
        );
      } else if (lastVisible) {
        // Subsequent pages
        productsQuery = query(
          collection(db, 'products'),
          orderBy('name'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        // Fallback if lastVisible is not set but page > 1
        console.log("No last document available for pagination");
        return;
      }

      const querySnapshot = await getDocs(productsQuery);
      
      if (!querySnapshot.empty) {
        // Get the last visible document for next pagination
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastDoc);
        
        // Map the documents to our product interface
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setProducts(productsData);
        console.log(`Loaded ${productsData.length} products`);
      } else {
        console.log("No products found for this page");
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    
    if (newPage === 1) {
      // Reset pagination when going back to first page
      setLastVisible(null);
    }
    
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  // Initial load
  useEffect(() => {
    fetchTotalProducts();
  }, []);

  // Fetch products when page changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  if (loading && currentPage === 1) {
    return <div className="container mx-auto px-4 py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {loading && <div className="text-center my-4">Loading more products...</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image || "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c="}
            rating={product.rating}
            onClick={() => handleProductClick(product.id)}
          />
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className={`w-10 h-10 ${currentPage === page ? 'bg-blue-600' : ''}`}
                onClick={() => handlePageChange(page)}
                disabled={loading}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}