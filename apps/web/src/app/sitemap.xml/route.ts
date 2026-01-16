import { NextResponse } from 'next/server';

const baseUrl = 'https://omnipdf.com';

const staticPages = [
  '',
  '/convert',
  '/tools',
  '/pricing',
  '/auth/login',
  '/auth/signup',
  '/about',
  '/blog',
  '/help',
  '/contact',
  '/privacy',
  '/terms',
  '/security',
];

const tools = [
  '/convert/merge',
  '/convert/split',
  '/convert/compress',
  '/convert/pdf-to-word',
  '/convert/pdf-to-excel',
  '/convert/pdf-to-ppt',
  '/convert/pdf-to-images',
  '/convert/word-to-pdf',
  '/convert/excel-to-pdf',
  '/convert/ppt-to-pdf',
  '/convert/unlock',
  '/convert/protect',
  '/convert/rotate',
  '/convert/ocr',
  '/convert/edit',
];

const locales = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'ru', 'ar', 'ko', 'hi'];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Static Pages -->
  ${staticPages.map((page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
  
  <!-- Tools Pages -->
  ${tools.map((tool) => `
  <url>
    <loc>${baseUrl}${tool}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
  
  <!-- Localized Pages -->
  ${locales.map((locale) => `
  <url>
    <loc>${baseUrl}/${locale}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}" />
  </url>`).join('')}
  
  <!-- Default locale (English) -->
  <url>
    <loc>${baseUrl}/en</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en" />
  </url>
  
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
