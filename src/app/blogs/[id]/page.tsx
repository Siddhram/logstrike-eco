"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader } from "@/components/ui/Loader";
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  likes: string[];
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!user || !blog) return;
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: blog.id, userId: user.uid }),
      });

      if (!response.ok) throw new Error('Failed to like blog');
      
      const updatedBlog = await response.json();
      setBlog(updatedBlog);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like blog');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-400">Error: {error}</div>;
  if (!blog) return <div className="container mx-auto px-4 py-8 text-white">Blog not found</div>;

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/blogs" 
          className="inline-flex items-center text-[#B146FF] hover:text-[#9333EA] mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </Link>

        {blog.imageUrl && (
          <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">{blog.title}</h1>
          
          <div className="flex items-center justify-between text-gray-400">
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#B146FF] transition-colors"
            >
              <svg 
                className="w-6 h-6" 
                fill={blog.likes.includes(user?.uid || '') ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span>{blog.likes.length} likes</span>
            </button>
          </div>

          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }} 
          />
        </div>
      </div>
    </div>
  );
}