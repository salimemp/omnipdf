'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@omnipdf/ui/src/Card';
import { cn } from '@omnipdf/shared/src/utils';
import { CurrencySelector, LocalizedPrice, formatLocalizedPrice } from '@/components/localization/CurrencySelector';
import { LanguageSelector } from '@/components/accessibility/LanguageSelector';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  notIncluded: string[];
  popular: boolean;
  cta: string;
  href: string;
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For personal use',
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    icon: Zap,
    features: [
      '25 conversions/month',
      '25MB file size limit',
      '1GB cloud storage',
      'Basic PDF tools',
      'Google & GitHub login',
      'Community support',
    ],
    notIncluded: [
      'AI features',
      'All cloud services',
      'Priority support',
      'API access',
    ],
    popular: false,
    cta: 'Get Started',
    href: '/auth/signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users',
    monthlyPriceUSD: 7.99,
    annualPriceUSD: 79.99,
    icon: Sparkles,
    features: [
      'Unlimited conversions',
      '500MB file size limit',
      '50GB cloud storage',
      'All PDF tools',
      'All cloud services (4)',
      'AI Assistant (100 credits/month)',
      'No ads',
      'Priority email support',
    ],
    notIncluded: [
      'Team features',
      'SSO/SAML',
      'API access',
    ],
    popular: true,
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams',
    monthlyPriceUSD: 24.99,
    annualPriceUSD: 249.99,
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
    cta: 'Contact Sales',
    href: '/contact?plan=enterprise',
  },
];

interface PricingCardsProps {
  plans?: PricingPlan[];
  showCurrencySelector?: boolean;
  showLanguageSelector?: boolean;
}

