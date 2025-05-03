"use client";

import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    name: "NVIDIA A100 Tensor Core GPU",
    description: "Accelerate your most demanding AI and HPC workloads with the NVIDIA A100 Tensor Core GPU.",
    price: 10999.99,
    image: "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c=",
    category: "GPU",
    rating: 4.9,
  }
 
];

// Mock data for new arrivals
const newArrivals = [
  {
    id: "5",
    name: "Cerebras CS-2",
    description: "The world's largest and fastest AI processor with 850,000 cores and 40GB of on-chip memory.",
    price: 24999.99,
    image: "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c=",
    category: "AI Processor",
    rating: 4.9,
  }
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

interface Category {
  name: string;
  image: string;
  link: string;
}

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image || "https://plus.unsplash.com/premium_photo-1683120963435-6f9355d4a776?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFpfGVufDB8fDB8fHww",
          link: `/category/${doc.data().name}`
        }));

        setCategories(categoriesData);

        // Fetch products from all categories
        const allProducts = [];
        for (const categoryDoc of categoriesSnapshot.docs) {
          const productsCollection = collection(db, `categories/${categoryDoc.id}/products`);
          const productsSnapshot = await getDocs(productsCollection);
          productsSnapshot.forEach(doc => {
            allProducts.push({
              id: doc.id,
              ...doc.data(),
              category: categoryDoc.data().name
            });
          });
        }

        // Set featured products and new arrivals
        if (allProducts.length > 0) {
          setFeaturedProducts(allProducts.slice(0, 3)); // First 3 as featured
          setNewArrivals(allProducts.slice(-3).reverse()); // Last 3 as new arrivals
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden h-screen">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#8B5CF6]/30" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-[#8B5CF6]">
              Next-Gen AI Hardware for Your Innovation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl">
              Discover cutting-edge AI chips and accelerators to power your machine learning projects and AI applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6"
                onClick={() => router.push('/products')}
              >
                Explore Products
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="w-full sm:w-auto hover:bg-[#7C3AED] hover:text-white text-[#8B5CF6] text-lg px-8 py-6"
                onClick={() => router.push('/blogs')}
              >
                Learn More
              </Button>
            </div>
            
            {/* Added stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B5CF6]">500+</div>
                <div className="text-sm text-gray-300 mt-1">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B5CF6]">10K+</div>
                <div className="text-sm text-gray-300 mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B5CF6]">24/7</div>
                <div className="text-sm text-gray-300 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Added scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg 
            className="w-6 h-6 text-white/70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* Categories Section */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
            Shop by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.slice(0, 3).map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => router.push(`/product?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[#8B5CF6]/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-white/10">
                  <div className="relative h-64">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-full transition-transform duration-700 scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-50 transition-all duration-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">{category.name}</h3>
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span 
                        className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#8B5CF6]/80 hover:bg-[#8B5CF6] text-white font-semibold backdrop-blur-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/product?category=${encodeURIComponent(category.name)}`);
                        }}
                      >
                        Shop Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/category" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full bg-transparent hover:bg-[#8B5CF6] text-white border-[#8B5CF6] hover:border-transparent backdrop-blur-sm px-8"
                onClick={() => router.push('/category')}
              >
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <ProductCarousel title="Featured Products" products={featuredProducts} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <ProductCarousel title="New Arrivals" products={newArrivals} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white bg-clip-text">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Guidance",
                description: "Our team of AI hardware specialists can help you choose the right components for your specific needs.",
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
              {
                title: "Premium Quality",
                description: "We source only the highest quality AI hardware from trusted manufacturers with full warranty coverage.",
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                title: "Fast Shipping",
                description: "With global warehouses and expedited shipping options, get your AI hardware delivered quickly and securely.",
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-[#111111] rounded-lg shadow-xl border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
                <div className="mb-4 text-[#8B5CF6]">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#8B5CF6] to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your AI Projects?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of AI researchers, engineers, and companies who trust us for their hardware needs.
          </p>
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
            >
              Browse Our Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
