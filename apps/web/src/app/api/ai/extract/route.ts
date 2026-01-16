import { NextRequest, NextResponse } from "next/server";

interface ExtractedContent {
  type: string;
  content: string;
  confidence: number;
  page?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { text, patterns } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text content is required" },
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

    const defaultPatterns = [
      {
        type: "email",
        pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      },
      {
        type: "phone",
        pattern:
          /(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g,
      },
      {
        type: "date",
        pattern:
          /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/g,
      },
      { type: "url", pattern: /https?:\/\/[^\s]+/g },
      { type: "money", pattern: /\$\s?[\d,]+\.?\d*/g },
    ];

    const searchPatterns = patterns || defaultPatterns;
    const extractedContent: ExtractedContent[] = [];

    for (const { type, pattern } of searchPatterns) {
      const matches = text.match(pattern) || [];
      const uniqueMatches = Array.from(new Set(matches));

      for (const match of uniqueMatches) {
        extractedContent.push({
          type,
          content: match,
          confidence: 0.9,
        });
      }
    }

    const prompt = `Extract structured information from this document text. Identify and categorize:

1. Personal Information (names, addresses, dates of birth)
2. Contact Information (emails, phones, addresses)
3. Financial Information (bank accounts, credit cards, amounts)
4. Dates and Deadlines
5. Key Entities (companies, organizations, products)
6. Legal/Contractual Terms

Document text (first 3000 chars):
${text.substring(0, 3000)}

Provide extraction results in JSON format:
{
  "entities": [
    {"category": "person|organization|location|date|money|contact", "value": "extracted value", "context": "surrounding text"}
  ],
  "structure": {
    "sections": ["section1", "section2"],
    "hasSignature": boolean,
    "hasDate": boolean,
    "documentType": "contract|letter|invoice|report|other"
  }
}`;

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2000,
          },
        }),
      },
    );

    let aiData = {};
    if (aiResponse.ok) {
      const data = await aiResponse.json();
      const responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiData = JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.warn("Failed to parse AI response as JSON");
      }
    }

    return NextResponse.json({
      patternMatches: extractedContent,
      aiExtraction: aiData,
    });
  } catch (error: any) {
    console.error("Content Extraction API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract content" },
      { status: 500 },
    );
  }
}
