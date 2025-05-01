"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

// Mock blog posts data
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI Hardware: Trends to Watch in 2023",
    excerpt:
      "Explore the latest trends in AI hardware and what to expect in the coming year, from specialized chips to energy-efficient designs.",
    image: "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c=",
    date: "May 15, 2023",
    author: "Dr. Sarah Chen",
    category: "Industry Trends",
    tags: ["AI", "Hardware", "Trends", "2023"],
  },
  {
    id: "2",
    title: "Comparing Top AI Accelerators: NVIDIA vs Google vs Intel",
    excerpt:
      "A detailed comparison of the leading AI accelerators on the market, examining performance, efficiency, and use cases.",
    image: "https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c=",
    date: "May 10, 2023",
    author: "Michael Rodriguez",
    category: "Product Comparisons",
    tags: ["NVIDIA", "Google", "Intel", "Comparison"],
  },
  {
    id: "3",
    title: "How to Choose the Right AI Chip for Your Machine Learning Project",
    excerpt:
      "A comprehensive guide to selecting the appropriate AI hardware based on your specific machine learning requirements and constraints.",
    image: "https://via.placeholder.com/800x450?text=Choosing+AI+Chips",
    date: "May 5, 2023",
    author: "Emily Watson",
    category: "Guides",
    tags: ["Guide", "Selection", "ML Projects"],
  },
  {
    id: "4",
    title: "Energy Efficiency in AI Computing: Challenges and Solutions",
    excerpt:
      "Examining the growing energy demands of AI workloads and innovative approaches to building more sustainable AI infrastructure.",
    image: "https://via.placeholder.com/800x450?text=Energy+Efficiency+AI",
    date: "April 28, 2023",
    author: "Dr. James Liu",
    category: "Sustainability",
    tags: ["Energy Efficiency", "Green AI", "Sustainability"],
  },
  {
    id: "5",
    title: "The Rise of Custom AI Chips: Case Studies and Success Stories",
    excerpt:
      "Exploring how companies are developing custom silicon to gain competitive advantages in AI performance and efficiency.",
    image: "https://via.placeholder.com/800x450?text=Custom+AI+Chips",
    date: "April 20, 2023",
    author: "Alexandra Kim",
    category: "Case Studies",
    tags: ["Custom Chips", "Case Studies", "Innovation"],
  },
];

// Categories for filtering
const categories = [
  "All",
  "Industry Trends",
  "Product Comparisons",
  "Guides",
  "Sustainability",
  "Case Studies",
];

export default function BlogPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-16 bg-black text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">AI Chip Blog</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest news, trends, and insights in AI hardware
          and machine learning acceleration.
        </p>
      </div>
  
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              category === "All"
                ? "bg-[#B146FF] text-white"
                : "bg-[#111111] text-gray-300 hover:bg-[#1a1a1a]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
  
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-[#111111] rounded-xl overflow-hidden shadow-lg hover:shadow-[#B146FF]/10 transition-shadow border border-[#B146FF]/10"
          >
            <div 
              className="relative h-48 cursor-pointer"
              onClick={() => router.push(`/blog/${post.id}`)}
            >
              <img
                src="https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c="
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-[#B146FF]">
                  {post.category}
                </span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-sm text-gray-400">{post.date}</span>
              </div>
              <h3 
                className="text-xl font-bold mb-2 text-white hover:text-[#B146FF] cursor-pointer"
                onClick={() => router.push(`/blog/${post.id}`)}
              >
                {post.title}
              </h3>
              <p className="text-gray-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#1a1a1a] rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-300">{post.author}</span>
                </div>
                <button
                  onClick={() => router.push(`/blog/${post.id}`)}
                  className="text-[#B146FF] hover:text-[#9333EA] text-sm font-medium"
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {/* Newsletter Signup */}
      <div className="bg-[#111111] rounded-xl p-8 mb-16 border border-[#B146FF]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-400 mb-6">
            Get the latest AI hardware news, product updates, and exclusive
            offers delivered directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md bg-black border border-[#B146FF]/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B146FF] focus:border-transparent"
              required
            />
            <Button type="submit" className="bg-[#B146FF] hover:bg-[#9333EA] text-white">Subscribe</Button>
          </form>
        </div>
      </div>
  
      {/* Popular Tags */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(
            new Set(blogPosts.flatMap((post) => post.tags))
          ).map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`)}
              className="px-3 py-1 bg-[#111111] text-gray-300 rounded-full text-sm hover:bg-[#1a1a1a] border border-[#B146FF]/20"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}