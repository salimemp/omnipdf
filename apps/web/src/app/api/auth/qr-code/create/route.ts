import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.replace("Bearer ", "");

    let userId: string | null = null;

    if (bearerToken) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(bearerToken);
      if (!error && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      const accessToken = cookieStore.get("sb-access-token")?.value;
      const refreshToken = cookieStore.get("sb-refresh-token")?.value;

      if (accessToken && refreshToken) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(accessToken);
        if (!error && user) {
          userId = user.id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = generateSecureToken();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const sessionData = {
      id: crypto.randomUUID(),
      token,
      userId,
      expiresAt,
      authenticated: false,
      createdAt: new Date(),
    };

    qrCodeSessions.set(token, sessionData);

    setTimeout(
      () => {
        qrCodeSessions.delete(token);
      },
      5 * 60 * 1000,
    );

    return NextResponse.json({
      id: sessionData.id,
      token: sessionData.token,
      expiresAt: sessionData.expiresAt,
    });
  } catch (error) {
    console.error("Error creating QR code session:", error);
    return NextResponse.json(
      { error: "Failed to create QR code session" },
      { status: 500 },
    );
  }
}

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
