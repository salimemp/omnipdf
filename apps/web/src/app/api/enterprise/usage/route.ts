import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usageMetrics = {
      conversionsThisMonth: 847,
      storageUsed: 5.2 * 1024 * 1024 * 1024,
      apiCalls: 123456,
      teamMembers: 8,
      billingCycleStart: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ).toISOString(),
      billingCycleEnd: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      ).toISOString(),
      planLimit: {
        conversions: 5000,
        storage: 50 * 1024 * 1024 * 1024,
        apiCalls: 500000,
        teamMembers: 50,
      },
    };

    return NextResponse.json(usageMetrics);
  } catch (error: any) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get usage metrics" },
      { status: 500 },
    );
  }
}
