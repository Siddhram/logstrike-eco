"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminAuth } from '@/lib/firebase-admin';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]); // Add users state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch users');
        }

        const usersData = await response.json();
        setUsers(usersData);
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

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#0f0f0f] border-r border-[#8B5CF6]/20 h-screen sticky top-0">
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
                { id: "reviews", name: "Reviews", icon: "⭐" },
                { id: "blog", name: "Blog Posts", icon: "📝" },
                { id: "settings", name: "Settings", icon: "⚙️" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center p-3 rounded-md ${activeTab === item.id
                        ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                        : "text-gray-400 hover:bg-[#8B5CF6]/5 hover:text-white"
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
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

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
                    className="bg-[#1A1A1A] p-6 rounded-lg border border-[#8B5CF6]/20"
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
                    asChild
                  >
                    <Link href="/admin/orders">View All</Link>
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Total
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
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
                              className="text-[#8B5CF6] hover:text-[#7C3AED]"
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
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20 mb-8">
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
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => router.push(`/product/${product.id}`)}
                              className="text-[#8B5CF6] hover:text-[#7C3AED] mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Button asChild>
                  <Link href="/admin/products/new">Add New Product</Link>
                </Button>
              </div>

              {/* Product filters and search */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex gap-4">
                    <select className="p-2 border rounded-md">
                      <option value="">All Categories</option>
                      <option value="GPU">GPU</option>
                      <option value="TPU">TPU</option>
                      <option value="AI Accelerator">AI Accelerator</option>
                      <option value="AI Processor">AI Processor</option>
                    </select>
                    <select className="p-2 border rounded-md">
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                    <Button variant="outline">Filter</Button>
                  </div>
                </div>
              </div>

              {activeTab === "customers" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Customers</h1>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                    >
                      Export List
                    </Button>
                  </div>
                  {loading ? (
                    <div className="text-white">Loading customers...</div>
                  ) : error ? (
                    <div className="text-red-600">Error: {error}</div>
                  ) : (
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Email
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
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                                  No customers found
                                </td>
                              </tr>
                            ) : (
                              users.map((user: { uid: string; email: string }) => (
                                <tr key={user.uid} className="hover:bg-[#8B5CF6]/10 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {user.uid}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {user.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400">
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={() => router.push(`/admin/customers/${user.uid}`)}
                                      className="text-[#8B5CF6] hover:text-[#9B7AE6] mr-4 transition-colors"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.uid)}
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
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">5</span> of{" "}
                      <span className="font-medium">12</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-l-md"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-600"
                      >
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-r-md"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "customers" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Customers</h1>

              {loading ? (
                <div>Loading customers...</div>
              ) : error ? (
                <div className="text-red-600">Error: {error}</div>
              ) : (
                <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-sm  border-[#8B5CF6]/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#8B5CF6]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1a1a1a] divide-y divide-[#8B5CF6]/20">
                        {users.map((user: { uid: string, email: string }) => (
                          <tr key={user.uid}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.uid}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                          </tr>
                        ))}
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
  );


interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount: number;
  tax: number;
  hsn: string;
}

interface OrderDetails {
  order_id: string;
  order_date: string;
  channel_id: number;
  
  // Billing Details
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  
  // Shipping Details
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_email?: string;
  shipping_phone?: string;
  
  // Order Items
  items: OrderItem[];
  
  // Payment & Shipping
  payment_method: string;
  shipping_charges: number;
  giftwrap_charges: number;
  transaction_charges: number;
  total_discount: number;
  sub_total: number;
  
  // Package Details
  length: number;
  breadth: number;
  height: number;
  weight: number;
  
  // Additional Details
  pickup_location?: string;
  invoice_number: string;
  order_type?: 1 | 2;
  status: string;
}

{activeTab === "orders" && (
  <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">Manage and track all orders</p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
        >
          Export Orders
        </Button>
        <Button
          size="sm"
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
        >
          Create Order
        </Button>
      </div>
    </div>

    {/* Order Filters */}
    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#8B5CF6]/20 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="bg-[#111111] border border-[#8B5CF6]/20 rounded-lg px-4 py-2 text-white"
        />
        <select className="bg-[#111111] border border-[#8B5CF6]/20 rounded-lg px-4 py-2 text-white">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <select className="bg-[#111111] border border-[#8B5CF6]/20 rounded-lg px-4 py-2 text-white">
          <option value="">Payment Method</option>
          <option value="prepaid">Prepaid</option>
          <option value="cod">COD</option>
        </select>
        <Button variant="outline" className="border-[#8B5CF6] text-[#8B5CF6]">
          Apply Filters
        </Button>
      </div>
    </div>

    {/* Orders Table */}
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#8B5CF6]/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#8B5CF6]/20">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
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
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-[#8B5CF6]/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {order.order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {order.order_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {order.billing_customer_name} {order.billing_last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  ${order.sub_total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-900/50 text-green-400"
                      : order.status === "Shipped"
                      ? "bg-blue-900/50 text-blue-400"
                      : "bg-yellow-900/50 text-yellow-400"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => router.push(`/admin/orders/${order.order_id}`)}
                    className="text-[#8B5CF6] hover:text-[#9B7AE6] mr-4 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handlePrintInvoice(order.order_id)}
                    className="text-[#8B5CF6] hover:text-[#9B7AE6] transition-colors"
                  >
                    Print Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}