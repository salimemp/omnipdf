import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, speed, pitch, volume } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TTS service not configured" },
        { status: 503 },
      );
    }

    const response = await fetch(
      "https://texttospeech.googleapis.com/v1/text:synthesize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voiceId?.split("-").slice(0, 2).join("-") || "en-US",
            name: voiceId || "en-US-WaveNet-A",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: speed || 1,
            pitch: pitch || 0,
            volumeGainDb: volume ? (volume - 1) * 12 : 0,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "TTS synthesis failed");
    }

    const data = await response.json();

    return NextResponse.json({
      audioUrl: `data:audio/mp3;base64,${data.audioContent}`,
    });
  } catch (error: any) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate speech" },
      { status: 500 },
    );
  }
}
