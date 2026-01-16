import {
  UserSchema,
  DocumentSchema,
  ConversionJobSchema,
  SubscriptionPlanSchema,
  ApiResponseSchema,
  CloudFileSchema,
  ConversionOptionsSchema,
  UserSubscriptionTier,
  SUBSCRIPTION_PLANS,
  TIER_FEATURES,
  ConversionType,
  ConversionFormat,
} from '../src/types';

describe('Types & Schemas', () => {
  describe('UserSchema', () => {
    test('validates valid user data', () => {
      const validUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.png',
        subscription_tier: 'pro' as UserSubscriptionTier,
        subscription_status: 'active',
        stripe_customer_id: 'cus_123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('rejects invalid email', () => {
      const invalidUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'invalid-email',
        subscription_tier: 'free' as UserSubscriptionTier,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('rejects invalid UUID', () => {
      const invalidUser = {
        id: 'not-a-uuid',
        email: 'test@example.com',
        subscription_tier: 'free' as UserSubscriptionTier,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('accepts missing optional fields', () => {
      const minimalUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        subscription_tier: 'free' as UserSubscriptionTier,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = UserSchema.safeParse(minimalUser);
      expect(result.success).toBe(true);
    });
  });

  describe('DocumentSchema', () => {
    test('validates valid document', () => {
      const validDoc = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        original_filename: 'test.pdf',
        original_format: 'pdf' as ConversionFormat,
        converted_format: 'docx' as ConversionFormat,
        file_size: 1024,
        storage_path: 'uploads/user-id/test.pdf',
        status: 'completed' as const,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = DocumentSchema.safeParse(validDoc);
      expect(result.success).toBe(true);
    });

    test('rejects invalid status', () => {
      const invalidDoc = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        original_filename: 'test.pdf',
        original_format: 'pdf' as ConversionFormat,
        file_size: 1024,
        storage_path: 'uploads/user-id/test.pdf',
        status: 'invalid-status' as any,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = DocumentSchema.safeParse(invalidDoc);
      expect(result.success).toBe(false);
    });

    test('rejects negative file size', () => {
      const invalidDoc = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        original_filename: 'test.pdf',
        original_format: 'pdf' as ConversionFormat,
        file_size: -100,
        storage_path: 'uploads/user-id/test.pdf',
        status: 'pending' as const,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = DocumentSchema.safeParse(invalidDoc);
      expect(result.success).toBe(false);
    });
  });

  describe('ConversionJobSchema', () => {
    test('validates valid conversion job', () => {
      const validJob = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        type: 'convert' as ConversionType,
        input_documents: [],
        output_format: 'docx' as ConversionFormat,
        status: 'pending' as const,
        progress: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = ConversionJobSchema.safeParse(validJob);
      expect(result.success).toBe(true);
    });

    test('validates all conversion types', () => {
      const types: ConversionType[] = [
        'merge', 'split', 'compress', 'convert', 'rotate',
        'extract', 'unlock', 'protect', 'watermark', 'ocr',
        'edit', 'sign', 'annotate',
      ];

      types.forEach((type) => {
        const job = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          user_id: '123e4567-e89b-12d3-a456-426614174001',
          type,
          input_documents: [],
          status: 'pending' as const,
          progress: 0,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const result = ConversionJobSchema.safeParse(job);
        expect(result.success).toBe(true);
      });
    });

    test('validates progress range', () => {
      const validJob = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        type: 'convert' as ConversionType,
        input_documents: [],
        status: 'processing' as const,
        progress: 50,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = ConversionJobSchema.safeParse(validJob);
      expect(result.success).toBe(true);
    });

    test('rejects progress > 100', () => {
      const invalidJob = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        type: 'convert' as ConversionType,
        input_documents: [],
        status: 'processing' as const,
        progress: 150,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = ConversionJobSchema.safeParse(invalidJob);
      expect(result.success).toBe(false);
    });
  });

  describe('SubscriptionPlanSchema', () => {
    test('validates subscription plans', () => {
      SUBSCRIPTION_PLANS.forEach((plan) => {
        const result = SubscriptionPlanSchema.safeParse(plan);
        expect(result.success).toBe(true);
      });
    });

    test('has all required fields', () => {
      SUBSCRIPTION_PLANS.forEach((plan) => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('tier');
        expect(plan).toHaveProperty('monthly_price');
        expect(plan).toHaveProperty('annual_price');
        expect(plan).toHaveProperty('features');
        expect(plan).toHaveProperty('limits');
      });
    });
  });

  describe('ApiResponseSchema', () => {
    test('validates success response', () => {
      const successResponse = {
        success: true,
        data: { id: '123' },
        message: 'Operation completed',
      };

      const result = ApiResponseSchema.safeParse(successResponse);
      expect(result.success).toBe(true);
    });

    test('validates error response', () => {
      const errorResponse = {
        success: false,
        error: 'Something went wrong',
      };

      const result = ApiResponseSchema.safeParse(errorResponse);
      expect(result.success).toBe(true);
    });

    test('accepts minimal response', () => {
      const minimalResponse = {
        success: true,
      };

      const result = ApiResponseSchema.safeParse(minimalResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('ConversionOptionsSchema', () => {
    test('validates empty options', () => {
      const validOptions = {};
      const result = ConversionOptionsSchema.safeParse(validOptions);
      expect(result.success).toBe(true);
    });

    test('validates merge options', () => {
      const mergeOptions = {
        merge_order: ['doc1', 'doc2', 'doc3'],
      };

      const result = ConversionOptionsSchema.safeParse(mergeOptions);
      expect(result.success).toBe(true);
    });

    test('validates compress quality', () => {
      const compressOptions = {
        compress_quality: 'high' as const,
      };

      const result = ConversionOptionsSchema.safeParse(compressOptions);
      expect(result.success).toBe(true);
    });

    test('rejects invalid compress quality', () => {
      const invalidOptions = {
        compress_quality: 'invalid' as any,
      };

      const result = ConversionOptionsSchema.safeParse(invalidOptions);
      expect(result.success).toBe(false);
    });

    test('validates rotation angle', () => {
      const rotateOptions = {
        rotate_angle: 90,
      };

      const result = ConversionOptionsSchema.safeParse(rotateOptions);
      expect(result.success).toBe(true);
    });

    test('rejects invalid rotation angle', () => {
      const invalidOptions = {
        rotate_angle: 45, // Not a multiple of 90
      };

      const result = ConversionOptionsSchema.safeParse(invalidOptions);
      expect(result.success).toBe(false);
    });
  });

  describe('TIER_FEATURES', () => {
    test('has all tiers', () => {
      expect(TIER_FEATURES).toHaveProperty('free');
      expect(TIER_FEATURES).toHaveProperty('pro');
      expect(TIER_FEATURES).toHaveProperty('enterprise');
    });

    test('enterprise has all features enabled', () => {
      const enterprise = TIER_FEATURES.enterprise;
      Object.values(enterprise).forEach((feature) => {
        expect(feature).toBe(true);
      });
    });

    test('free tier has limited features', () => {
      const free = TIER_FEATURES.free;
      expect(free.ai_chat).toBe(false);
      expect(free.ai_summarize).toBe(false);
      expect(free.ai_translate).toBe(false);
      expect(free.read_aloud).toBe(false);
    });

    test('pro tier has AI features', () => {
      const pro = TIER_FEATURES.pro;
      expect(pro.ai_chat).toBe(true);
      expect(pro.ai_summarize).toBe(true);
      expect(pro.ai_translate).toBe(true);
      expect(pro.read_aloud).toBe(true);
    });
  });
});
