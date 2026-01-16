import { NextRequest, NextResponse } from "next/server";

const qrCodeSessions = new Map<
  string,
  {
    id: string;
    token: string;
    userId: string;
    expiresAt: number;
    authenticated: boolean;
    createdAt: Date;
  }
>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const session = qrCodeSessions.get(token);

    if (!session) {
      return NextResponse.json(
        { error: "QR code session not found or expired" },
        { status: 404 },
      );
    }

    if (Date.now() > session.expiresAt) {
      qrCodeSessions.delete(token);
      return NextResponse.json(
        { error: "QR code has expired" },
        { status: 410 },
      );
    }

    return NextResponse.json({
      authenticated: session.authenticated,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Error verifying QR code session:", error);
    return NextResponse.json(
      { error: "Failed to verify QR code session" },
      { status: 500 },
    );
  }
}
