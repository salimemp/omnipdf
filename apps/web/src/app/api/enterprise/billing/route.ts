import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripePortalUrl = "https://billing.stripe.com/p/session/test_123";

    return NextResponse.json({
      url: stripePortalUrl,
    });
  } catch (error: any) {
    console.error("Billing portal API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create billing portal session" },
      { status: 500 },
    );
  }
}
