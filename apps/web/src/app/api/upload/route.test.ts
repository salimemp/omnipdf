// @ts-nocheck
const mockCookies = {
  get: jest.fn(),
  getAll: jest.fn(() => []),
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookies)),
}));

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => {
  const createQueryBuilder = (data = null, error = null) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  });

  return {
    createServerClient: jest.fn(() => {
      const mockClient = {
        auth: {
          getSession: jest
            .fn()
            .mockResolvedValue({ data: { session: null }, error: null }),
          exchangeCodeForSession: jest
            .fn()
            .mockResolvedValue({ data: { session: null }, error: null }),
          signInWithPassword: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          resend: jest.fn(),
        },
        from: jest.fn((table) => {
          const tableData =
            {
              usage_analytics: { total_conversions: 0 },
              users: {
                subscription_tier: "free",
                subscription_status: "active",
              },
              documents: [],
              conversions: null,
            }[table] || null;
          return createQueryBuilder(tableData, null);
        }),
        storage: {
          from: jest.fn(() => ({
            upload: jest
              .fn()
              .mockResolvedValue({ data: { path: "test-path" }, error: null }),
            remove: jest.fn().mockResolvedValue({ error: null }),
            getPublicUrl: jest
              .fn()
              .mockReturnValue({
                data: { publicUrl: "https://example.com/test" },
              }),
          })),
        },
        rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      return mockClient;
    }),
  };
});

describe("Upload API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 when not authenticated", async () => {
    const { createServerClient } = require("@supabase/ssr");
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: null }, error: null }),
      },
    });

    const { POST } = require("./route");

    const mockRequest = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      body: new FormData(),
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
  });

  test("returns 400 when no file provided", async () => {
    const mockSession = { user: { id: "user-123" } };
    const { createServerClient } = require("@supabase/ssr");
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: mockSession }, error: null }),
      },
      from: jest.fn((table) => ({
        select: jest.fn().mockReturnThis(),
        eq: jest
          .fn()
          .mockResolvedValue({
            data: { subscription_tier: "free" },
            error: null,
          }),
      })),
      storage: {
        from: jest.fn(() => ({
          upload: jest
            .fn()
            .mockResolvedValue({ data: { path: "test-path" }, error: null }),
          getPublicUrl: jest
            .fn()
            .mockReturnValue({
              data: { publicUrl: "https://example.com/test" },
            }),
        })),
      },
    });

    const { POST } = require("./route");

    const formData = new FormData();
    const mockRequest = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
  });

  test("rejects file exceeding size limit", async () => {
    const mockSession = { user: { id: "user-123" } };
    const { createServerClient } = require("@supabase/ssr");
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: mockSession }, error: null }),
      },
      from: jest.fn((table) => ({
        select: jest.fn().mockReturnThis(),
        eq: jest
          .fn()
          .mockResolvedValue({
            data: { subscription_tier: "free" },
            error: null,
          }),
      })),
      storage: {
        from: jest.fn(() => ({
          upload: jest
            .fn()
            .mockResolvedValue({ data: { path: "test-path" }, error: null }),
          getPublicUrl: jest
            .fn()
            .mockReturnValue({
              data: { publicUrl: "https://example.com/test" },
            }),
        })),
      },
    });

    const formData = new FormData();
    const largeFile = new File(["x".repeat(26 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });
    formData.append("file", largeFile);
    formData.append("conversionType", "convert");

    const { POST } = require("./route");

    const mockRequest = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
  });
});

describe("Convert API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 when not authenticated", async () => {
    const { createServerClient } = require("@supabase/ssr");
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: null }, error: null }),
      },
    });

    const { POST } = require("./route");

    const mockRequest = new Request("http://localhost:3000/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "convert",
        documentIds: ["doc-1"],
        outputFormat: "docx",
      }),
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
  });

  test("returns 400 for missing required fields", async () => {
    const mockSession = { user: { id: "user-123" } };
    const { createServerClient } = require("@supabase/ssr");
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: mockSession }, error: null }),
      },
      from: jest.fn((table) => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data:
            table === "usage_analytics"
              ? { total_conversions: 0 }
              : { subscription_tier: "free", subscription_status: "active" },
          error: null,
        }),
      })),
    });

    const { POST } = require("./route");

    const mockRequest = new Request("http://localhost:3000/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
  });

  test("returns 400 for invalid conversion type", async () => {
    const mockSession = { user: { id: "user-123" } };
    const { createServerClient } = require("@supabase/ssr");
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: mockSession }, error: null }),
      },
      from: jest.fn((table) => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data:
            table === "usage_analytics"
              ? { total_conversions: 0 }
              : { subscription_tier: "free", subscription_status: "active" },
          error: null,
        }),
      })),
    });

    const { POST } = require("./route");

    const mockRequest = new Request("http://localhost:3000/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "invalid_type",
        documentIds: ["doc-1"],
      }),
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
  });
});
