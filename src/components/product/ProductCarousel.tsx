"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface ProductCarouselProps {
  title: string;
  category: string;
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
      
      containerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
      
      setScrollPosition(scrollTo);
    }
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#8B5CF6]">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#8B5CF6] transition-colors"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-[#8B5CF6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#8B5CF6] transition-colors"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-[#8B5CF6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-72 bg-[#111111] rounded-xl overflow-hidden shadow-lg hover:shadow-[#8B5CF6]/20 transition-all duration-300 border border-gray-800"
          >
            <div 
              className="relative h-56 cursor-pointer group" 
              onClick={() => navigateToProduct(product.id)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-white">{product.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 
                className="font-medium text-white text-lg mb-2 hover:text-[#8B5CF6] cursor-pointer transition-colors"
                onClick={() => navigateToProduct(product.id)}
              >
                {product.name}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-xl text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="w-full py-2 px-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg transition-colors">
                  Add to Cart
                </button>
                <button className="w-full py-2 px-4 border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white rounded-lg transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}