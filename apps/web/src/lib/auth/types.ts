export type AuthMethod =
  | "email"
  | "magiclink"
  | "passkey"
  | "biometric"
  | "oauth"
  | "qrcode";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: AuthUser;
}

export interface MagicLinkRequest {
  email: string;
  redirectTo?: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface PasskeyRegistrationOptions {
  user: {
    id: string;
    name: string;
    email: string;
  };
  rpName: string;
  rpId: string;
  challenge: string;
}

export interface PasskeyAssertionOptions {
  challenge: string;
  rpId: string;
  allowCredentials?: {
    id: string;
    type: string;
  }[];
}

export interface QRCodeSession {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: number;
  created_at: string;
  device_info?: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const AUTH_ERRORS = {
  INVALID_EMAIL: { code: "INVALID_EMAIL", message: "Invalid email address" },
  USER_NOT_FOUND: { code: "USER_NOT_FOUND", message: "User not found" },
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid credentials",
  },
  EXPIRED_SESSION: { code: "EXPIRED_SESSION", message: "Session has expired" },
  PASSKEY_REGISTRATION_FAILED: {
    code: "PASSKEY_REGISTRATION_FAILED",
    message: "Passkey registration failed",
  },
  PASSKEY_VERIFICATION_FAILED: {
    code: "PASSKEY_VERIFICATION_FAILED",
    message: "Passkey verification failed",
  },
  BIOMETRIC_NOT_AVAILABLE: {
    code: "BIOMETRIC_NOT_AVAILABLE",
    message: "Biometric authentication not available",
  },
  BIOMETRIC_AUTH_FAILED: {
    code: "BIOMETRIC_AUTH_FAILED",
    message: "Biometric authentication failed",
  },
  QR_CODE_EXPIRED: { code: "QR_CODE_EXPIRED", message: "QR code has expired" },
  QR_CODE_INVALID: { code: "QR_CODE_INVALID", message: "Invalid QR code" },
} as const;

export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as Record<string, unknown>).code === "string"
  );
}
