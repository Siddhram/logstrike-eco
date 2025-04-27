"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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

  if (loading) return <div className="container mx-auto px-4 py-8">Loading blogs...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Blogs</h1>
        <Link
          href="/blogs/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <div 
                dangerouslySetInnerHTML={{ __html: blog.description }} 
                className="text-gray-600 mb-4 line-clamp-3"
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}