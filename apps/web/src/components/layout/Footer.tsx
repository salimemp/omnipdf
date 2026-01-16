'use client';

import Link from 'next/link';
import { FileText, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'Convert PDF', href: '/convert' },
      { label: 'All Tools', href: '/tools' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'API', href: '/api' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Status', href: '/status' },
      { label: 'Integrations', href: '/integrations' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Compliance', href: '/compliance' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/omnipdf', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/omnipdf', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/omnipdf', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@omnipdf.com', label: 'Email' },
  ];

  return (
    <footer className="bg-surface-900 text-surface-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">
                Omni<span className="text-primary-400">PDF</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-surface-400 max-w-xs">
              The most powerful all-in-one PDF converter. Convert, edit, and manage PDFs with AI-powered features.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-surface-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-400">
              © {new Date().getFullYear()} OmniPDF. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-surface-500">Made with love worldwide</span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-surface-800 rounded text-surface-400">
                  CCPA
                </span>
                <span className="text-xs px-2 py-1 bg-surface-800 rounded text-surface-400">
                  HIPAA
                </span>
                <span className="text-xs px-2 py-1 bg-surface-800 rounded text-surface-400">
                  SOC2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
