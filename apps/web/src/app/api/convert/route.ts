import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-react';
import { createId } from '@omnipdf/shared/src/utils';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

const CONVERSION_ENDPOINTS: Record<string, string> = {
  merge: '/api/convert/merge',
  split: '/api/convert/split',
  compress: '/api/convert/compress',
  convert: '/api/convert/convert',
  rotate: '/api/convert/rotate',
  unlock: '/api/convert/unlock',
  protect: '/api/convert/protect',
  edit: '/api/convert/edit',
  ocr: '/api/convert/ocr',
  extract: '/api/convert/extract',
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: request.cookies.getAll(),
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user's conversion limits
    const { data: usageData } = await supabase
      .from('usage_analytics')
      .select('total_conversions')
      .eq('user_id', session.user.id)
      .gte('period_start', new Date(new Date().setDate(1)).toISOString())
      .single();

    const { data: user } = await supabase
      .from('users')
      .select('subscription_tier, subscription_status')
      .eq('id', session.user.id)
      .single();

    const monthlyLimit = user?.subscription_tier === 'free' 
      ? 25 
      : user?.subscription_tier === 'pro' 
        ? -1 // unlimited
        : -1;

    if (monthlyLimit > 0 && usageData?.total_conversions >= monthlyLimit) {
      return NextResponse.json(
        { error: 'Monthly conversion limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    if (user?.subscription_status !== 'active' && user?.subscription_status !== 'trialing') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      type, 
      documentIds, 
      outputFormat, 
      options,
      sourceCloudProvider,
      sourceCloudPath,
    } = body;

    // Validate input
    if (!type || !documentIds || documentIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if conversion type is valid
    if (!CONVERSION_ENDPOINTS[type]) {
      return NextResponse.json(
        { error: 'Invalid conversion type' },
        { status: 400 }
      );
    }

    // Get documents from database
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .in('id', documentIds)
      .eq('user_id', session.user.id);

    if (docsError || !documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'Documents not found' },
        { status: 404 }
      );
    }

    // Create conversion job
    const { data: conversion, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        user_id: session.user.id,
        type,
        input_documents: documentIds,
        output_format: outputFormat,
        options,
        status: 'processing',
        progress: 0,
      })
      .select()
      .single();

    if (conversionError) {
      return NextResponse.json(
        { error: 'Failed to create conversion job' },
        { status: 500 }
      );
    }

    // Trigger conversion via Cloudflare Worker (or fallback to queue)
    const conversionUrl = `${process.env.NEXT_PUBLIC_APP_URL}${CONVERSION_ENDPOINTS[type]}`;
    
    // For now, we'll simulate the conversion and return success
    // In production, this would trigger an async job via Cloudflare Queues
    const result = await simulateConversion(conversion.id, type, documents, outputFormat, options);

    // Update conversion status
    await supabase
      .from('conversions')
      .update({
        status: result.success ? 'completed' : 'failed',
        progress: 100,
        result_url: result.url || null,
        error_message: result.error || null,
      })
      .eq('id', conversion.id);

    // Update usage analytics
    await supabase.rpc('increment_conversion_count', {
      user_id: session.user.id,
    });

    return NextResponse.json({
      success: result.success,
      data: {
        conversion: {
          id: conversion.id,
          type,
          status: result.success ? 'completed' : 'failed',
          resultUrl: result.url,
          error: result.error,
        },
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function simulateConversion(
  conversionId: string,
  type: string,
  documents: any[],
  outputFormat?: string,
  options?: any
): Promise<{ success: boolean; url?: string; error?: string }> {
  // In production, this would be handled by Cloudflare Workers
  // For now, return a mock success response
  return {
    success: true,
    url: `https://example.com/converted/${conversionId}.${outputFormat || 'pdf'}`,
  };
}
