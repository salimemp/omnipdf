import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Blog - OmniPDF | PDF Tools News and Updates",
  description:
    "Latest news, updates, and insights about OmniPDF and PDF document management.",
};

const BLOG_POSTS = [
  {
    slug: "introducing-omnipdf-ai-features",
    title: "Introducing OmniPDF AI: Smart PDF Processing with Gemini",
    excerpt:
      "We are excited to announce our new AI-powered features including smart summarization, translation, and document analysis powered by Google Gemini.",
    date: "2026-01-10",
    author: "Sarah Chen",
    category: "Product",
    readTime: "5 min read",
    image: "/images/blog/ai-features.jpg",
  },
  {
    slug: "pdf-security-best-practices",
    title: "PDF Security Best Practices for Enterprise",
    excerpt:
      "Learn how to protect your sensitive documents with our comprehensive guide to PDF encryption, access controls, and compliance requirements.",
    date: "2026-01-05",
    author: "Michael Rodriguez",
    category: "Security",
    readTime: "8 min read",
    image: "/images/blog/security.jpg",
  },
  {
    slug: "batch-processing-guide",
    title: "Mastering Batch PDF Processing: A Complete Guide",
    excerpt:
      "Discover how to process multiple PDFs simultaneously with our batch processing features, saving hours of manual work.",
    date: "2025-12-28",
    author: "Emily Watson",
    category: "Tutorial",
    readTime: "6 min read",
    image: "/images/blog/batch-processing.jpg",
  },
  {
    slug: "cloud-integration-benefits",
    title: "The Benefits of Cloud-Integrated PDF Tools",
    excerpt:
      "Why integrating PDF tools with your cloud storage can transform your document workflow and boost productivity.",
    date: "2025-12-20",
    author: "James Park",
    category: "Integration",
    readTime: "4 min read",
    image: "/images/blog/cloud-integration.jpg",
  },
  {
    slug: "mobile-pdf-management",
    title: "PDF Management on the Go: Mobile Best Practices",
    excerpt:
      "Tips and tricks for efficiently managing PDF documents on your mobile device using OmniPDF mobile app.",
    date: "2025-12-15",
    author: "Lisa Thompson",
    category: "Mobile",
    readTime: "5 min read",
    image: "/images/blog/mobile.jpg",
  },
  {
    slug: "ocr-technology-explained",
    title: "Understanding OCR Technology in PDF Processing",
    excerpt:
      "A deep dive into Optical Character Recognition and how it enables text extraction from scanned documents.",
    date: "2025-12-10",
    author: "David Kim",
    category: "Technology",
    readTime: "7 min read",
    image: "/images/blog/ocr.jpg",
  },
];

const CATEGORIES = [
  "All",
  "Product",
  "Security",
  "Tutorial",
  "Integration",
  "Mobile",
  "Technology",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <Header />

      <main>
        <section className="bg-surface-50 dark:bg-surface-900 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
              OmniPDF Blog
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl">
              Latest news, updates, and insights about PDF document management,
              productivity tips, and industry trends.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All"
                      ? "bg-primary-600 text-white"
                      : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-xl border border-surface-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-surface-800 dark:bg-surface-900"
                >
                  <div className="aspect-video bg-surface-100 dark:bg-surface-800" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        {post.category}
                      </span>
                      <span className="text-xs text-surface-500">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-surface-200 dark:bg-surface-700" />
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {post.author}
                        </span>
                      </div>
                      <span className="text-xs text-surface-500">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button className="px-6 py-3 rounded-lg border border-surface-300 text-surface-600 font-medium hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800">
                Load More Articles
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
