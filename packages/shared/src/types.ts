import { z } from 'zod';

// User Types
export const UserSubscriptionTier = z.enum(['free', 'pro', 'enterprise']);
export type UserSubscriptionTier = z.infer<typeof UserSubscriptionTier>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  subscription_tier: UserSubscriptionTier,
  subscription_status: z.enum(['active', 'canceled', 'past_due', 'trialing']).default('active'),
  stripe_customer_id: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Document Types
export const ConversionFormat = z.enum([
  'pdf',
  'docx',
  'doc',
  'xlsx',
  'xls',
  'pptx',
  'ppt',
  'txt',
  'html',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'tiff',
  'webp',
  'svg',
  'epub',
  'mobi',
  'azw3',
  'csv',
  'json',
  'xml',
  'markdown',
  'rtf',
  'odt',
  'ods',
  'odp',
]);

export type ConversionFormat = z.infer<typeof ConversionFormat>;

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  original_filename: z.string().min(1).max(255),
  original_format: ConversionFormat,
  converted_format: ConversionFormat.optional(),
  file_size: z.number().positive(),
  storage_path: z.string().min(1),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  error_message: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Document = z.infer<typeof DocumentSchema>;

// Conversion Types
export const ConversionTypeSchema = z.enum([
  'merge',
  'split',
  'compress',
  'convert',
  'rotate',
  'extract',
  'unlock',
  'protect',
  'watermark',
  'ocr',
  'edit',
  'sign',
  'annotate',
]);

export type ConversionType = z.infer<typeof ConversionTypeSchema>;

export const ConversionJobSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: ConversionTypeSchema,
  input_documents: z.array(DocumentSchema),
  output_format: ConversionFormat.optional(),
  options: z.record(z.unknown()).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  progress: z.number().min(0).max(100).default(0),
  result_url: z.string().url().optional(),
  error_message: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type ConversionJob = z.infer<typeof ConversionJobSchema>;

// Subscription Types
export const SubscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: UserSubscriptionTier,
  monthly_price: z.number().min(0),
  annual_price: z.number().min(0),
  features: z.array(z.string()),
  limits: z.object({
    max_file_size_mb: z.number(),
    monthly_conversions: z.number().optional(),
    cloud_storage_gb: z.number(),
    ai_credits: z.number(),
    cloud_services: z.array(z.string()),
  }),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    monthly_price: 0,
    annual_price: 0,
    features: [
      'Basic PDF tools',
      '25 conversions/month',
      '25MB file size limit',
      '1GB cloud storage',
      'Google & GitHub login',
      'Community support',
    ],
    limits: {
      max_file_size_mb: 25,
      monthly_conversions: 25,
      cloud_storage_gb: 1,
      ai_credits: 5,
      cloud_services: ['google_drive'],
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    monthly_price: 7.99,
    annual_price: 79.99,
    features: [
      'All PDF tools',
      'Unlimited conversions',
      '500MB file size limit',
      '50GB cloud storage',
      'All cloud services',
      'AI Assistant',
      'Priority support',
      'No ads',
    ],
    limits: {
      max_file_size_mb: 500,
      cloud_storage_gb: 50,
      ai_credits: 100,
      cloud_services: ['google_drive', 'dropbox', 'onedrive', 'box'],
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    monthly_price: 24.99,
    annual_price: 249.99,
    features: [
      'Everything in Pro',
      '2GB file size limit',
      '1TB cloud storage',
      'Unlimited AI credits',
      'Team management',
      'SSO/SAML',
      'API access',
      'Dedicated support',
      'Custom branding',
    ],
    limits: {
      max_file_size_mb: 2048,
      cloud_storage_gb: 1000,
      ai_credits: -1,
      cloud_services: ['google_drive', 'dropbox', 'onedrive', 'box'],
    },
  },
];

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Cloud Storage Types
export const CloudProviderSchema = z.enum(['google_drive', 'dropbox', 'onedrive', 'box']);
export type CloudProvider = z.infer<typeof CloudProviderSchema>;

export const CloudFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  mime_type: z.string(),
  size: z.number(),
  provider: CloudProviderSchema,
  web_url: z.string().url(),
  download_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  created_at: z.date(),
  modified_at: z.date(),
});

export type CloudFile = z.infer<typeof CloudFileSchema>;

// Feature Flags
export const FeatureFlagsSchema = z.object({
  ai_chat: z.boolean(),
  ai_summarize: z.boolean(),
  ai_translate: z.boolean(),
  read_aloud: z.boolean(),
  collaboration: z.boolean(),
  api_access: z.boolean(),
  sso: z.boolean(),
  audit_logs: z.boolean(),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

export const TIER_FEATURES: Record<UserSubscriptionTier, FeatureFlags> = {
  free: {
    ai_chat: false,
    ai_summarize: false,
    ai_translate: false,
    read_aloud: false,
    collaboration: false,
    api_access: false,
    sso: false,
    audit_logs: false,
  },
  pro: {
    ai_chat: true,
    ai_summarize: true,
    ai_translate: true,
    read_aloud: true,
    collaboration: false,
    api_access: false,
    sso: false,
    audit_logs: false,
  },
  enterprise: {
    ai_chat: true,
    ai_summarize: true,
    ai_translate: true,
    read_aloud: true,
    collaboration: true,
    api_access: true,
    sso: true,
    audit_logs: true,
  },
};

// Conversion Options
export const ConversionOptionsSchema = z.object({
  merge_order: z.array(z.string()).optional(),
  split_pages: z.array(z.number()).optional(),
  compress_quality: z.enum(['low', 'medium', 'high']).default('medium'),
  rotate_angle: z.number().min(-360).max(360).multipleOf(90).optional(),
  ocr_language: z.string().default('en'),
  watermark_text: z.string().optional(),
  watermark_position: z.enum(['center', 'top', 'bottom', 'diagonal']).default('diagonal'),
  password: z.string().optional(),
  unlock_password: z.string().optional(),
  output_filename: z.string().optional(),
});

export type ConversionOptions = z.infer<typeof ConversionOptionsSchema>;

// Analytics Types
export const UsageAnalyticsSchema = z.object({
  user_id: z.string().uuid(),
  period_start: z.date(),
  period_end: z.date(),
  total_conversions: z.number(),
  conversion_types: z.record(z.number()),
  storage_used_bytes: z.number(),
  ai_api_calls: z.number(),
  cloud_api_calls: z.record(z.number()),
});

export type UsageAnalytics = z.infer<typeof UsageAnalyticsSchema>;