export function PricingCards({
  plans = defaultPlans,
  showCurrencySelector = true,
  showLanguageSelector = true,
}: PricingCardsProps) {
  const { i18n } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [localizedPrices, setLocalizedPrices] = useState<Record<string, LocalizedPrice>>({});

  // Calculate localized prices when currency changes
  useEffect(() => {
    const prices: Record<string, LocalizedPrice> = {};
    plans.forEach((plan) => {
      const usdPrice = billingCycle === 'monthly' ? plan.monthlyPriceUSD : plan.annualPriceUSD / 12;
      
      // Use the CurrencySelector's internal calculation
      const formatted = formatLocalizedPrice(usdPrice, selectedCurrency, true);
      
      prices[plan.id] = {
        amount: usdPrice,
        currency: {
          code: selectedCurrency,
          ...getCurrencyData(selectedCurrency),
        },
        subtotal: usdPrice * getCurrencyData(selectedCurrency).rate,
        tax: 0,
        total: usdPrice * getCurrencyData(selectedCurrency).rate,
        formatted: formatCurrency(usdPrice, selectedCurrency),
        formattedSubtotal: '',
        formattedTax: '',
      };
    });
    setLocalizedPrices(prices);
  }, [billingCycle, selectedCurrency, plans]);

  return (
    <div>
      {/* Language and Currency Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        {showLanguageSelector && (
          <LanguageSelector variant="dropdown" showFlag />
        )}
        {showCurrencySelector && (
          <CurrencySelector
            usdAmount={7.99}
            showDetails={false}
            variant="default"
            onCurrencyChange={(currency) => setSelectedCurrency(currency.code)}
          />
        )}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-4 rounded-full bg-surface- dark:bg-surface-200 p-1800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'rounded-full px-6 py-2 text-sm font-medium transition-all',
              billingCycle === 'monthly'
                ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
                : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-200'
            )}
            aria-pressed={billingCycle === 'monthly'}
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
            aria-pressed={billingCycle === 'annual'}
          >
            Annual
            <span className="ml-2 text-xs text-green-600 font-medium">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="rounded-full bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </span>
              </div>
            )}

            <Card
              variant={plan.popular ? 'elevated' : 'bordered'}
              padding="lg"
              className={cn(
                'h-full',
                plan.popular && 'border-primary-500 ring-2 ring-primary-500/20'
              )}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                    <plan.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="mt-4">
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-surface-900 dark:text-white">
                    {localizedPrices[plan.id]?.formatted.split(' ')[0] || 
                      (plan.monthlyPriceUSD === 0 ? '$0' : formatCurrency(plan.monthlyPriceUSD, selectedCurrency))}
                  </span>
                  <span className="text-surface-500">/month</span>
                </div>
                {billingCycle === 'annual' && plan.annualPriceUSD > 0 && (
                  <p className="mt-1 text-sm text-green-600">
                    Billed {formatCurrency(plan.annualPriceUSD, selectedCurrency)} annually
                  </p>
                )}

                {/* Tax Info */}
                <p className="mt-2 text-xs text-surface-500">
                  {getTaxNameForCurrency(selectedCurrency) && 
                   getTaxRateForCurrency(selectedCurrency) > 0 ? (
                    `Includes ${getTaxRateForCurrency(selectedCurrency)}% ${getTaxNameForCurrency(selectedCurrency)}`
                  ) : (
                    'No additional taxes'
                  )}
                </p>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-sm text-surface-700 dark:text-surface-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 opacity-50">
                      <Check className="h-5 w-5 shrink-0 text-surface-400" />
                      <span className="text-sm text-surface-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-6">
                <a href={plan.href} className="block w-full">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helper functions - memoized for performance
const currencyData: Record<string, { symbol: string; name: string; rate: number; locale: string; taxRate: number; taxName: string }> = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1.0, locale: 'en-US', taxRate: 0, taxName: '' },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE', taxRate: 20, taxName: 'VAT' },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.79, locale: 'en-GB', taxRate: 20, taxName: 'VAT' },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 149.50, locale: 'ja-JP', taxRate: 10, taxName: 'Consumption Tax' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', rate: 7.24, locale: 'zh-CN', taxRate: 6, taxName: 'VAT' },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.12, locale: 'en-IN', taxRate: 18, taxName: 'GST' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', rate: 4.97, locale: 'pt-BR', taxRate: 17, taxName: 'ICMS' },
  KRW: { symbol: '₩', name: 'South Korean Won', rate: 1298.00, locale: 'ko-KR', taxRate: 10, taxName: 'VAT' },
  MXN: { symbol: '$', name: 'Mexican Peso', rate: 17.15, locale: 'es-MX', taxRate: 16, taxName: 'IVA' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.53, locale: 'en-AU', taxRate: 10, taxName: 'GST' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.36, locale: 'en-CA', taxRate: 13, taxName: 'HST' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', rate: 0.88, locale: 'de-CH', taxRate: 7.7, taxName: 'VAT' },
  RUB: { symbol: '₽', name: 'Russian Ruble', rate: 91.50, locale: 'ru-RU', taxRate: 20, taxName: 'VAT' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', rate: 1.34, locale: 'en-SG', taxRate: 9, taxName: 'GST' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', rate: 7.82, locale: 'en-HK', taxRate: 0, taxName: '' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.65, locale: 'en-NZ', taxRate: 15, taxName: 'GST' },
  ZAR: { symbol: 'R', name: 'South African Rand', rate: 18.65, locale: 'en-ZA', taxRate: 15, taxName: 'VAT' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67, locale: 'ar-AE', taxRate: 5, taxName: 'VAT' },
  THB: { symbol: '฿', name: 'Thai Baht', rate: 35.80, locale: 'th-TH', taxRate: 7, taxName: 'VAT' },
  PLN: { symbol: 'zł', name: 'Polish Zloty', rate: 3.98, locale: 'pl-PL', taxRate: 23, taxName: 'VAT' },
  TRY: { symbol: '₺', name: 'Turkish Lira', rate: 29.00, locale: 'tr-TR', taxRate: 20, taxName: 'VAT' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', rate: 15650.00, locale: 'id-ID', taxRate: 11, taxName: 'VAT' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.72, locale: 'ms-MY', taxRate: 6, taxName: 'SST' },
  PHP: { symbol: '₱', name: 'Philippine Peso', rate: 55.80, locale: 'en-PH', taxRate: 12, taxName: 'VAT' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna', rate: 22.50, locale: 'cs-CZ', taxRate: 21, taxName: 'VAT' },
  ILS: { symbol: '₪', name: 'Israeli Shekel', rate: 3.67, locale: 'he-IL', taxRate: 17, taxName: 'VAT' },
  CLP: { symbol: '$', name: 'Chilean Peso', rate: 880.00, locale: 'es-CL', taxRate: 19, taxName: 'IVA' },
  PKR: { symbol: '₨', name: 'Pakistani Rupee', rate: 281.00, locale: 'en-PK', taxRate: 18, taxName: 'GST' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', rate: 24500.00, locale: 'vi-VN', taxRate: 10, taxName: 'VAT' },
};

function getCurrencyData(code: string) {
  return currencyData[code] || currencyData.USD;
}

function formatCurrency(amount: number, currency: string): string {
  const data = getCurrencyData(currency);
  return new Intl.NumberFormat(data.locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

function getTaxRateForCurrency(code: string): number {
  return getCurrencyData(code).taxRate;
}

function getTaxNameForCurrency(code: string): string {
  return getCurrencyData(code).taxName;
}

export default PricingCards;
