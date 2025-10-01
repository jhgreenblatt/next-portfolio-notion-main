"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface BlobImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  unoptimized?: boolean;
  caption?: string;
}

export default function BlobImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  unoptimized = true,
  caption,
}: BlobImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If it's already a blob URL or a data URL, use it directly
    if (src.includes('blob.vercel-storage.com') || src.startsWith('data:')) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // For Notion images, try to upload to blob storage
    if (src.includes('notion.so') || src.includes('amazonaws.com')) {
      uploadToBlob(src);
    } else {
      setImageSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  const uploadToBlob = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl,
          filename: `notion-image-${Date.now()}`
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        setImageSrc(url);
      } else {
        // Fallback to original URL if upload fails
        setImageSrc(src);
      }
    } catch (error) {
      console.error('Failed to upload image to blob storage:', error);
      // Fallback to original URL
      setImageSrc(src);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  const imageProps = fill
    ? {
        src: imageSrc,
        alt,
        fill: true,
        className,
        unoptimized,
        onError: () => setError("Failed to load image"),
      }
    : {
        src: imageSrc,
        alt,
        width,
        height,
        className,
        unoptimized,
        onError: () => setError("Failed to load image"),
      };

  return (
    <>
      <Image {...imageProps} />
      {caption && (
        <p className="text-sm text-gray-500 mt-2 text-center italic">
          {caption}
        </p>
      )}
    </>
  );
}
