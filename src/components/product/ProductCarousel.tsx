"use client";

import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { formatPrice } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from './ProductCard';

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

export function ProductCarousel({ title, products }: { title: string; products: Product[] }) {
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        {title}
      </h2>
      <Carousel className="w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div onClick={() => handleProductClick(product.id)}>
                <ProductCard {...product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}