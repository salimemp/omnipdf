'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, ChevronDown, Check } from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { cn } from '@omnipdf/shared/src/utils';

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  locale: string;
  taxRate: number;
  taxName: string;
}

const currencies: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, locale: 'en-US', taxRate: 0, taxName: 'Sales Tax' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE', taxRate: 20, taxName: 'VAT' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, locale: 'en-GB', taxRate: 20, taxName: 'VAT' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50, locale: 'ja-JP', taxRate: 10, taxName: 'Consumption Tax' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24, locale: 'zh-CN', taxRate: 6, taxName: 'VAT' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12, locale: 'en-IN', taxRate: 18, taxName: 'GST' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 4.97, locale: 'pt-BR', taxRate: 17, taxName: 'ICMS' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1298.00, locale: 'ko-KR', taxRate: 10, taxName: 'VAT' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', rate: 17.15, locale: 'es-MX', taxRate: 16, taxName: 'IVA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53, locale: 'en-AU', taxRate: 10, taxName: 'GST' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36, locale: 'en-CA', taxRate: 13, taxName: 'HST' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.88, locale: 'de-CH', taxRate: 7.7, taxName: 'VAT' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: 91.50, locale: 'ru-RU', taxRate: 20, taxName: 'VAT' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34, locale: 'en-SG', taxRate: 9, taxName: 'GST' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rate: 7.82, locale: 'en-HK', taxRate: 0, taxName: '' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 10.42, locale: 'sv-SE', taxRate: 25, taxName: 'VAT' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 10.75, locale: 'nb-NO', taxRate: 25, taxName: 'VAT' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.65, locale: 'en-NZ', taxRate: 15, taxName: 'GST' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.65, locale: 'en-ZA', taxRate: 15, taxName: 'VAT' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67, locale: 'ar-AE', taxRate: 5, taxName: 'VAT' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 35.80, locale: 'th-TH', taxRate: 7, taxName: 'VAT' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', rate: 3.98, locale: 'pl-PL', taxRate: 23, taxName: 'VAT' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 29.00, locale: 'tr-TR', taxRate: 20, taxName: 'VAT' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 15650.00, locale: 'id-ID', taxRate: 11, taxName: 'VAT' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.72, locale: 'ms-MY', taxRate: 6, taxName: 'SST' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 55.80, locale: 'en-PH', taxRate: 12, taxName: 'VAT' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', rate: 22.50, locale: 'cs-CZ', taxRate: 21, taxName: 'VAT' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', rate: 3.67, locale: 'he-IL', taxRate: 17, taxName: 'VAT' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', rate: 880.00, locale: 'es-CL', taxRate: 19, taxName: 'IVA' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 281.00, locale: 'en-PK', taxRate: 18, taxName: 'GST' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 110.00, locale: 'bn-BD', taxRate: 15, taxName: 'VAT' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 24500.00, locale: 'vi-VN', taxRate: 10, taxName: 'VAT' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 30.90, locale: 'ar-EG', taxRate: 14, taxName: 'VAT' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', rate: 37.50, locale: 'uk-UA', taxRate: 20, taxName: 'VAT' },
];

export interface LocalizedPrice {
  amount: number;
  currency: CurrencyInfo;
  subtotal: number;
  tax: number;
  total: number;
  formatted: string;
  formattedSubtotal: string;
  formattedTax: string;
}

interface CurrencySelectorProps {
  usdAmount: number;
  showDetails?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
  onCurrencyChange?: (currency: CurrencyInfo, localizedPrice: LocalizedPrice) => void;
}

