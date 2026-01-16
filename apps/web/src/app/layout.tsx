import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0ea5e9',
};

const baseUrl = 'https://omnipdf.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'OmniPDF - All-in-One PDF Converter & Editor',
    template: '%s | OmniPDF',
  },
  description: 'Convert, merge, split, compress, and edit PDFs with AI-powered features. Free, fast, and secure. Supports 25+ file formats.',
  keywords: [
    'PDF converter',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'PDF to Word',
    'PDF to Excel',
    'PDF tools',
    'AI PDF',
    'document conversion',
    'free PDF converter',
    'online PDF tools',
    'PDF manipulation',
    'convert to PDF',
    'PDF from Word',
    'OCR PDF',
    'edit PDF',
    'sign PDF',
    'protect PDF',
    'unlock PDF',
  ].join(', '),
  authors: [{ name: 'OmniPDF', url: `${baseUrl}/about` }],
  creator: 'OmniPDF',
  publisher: 'OmniPDF',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'OmniPDF',
    title: 'OmniPDF - All-in-One PDF Converter & Editor',
    description: 'Convert, merge, split, compress, and edit PDFs with AI-powered features. Free, fast, and secure.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OmniPDF - All-in-One PDF Converter',
      },
      {
        url: '/images/og-image-square.png',
        width: 1080,
        height: 1080,
        alt: 'OmniPDF Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@OmniPDF',
    creator: '@OmniPDF',
    title: 'OmniPDF - All-in-One PDF Converter & Editor',
    description: 'Convert, merge, split, compress, and edit PDFs with AI-powered features. Free, fast, and secure.',
    images: [
      {
        url: '/images/twitter-image.png',
        width: 1200,
        height: 600,
        alt: 'OmniPDF - All-in-One PDF Converter',
      },
    ],
  },
  facebook: {
    appId: '123456789',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en': baseUrl,
      'es': `${baseUrl}/es`,
      'fr': `${baseUrl}/fr`,
      'de': `${baseUrl}/de`,
      'zh': `${baseUrl}/zh`,
      'ja': `${baseUrl}/ja`,
      'pt': `${baseUrl}/pt`,
      'ru': `${baseUrl}/ru`,
      'ar': `${baseUrl}/ar`,
      'ko': `${baseUrl}/ko`,
    },
  },
  category: 'productivity',
  classification: 'Software Application',
  other: {
    'og:price:amount': '0',
    'og:price:currency': 'USD',
    'og:availability': 'in stock',
    'product:price:amount': '0',
    'product:price:currency': 'USD',
    'application-name': 'OmniPDF',
    'msapplication-TileColor': '#0ea5e9',
  },
  assets: [
    '/fonts/Inter.woff2',
  ],
  bookmarks: [
    `${baseUrl}/convert`,
    `${baseUrl}/pricing`,
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="OmniPDF Blog" href="/blog/rss.xml" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.resend.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'OmniPDF',
              applicationCategory: 'ProductivityApplication',
              operatingSystem: 'Web, Windows, macOS, Linux, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              author: {
                '@type': 'Organization',
                name: 'OmniPDF',
                url: baseUrl,
              },
              publisher: {
                '@type': 'Organization',
                name: 'OmniPDF',
                url: baseUrl,
              },
              datePublished: '2024-01-01',
              dateModified: new Date().toISOString().split('T')[0],
              description: 'All-in-One PDF Converter with AI-powered features. Convert, merge, split, compress, and edit PDFs.',
              features: [
                'PDF to Word conversion',
                'PDF to Excel conversion',
                'Merge PDF files',
                'Split PDF files',
                'Compress PDF files',
                'AI-powered document summarization',
                'Multi-language translation',
                'OCR scanning',
              ],
              screenshot: [
                `${baseUrl}/images/screenshot-1.png`,
                `${baseUrl}/images/screenshot-2.png`,
              ],
              softwareVersion: '1.0.0',
              url: baseUrl,
            }),
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: baseUrl,
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
