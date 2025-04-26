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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Chip Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest news, trends, and insights in AI hardware
          and machine learning acceleration.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <img
            src="https://media.istockphoto.com/id/2183748780/photo/artificial-intelligence.jpg?s=1024x1024&w=is&k=20&c=SSToyScegnkbVgfXpeU-9bQ8DVnUO7WV1U7KWw1oj_c="
            alt="Featured post"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
              <span className="ml-3 text-white text-sm">May 20, 2023</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              The Next Generation of AI Hardware: What's Coming in 2024
            </h2>
            <p className="text-gray-200 mb-6 max-w-3xl">
              Get an exclusive preview of the upcoming AI hardware innovations
              that will shape the industry in the coming year, from quantum
              accelerators to neuromorphic computing.
            </p>
            <Button onClick={() => router.push('/blog/next-gen-ai-hardware')}>
              Read Article
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              category === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
            className="bg-[#111111] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                <span className="text-sm font-medium text-blue-600">
                  {post.category}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <h3 
                className="text-xl font-bold mb-2 hover:text-blue-600 cursor-pointer"
                onClick={() => router.push(`/blog/${post.id}`)}
              >
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
                <button
                  onClick={() => router.push(`/blog/${post.id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-[#111111] rounded-xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest AI hardware news, product updates, and exclusive
            offers delivered directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="text-xl font-bold mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(
            new Set(blogPosts.flatMap((post) => post.tags))
          ).map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`)}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}