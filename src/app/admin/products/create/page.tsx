"use client";

import { useState } from 'react';

export default function AdminPage() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      alert('Product added successfully');
      setProductData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-8">Add New Product</h1>
        <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#8B5CF6]/20">
            <div className="space-y-4">
              {/* Input fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111111] border border-[#8B5CF6]/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  required
                />
              </div>
              
              {/* Other input fields with similar styling */}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-[#8B5CF6] text-white rounded-md hover:bg-[#7C3AED] transition-colors duration-300 disabled:bg-[#8B5CF6]/50"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
