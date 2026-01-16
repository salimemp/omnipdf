"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Mail,
  Lock,
  Github,
  ArrowRight,
  Key,
  QrCode,
  AlertCircle,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import { Input } from "@omnipdf/ui/src/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@omnipdf/ui/src/Card";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { PasskeyAuth } from "@/components/auth/PasskeyAuth";
import { QRCodeAuth } from "@/components/auth/QRCodeAuth";
import { signIn, signInWithEmail, signInWithOAuth } from "@/lib/auth/client";

type AuthMode = "password" | "magiclink" | "passkey" | "qrcode";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await signInWithOAuth(provider);

    if (oauthError) {
      setError(oauthError.message);
    }
    setLoading(false);
  };

  const handlePasskeySuccess = () => {
    router.push("/dashboard");
    router.refresh();
  };

  const handleQRCodeSuccess = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white">
            <FileText className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-surface-900 dark:text-white">
            Omni<span className="text-primary-600">PDF</span>
          </span>
        </Link>

        <AnimatePresence mode="wait">
          {authMode === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card variant="bordered" padding="lg">
                <CardHeader className="text-center">
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin("google")}
                      disabled={loading}
                      leftIcon={
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      }
                    >
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin("github")}
                      disabled={loading}
                      leftIcon={<Github className="h-5 w-5" />}
                    >
                      GitHub
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-surface-200 dark:border-surface-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-surface-500 dark:bg-surface-900">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      leftIcon={<Mail className="h-5 w-5" />}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftIcon={<Lock className="h-5 w-5" />}
                      required
                    />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          Remember me
                        </span>
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={loading}
                    >
                      Sign in
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-surface-200 dark:border-surface-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-surface-500 dark:bg-surface-900">
                        Or try
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthMode("magiclink")}
                      leftIcon={<Mail className="h-4 w-4" />}
                      className="text-xs"
                    >
                      Magic Link
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthMode("passkey")}
                      leftIcon={<Key className="h-4 w-4" />}
                      className="text-xs"
                    >
                      Passkey
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthMode("qrcode")}
                      leftIcon={<QrCode className="h-4 w-4" />}
                      className="text-xs"
                    >
                      QR Code
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="justify-center">
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {authMode === "magiclink" && (
            <motion.div
              key="magiclink"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MagicLinkForm
                onSuccess={() => router.push("/auth/verify-magic-link")}
                onSwitchToPassword={() => setAuthMode("password")}
              />
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthMode("password")}
                  leftIcon={<ArrowRight className="h-4 w-4 rotate-180" />}
                >
                  Back to sign in
                </Button>
              </div>
            </motion.div>
          )}

          {authMode === "passkey" && (
            <motion.div
              key="passkey"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <PasskeyAuth onSuccess={handlePasskeySuccess} />
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthMode("password")}
                  leftIcon={<ArrowRight className="h-4 w-4 rotate-180" />}
                >
                  Back to sign in
                </Button>
              </div>
            </motion.div>
          )}

          {authMode === "qrcode" && (
            <motion.div
              key="qrcode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <QRCodeAuth onSuccess={handleQRCodeSuccess} />
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthMode("password")}
                  leftIcon={<ArrowRight className="h-4 w-4 rotate-180" />}
                >
                  Back to sign in
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
