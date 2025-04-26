"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function CreateBlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Fetch user's blogs
  const fetchUserBlogs = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/users/${user.uid}/blogs`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setUserBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a blog');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          title,
          description,
          imageUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      // Refresh user blogs after creation
      await fetchUserBlogs();
      
      // Clear form
      setTitle('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlogId(blog.id);
    setTitle(blog.title);
    setDescription(blog.description);
    setImageUrl(blog.imageUrl);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !editingBlogId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/blogs/${editingBlogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      // Refresh user blogs after update
      await fetchUserBlogs();
      
      // Clear form and editing state
      setEditingBlogId(null);
      setTitle('');
      setDescription('');
      setImageUrl('');

      // Navigate to /blogs
      router.push('/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={editingBlogId ? handleUpdate : handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[200px]"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-1 font-medium">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading 
            ? (editingBlogId ? 'Updating...' : 'Creating...') 
            : (editingBlogId ? 'Update Blog' : 'Create Blog')
          }
        </button>
        
        {editingBlogId && (
          <button
            type="button"
            onClick={() => {
              setEditingBlogId(null);
              setTitle('');
              setDescription('');
              setImageUrl('');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* User's Blogs List */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Your Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-32 object-cover mb-4"
                />
              )}
              <button
                onClick={() => handleEdit(blog)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}