"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function Header({ categories = [] }: { categories?: { name: string; link: string; image: string }[] }) {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Update the Categories Dropdown section
  return (
    <>
      {/* Top Header */}
      <header className="bg-[#111111] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#FFFFFF]">AI CHIP STORE</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your search key..."
                  className="w-full p-2.5 pl-4 pr-12 bg-[#1A1A1A] text-[#E5E5E5] placeholder-[#9CA3AF] 
                           border border-[#D1D5DB] rounded-full focus:outline-none focus:border-[#8B5CF6]
                           transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-[#8B5CF6] text-white rounded-r-full 
                           hover:bg-[#7C3AED] transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              <Link href="/cart" className="relative flex items-center group">
                <svg className="h-6 w-6 text-[#E5E5E5] group-hover:text-[#8B5CF6] transition-colors" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-[#8B5CF6] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">{user.displayName}</span>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login"
                        className="px-4 py-2 text-sm font-medium text-[#8B5CF6] hover:text-white border border-[#8B5CF6] hover:bg-[#8B5CF6] rounded-lg transition-all duration-200">
                    Login
                  </Link>
                  <Link href="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-all duration-200">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#8B5CF6] text-white ">
        <div className="container mx-auto px-4 items-center">
          <div className="flex items-center h-12">
            {/* Categories Dropdown */}
            {/* <div className="relative group">
              <button 
                className="flex items-center h-full px-4 hover:bg-[#7C3AED] transition-colors"
                onClick={toggleCategory}
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Categories
              </button> */}
              
              {/* Dropdown Menu */}
              {/* <div 
                className={`absolute left-0 top-full w-56 bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${
                  isCategoryOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                {categories?.map((category, index) => (
                  <Link
                    key={index}
                    href={category.link}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#8B5CF6] hover:text-white transition-colors"
                  >
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div> */}

            {/* Main Navigation */}
            <div className="hidden md:flex items-center h-full ml-120">
              <Link href="/" className="px-4 h-full flex items-center hover:bg-[#7C3AED] transition-colors">
                HOME
              </Link>
              <Link href="/products" className="px-4 h-full flex items-center hover:bg-[#7C3AED] transition-colors">
                SHOP
              </Link>
              <Link href="/blog" className="px-4 h-full flex items-center hover:bg-[#7C3AED] transition-colors">
                BLOG
              </Link>
              <Link href="/contact" className="px-4 h-full flex items-center hover:bg-[#7C3AED] transition-colors">
                CONTACT
              </Link>
            </div>

            {/* Free Shipping Notice */}
            <div className="hidden md:block ml-auto text-sm">
              Free Shipping on Orders $50+
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for AI chips..."
                  className="w-full p-2.5 pl-4 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <nav className="flex flex-col space-y-2">
              <Link href="/" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Home
              </Link>
              <Link href="/products" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Shop
              </Link>
              <Link href="/blog" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Blog
              </Link>
              <Link href="/contact" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Contact
              </Link>
              {isAdmin && (
                <Link href="/admin" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Admin Dashboard
                </Link>
              )}
              {user && (
                <>
                  <Link href="/profile" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    Profile
                  </Link>
                  <Link href="/orders" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-md border-t border-gray-100"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}