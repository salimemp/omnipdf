'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Merge,
  Split,
  Minimize,
  RotateCw,
  FileText,
  Lock,
  Unlock,
  PenTool,
  Image,
  Download,
  Edit3,
  Scan,
  Wand2,
} from 'lucide-react';

const tools = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one document',
    icon: Merge,
    href: '/convert/merge',
    color: 'from-blue-500 to-blue-600',
    available: true,
  },
  {
    name: 'Split PDF',
    description: 'Extract pages or split into separate files',
    icon: Split,
    href: '/convert/split',
    color: 'from-purple-500 to-purple-600',
    available: true,
  },
  {
    name: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: Minimize,
    href: '/convert/compress',
    color: 'from-green-500 to-green-600',
    available: true,
  },
  {
    name: 'Convert PDF',
    description: 'Convert to and from any format',
    icon: RotateCw,
    href: '/convert',
    color: 'from-orange-500 to-orange-600',
    available: true,
  },
  {
    name: 'PDF to Word',
    description: 'Convert PDF to editable DOCX documents',
    icon: FileText,
    href: '/convert/pdf-to-word',
    color: 'from-blue-600 to-blue-700',
    available: true,
  },
  {
    name: 'PDF to Excel',
    description: 'Extract data to spreadsheets',
    icon: Edit3,
    href: '/convert/pdf-to-excel',
    color: 'from-green-600 to-green-700',
    available: true,
  },
  {
    name: 'Unlock PDF',
    description: 'Remove password protection',
    icon: Unlock,
    href: '/convert/unlock',
    color: 'from-yellow-500 to-yellow-600',
    available: true,
  },
  {
    name: 'Protect PDF',
    description: 'Add password protection to your files',
    icon: Lock,
    href: '/convert/protect',
    color: 'from-red-500 to-red-600',
    available: true,
  },
  {
    name: 'Edit PDF',
    description: 'Add text, images, and annotations',
    icon: PenTool,
    href: '/convert/edit',
    color: 'from-indigo-500 to-indigo-600',
    available: false,
  },
  {
    name: 'OCR',
    description: 'Extract text from scanned documents',
    icon: Scan,
    href: '/convert/ocr',
    color: 'from-pink-500 to-pink-600',
    available: false,
  },
  {
    name: 'AI Summary',
    description: 'Summarize documents with AI',
    icon: Wand2,
    href: '/convert/ai-summary',
    color: 'from-accent-500 to-accent-600',
    available: false,
  },
  {
    name: 'PDF to JPG',
    description: 'Extract images from PDF pages',
    icon: Image,
    href: '/convert/pdf-to-jpg',
    color: 'from-teal-500 to-teal-600',
    available: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ToolsSection() {
  return (
    <section className="bg-surface-50 dark:bg-surface-900 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
            All the PDF Tools You Need
          </h2>
          <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
            Powerful tools to work with your documents. More coming soon.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.name} variants={item}>
              <Link
                href={tool.href}
                className={`group relative block rounded-xl bg-white p-5 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 dark:bg-surface-800 ${
                  !tool.available ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg transition-transform group-hover:scale-110`}
                >
                  <tool.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mt-4 font-semibold text-surface-900 dark:text-white">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm text-surface-500">
                  {tool.description}
                </p>

                {/* Badge */}
                {!tool.available && (
                  <span className="absolute right-3 top-3 rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-500 dark:bg-surface-700">
                    Soon
                  </span>
                )}

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <Download className="h-5 w-5 text-primary-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            View All 25+ Tools
            <Download className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
