import { createServerClient } from '@supabase/auth-helpers-react';

// Mock the createServerClient
jest.mock('@supabase/auth-helpers-react', () => ({
  createServerClient: jest.fn(() => ({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        exchangeCodeForSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        resend: jest.fn(),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        update: jest.fn().mockResolvedValue({ data: null, error: null }),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
  createClient: jest.fn(),
}));

describe('Upload API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when not authenticated', async () => {
    const { POST } = require('./route');
    
    const mockRequest = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: new FormData(),
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  test('returns 400 when no file provided', async () => {
    const { POST } = require('./route');
    
    const mockSession = {
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
    };
    
    (createServerClient as jest.Mock).mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValue(mockSession),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { subscription_tier: 'free' }, error: null }),
      }),
    });

    const formData = new FormData();
    const mockRequest = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('No file provided');
  });

  test('rejects file exceeding size limit', async () => {
    const { POST } = require('./route');
    
    const mockSession = {
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
    };
    
    (createServerClient as jest.Mock).mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValue(mockSession),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { subscription_tier: 'free' }, error: null }),
      }),
    });

    const formData = new FormData();
    // Create a file larger than 25MB (free tier limit)
    const largeFile = new File(['x'.repeat(26 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    formData.append('file', largeFile);
    formData.append('conversionType', 'convert');

    const mockRequest = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('File size exceeds limit');
  });
});

describe('Convert API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when not authenticated', async () => {
    const { POST } = require('./route');
    
    const mockRequest = new Request('http://localhost:3000/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'convert',
        documentIds: ['doc-1'],
        outputFormat: 'docx',
      }),
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  test('returns 400 for missing required fields', async () => {
    const mockSession = {
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
    };
    
    (createServerClient as jest.Mock).mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValue(mockSession),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: { subscription_tier: 'free' }, 
          error: null 
        }),
      }),
    });

    const { POST } = require('./route');
    
    const mockRequest = new Request('http://localhost:3000/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing required fields');
  });

  test('returns 400 for invalid conversion type', async () => {
    const mockSession = {
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
    };
    
    (createServerClient as jest.Mock).mockReturnValueOnce({
      auth: {
        getSession: jest.fn().mockResolvedValue(mockSession),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: { subscription_tier: 'free' }, 
          error: null 
        }),
      }),
    });

    const { POST } = require('./route');
    
    const mockRequest = new Request('http://localhost:3000/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'invalid_type',
        documentIds: ['doc-1'],
      }),
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid conversion type');
  });
});
