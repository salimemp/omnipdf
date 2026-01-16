import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be used in the browser');
  }
  
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key'
    );
  }
  
  return supabaseClient;
};
