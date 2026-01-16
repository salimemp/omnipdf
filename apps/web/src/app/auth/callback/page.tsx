import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/auth-helpers-react';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: [],
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(
    searchParams.code as string
  );

  if (error) {
    redirect('/auth/login?error=callback_error');
  }

  redirect('/dashboard');
}
