import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Map of incorrect routes to their correct destinations
const routeRedirects: Record<string, string> = {
  '/products': '/product',
  '/cart-items': '/cart',
  '/account': '/profile',
  '/checkout-page': '/checkout',
  '/login-page': '/login',
  '/register-page': '/register',
  '/admin-panel': '/admin',
  '/product-details': '/product',
  '/categories': '/category',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is in our redirect map
  if (pathname in routeRedirects) {
    const url = request.nextUrl.clone();
    url.pathname = routeRedirects[pathname];
    
    // 308 is a permanent redirect that preserves the HTTP method
    return NextResponse.redirect(url, 308);
  }
  
  // Handle product ID routes with plural form
  if (pathname.startsWith('/products/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace('/products/', '/product/');
    return NextResponse.redirect(url, 308);
  }
  
  // Handle other common misspellings or variations
  if (pathname.startsWith('/categor') && !pathname.startsWith('/category')) {
    const url = request.nextUrl.clone();
    url.pathname = '/category';
    return NextResponse.redirect(url, 308);
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all paths except for assets, api routes, and _next
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};