export function CurrencySelector({
  usdAmount,
  showDetails = false,
  variant = 'default',
  className,
  onCurrencyChange,
}: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo>(currencies[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Auto-detect currency based on browser locale
    const browserLocale = navigator.language;
    const detected = currencies.find(c => 
      browserLocale.includes(c.code) || 
      browserLocale.includes(c.code.split('-')[0])
    );
    if (detected) {
      setSelectedCurrency(detected);
    }
  }, []);

  const localizedPrice: LocalizedPrice = useMemo(() => {
    const subtotal = usdAmount * selectedCurrency.rate;
    const tax = subtotal * (selectedCurrency.taxRate / 100);
    const total = subtotal + tax;

    return {
      amount: usdAmount,
      currency: selectedCurrency,
      subtotal,
      tax,
      total,
      formatted: new Intl.NumberFormat(selectedCurrency.locale, {
        style: 'currency',
        currency: selectedCurrency.code,
      }).format(total),
      formattedSubtotal: new Intl.NumberFormat(selectedCurrency.locale, {
        style: 'currency',
        currency: selectedCurrency.code,
      }).format(subtotal),
      formattedTax: new Intl.NumberFormat(selectedCurrency.locale, {
        style: 'currency',
        currency: selectedCurrency.code,
      }).format(tax),
    };
  }, [usdAmount, selectedCurrency]);

  const handleCurrencySelect = (currency: CurrencyInfo) => {
    return (
      <div className={cn('relative inline-flex', className)}>
        <select
          value={selectedCurrency.code}
          onChange={(e) => {
            const currency = currencies.find(c => c.code === e.target.value);
            if (currency) handleCurrencySelect(currency);
          }}
          className="bg-transparent text-sm font-medium text-surface-600 dark:text-surface-400 border-none outline-none cursor-pointer pr-8 appearance-none"
          aria-label="Select currency"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code}
            </option>
          ))}
        </select>
        <DollarSign className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
        aria-label={`Select currency. Current: ${selectedCurrency.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <DollarSign className="h-4 w-4" />
        <span>{selectedCurrency.symbol}</span>
        <span>{selectedCurrency.code}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-white py-2 shadow-strong z-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
            role="listbox"
            aria-label="Select currency"
          >
            <div className="px-3 py-2 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Currency
            </div>
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2 text-sm transition-colors',
                  'hover:bg-surface-100 dark:hover:bg-surface-700',
                  selectedCurrency.code === currency.code && 'bg-primary-50 dark:bg-primary-900/20'
                )}
                role="option"
                aria-selected={selectedCurrency.code === currency.code}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-8">{currency.symbol}</span>
                  <div className="text-left">
                    <div className="font-medium text-surface-900 dark:text-white">
                      {currency.code}
                    </div>
                    <div className="text-xs text-surface-500">{currency.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat(currency.locale, {
                      style: 'currency',
                      currency: currency.code,
                    }).format(usdAmount * currency.rate)}
                  </div>
                  {currency.taxRate > 0 && (
                    <div className="text-xs text-surface-500">
                      incl. {currency.taxRate}% {currency.taxName}
                    </div>
                  )}
                </div>
                {selectedCurrency.code === currency.code && (
                  <Check className="h-4 w-4 text-primary-600 ml-2" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {showDetails && (
        <div className="mt-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-surface-600 dark:text-surface-400">
              Subtotal (USD {usdAmount})
            </span>
            <span className="font-medium">{localizedPrice.formattedSubtotal}</span>
          </div>
          {selectedCurrency.taxRate > 0 && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-surface-600 dark:text-surface-400">
                {selectedCurrency.taxName} ({selectedCurrency.taxRate}%)
              </span>
              <span className="font-medium">{localizedPrice.formattedTax}</span>
            </div>
          )}
          <hr className="my-2 border-surface-200 dark:border-surface-700" />
          <div className="flex justify-between font-semibold">
            <span className="text-surface-900 dark:text-white">Total</span>
            <span className="text-primary-600">{localizedPrice.formatted}</span>
          </div>
          <p className="text-xs text-surface-500 mt-2">
            * Final amount may vary slightly due to exchange rate fluctuations
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to format price with currency conversion
export function formatLocalizedPrice(
  usdAmount: number,
  currencyCode: string = 'USD',
  showTax: boolean = false
): string {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
  const amount = usdAmount * currency.rate;
  const tax = showTax ? amount * (currency.taxRate / 100) : 0;
  const total = amount + tax;

  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(total);
}

// Get all supported currencies
export function getSupportedCurrencies(): CurrencyInfo[] {
  return currencies;
}
