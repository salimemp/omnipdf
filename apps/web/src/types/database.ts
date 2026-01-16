export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          original_filename: string;
          original_format: string;
          converted_format: string | null;
          file_size: number;
          storage_path: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_filename: string;
          original_format: string;
          converted_format?: string | null;
          file_size: number;
          storage_path: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_filename?: string;
          original_format?: string;
          converted_format?: string | null;
          file_size?: number;
          storage_path?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          input_documents: string[];
          output_format: string | null;
          options: Json | null;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          progress: number;
          result_url: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          input_documents: string[];
          output_format?: string | null;
          options?: Json | null;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          progress?: number;
          result_url?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          input_documents?: string[];
          output_format?: string | null;
          options?: Json | null;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          progress?: number;
          result_url?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_analytics: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          period_end: string;
          total_conversions: number;
          storage_used_bytes: number;
          ai_api_calls: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_start: string;
          period_end: string;
          total_conversions?: number;
          storage_used_bytes?: number;
          ai_api_calls?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          period_start?: string;
          period_end?: string;
          total_conversions?: number;
          storage_used_bytes?: number;
          ai_api_calls?: number;
          created_at?: string;
        };
      };
    };
  };
}
