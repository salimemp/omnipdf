'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { cn } from '@omnipdf/shared/src/utils';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'dropdown' | 'compact';
  showFlag?: boolean;
  className?: string;
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  showFlag = true,
  className 
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    
    return () => {
      if (announcementRef.current) {
        announcementRef.current.remove();
        announcementRef.current = null;
      }
    };
  }, []);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Update URL with language parameter
    const params = new URLSearchParams(window.location.search);
    params.set('lang', langCode);
    router.push(`${pathname}?${params.toString()}`);
    
    setIsOpen(false);
    
    // Announce change for screen readers
    const langName = languages.find(l => l.code === langCode)?.name;
    if (langName) {
      if (announcementRef.current) {
        announcementRef.current.remove();
      }
      
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Language changed to ${langName}`;
      document.body.appendChild(announcement);
      announcementRef.current = announcement;
      
      setTimeout(() => {
        if (announcement.parentNode) {
          announcement.remove();
        }
        if (announcementRef.current === announcement) {
          announcementRef.current = null;
        }
      }, 1000);
    }
  };

  if (!mounted) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className={cn(
          'bg-transparent text-sm text-surface-600 dark:text-surface-400',
          'border-none outline-none cursor-pointer',
          className
        )}
        aria-label="Select language"
      >
        {languages.slice(0, 10).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {showFlag ? `${lang.flag} ${lang.nativeName}` : lang.nativeName}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
        aria-label={`Select language. Current: ${currentLang.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        {showFlag && <span>{currentLang.flag}</span>}
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
            className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl bg-white py-2 shadow-strong z-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
            role="listbox"
            aria-label="Select language"
          >
            <div className="px-3 py-2 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Languages
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                  'hover:bg-surface-100 dark:hover:bg-surface-700',
                  i18n.language === lang.code && 'bg-primary-50 dark:bg-primary-900/20'
                )}
                role="option"
                aria-selected={i18n.language === lang.code}
              >
                {showFlag && <span className="text-lg">{lang.flag}</span>}
                <div className="flex-1 text-left">
                  <div className="font-medium text-surface-900 dark:text-white">
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-surface-500">{lang.name}</div>
                </div>
                {i18n.language === lang.code && (
                  <Check className="h-4 w-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
