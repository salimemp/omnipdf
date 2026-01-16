import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "example-key",
  );

export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function signInWithEmail(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithOAuth(
  provider: "google" | "github" | "discord",
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithMagicLink(email: string) {
  return signInWithEmail(email);
}

export async function createQRCodeSession(): Promise<{
  session: { id: string; token: string; expiresAt: number } | null;
  error: { message: string } | null;
}> {
  const sessionId = crypto.randomUUID();
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  return {
    session: { id: sessionId, token, expiresAt },
    error: null,
  };
}

export async function pollForQRCodeAuth(
  token: string,
): Promise<{
  authenticated: boolean;
  error: { code: string; message: string } | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return { authenticated: true, error: null };
}
