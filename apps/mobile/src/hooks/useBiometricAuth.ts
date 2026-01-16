import { useState, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricResult {
  success: boolean;
  error?: string;
  isEnrolled: boolean;
  biometricType: "fingerprint" | "face" | "iris" | null;
}

export interface BiometricOptions {
  promptMessage?: string;
  cancelLabel?: string;
  disableDeviceFallback?: boolean;
  fallbackLabel?: string;
}

export function useBiometricAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BiometricResult | null>(null);

  const checkBiometricAvailability = useCallback(async (): Promise<{
    available: boolean;
    isEnrolled: boolean;
    biometricType: BiometricResult["biometricType"];
  }> => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      let biometricType: BiometricResult["biometricType"] = null;
      if (enrolled) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          biometricType = "fingerprint";
        } else if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          )
        ) {
          biometricType = "face";
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.IRIS)
        ) {
          biometricType = "iris";
        }
      }

      return {
        available: compatible,
        isEnrolled: enrolled,
        biometricType,
      };
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return {
        available: false,
        isEnrolled: false,
        biometricType: null,
      };
    }
  }, []);

  const authenticate = useCallback(
    async (options?: BiometricOptions): Promise<BiometricResult> => {
      setLoading(true);
      setResult(null);

      try {
        const { available, isEnrolled, biometricType } =
          await checkBiometricAvailability();

        if (!available) {
          const errorResult: BiometricResult = {
            success: false,
            error: "Biometric hardware not available on this device",
            isEnrolled: false,
            biometricType: null,
          };
          setResult(errorResult);
          setLoading(false);
          return errorResult;
        }

        if (!isEnrolled) {
          const errorResult: BiometricResult = {
            success: false,
            error:
              "No biometric credentials enrolled. Please set up biometrics in your device settings.",
            isEnrolled: false,
            biometricType,
          };
          setResult(errorResult);
          setLoading(false);
          return errorResult;
        }

        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage:
            options?.promptMessage || "Authenticate to access OmniPDF",
          cancelLabel: options?.cancelLabel || "Cancel",
          disableDeviceFallback: options?.disableDeviceFallback || false,
          fallbackLabel: options?.fallbackLabel || "Use PIN",
        });

        const biometricResult: BiometricResult = {
          success: authResult.success,
          error: authResult.success
            ? undefined
            : authResult.error || "Authentication failed",
          isEnrolled: true,
          biometricType,
        };

        setResult(biometricResult);
        setLoading(false);
        return biometricResult;
      } catch (error: any) {
        const errorResult: BiometricResult = {
          success: false,
          error:
            error.message ||
            "An unexpected error occurred during authentication",
          isEnrolled: false,
          biometricType: null,
        };
        setResult(errorResult);
        setLoading(false);
        return errorResult;
      }
    },
    [checkBiometricAvailability],
  );

  const cancelAuth = useCallback(async () => {
    try {
      await LocalAuthentication.cancelAuthenticate();
    } catch (error) {
      console.error("Error canceling authentication:", error);
    }
  }, []);

  return {
    loading,
    result,
    checkBiometricAvailability,
    authenticate,
    cancelAuth,
  };
}

export function useBiometricEnabled() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkEnabled = useCallback(async () => {
    try {
      const stored = await SecureStore.getItemAsync("biometricEnabled");
      setIsEnabled(stored === "true");
    } catch (error) {
      console.error("Error checking biometric enabled status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const enableBiometric = useCallback(async (enabled: boolean) => {
    try {
      await SecureStore.setItemAsync("biometricEnabled", enabled.toString());
      setIsEnabled(enabled);
    } catch (error) {
      console.error("Error setting biometric enabled status:", error);
    }
  }, []);

  return {
    isEnabled,
    loading,
    checkEnabled,
    enableBiometric,
  };
}

import * as SecureStore from "expo-secure-store";
