import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@omnipdf/ui/src/Card";
import { createQRCodeSession, pollForQRCodeAuth } from "@/lib/auth/client";
import type { AuthError } from "@/lib/auth/types";

interface QRCodeAuthProps {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
}

export function QRCodeAuth({ onSuccess, onError }: QRCodeAuthProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{
    id: string;
    token: string;
    expiresAt: number;
  } | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [polling, setPolling] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);
    setAuthenticated(false);

    const { session: newSession, error: sessionError } =
      await createQRCodeSession();

    if (sessionError) {
      setError(sessionError.message);
      onError?.(sessionError);
      setLoading(false);
      return;
    }

    if (newSession) {
      setSession(newSession);
      const qrData = JSON.stringify({
        action: "omnipdf-auth",
        token: newSession.token,
        expiresAt: newSession.expiresAt,
      });
      const encodedData = btoa(qrData);
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(encodedData)}`,
      );
    }

    setLoading(false);
  };

  const startPolling = () => {
    if (!session?.token) return;

    setPolling(true);
    let attempts = 0;
    const maxAttempts = 60;

    pollIntervalRef.current = setInterval(async () => {
      if (attempts >= maxAttempts) {
        stopPolling();
        setError("QR code expired. Please generate a new one.");
        return;
      }

      const { authenticated: isAuthenticated, error: pollError } =
        await pollForQRCodeAuth(session.token);

      if (pollError) {
        if (pollError.code === "QR_CODE_EXPIRED") {
          stopPolling();
          setError("QR code expired. Please generate a new one.");
        } else {
          setError(pollError.message);
        }
        onError?.(pollError);
        return;
      }

      if (isAuthenticated) {
        stopPolling();
        setAuthenticated(true);
        onSuccess?.();
      }

      attempts++;
    }, 2000);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setPolling(false);
  };

  useEffect(() => {
    if (session && !authenticated) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [session, authenticated]);

  useEffect(() => {
    generateQRCode();
  }, []);

  if (authenticated) {
    return (
      <Card variant="bordered" padding="lg">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl mb-2">
            Successfully Authenticated!
          </CardTitle>
          <CardDescription>
            Redirecting you to your dashboard...
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered" padding="lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
          <QrCode className="h-6 w-6 text-primary-600" />
        </div>
        <CardTitle>Sign in with Mobile App</CardTitle>
        <CardDescription>
          Scan the QR code with your mobile app to authenticate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Generating QR code...
              </p>
            </div>
          ) : qrCodeUrl ? (
            <>
              <div className="relative p-4 bg-white rounded-lg shadow-sm mb-4">
                <img
                  src={qrCodeUrl}
                  alt="Authentication QR Code"
                  className="w-48 h-48"
                />
                {polling && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                    <div className="bg-white dark:bg-surface-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Waiting for scan...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 mb-4">
                <Smartphone className="h-4 w-4" />
                Open OmniPDF mobile app and scan this code
              </div>
            </>
          ) : null}

          <Button
            variant="outline"
            onClick={generateQRCode}
            disabled={loading}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Generate New QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function QRCodeDisplay({ token }: { token: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const qrData = JSON.stringify({
      action: "omnipdf-auth",
      token,
      expiresAt: Date.now() + 300000,
    });
    const encodedData = btoa(qrData);
    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(encodedData)}`,
    );
  }, [token]);

  if (!qrCodeUrl) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <img
      src={qrCodeUrl}
      alt="Authentication QR Code"
      className="w-full max-w-[200px] mx-auto"
    />
  );
}
