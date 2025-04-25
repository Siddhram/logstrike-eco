import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Mock function to get blog post by ID
const getBlogPostById = (id: string) => {
  const posts = [
    {
      id: "1",
      title: "The Future of AI Hardware: Trends to Watch in 2023",
      content: `
        <p>The landscape of AI hardware is evolving rapidly, with new innovations and approaches emerging to address the growing demands of artificial intelligence workloads. In this article, we'll explore the key trends shaping the future of AI chips and what to expect in 2023 and beyond.</p>
        
        <h2>1. Specialized AI Accelerators</h2>
        <p>General-purpose GPUs have dominated the AI hardware space for years, but we're seeing a significant shift toward specialized accelerators designed for specific AI workloads. These purpose-built chips offer superior performance and energy efficiency for targeted applications:</p>
        <ul>
          <li><strong>Training Accelerators:</strong> Optimized for the massive parallel computations required during model training.</li>
          <li><strong>Inference Engines:</strong> Streamlined for deploying trained models with lower latency and power requirements.</li>
          <li><strong>Domain-Specific Accelerators:</strong> Tailored for particular AI domains like computer vision, natural language processing, or recommendation systems.</li>
        </ul>
        
        <h2>2. Heterogeneous Computing Architectures</h2>
        <p>Rather than relying on a single type of processor, modern AI systems are increasingly adopting heterogeneous computing approaches that combine different types of processing units:</p>
        <ul>
          <li><strong>CPU + GPU + FPGA:</strong> Flexible systems that can allocate different workloads to the most appropriate processor.</li>
          <li><strong>System-on-Chip (SoC) Designs:</strong> Integrated solutions that combine various processing elements on a single chip.</li>
          <li><strong>Chiplet Architecture:</strong> Modular approach allowing different processing elements to be combined in a single package.</li>
        </ul>
        
        <h2>3. Edge AI Processing</h2>
        <p>As AI applications expand beyond data centers to edge devices, we're seeing significant innovation in low-power, high-efficiency AI chips designed for deployment in resource-constrained environments:</p>
        <ul>
          <li><strong>Mobile AI Processors:</strong> Dedicated neural processing units in smartphones and tablets.</li>
          <li><strong>IoT-Optimized AI Chips:</strong> Ultra-low power solutions for smart sensors and embedded systems.</li>
          <li><strong>Autonomous Vehicle Processors:</strong> Specialized hardware for real-time AI processing in self-driving cars.</li>
        </ul>
        
        <h2>4. Memory-Centric Architectures</h2>
        <p>The traditional von Neumann architecture, with its separation of processing and memory, creates bottlenecks for data-intensive AI workloads. New approaches are emerging to address this challenge:</p>
        <ul>
          <li><strong>In-Memory Computing:</strong> Performing computations directly within memory to reduce data movement.</li>
          <li><strong>Near-Memory Processing:</strong> Placing computational elements closer to memory to reduce latency.</li>
          <li><strong>High-Bandwidth Memory (HBM):</strong> Advanced memory technologies providing massive bandwidth for AI accelerators.</li>
        </ul>
        
        <h2>5. Energy Efficiency Innovations</h2>
        <p>As AI models grow larger and more complex, energy consumption has become a critical concern. Hardware designers are focusing on various approaches to improve efficiency:</p>
        <ul>
          <li><strong>Reduced Precision Computing:</strong> Using lower numerical precision (like 8-bit or 4-bit operations) where full precision isn't required.</li>
          <li><strong>Sparsity Exploitation:</strong> Hardware support for efficiently processing sparse neural networks.</li>
          <li><strong>Dynamic Power Management:</strong> Sophisticated techniques to optimize power usage based on workload characteristics.</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>The AI hardware landscape is undergoing a period of unprecedented innovation and specialization. As we move through 2023, we expect to see continued diversification of AI accelerator architectures, with a growing emphasis on energy efficiency, edge deployment, and domain-specific optimizations. Organizations investing in AI infrastructure should carefully evaluate these trends to ensure their hardware choices align with their specific AI workloads and requirements.</p>
      `,
      image: "https://via.placeholder.com/1200x600?text=AI+Hardware+Trends",
      date: "May 15, 2023",
      author: "Dr. Sarah Chen",
      authorTitle: "AI Hardware Specialist",
      authorImage: "https://via.placeholder.com/100x100?text=SC",
      category: "Industry Trends",
      tags: ["AI", "Hardware", "Trends", "2023"],
      relatedPosts: ["2", "3", "5"],
    },
    // More posts would be defined here
  ];
  
  return posts.find(post => post.id === id);
};

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPostById(params.id);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/blog" className="text-gray-500 hover:text-gray-700">
              Blog
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-900 font-medium">{post.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <Link
            href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-blue-600 font-medium"
          >
            {post.category}
          </Link>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-500">{post.date}</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        
        <div className="flex items-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image
              src={post.authorImage}
              alt={post.author}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{post.author}</div>
            <div className="text-sm text-gray-500">{post.authorTitle}</div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-12">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-8">
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          <div className="mt-12">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-lg">{post.author}</div>
                <div className="text-gray-600">{post.authorTitle}</div>
              </div>
            </div>
            <p className="mt-4">
              Dr. Sarah Chen is a leading expert in AI hardware architecture with over 15 years of experience in the semiconductor industry. She holds a Ph.D. in Computer Engineering from Stanford University and has published numerous papers on accelerator design for machine learning workloads.
            </p>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Comments (3)</h3>
            
            {/* Comment Form */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Leave a Comment</h4>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <Button type="submit">Post Comment</Button>
              </form>
            </div>
            
            {/* Comments List */}
            <div className="space-y-6">
              {[
                {
                  id: "c1",
                  name: "Michael Johnson",
                  date: "May 16, 2023",
                  content: "Great article! I especially found the section on edge AI processing insightful. As someone working in IoT, I'm seeing firsthand how these specialized chips are transforming what's possible at the edge.",
                },
                {
                  id: "c2",
                  name: "Lisa Wang",
                  date: "May 16, 2023",
                  content: "I'd add that the trend toward open-source hardware designs is also gaining momentum. Projects like RISC-V based AI accelerators are enabling more innovation and customization options for specialized workloads.",
                },
                {
                  id: "c3",
                  name: "Robert Chen",
                  date: "May 17, 2023",
                  content: "The memory-centric architectures point is spot on. The von Neumann bottleneck has been a major limitation for AI workloads, and it's exciting to see new approaches addressing this fundamental challenge.",
                },
              ].map((comment) => (
                <div key={comment.id} className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{comment.name}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-2.5">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {[
                  { name: "Industry Trends", count: 8 },
                  { name: "Product Comparisons", count: 12 },
                  { name: "Guides", count: 15 },
                  { name: "Sustainability", count: 6 },
                  { name: "Case Studies", count: 9 },
                ].map((category) => (
                  <li key={category.name}>
                    <Link
                      href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex justify-between items-center text-gray-700 hover:text-blue-600"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {[
                  {
                    id: "2",
                    title: "Comparing Top AI Accelerators: NVIDIA vs Google vs Intel",
                    date: "May 10, 2023",
                    image: "https://via.placeholder.com/100x100?text=AI+Accelerators",
                  },
                  {
                    id: "3",
                    title: "How to Choose the Right AI Chip for Your Machine Learning Project",
                    date: "May 5, 2023",
                    image: "https://via.placeholder.com/100x100?text=Choosing+AI+Chips",
                  },
                  {
                    id: "4",
                    title: "Energy Efficiency in AI Computing: Challenges and Solutions",
                    date: "April 28, 2023",
                    image: "https://via.placeholder.com/100x100?text=Energy+Efficiency",
                  },
                ].map((recentPost) => (
                  <Link key={recentPost.id} href={`/blog/${recentPost.id}`}>
                    <div className="flex items-center group">
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={recentPost.image}
                          alt={recentPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium group-hover:text-blue-600 line-clamp-2">
                          {recentPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{recentPost.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest AI hardware news and insights delivered to your inbox.
              </p>
              <form>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: "2",
              title: "Comparing Top AI Accelerators: NVIDIA vs Google vs Intel",
              excerpt: "A detailed comparison of the leading AI accelerators on the market, examining performance, efficiency, and use cases.",
              image: "https://via.placeholder.com/400x250?text=AI+Accelerators+Comparison",
              date: "May 10, 2023",
            },
            {
              id: "3",
              title: "How to Choose the Right AI Chip for Your Machine Learning Project",
              excerpt: "A comprehensive guide to selecting the appropriate AI hardware based on your specific machine learning requirements and constraints.",
              image: "https://via.placeholder.com/400x250?text=Choosing+AI+Chips",
              date: "May 5, 2023",
            },
            {
              id: "5",
              title: "The Rise of Custom AI Chips: Case Studies and Success Stories",
              excerpt: "Exploring how companies are developing custom silicon to gain competitive advantages in AI performance and efficiency.",
              image: "https://via.placeholder.com/400x250?text=Custom+AI+Chips",
              date: "April 20, 2023",
            },
          ].map((relatedPost) => (
            <div
              key={relatedPost.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${relatedPost.id}`}>
                <div className="relative h-48">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{relatedPost.date}</div>
                <Link href={`/blog/${relatedPost.id}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
                    {relatedPost.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                <Link
                  href={`/blog/${relatedPost.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}