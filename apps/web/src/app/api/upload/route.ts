import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-react';
import { createId } from '@omnipdf/shared/src/utils';

export const runtime = 'nodejs';
export const maxDuration = 60;

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversionType = formData.get('conversionType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (check user tier for limits)
    const { data: user } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single();

    const maxSize = user?.subscription_tier === 'enterprise' 
      ? 2 * 1024 * 1024 * 1024 // 2GB
      : user?.subscription_tier === 'pro'
        ? 500 * 1024 * 1024 // 500MB
        : 25 * 1024 * 1024; // 25MB

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${(maxSize / 1024 / 1024).toFixed(0)}MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${createId()}.${fileExt}`;
    const storagePath = `uploads/${session.user.id}/${conversionType}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(storagePath);

    // Create document record
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: session.user.id,
        original_filename: file.name,
        original_format: fileExt || 'unknown',
        file_size: file.size,
        storage_path: storagePath,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file
      await supabase.storage.from('documents').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: document.id,
          original_filename: document.original_filename,
          original_format: document.original_format,
          file_size: document.file_size,
          url: publicUrl,
        },
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
