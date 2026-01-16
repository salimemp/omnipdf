import { useState } from "react";
import {
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Smartphone,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@omnipdf/ui/src/Card";

interface PasskeyAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PasskeyAuth({ onSuccess, onError }: PasskeyAuthProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const isWebAuthnSupported =
    typeof window !== "undefined" &&
    (window.PublicKeyCredential || (window as any).PublicKeyCredential);

  const handleSignInWithPasskey = async () => {
    if (!isWebAuthnSupported) {
      setError("Passkeys are not supported in your browser");
      onError?.("Passkeys are not supported in your browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      if (!available) {
        setError(
          "No passkey authenticator available. Please set up a passkey first.",
        );
        onError?.("No passkey authenticator available");
        setLoading(false);
        return;
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: "preferred",
      };

      const credential = (await navigator.credentials.get({
        publicKey,
      } as any)) as PublicKeyCredential;

      if (credential) {
        onSuccess?.();
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Authentication was cancelled. Please try again.");
      } else if (err.name === "InvalidStateError") {
        setError("No passkeys found. Please register a passkey first.");
      } else {
        setError(err.message || "Passkey authentication failed");
      }
      onError?.(error || "Passkey authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPasskey = async () => {
    if (!isWebAuthnSupported) {
      setError("Passkeys are not supported in your browser");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "OmniPDF",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: "OmniPDF User",
          displayName: "OmniPDF User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 60000,
      };

      const credential = (await navigator.credentials.create({
        publicKey,
      } as any)) as PublicKeyCredential;

      if (credential) {
        setRegistered(true);
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Passkey registration was cancelled.");
      } else {
        setError(err.message || "Passkey registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <Card variant="bordered" padding="lg">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl mb-2">Passkey Registered!</CardTitle>
          <CardDescription className="mb-6">
            Your passkey has been set up successfully. You can now use it to
            sign in.
          </CardDescription>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSignInWithPasskey}
          >
            Sign in with Passkey
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
          <Key className="h-6 w-6 text-primary-600" />
        </div>
        <CardTitle>Passkey Authentication</CardTitle>
        <CardDescription>
          Sign in securely with your device&apos;s passkey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isWebAuthnSupported ? (
          <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
            Passkeys are not supported in your browser. Please use a modern
            browser like Chrome, Edge, or Safari.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
              <Shield className="h-5 w-5 text-green-600 shrink-0" />
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Use your device&apos;s fingerprint, face recognition, or PIN to
                authenticate
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSignInWithPasskey}
              loading={loading}
              leftIcon={<Key className="h-5 w-5" />}
            >
              Sign in with Passkey
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-surface-200 dark:border-surface-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-surface-500 dark:bg-surface-900">
                  or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleRegisterPasskey}
              disabled={loading}
              leftIcon={<Smartphone className="h-5 w-5" />}
            >
              Set Up Passkey
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function PasskeySetup({ onComplete }: { onComplete?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "OmniPDF",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: "OmniPDF User",
          displayName: "OmniPDF User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 60000,
      };

      const credential = (await navigator.credentials.create({
        publicKey,
      } as any)) as PublicKeyCredential;

      if (credential) {
        setSuccess(true);
        onComplete?.();
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Passkey setup was cancelled.");
      } else {
        setError(err.message || "Passkey setup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-green-600 dark:text-green-400">
          Passkey set up successfully!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <Button
        variant="outline"
        onClick={handleSetup}
        loading={loading}
        leftIcon={<Key className="h-4 w-4" />}
      >
        Set Up Passkey
      </Button>
    </div>
  );
}
