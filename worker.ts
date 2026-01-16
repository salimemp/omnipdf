export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/pdf-to-text') {
      return handlePdfToText(request, env);
    }

    if (url.pathname === '/pdf-to-images') {
      return handlePdfToImages(request, env);
    }

    if (url.pathname === '/merge-pdfs') {
      return handleMergePdfs(request, env);
    }

    if (url.pathname === '/split-pdf') {
      return handleSplitPdf(request, env);
    }

    if (url.pathname === '/compress-pdf') {
      return handleCompressPdf(request, env);
    }

    if (url.pathname === '/convert-format') {
      return handleConvertFormat(request, env);
    }

    if (url.pathname === '/ai-summarize') {
      return handleAiSummarize(request, env);
    }

    if (url.pathname === '/ai-translate') {
      return handleAiTranslate(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};

interface Env {
  R2_BUCKET: R2Bucket;
  GEMINI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

async function handlePdfToText(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo purposes, return mock data
    // In production, use a PDF parsing library
    const text = `This is extracted text from ${file.name}. 

The PDF contains multiple pages with various content types including:
- Text paragraphs
- Tables
- Images
- Form fields

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handlePdfToImages(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo purposes, return mock data
    // In production, use a PDF rendering library
    return new Response(JSON.stringify({
      images: [
        { page: 1, url: 'https://example.com/page1.png' },
        { page: 2, url: 'https://example.com/page2.png' },
      ],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleMergePdfs(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length < 2) {
      return new Response(JSON.stringify({ error: 'At least 2 files required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo purposes, return mock data
    // In production, merge PDFs using a library
    return new Response(JSON.stringify({
      success: true,
      url: 'https://example.com/merged.pdf',
      filename: 'merged.pdf',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleSplitPdf(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pages = formData.get('pages') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo purposes, return mock data
    return new Response(JSON.stringify({
      success: true,
      files: [
        { url: 'https://example.com/split-1.pdf', page: 1 },
        { url: 'https://example.com/split-2.pdf', page: 2 },
      ],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleCompressPdf(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = formData.get('quality') as string || 'medium';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo purposes, return mock data
    const originalSize = file.size;
    const compressionRatio = quality === 'high' ? 0.3 : quality === 'medium' ? 0.5 : 0.7;
    const newSize = Math.floor(originalSize * compressionRatio);

    return new Response(JSON.stringify({
      success: true,
      url: 'https://example.com/compressed.pdf',
      filename: 'compressed.pdf',
      originalSize,
      newSize,
      saved: originalSize - newSize,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleConvertFormat(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string;

    if (!file || !targetFormat) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo purposes, return mock data
    return new Response(JSON.stringify({
      success: true,
      url: `https://example.com/converted.${targetFormat}`,
      filename: `converted.${targetFormat}`,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleAiSummarize(request: Request, env: Env): Promise<Response> {
  try {
    const { text, language } = await request.json() as { text: string; language: string };

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Gemini API for summarization
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarize the following text in ${language || 'English'}:\n\n${text}`,
            }],
          }],
        }),
      }
    );

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Summary unavailable';

    return new Response(JSON.stringify({ summary }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'AI processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleAiTranslate(request: Request, env: Env): Promise<Response> {
  try {
    const { text, targetLanguage } = await request.json() as { text: string; targetLanguage: string };

    if (!text || !targetLanguage) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Gemini API for translation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following text to ${targetLanguage}:\n\n${text}`,
            }],
          }],
        }),
      }
    );

    const data = await response.json();
    const translation = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Translation unavailable';

    return new Response(JSON.stringify({ translation }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'AI processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
