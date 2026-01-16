import { useState } from "react";
import {
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import { Input } from "@omnipdf/ui/src/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@omnipdf/ui/src/Card";
import { signInWithMagicLink } from "@/lib/auth/client";
import type { MagicLinkRequest } from "@/lib/auth/types";

interface MagicLinkFormProps {
  onSuccess?: () => void;
  onSwitchToPassword?: () => void;
}

export function MagicLinkForm({
  onSuccess,
  onSwitchToPassword,
}: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const request: MagicLinkRequest = {
      email,
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    };

    const result = await signInWithMagicLink(request);

    if (result.success) {
      setSuccess(true);
      onSuccess?.();
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <Card variant="bordered" padding="lg">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl mb-2">Check your email</CardTitle>
          <CardDescription className="mb-6">
            We&apos;ve sent a magic link to <strong>{email}</strong>
          </CardDescription>
          <div className="rounded-lg bg-surface-50 p-4 text-left dark:bg-surface-800 mb-6">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              <strong className="text-surface-900 dark:text-white">
                Next steps:
              </strong>
            </p>
            <ol className="text-sm text-surface-600 dark:text-surface-400 space-y-1 list-decimal list-inside mt-2">
              <li>Check your email inbox</li>
              <li>Click the magic link to sign in</li>
              <li>You&apos;ll be redirected to your dashboard</li>
            </ol>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setEmail("");
            }}
            className="w-full"
          >
            Send another magic link
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
          <Mail className="h-6 w-6 text-primary-600" />
        </div>
        <CardTitle>Sign in with Magic Link</CardTitle>
        <CardDescription>
          We&apos;ll send you a secure link to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-5 w-5" />}
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Send Magic Link
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSwitchToPassword}
            >
              Sign in with password instead
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface VerifyMagicLinkProps {
  email: string;
  onResend?: () => void;
  onSwitchEmail?: () => void;
}

export function VerifyMagicLink({
  email,
  onResend,
  onSwitchEmail,
}: VerifyMagicLinkProps) {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setResending(true);
    const request: MagicLinkRequest = {
      email,
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    };

    const result = await signInWithMagicLink(request);

    if (result.success) {
      setResendSuccess(true);
      onResend?.();
    }

    setResending(false);
  };

  return (
    <Card variant="bordered" padding="lg">
      <CardContent className="text-center py-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          <Mail className="h-8 w-8 text-primary-600" />
        </div>
        <CardTitle className="text-xl mb-2">Check your email</CardTitle>
        <CardDescription className="mb-6">
          We&apos;ve sent a magic link to <strong>{email}</strong>
        </CardDescription>

        <div className="rounded-lg bg-surface-50 p-4 text-left dark:bg-surface-800 mb-6">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
            <strong className="text-surface-900 dark:text-white">
              Didn&apos;t receive the email?
            </strong>
          </p>
          <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1 list-disc list-inside">
            <li>Check your spam folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>

        {resendSuccess ? (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2 mb-4">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Magic link sent successfully!
          </div>
        ) : null}

        <Button
          variant="primary"
          size="lg"
          className="w-full mb-3"
          onClick={handleResend}
          loading={resending}
          disabled={resendSuccess}
        >
          {resendSuccess ? "Email Sent" : "Resend Magic Link"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSwitchEmail}
          className="w-full"
        >
          Use a different email
        </Button>
      </CardContent>
    </Card>
  );
}
