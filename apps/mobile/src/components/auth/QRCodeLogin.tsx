import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "@react-navigation/native";
import { signInWithQRCode } from "@/lib/auth/client";

interface QRCodeLoginProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function QRCodeLogin({ onSuccess, onError }: QRCodeLoginProps) {
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);
    setAuthenticated(false);

    try {
      const { session, error: sessionError } = await createQRCodeSession();

      if (sessionError) {
        setError(sessionError.message);
        onError(sessionError.message);
        setLoading(false);
        return;
      }

      if (session) {
        setToken(session.token);
        setExpiresAt(session.expiresAt);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate QR code";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/qr-code/verify?token=${token}`,
      );
      const data = await response.json();

      if (data.authenticated) {
        setAuthenticated(true);
        onSuccess();
      } else if (data.error) {
        if (data.error === "QR code has expired") {
          generateQRCode();
        } else {
          setError(data.error);
        }
      }
    } catch (err: any) {
      console.error("Error checking auth status:", err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  useFocusEffect(() => {
    if (token && !authenticated) {
      const interval = setInterval(checkAuthStatus, 2000);
      return () => clearInterval(interval);
    }
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Generating QR code...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={generateQRCode}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (authenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>Successfully authenticated!</Text>
        <Text style={styles.redirectText}>Redirecting...</Text>
      </View>
    );
  }

  const qrData = token
    ? JSON.stringify({
        action: "omnipdf-auth",
        token,
        expiresAt,
      })
    : "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan to Sign In</Text>
      <Text style={styles.subtitle}>
        Scan this QR code on your web browser to sign in
      </Text>

      <View style={styles.qrContainer}>
        {token && <QRCode value={qrData} size={200} />}
      </View>

      <Text style={styles.instruction}>
        Open OmniPDF in your web browser and select "Sign in with QR Code"
      </Text>

      <TouchableOpacity style={styles.refreshButton} onPress={generateQRCode}>
        <Text style={styles.refreshButtonText}>Refresh QR Code</Text>
      </TouchableOpacity>
    </View>
  );
}

async function createQRCodeSession(): Promise<{
  session: { token: string; expiresAt: number } | null;
  error: { message: string } | null;
}> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/qr-code/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        session: null,
        error: { message: data.error || "Failed to create session" },
      };
    }

    return { session: data, error: null };
  } catch (error: any) {
    return {
      session: null,
      error: { message: error.message || "Network error" },
    };
  }
}

import { createClient } from "@/lib/supabase/client";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
  },
  redirectText: {
    fontSize: 14,
    color: "#6b7280",
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  instruction: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});
