import { useState, useEffect, useCallback } from "react";
import {
  signInWithEmail,
  signInWithMagicLink,
  signUpWithEmail,
  signInWithOAuth,
  signOut,
  getCurrentUser,
  refreshSession,
  resetPassword,
  updatePassword,
  createQRCodeSession,
  pollForQRCodeAuth,
  signInWithQRCode,
} from "@/lib/auth/client";
import type {
  AuthUser,
  AuthSession,
  AuthError,
  MagicLinkRequest,
} from "@/lib/auth/types";

interface UseAuthReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signInWithMagicLink: (
    request: MagicLinkRequest,
  ) => Promise<{ success: boolean; message: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ needsVerification: boolean; error: AuthError | null }>;
  signInWithOAuth: (
    provider: "google" | "github",
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; message: string }>;
  updatePassword: (
    newPassword: string,
  ) => Promise<{ success: boolean; error: AuthError | null }>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { user: currentUser, error: userError } = await getCurrentUser();

    if (userError) {
      setError(userError);
      setUser(null);
      setSession(null);
    } else {
      setUser(currentUser);

      if (currentUser) {
        const { session: refreshResult, error: refreshError } =
          await refreshSession();
        if (refreshError) {
          setError(refreshError);
        } else if (refreshResult) {
          setSession(refreshResult);
        }
      } else {
        setSession(null);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleSignInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await signInWithEmail(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
      return { error: signInError };
    }

    if (data) {
      setSession(data);
      setUser(data.user);
    }

    setLoading(false);
    return { error: null };
  };

  const handleSignInWithMagicLink = async (request: MagicLinkRequest) => {
    setLoading(true);
    setError(null);

    const result = await signInWithMagicLink(request);

    setLoading(false);
    return result;
  };

  const handleSignUpWithEmail = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    setLoading(true);
    setError(null);

    const {
      data,
      error: signUpError,
      needsVerification,
    } = await signUpWithEmail(email, password, name);

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return { needsVerification: false, error: signUpError };
    }

    if (data) {
      setSession(data);
      setUser(data.user);
    }

    setLoading(false);
    return { needsVerification, error: null };
  };

  const handleSignInWithOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await signInWithOAuth(provider);

    setLoading(false);
    return { error: oauthError };
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    const { error: signOutError } = await signOut();

    if (signOutError) {
      setError(signOutError);
    } else {
      setUser(null);
      setSession(null);
    }

    setLoading(false);
    return { error: signOutError };
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    const result = await resetPassword(email);

    setLoading(false);
    return result;
  };

  const handleUpdatePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);

    const { success, error: updateError } = await updatePassword(newPassword);

    if (updateError) {
      setError(updateError);
    }

    setLoading(false);
    return { success, error: updateError };
  };

  const clearError = () => setError(null);

  return {
    user,
    session,
    loading,
    error,
    signInWithEmail: handleSignInWithEmail,
    signInWithMagicLink: handleSignInWithMagicLink,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithOAuth: handleSignInWithOAuth,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    refreshUser,
    clearError,
  };
}

interface UseQRCodeAuthReturn {
  session: { id: string; token: string; expiresAt: number } | null;
  loading: boolean;
  error: AuthError | null;
  authenticated: boolean;
  createSession: () => Promise<{ error: AuthError | null }>;
  pollForAuth: () => Promise<{ error: AuthError | null }>;
  cancelPolling: () => void;
}

export function useQRCodeAuth(token: string | null): UseQRCodeAuthReturn {
  const [session, setSession] = useState<{
    id: string;
    token: string;
    expiresAt: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [polling, setPolling] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const createSession = async () => {
    setLoading(true);
    setError(null);

    const { session: newSession, error: sessionError } =
      await createQRCodeSession();

    if (sessionError) {
      setError(sessionError);
      setLoading(false);
      return { error: sessionError };
    }

    if (newSession) {
      setSession(newSession);
    }

    setLoading(false);
    return { error: null };
  };

  const pollForAuth = async () => {
    if (!session?.token) {
      return { error: { code: "NO_SESSION", message: "No QR code session" } };
    }

    setPolling(true);
    const controller = new AbortController();
    setAbortController(controller);

    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      if (controller.signal.aborted || attempts >= maxAttempts) {
        setPolling(false);
        return;
      }

      const { authenticated: isAuthenticated, error: pollError } =
        await pollForQRCodeAuth(session.token);

      if (pollError) {
        setError(pollError);
        setPolling(false);
        return { error: pollError };
      }

      if (isAuthenticated) {
        setAuthenticated(true);
        setPolling(false);
        return { error: null };
      }

      attempts++;
      setTimeout(poll, 2000);
    };

    await poll();
    return { error: null };
  };

  const cancelPolling = () => {
    if (abortController) {
      abortController.abort();
    }
    setPolling(false);
  };

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return {
    session,
    loading,
    error,
    authenticated,
    createSession,
    pollForAuth,
    cancelPolling,
  };
}
