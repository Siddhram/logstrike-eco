"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Loader } from "@/components/ui/Loader";

interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  likes: string[]; // Ensure this is an array of strings
}

export default function BlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLike = async (blogId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          userId: user.uid
        }),
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to like blog');
      }
  
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like blog');
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    }
  };

  if (loading) {
    return <Loader />;
  }
  if (error) return <div className="container mx-auto px-4 py-8 text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Latest Blogs</h1>
          <Link
            href="/blogs/create"
            className="px-6 py-3 bg-[#B146FF] text-white rounded-lg hover:bg-[#9333EA] transition-colors"
          >
            Create New Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-[#111111] rounded-xl shadow-lg overflow-hidden border border-[#B146FF]/20 hover:border-[#B146FF]/50 transition-all">
              <Link href={`/blogs/${blog.id}`}>
                {blog.imageUrl && (
                  <div className="relative h-48">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-3">{blog.title}</h2>
                  <div 
                    dangerouslySetInnerHTML={{ __html: blog.description }} 
                    className="text-gray-400 mb-4 line-clamp-3"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(blog.id);
                        }}
                        className="flex items-center space-x-1 text-gray-400 hover:text-[#B146FF] transition-colors"
                      >
                        <svg className="w-5 h-5" fill={blog.likes.includes(user?.uid || '') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{blog.likes.length}</span>
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(blog.id);
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}