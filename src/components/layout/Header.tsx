"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { SearchProvider } from '@/components/search/SearchProvider';
import { SearchBox } from '@/components/search/SearchBox';
import { SearchResults } from '@/components/search/SearchResults';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function Header({ categories = [] }: { categories?: { name: string; link: string; image: string }[] }) {
  const { cart = [] } = useCart();
  const cartItemCount = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item?.quantity || 1), 0) 
    : 0;

  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const searchResultsRef = React.useRef<HTMLDivElement>(null);

  // Move the isActiveLink function here, before it's used
  const isActiveLink = (path: string) => {
    return pathname === path ? 'bg-[#7C3AED]' : '';
  };

  const handleSearchSubmit = (query: string) => {
    console.log('Searching for:', query);
    setShowSearchResults(true);
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true); // Show results when focusing on search box
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // Close search results when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div className="flex-1 max-w-2xl mx-8 hidden md:block relative" ref={searchResultsRef}>
              <SearchProvider indexName="products">
                <div onFocus={handleSearchFocus}>
                  <SearchBox 
                    placeholder="Enter your search key..." 
                    onSubmit={handleSearchSubmit}
                    className="w-full"
                  />
                </div>
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <SearchResults />
                  </div>
                )}
              </SearchProvider>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative flex items-center">
                <svg className="h-6 w-6 text-[#E5E5E5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8B5CF6] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {!user ? (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#8B5CF6] rounded-md"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the component remains the same */}
      {/* Navigation Bar with active states */}
      <nav className="bg-[#8B5CF6] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className={`hover:bg-[#7C3AED] px-4 py-3 ${isActiveLink('/')}`}
              >
                HOME
              </Link>
              <Link 
                href="/products" 
                className={`hover:bg-[#7C3AED] px-4 py-3 ${isActiveLink('/shop')}`}
              >
                SHOP
              </Link>
              <Link 
                href="/blog" 
                className={`hover:bg-[#7C3AED] px-4 py-3 ${isActiveLink('/blog')}`}
              >
                BLOG
              </Link>
              <Link 
                href="/contact" 
                className={`hover:bg-[#7C3AED] px-4 py-3 ${isActiveLink('/contact')}`}
              >
                CONTACT
              </Link>
            </div>
            <div className="text-sm">Free Shipping on Orders $50+</div>
          </div>
        </div>
      </nav>

      {/* Mobile menu with active states */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <SearchProvider indexName="products">
              <div onFocus={handleSearchFocus}>
                <SearchBox 
                  placeholder="Search for AI chips..." 
                  onSubmit={handleSearchSubmit}
                  className="mb-4"
                />
              </div>
              {showSearchResults && (
                <div className="mb-4 bg-white rounded-lg border border-gray-200">
                  <SearchResults />
                </div>
              )}
            </SearchProvider>

            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`p-2 text-gray-700 hover:bg-gray-100 rounded-md ${pathname === '/' ? 'bg-gray-100' : ''}`}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`p-2 text-gray-700 hover:bg-gray-100 rounded-md ${pathname === '/products' ? 'bg-gray-100' : ''}`}
              >
                Shop
              </Link>
              <Link 
                href="/blog" 
                className={`p-2 text-gray-700 hover:bg-gray-100 rounded-md ${pathname === '/blog' ? 'bg-gray-100' : ''}`}
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className={`p-2 text-gray-700 hover:bg-gray-100 rounded-md ${pathname === '/contact' ? 'bg-gray-100' : ''}`}
              >
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