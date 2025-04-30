import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-400">Your trusted source for AI chips and components.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-[#8B5CF6]">Home</Link></li>
              <li><Link href="/shop" className="hover:text-[#8B5CF6]">Shop</Link></li>
              <li><Link href="/blog" className="hover:text-[#8B5CF6]">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-[#8B5CF6]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@aichipstore.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Tech Street</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter</p>
            <form action="/api/subscribe" method="POST" className="flex">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="px-4 py-2 w-full bg-[#1A1A1A] border border-[#8B5CF6]/30 rounded-l-md text-white"
                required
              />
              <button
                type="submit"
                className="bg-[#8B5CF6] text-white px-4 py-2 rounded-r-md hover:bg-[#7C3AED] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}