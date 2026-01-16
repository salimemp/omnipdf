import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { document1, document2 } = await request.json();

    if (!document1 || !document2) {
      return NextResponse.json(
        { error: "Both documents are required for comparison" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 },
      );
    }

    const prompt = `Compare these two documents and provide a detailed analysis:

DOCUMENT 1:
${document1.substring(0, 5000)}

DOCUMENT 2:
${document2.substring(0, 5000)}

Provide the comparison in JSON format with the following structure:
{
  "similarity": number (0-100),
  "keyDifferences": [
    {"type": "addition|deletion|modification", "section": "section name", "description": "detailed description"}
  ],
  "commonTopics": ["topic1", "topic2", ...],
  "summary": "brief comparison summary"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Document comparison failed");
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let comparisonResult;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        comparisonResult = JSON.parse(jsonMatch[0]);
      } else {
        comparisonResult = { rawResponse: aiResponse };
      }
    } catch {
      comparisonResult = { rawResponse: aiResponse };
    }

    return NextResponse.json(comparisonResult);
  } catch (error: any) {
    console.error("Document Comparison API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to compare documents" },
      { status: 500 },
    );
  }
}
