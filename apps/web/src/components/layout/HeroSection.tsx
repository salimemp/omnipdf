'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Zap, Shield, Globe, Sparkles } from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { FileDropZone } from '@/components/convert/FileDropZone';

export function HeroSection() {
  const [showConverter, setShowConverter] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-900/20" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent-200/30 blur-3xl dark:bg-accent-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered PDF Tools
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            All-in-One PDF
            <br />
            <span className="gradient-text">Converter & Editor</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-surface-600 dark:text-surface-400"
          >
            Convert, merge, split, compress, edit, and annotate PDFs with AI-powered features.
            Free, fast, and secure. Works with Google Drive, Dropbox, and more.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/convert">
              <Button variant="primary" size="lg" className="gap-2">
                Convert PDF Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">
                View Pricing
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Secure Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span>50+ Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <span>25+ Formats</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Converter */}
        {showConverter ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <FileDropZone onClose={() => setShowConverter(false)} onFilesSelected={(files) => {
              console.log('Files selected:', files);
              // Handle file selection - could navigate to convert page
            }} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <button
              onClick={() => setShowConverter(true)}
              className="group relative mx-auto block w-full max-w-2xl rounded-2xl border-2 border-dashed border-surface-300 bg-white/50 p-8 text-center transition-all hover:border-primary-500 hover:bg-white dark:border-surface-600 dark:bg-surface-800/50 dark:hover:border-primary-500 dark:hover:bg-surface-800"
            >
              <FileText className="mx-auto h-12 w-12 text-surface-400 transition-transform group-hover:scale-110 group-hover:text-primary-500" />
              <p className="mt-4 font-medium text-surface-700 dark:text-surface-300">
                Drop your PDF here or click to browse
              </p>
              <p className="mt-1 text-sm text-surface-500">
                Supports PDF, DOCX, XLSX, PPTX, and more
              </p>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
