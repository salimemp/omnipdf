import { test, expect } from "@playwright/test";

test.describe("Integration Tests", () => {
  test("Convert API handles requests", async ({ request }) => {
    const response = await request.post("/api/convert", {
      data: {
        type: "convert",
        documentIds: ["test-doc-1"],
        outputFormat: "pdf",
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test("Upload API accepts files", async ({ request }) => {
    const response = await request.post("/api/upload", {
      multipart: {
        file: {
          name: "test.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("test content"),
        },
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test("AI endpoints respond", async ({ request }) => {
    const response = await request.post("/api/ai/chat", {
      data: { text: "How do I convert PDF?" },
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    const data = await response.json();
    expect(data).toHaveProperty("response");
  });

  test("Enterprise endpoints work", async ({ request }) => {
    const response = await request.get("/api/enterprise/usage");
    expect(response.status()).toBeGreaterThanOrEqual(200);
    const data = await response.json();
    expect(data).toHaveProperty("conversionsThisMonth");
  });

  test("Cloud endpoints require auth", async ({ request }) => {
    const response = await request.get(
      "/api/cloud/files?provider=google-drive",
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
