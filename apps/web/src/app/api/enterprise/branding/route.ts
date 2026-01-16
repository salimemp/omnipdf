import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { config } = await request.json();

    if (!config) {
      return NextResponse.json(
        { error: "Configuration is required" },
        { status: 400 },
      );
    }

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Saving brand config for user:", userId, config);

    return NextResponse.json({
      success: true,
      message: "Branding configuration saved successfully",
    });
  } catch (error: any) {
    console.error("Branding API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save branding configuration" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mockConfig = {
      logo: null,
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      fontFamily: "Inter",
      companyName: "Acme Corporation",
      customDomain: "pdf.acme.com",
      favicon: null,
    };

    return NextResponse.json({ config: mockConfig });
  } catch (error: any) {
    console.error("Get branding API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get branding configuration" },
      { status: 500 },
    );
  }
}
