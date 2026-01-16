'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@omnipdf/ui/src/Card';
import { createClient } from '@/lib/supabase';
import { PricingCards } from '@/components/pricing/PricingCards';
import { SkipLink } from '@/components/accessibility/Accessibility';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/auth/signup?plan=${planId}`);
        return;
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: planId === 'pro' ? 'price_pro_monthly' : 'price_enterprise_monthly',
          customerId: session.user.id,
        }),
      });

      const { url, error } = await response.json();
      
      if (error) {
        console.error('Checkout error:', error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  const faqs = [
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal through Stripe.',
    },
    {
      q: 'Is there a free trial for Pro?',
      a: 'Yes, Pro and Enterprise plans come with a 7-day free trial. No credit card required to start.',
    },
    {
      q: 'What happens to my files if I downgrade?',
      a: "Your files remain safe. You can still access and download them, but you won't be able to upload new files beyond your tier limits.",
    },
    {
      q: 'Do you offer refunds?',
      a: 'We offer a 30-day money-back guarantee for all paid plans. Contact support@omnipdf.com for assistance.',
    },
    {
      q: 'Can I switch between monthly and annual billing?',
      a: 'Yes, you can change your billing cycle at any time. The new rate will apply on your next billing date.',
    },
    {
      q: 'Are my files secure?',
      a: 'Absolutely. We use AES-256 encryption, automatically delete files after 24 hours, and are SOC2 Type II compliant.',
    },
    {
      q: 'Is AI available on the free plan?',
      a: 'Free users get 5 AI credits per month. Pro users get 100 credits, and Enterprise users get unlimited credits.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <SkipLink targetId="main-content" />
      
      {/* Header */}
      <header className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white">
                Omni<span className="text-primary-600">PDF</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards with Currency */}
        <PricingCards />

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-surface-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} padding="md">
                <h3 className="font-semibold text-surface-900 dark:text-white">
                  {faq.q}
                </h3>
                <p className="mt-2 text-surface-600 dark:text-surface-400">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            Still have questions?
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-900 text-surface-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="font-bold text-white">OmniPDF</span>
              </Link>
              <p className="text-sm text-surface-400">
                All-in-one PDF converter with AI-powered features.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/convert" className="hover:text-white">Convert</Link></li>
                <li><Link href="/tools" className="hover:text-white">All Tools</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-800 text-center text-sm text-surface-400">
            © {new Date().getFullYear()} OmniPDF. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
