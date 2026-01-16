'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Globe,
  Cloud,
  Sparkles,
  Users,
  Smartphone,
  Monitor,
  Cpu,
  Lock,
  Gauge,
  Languages,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process files in seconds with our edge computing infrastructure. No waiting, no queues.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Military-Grade Security',
    description: 'AES-256 encryption, automatic file deletion, and zero-knowledge architecture.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Globe,
    title: '50+ Languages',
    description: 'AI-powered translation for documents in over 50 languages. Truly global.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    description: 'Integrate with Google Drive, Dropbox, OneDrive, and Box. Work anywhere.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Summarize, translate, and chat with your documents using Gemini AI.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Real Collaboration',
    description: 'Work together on documents in real-time. Share, comment, and collaborate.',
    color: 'from-teal-400 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works perfectly on all devices. Desktop, tablet, and mobile.',
    color: 'from-indigo-400 to-violet-500',
  },
  {
    icon: Monitor,
    title: 'Desktop Apps',
    description: 'Native apps for Windows, macOS, and Linux. Work offline.',
    color: 'from-amber-400 to-yellow-500',
  },
];

const technicalFeatures = [
  {
    icon: Cpu,
    title: 'Edge Computing',
    description: 'Powered by Cloudflare Workers for global, low-latency processing.',
  },
  {
    icon: Lock,
    title: 'SOC2 Compliant',
    description: 'Enterprise-grade security with full audit logging and compliance.',
  },
  {
    icon: Gauge,
    title: 'Optimized Engine',
    description: 'Custom-built PDF processing engine for maximum performance.',
  },
  {
    icon: Languages,
    title: 'Universal Support',
    description: 'Convert between 25+ file formats with perfect fidelity.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
            Why Choose OmniPDF?
          </h2>
          <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
            Built with modern technology for the best experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl bg-white p-6 shadow-soft hover:shadow-medium transition-all dark:bg-surface-800"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-surface-600 dark:text-surface-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technical Features */}
        <div className="rounded-3xl bg-gradient-to-br from-surface-900 to-surface-800 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">
              Enterprise-Grade Technology
            </h2>
            <p className="mt-2 text-surface-400">
              Built on modern infrastructure for reliability and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white mb-3">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-surface-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
