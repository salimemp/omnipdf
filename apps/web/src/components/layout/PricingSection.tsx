'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, Zap } from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@omnipdf/ui/src/Card';
import { cn } from '@omnipdf/shared/src/utils';
import Link from 'next/link';

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'For personal use and occasional conversions',
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Zap,
    features: [
      '25 conversions/month',
      '25MB file size limit',
      '1GB cloud storage',
      'Basic PDF tools',
      'Google & GitHub login',
      'Community support',
      'Ad-supported',
    ],
    notIncluded: [
      'AI features',
      'All cloud services',
      'Priority support',
      'API access',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and professionals',
    monthlyPrice: 7.99,
    annualPrice: 79.99,
    icon: Sparkles,
    features: [
      'Unlimited conversions',
      '500MB file size limit',
      '50GB cloud storage',
      'All PDF tools',
      'All cloud services (4)',
      'AI Assistant (100 credits)',
      'No ads',
      'Priority email support',
    ],
    notIncluded: [
      'Team features',
      'SSO/SAML',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    monthlyPrice: 24.99,
    annualPrice: 249.99,
    icon: Building2,
    features: [
      'Everything in Pro',
      '2GB file size limit',
      '1TB cloud storage',
      'Unlimited AI credits',
      'Team management',
      'SSO/SAML',
      'API access',
      'Custom branding',
      '24/7 dedicated support',
      'Audit logs',
      'Custom contracts',
    ],
    notIncluded: [],
    popular: false,
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section className="bg-surface-50 dark:bg-surface-900 py-16 md:py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-surface-600 dark:text-surface-400">
            Choose the plan that works for you. Upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-surface-200 p-1 dark:bg-surface-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'rounded-full px-6 py-2 text-sm font-medium transition-all',
                billingCycle === 'monthly'
                  ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
                  : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-200'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={cn(
                'rounded-full px-6 py-2 text-sm font-medium transition-all',
                billingCycle === 'annual'
                  ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
                  : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-200'
              )}
            >
              Annual
              <span className="ml-2 text-xs text-green-600 font-medium">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="rounded-full bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-1 text-sm font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <Card
                variant={tier.popular ? 'elevated' : 'bordered'}
                padding="lg"
                className={cn(
                  'h-full',
                  tier.popular && 'border-primary-500 ring-2 ring-primary-500/20'
                )}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                      <tier.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="mt-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-surface-900 dark:text-white">
                      ${billingCycle === 'monthly' ? tier.monthlyPrice : (tier.annualPrice / 12).toFixed(2)}
                    </span>
                    <span className="text-surface-500">/month</span>
                  </div>
                  {billingCycle === 'annual' && tier.annualPrice > 0 && (
                    <p className="mt-1 text-sm text-green-600">
                      Billed ${tier.annualPrice} annually
                    </p>
                  )}

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 shrink-0 text-green-500" />
                        <span className="text-sm text-surface-700 dark:text-surface-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {tier.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 opacity-50">
                        <Check className="h-5 w-5 shrink-0 text-surface-400" />
                        <span className="text-sm text-surface-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-6">
                  <Link href={tier.id === 'free' ? '/auth/signup' : `/pricing/${tier.id}`} className="w-full">
                    <Button
                      variant={tier.popular ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                    >
                      {tier.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison CTA */}
        <div className="mt-12 text-center">
          <p className="text-surface-600 dark:text-surface-400">
            Need a custom solution?{' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Sales
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
