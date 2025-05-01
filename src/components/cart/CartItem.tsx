"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean; // Add this prop
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onToggleSelect: (id: string) => void; // Add this prop
}

export function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  selected,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
}: CartItemProps) {
  const router = useRouter();
  
  return (
    <div className="flex items-center">
      <div className="flex items-center pr-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(id)}
          className="h-4 w-4 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]"
        />
      </div>
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src="https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c="
          alt={name}
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <button 
                onClick={() => router.push(`/product/${id}`)}
                className="hover:text-blue-600"
              >
                {name}
              </button>
            </h3>
            <p className="ml-4">{formatPrice(price)}</p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <p className="text-gray-500">Qty</p>
            <div className="flex items-center border rounded-md">
              <button
                className="px-2 py-1 text-gray-600 hover:text-gray-800"
                onClick={() => quantity > 1 && onUpdateQuantity(id, quantity - 1)}
              >
                -
              </button>
              <span className="px-2 py-1">{quantity}</span>
              <button
                className="px-2 py-1 text-gray-600 hover:text-gray-800"
                onClick={() => onUpdateQuantity(id, quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            className="font-medium text-red-600 hover:text-red-500"
            onClick={() => onRemove(id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}