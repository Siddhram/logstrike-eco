"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import the TinyMCE editor with ssr: false to prevent hydration issues
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false }
);

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
  const [content, setContent] = useState('');
  // Add state to track if we're on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts on client
    setIsClient(true);
  }, []);

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
  
      // Create a plain text description from the editor content
      const description = content.replace(/<[^>]+>/g, '').substring(0, 200);
  
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          title,
          content,
          description, // Add description from editor content
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
    setContent(blog.description); // Set the editor content with the description
    setImageUrl(blog.imageUrl);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !editingBlogId) return;
  
    try {
      setLoading(true);
      setError(null);
  
      // Use the editor's content as the description
      const description = content;
  
      const response = await fetch(`/api/blogs/${editingBlogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          description, // Use the editor's content as the description
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
      setContent('');
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
          <label htmlFor="content" className="block mb-1 font-medium">
            Content
          </label>
          {isClient && (
            <Editor
              apiKey="bur29i80vwrr8x5j4jt14n6mdpgo2av5je0lrp5q9j17xqb6"
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
                  'searchreplace', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
            />
          )}
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
              <div 
                dangerouslySetInnerHTML={{ __html: blog.description }} 
                className="text-gray-600 mb-4 line-clamp-3"
              />
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


interface Blog {
  id: string;
  title: string;
  content: string;
  description: string; // Add description to the interface
  imageUrl?: string;
}