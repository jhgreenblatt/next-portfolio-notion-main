"use client";

import BlobImage from "./BlobImage";
import { NotionBlock } from "./NotionRenderer";

// Advanced layout patterns based on your reference image
interface LayoutPattern {
  pattern: string[];
  component: string;
  keywords?: string[];
}

const LAYOUT_PATTERNS: Record<string, LayoutPattern> = {
  // Full-width hero image with overlay text
  HERO_OVERLAY: {
    pattern: ['heading_1', 'paragraph', 'image'],
    component: 'HeroOverlay'
  },
  
  // Service blueprint / complex diagram
  FULLWIDTH_DIAGRAM: {
    pattern: ['heading_2', 'paragraph', 'image'],
    component: 'FullWidthDiagram'
  },
  
  // Two-column content with image
  TWO_COLUMN: {
    pattern: ['heading_2', 'paragraph', 'paragraph', 'image'],
    component: 'TwoColumn'
  },
  
  // Image gallery / carousel
  IMAGE_GALLERY: {
    pattern: ['heading_2', 'image', 'image', 'image'],
    component: 'ImageGallery'
  },
  
  // KPI cards / metrics display
  METRICS_CARDS: {
    pattern: ['heading_2', 'paragraph', 'image'],
    component: 'MetricsCards'
  },
  
  // Timeline / process steps
  TIMELINE: {
    pattern: ['heading_2', 'paragraph', 'image'],
    component: 'Timeline'
  },
  
  // Simple centered content
  CENTERED: {
    pattern: ['heading_2', 'paragraph'],
    component: 'Centered'
  },
  
  // Side-by-side comparison
  COMPARISON: {
    pattern: ['heading_2', 'paragraph', 'image', 'paragraph', 'image'],
    component: 'Comparison'
  }
};

// Layout Components
const HeroOverlay = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, paragraph, image] = blocks;
  
  return (
    <div className="my-16">
      <div className="relative">
        {image?.url && (
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
            <BlobImage
              src={image.url}
              alt={heading?.text || 'Hero image'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-8">
                {heading && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {heading.text}
                  </h1>
                )}
                {paragraph && (
                  <p className="text-xl md:text-2xl leading-relaxed">
                    {paragraph.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FullWidthDiagram = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, paragraph, image] = blocks;
  
  return (
    <div className="my-16">
      {heading && (
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{heading.text}</h2>
      )}
      
      {paragraph && (
        <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-4xl">
          {paragraph.text}
        </p>
      )}
      
      {image?.url && (
        <div className="relative">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <BlobImage
              src={image.url}
              alt={heading?.text || 'Diagram'}
              fill
              className="object-contain bg-gray-50"
            />
          </div>
          {image.caption && (
            <p className="text-sm text-gray-600 mt-4 text-center italic">
              {image.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const TwoColumn = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, ...contentBlocks] = blocks;
  const paragraphs = contentBlocks.filter(block => block.type === 'paragraph');
  const images = contentBlocks.filter(block => block.type === 'image');
  
  return (
    <div className="my-16">
      {heading && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900">{heading.text}</h2>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              <p className="text-lg text-gray-700 leading-relaxed">
                {paragraph.text}
              </p>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <BlobImage
                src={image.url!}
                alt={image.caption || `Image ${index + 1}`}
                fill
                className="object-cover"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
                  <p className="text-sm font-medium text-gray-900">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ImageGallery = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, ...imageBlocks] = blocks;
  const images = imageBlocks.filter(block => block.type === 'image');
  
  return (
    <div className="my-16">
      {heading && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900">{heading.text}</h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <BlobImage
              src={image.url!}
              alt={image.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {image.caption && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-end">
                <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">{image.caption}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Centered = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, paragraph] = blocks;
  
  return (
    <div className="my-16 text-center max-w-4xl mx-auto">
      {heading && (
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{heading.text}</h2>
      )}
      {paragraph && (
        <p className="text-lg text-gray-700 leading-relaxed">{paragraph.text}</p>
      )}
    </div>
  );
};

const Comparison = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, paragraph1, image1, paragraph2, image2] = blocks;
  
  return (
    <div className="my-16">
      {heading && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">{heading.text}</h2>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {paragraph1 && (
            <p className="text-lg text-gray-700 leading-relaxed">{paragraph1.text}</p>
          )}
          {image1?.url && (
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
              <BlobImage
                src={image1.url}
                alt={image1.caption || 'Comparison image 1'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {paragraph2 && (
            <p className="text-lg text-gray-700 leading-relaxed">{paragraph2.text}</p>
          )}
          {image2?.url && (
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
              <BlobImage
                src={image2.url}
                alt={image2.caption || 'Comparison image 2'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Layout trigger detection from Notion content
const detectLayoutTrigger = (blocks: NotionBlock[]): string | null => {
  // Look for layout triggers in the first few blocks
  const firstBlocks = blocks.slice(0, 3);
  
  for (const block of firstBlocks) {
    const text = block.text?.toLowerCase() || '';
    
    // Check for callout blocks with layout triggers
    if (block.type === 'callout') {
      // Look for layout:hero-overlay, layout:fullwidth-diagram, etc.
      const layoutMatch = text.match(/layout:\s*([a-z-]+)/);
      if (layoutMatch) {
        const layoutType = layoutMatch[1].replace(/-/g, '_').toUpperCase();
        return layoutType;
      }
    }
    
    // Check for special heading patterns
    if (block.type.startsWith('heading')) {
      // Look for [LAYOUT:hero-overlay] in heading text
      const headingMatch = text.match(/\[layout:\s*([a-z-]+)\]/);
      if (headingMatch) {
        const layoutType = headingMatch[1].replace(/-/g, '_').toUpperCase();
        return layoutType;
      }
    }
    
    // Check for paragraph blocks with layout triggers
    if (block.type === 'paragraph') {
      const paragraphMatch = text.match(/<!-- layout:\s*([a-z-]+) -->/);
      if (paragraphMatch) {
        const layoutType = paragraphMatch[1].replace(/-/g, '_').toUpperCase();
        return layoutType;
      }
    }
  }
  
  return null;
};

// Main Dynamic Layout Component
export default function DynamicLayout({ blocks }: { blocks: NotionBlock[] }) {
  const layoutType = detectLayoutTrigger(blocks);
  
  switch (layoutType) {
    case 'HERO_OVERLAY':
      return <HeroOverlay blocks={blocks} />;
    case 'FULLWIDTH_DIAGRAM':
      return <FullWidthDiagram blocks={blocks} />;
    case 'TWO_COLUMN':
      return <TwoColumn blocks={blocks} />;
    case 'IMAGE_GALLERY':
      return <ImageGallery blocks={blocks} />;
    case 'METRICS_CARDS':
      return <FullWidthDiagram blocks={blocks} />; // Reuse diagram layout for metrics
    case 'TIMELINE':
      return <FullWidthDiagram blocks={blocks} />; // Reuse diagram layout for timeline
    case 'CENTERED':
      return <Centered blocks={blocks} />;
    case 'COMPARISON':
      return <Comparison blocks={blocks} />;
    default:
      return null; // Fall back to default NotionRenderer
  }
}
