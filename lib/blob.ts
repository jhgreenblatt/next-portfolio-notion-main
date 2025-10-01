import { put } from '@vercel/blob';

/**
 * Upload an image from a URL to Vercel blob storage
 * This is useful for converting Notion images to blob storage URLs
 */
export async function uploadImageToBlob(imageUrl: string, filename?: string): Promise<string | null> {
  try {
    // Fetch the image from the original URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return null;
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Generate a filename if not provided
    const finalFilename = filename || `image-${Date.now()}.${getFileExtension(contentType)}`;
    
    // Upload to blob storage
    const blob = await put(finalFilename, imageBuffer, {
      access: 'public',
      contentType,
    });

    return blob.url;
  } catch (error) {
    console.error('Error uploading image to blob storage:', error);
    return null;
  }
}

/**
 * Get file extension from content type
 */
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

/**
 * Check if a URL is already a blob storage URL
 */
export function isBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

/**
 * Process image URL - upload to blob storage if it's not already a blob URL
 */
export async function processImageUrl(originalUrl: string, filename?: string): Promise<string> {
  // If it's already a blob URL, return as-is
  if (isBlobUrl(originalUrl)) {
    return originalUrl;
  }
  
  // Otherwise, upload to blob storage
  const blobUrl = await uploadImageToBlob(originalUrl, filename);
  return blobUrl || originalUrl; // Fallback to original URL if upload fails
}
