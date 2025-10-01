"use client";

import BlobImage from "./BlobImage";
import { NotionBlock } from "./NotionRenderer";

// Layout detection patterns
const detectLayoutPattern = (blocks: NotionBlock[]): string => {
  // Look for patterns in the content structure
  const blockTypes = blocks.map(block => block.type);
  
  // Pattern: Heading + Paragraph + Image = "hero-image"
  if (blockTypes.slice(0, 3).join(',') === 'heading_2,paragraph,image') {
    return 'hero-image';
  }
  
  // Pattern: Multiple consecutive images = "image-gallery"
  const imageCount = blocks.filter(block => block.type === 'image').length;
  if (imageCount >= 3) {
    return 'image-gallery';
  }
  
  // Pattern: Heading + Paragraph + Image + Paragraph = "image-with-text"
  if (blockTypes.slice(0, 4).join(',') === 'heading_2,paragraph,image,paragraph') {
    return 'image-with-text';
  }
  
  // Default layout
  return 'default';
};

// Layout Components
const HeroImageLayout = ({ blocks }: { blocks: NotionBlock[] }) => {
  const heading = blocks[0];
  const paragraph = blocks[1];
  const image = blocks[2];
  
  return (
    <div className="my-12">
      {heading && (
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {heading.richText ? renderRichText(heading.richText) : heading.text}
        </h2>
      )}
      
      {paragraph && (
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          {paragraph.richText ? renderRichText(paragraph.richText) : paragraph.text}
        </p>
      )}
      
      {image && image.url && (
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-gray-200">
          <BlobImage
            src={image.url}
            alt={image.caption || 'Case study image'}
            fill
            className="object-cover"
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <p className="text-sm">{image.caption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ImageGalleryLayout = ({ blocks }: { blocks: NotionBlock[] }) => {
  const images = blocks.filter(block => block.type === 'image');
  
  return (
    <div className="my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
            <BlobImage
              src={image.url!}
              alt={image.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                <p className="text-xs">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TwoColumnLayout = ({ blocks }: { blocks: NotionBlock[] }) => {
  const heading = blocks.find(block => block.type.startsWith('heading'));
  const paragraphs = blocks.filter(block => block.type === 'paragraph');
  const images = blocks.filter(block => block.type === 'image');
  
  return (
    <div className="my-12">
      {heading && (
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          {heading.richText ? renderRichText(heading.richText) : heading.text}
        </h2>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          {paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph.richText ? renderRichText(paragraph.richText) : paragraph.text}
            </p>
          ))}
        </div>
        
        <div className="space-y-6">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
              <BlobImage
                src={image.url!}
                alt={image.caption || `Image ${index + 1}`}
                fill
                className="object-cover"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to render rich text (reused from NotionRenderer)
const renderRichText = (richText: NotionBlock['richText']) => {
  if (!richText) return '';
  
  return richText.map((text, index) => {
    const content = text.text.content;
    let element: React.ReactNode = content;
    
    if (text.annotations.bold) element = <strong key={index}>{element}</strong>;
    if (text.annotations.italic) element = <em key={index}>{element}</em>;
    if (text.annotations.code) element = <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm">{element}</code>;
    
    if (text.text.link) {
      element = (
        <a 
          key={index}
          href={text.text.link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {element}
        </a>
      );
    }
    
    return element;
  });
};

// Main Layout Component
export default function CaseStudyLayout({ blocks }: { blocks: NotionBlock[] }) {
  const layoutPattern = detectLayoutPattern(blocks);
  
  switch (layoutPattern) {
    case 'hero-image':
      return <HeroImageLayout blocks={blocks} />;
    case 'image-gallery':
      return <ImageGalleryLayout blocks={blocks} />;
    case 'image-with-text':
      return <TwoColumnLayout blocks={blocks} />;
    default:
      // Fallback to default NotionRenderer
      return null;
  }
}
