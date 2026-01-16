import { useState, useEffect, useCallback } from "react";
import {
  signIn,
  signUp,
  signInWithEmail,
  signInWithMagicLink,
  signInWithOAuth,
  signOut,
  getUser,
} from "@/lib/auth/client";

interface UseAuthReturn {
  user: ReturnType<typeof getUser> extends Promise<infer T> ? T : null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signInWithOAuth: (
    provider: "google" | "github" | "discord",
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const currentUser = await getUser();
    setUser(currentUser);

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleSignInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    } else {
      await refreshUser();
    }

    setLoading(false);
    return { error: signInError?.message || null };
  };

  const handleSignInWithMagicLink = async (email: string) => {
    setLoading(true);
    setError(null);

    const { error: signInError } = await signInWithMagicLink(email);

    setLoading(false);
    return { error: signInError?.message || null };
  };

  const handleSignUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
    }

    setLoading(false);
    return { error: signUpError?.message || null };
  };

  const handleSignInWithOAuth = async (
    provider: "google" | "github" | "discord",
  ) => {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await signInWithOAuth(provider);

    setLoading(false);
    return { error: oauthError?.message || null };
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    const { error: signOutError } = await signOut();

    if (!signOutError) {
      setUser(null);
    }

    setLoading(false);
    return { error: signOutError?.message || null };
  };

  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    signInWithEmail: handleSignInWithEmail,
    signInWithMagicLink: handleSignInWithMagicLink,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithOAuth: handleSignInWithOAuth,
    signOut: handleSignOut,
    clearError,
  };
}
