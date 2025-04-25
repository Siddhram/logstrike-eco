"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface ProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const productData: ProductData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      stock: parseInt(formData.get("stock") as string),
    };

    // Validate required fields
    if (!productData.name || !productData.description || isNaN(productData.price) || 
        !productData.image || !productData.category || isNaN(productData.stock)) {
      setError("Please fill all fields correctly");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      // Clone the response before reading it
      const clonedResponse = response.clone();
      
      if (!response.ok) {
        let errorMessage = "Failed to create product";
        try {
          const errorData = await clonedResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // Handle non-JSON responses
          const text = await clonedResponse.text();
          errorMessage = text.startsWith("<!DOCTYPE") ? 
            "Server error: Received HTML response" : 
            text;
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      // Handle successful response
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <Input name="name" required minLength={2} maxLength={100} />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <Textarea name="description" required minLength={10} maxLength={1000} />
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <Input name="price" type="number" step="0.01" required min={0} />
        </div>

        <div>
          <label className="block mb-1">Image URL</label>
          <Input name="image" type="url" required />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <Input name="category" required minLength={2} maxLength={50} />
        </div>

        <div>
          <label className="block mb-1">Stock</label>
          <Input name="stock" type="number" required min={0} />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}