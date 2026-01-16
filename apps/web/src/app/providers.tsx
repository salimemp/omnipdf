'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createContext } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ThemeProvider, useTheme } from 'next-themes';
import '@/lib/i18n/i18n';

interface ProvidersProps {
  children: ReactNode;
}

export const SupabaseContext = createContext<ReturnType<typeof createBrowserClient> | null>(null);

function I18nProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
    </SupabaseContext.Provider>
  );
}
