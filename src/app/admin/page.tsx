"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminAuth } from '@/lib/firebase-admin';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  // Add these types at the top of the file
  interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    status?: string;
  }
  
  interface User {
    uid: string;
    email: string;
    displayName: string;
    createdAt: any;
    status: string;
  }
  
  interface Order {
    id: string;
    userId: string;
    customerName: string;
    items: any[];
    total: number;
    status: string;
    createdAt: any;
  }
  
  // Update the state declarations
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const router = useRouter();

  // Add this mock data near the products mock data
  const recentOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      date: "2023-10-15",
      total: 1299.99,
      status: "Delivered"
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      date: "2023-10-14",
      total: 799.99,
      status: "Shipped"
    },
    {
      id: "ORD003",
      customer: "Acme Corp",
      date: "2023-10-13",
      total: 4599.99,
      status: "Processing"
    }
  ];

  // Update the users fetching useEffect
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get users from Firestore
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        if (querySnapshot.empty) {
          console.log("No users found in the collection");
        } else {
          console.log(`Found ${querySnapshot.docs.length} users`);
        }
        
        const usersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("User data:", data); // Debug log
          return {
            uid: doc.id,
            email: data.email || 'N/A',
            displayName: data.displayName || 'N/A',
            createdAt: data.createdAt?.toDate() || new Date(),
            status: data.status || 'Active',
          };
        });

        setUsers(usersData);
        console.log("Users set:", usersData); // Debug log
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "customers") {
      fetchUsers();
    }
  }, [activeTab]);

  // Add handleDeleteUser function if not already present
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(prev => prev.filter(user => user.uid !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error instanceof Error ? error.message : 'Failed to delete user');
      }
    }
  };

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const allProducts = [];

        // Fetch products from each category
        for (const categoryDoc of categoriesSnapshot.docs) {
          const productsCollection = collection(db, `categories/${categoryDoc.id}/products`);
          const productsSnapshot = await getDocs(productsCollection);

          productsSnapshot.forEach(doc => {
            allProducts.push({
              id: doc.id,
              ...doc.data(),
              category: categoryDoc.data().name
            });
          });
        }

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  // Handle product deletion
  const handleDelete = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Add this effect to fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const postsSnapshot = await getDocs(collection(db, 'blog-posts'));
        const posts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch blog posts');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "blog") {
      fetchBlogPosts();
    }
  }, [activeTab]);

  // Add the delete handler
  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blog-posts', postId));
        setBlogPosts(prev => prev.filter(post => post.id !== postId));
      } catch (error) {
        console.error("Error deleting blog post:", error);
      }
    }
  };

  const Loader = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#111111]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-[#8B5CF6]/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-[#8B5CF6] rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[#8B5CF6] text-lg font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="bg-[#1a1a1a] border-b border-[#8B5CF6]/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">AI CHIP STORE</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a1a1a] shadow-lg h-screen sticky top-0 border-r border-[#8B5CF6]/20">
          <div className="p-6 border-b border-[#8B5CF6]/20">
            <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { id: "dashboard", name: "Dashboard", icon: "📊" },
                { id: "products", name: "Products", icon: "📦" },
                { id: "orders", name: "Orders", icon: "🛒" },
                { id: "customers", name: "Customers", icon: "👥" },
                // { id: "reviews", name: "Reviews", icon: "⭐" },
                // { id: "blog", name: "Blog Posts", icon: "📝" },
                // { id: "settings", name: "Settings", icon: "⚙️" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 ${activeTab === item.id
                      ? "bg-[#8B5CF6] text-white"
                      : "text-gray-400 hover:bg-[#8B5CF6]/10 hover:text-white"
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "dashboard" && (
            loading ? (
              <Loader />
            ) : (
              <div>
                <h1 className="text-3xl font-bold mb-8 text-white">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      title: "Total Sales",
                      value: "$48,799.95",
                      change: "+12.5%",
                      trend: "up",
                    },
                    {
                      title: "Orders",
                      value: "124",
                      change: "+8.2%",
                      trend: "up",
                    },
                    {
                      title: "Customers",
                      value: "96",
                      change: "+15.3%",
                      trend: "up",
                    },
                    {
                      title: "Avg. Order Value",
                      value: "$393.55",
                      change: "-2.1%",
                      trend: "down",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
                    >
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        {stat.title}
                      </h3>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-white">{stat.value}</p>
                        <p
                          className={`ml-2 text-sm font-medium ${stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-white">Recent Orders</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8B5CF6]/20">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                  }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                href={`/admin/orders/${order.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Product Inventory */}
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-white">Product Inventory</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                      asChild
                    >
                      <Link href="/admin/products">View All</Link>
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8B5CF6]/20">
                        {loading ? (
                          <Loader />
                        ) : error ? (
                          <div className="text-red-600">Error: {error}</div>
                        ) : (
                          products.map((product) => (
                            <tr key={product.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {product.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                ${product.price?.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {product.stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${product.stock > 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                  className="text-[#8B5CF6] hover:text-[#9B7AE6] mr-4 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}

          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Products</h1>
                <Button asChild className="w-full sm:w-auto border-2 hover:bg-white/10 text-white border-white/50 text-lg px-5 py-5">
                  <Link href="/admin/products/create">Add New Product</Link>
                </Button>
              </div>

              {loading ? (
                <Loader />
              ) : error ? (
                <div className="text-red-600">Error: {error}</div>
              ) : (
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8B5CF6]/20">
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                              No products found
                            </td>
                          </tr>
                        ) : (
                          products.map((product) => (
                            <tr key={product.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {product.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                ${product.price?.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {product.stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${product.stock > 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                  className="text-[#8B5CF6] hover:text-[#9B7AE6] mr-4 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "customers" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Customers</h1>
              </div>

              {loading ? (
                <Loader />
              ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8B5CF6]/20">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                              No customers found
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user.uid} className="hover:bg-[#8B5CF6]/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                {user.displayName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {user.createdAt instanceof Date 
                                  ? user.createdAt.toLocaleDateString() 
                                  : new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${user.status === "Active" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                  {user.status || "Active"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteUser(user.uid)}
                                  className="text-red-500 hover:text-red-700 mr-4"
                                >
                                  Delete
                                </button>
                                <Link href={`/admin/customers/${user.uid}`} className="text-blue-500 hover:text-blue-700">
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
};