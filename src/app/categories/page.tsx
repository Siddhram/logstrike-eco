"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image || "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c=",
          link: `/category/${encodeURIComponent(doc.data().name)}`
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Calculate pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

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

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-14 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
          All Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentCategories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer"
              onClick={() => router.push(category.link)}
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
                    <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#8B5CF6]/80 hover:bg-[#8B5CF6] text-white font-semibold backdrop-blur-md">
                      Shop Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-white/10 text-white hover:bg-[#8B5CF6]/50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}