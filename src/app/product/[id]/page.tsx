"use client";
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Get all categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        
        // Search through all categories' products
        for (const categoryDoc of categoriesSnapshot.docs) {
          const productRef = doc(db, `categories/${categoryDoc.id}/products`, productId);
          const productSnap = await getDoc(productRef);
          
          if (productSnap.exists()) {
            const productData = productSnap.data();
            setProduct({
              id: productSnap.id,
              name: productData?.name || '',
              description: productData?.description || '',
              price: productData?.price || 0,
              image: productData?.image || '',
              category: categoryDoc.data().name || '',
              stock: productData?.stock || 0,
              rating: productData?.rating
            });
            return;
          }
        }
        
        setError('Product not found');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category // Ensure category is included
      });
      alert(`${product.name} added to cart!`);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          {product.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
          )}

          <div className="text-2xl font-bold">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => router.push('/cart')}
            >
              Shop Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>

          {/* Additional Product Information */}
          <div className="space-y-2">
            <div className="flex justify-between border-b py-2">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-gray-600">Availability</span>
              <span className="font-medium">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}