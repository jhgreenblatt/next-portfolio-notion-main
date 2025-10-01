import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, filename } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Generate filename if not provided
    const finalFilename = filename || `image-${Date.now()}.${getFileExtension(contentType)}`;
    
    // Upload to blob storage
    const blob = await put(finalFilename, imageBuffer, {
      access: 'public',
      contentType,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

function getFileExtension(contentType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  
  return extensions[contentType] || 'jpg';
}
