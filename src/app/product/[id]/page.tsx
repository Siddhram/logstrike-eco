"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Loader } from "@/components/ui/Loader";
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.id) return;

        // Try direct products collection first
        const productRef = doc(db, 'products', params.id as string);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({
            id: productSnap.id,
            ...productSnap.data() as Product
          });
          setLoading(false);
          return;
        }

        // If not found, try categories
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        
        for (const categoryDoc of categoriesSnapshot.docs) {
          const productDoc = doc(db, `categories/${categoryDoc.id}/products/${params.id}`);
          const productSnapshot = await getDoc(productDoc);
          
          if (productSnapshot.exists()) {
            setProduct({
              id: productSnapshot.id,
              ...productSnapshot.data(),
              category: categoryDoc.data().name
            } as Product);
            setLoading(false);
            return;
          }
        }
        
        setError('Product not found');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <Loader />;
  }

  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8">Product not found</div>;

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login page with return URL
      router.push(`/login?redirect=/product/${params.id}`);
      return;
    }
    
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      alert(`${product.name} added to cart!`);
    }
  };

  const handleShopNow = async () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/cart');
    }
  };
  
  // In the JSX
  <Button 
    size="lg" 
    className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all duration-300"
    onClick={handleShopNow}
  >
    Shop Now
  </Button>

  return (
    <div className="min-h-screen bg-[#111111] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-[#8B5CF6]/20 p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6 text-white">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              {product.name}
            </h1>
            
            {product.rating && (
              <div className="flex items-center">
                <span className="text-[#8B5CF6]">★</span>
                <span className="ml-1 text-sm text-gray-300">{product.rating}</span>
              </div>
            )}

            <div className="text-3xl font-bold text-[#8B5CF6]">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all duration-300"
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => router.push('/cart'), 100); // Delay navigation
                }}
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>

            {/* Additional Product Information */}
            <div className="space-y-4 mt-8 pt-6 border-t border-[#8B5CF6]/20">
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Category</span>
                <span className="font-medium text-[#8B5CF6]">{product.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Availability</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}