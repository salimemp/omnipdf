import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Book, Code, Shield, Zap, Globe, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation - OmniPDF",
  description:
    "Comprehensive documentation for OmniPDF features, API references, and integration guides.",
};

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    icon: Book,
    articles: [
      { title: "Quick Start Guide", href: "/docs/quick-start" },
      { title: "Account Setup", href: "/docs/account-setup" },
      { title: "Interface Tour", href: "/docs/interface-tour" },
      { title: "Keyboard Shortcuts", href: "/docs/keyboard-shortcuts" },
    ],
  },
  {
    title: "API Reference",
    description: "Technical documentation for developers",
    icon: Code,
    articles: [
      { title: "API Overview", href: "/docs/api/overview" },
      { title: "Authentication", href: "/docs/api/authentication" },
      { title: "Conversion API", href: "/docs/api/conversion" },
      { title: "Webhook Events", href: "/docs/api/webhooks" },
    ],
  },
  {
    title: "Security & Compliance",
    description: "Security practices and compliance information",
    icon: Shield,
    articles: [
      { title: "Security Overview", href: "/docs/security/overview" },
      { title: "Data Encryption", href: "/docs/security/encryption" },
      { title: "Compliance Certifications", href: "/docs/security/compliance" },
      { title: "GDPR Compliance", href: "/docs/security/gdpr" },
    ],
  },
  {
    title: "Integrations",
    description: "Connect OmniPDF with your favorite tools",
    icon: Layers,
    articles: [
      { title: "Cloud Storage", href: "/docs/integrations/cloud-storage" },
      {
        title: "Google Workspace",
        href: "/docs/integrations/google-workspace",
      },
      { title: "Microsoft 365", href: "/docs/integrations/microsoft-365" },
      { title: "Zapier", href: "/docs/integrations/zapier" },
    ],
  },
  {
    title: "Enterprise",
    description: "Enterprise deployment and management",
    icon: Globe,
    articles: [
      { title: "Enterprise Overview", href: "/docs/enterprise/overview" },
      { title: "SSO/SAML Setup", href: "/docs/enterprise/sso" },
      { title: "Team Management", href: "/docs/enterprise/team-management" },
      { title: "Custom Branding", href: "/docs/enterprise/branding" },
    ],
  },
  {
    title: "Performance",
    description: "Optimize your workflow",
    icon: Zap,
    articles: [
      { title: "Batch Processing", href: "/docs/performance/batch-processing" },
      { title: "API Rate Limits", href: "/docs/performance/rate-limits" },
      { title: "Best Practices", href: "/docs/performance/best-practices" },
    ],
  },
];

const POPULAR_ARTICLES = [
  "How to convert PDF to Word",
  "Merge multiple PDF files",
  "Compress PDF without quality loss",
  "Password protect PDF files",
  "Edit text in PDF documents",
  "OCR for scanned documents",
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <Header />

      <main>
        <section className="bg-surface-50 dark:bg-surface-900 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 mb-8">
              Everything you need to know to get the most out of OmniPDF
            </p>

            <div className="relative max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search documentation..."
                className="w-full px-6 py-4 rounded-xl border border-surface-300 bg-white dark:border-surface-700 dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {DOC_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-surface-200 p-6 dark:border-surface-800"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <section.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-surface-900 dark:text-white">
                        {section.title}
                      </h2>
                      <p className="text-sm text-surface-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {section.articles.map((article) => (
                      <li key={article.href}>
                        <Link
                          href={article.href}
                          className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-50 dark:bg-surface-900 py-12">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6 text-center">
              Popular Articles
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_ARTICLES.map((article) => (
                <Link
                  key={article}
                  href={`/docs/${article.toLowerCase().replace(/ /g, "-")}`}
                  className="px-4 py-2 rounded-full border border-surface-200 bg-white text-surface-600 hover:border-primary-300 hover:text-primary-600 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-primary-600"
                >
                  {article}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
              Need help with something specific?
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Our support team is here to assist you with any questions.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:support@omnipdf.com"
                className="px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
              >
                Contact Support
              </a>
              <a
                href="https://github.com/omnipdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-surface-300 text-surface-600 font-medium hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800"
              >
                GitHub Discussions
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
