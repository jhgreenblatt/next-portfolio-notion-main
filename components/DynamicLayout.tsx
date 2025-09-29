"use client";

import Image from "next/image";
import { NotionBlock } from "./NotionRenderer";

// Advanced layout patterns based on your reference image
interface LayoutPattern {
  pattern: string[];
  component: string;
  keywords?: string[];
}

const LAYOUT_PATTERNS: Record<string, LayoutPattern> = {
  // Full-width hero image with overlay text
  HERO_WITH_OVERLAY: {
    pattern: ['heading_1', 'paragraph', 'image'],
    component: 'HeroOverlay'
  },
  
  // Service blueprint / complex diagram
  DIAGRAM_FULLWIDTH: {
    pattern: ['heading_2', 'paragraph', 'image'],
    keywords: ['blueprint', 'diagram', 'process', 'flow'],
    component: 'FullWidthDiagram'
  },
  
  // Two-column content with image
  TWO_COLUMN_CONTENT: {
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
    keywords: ['kpi', 'metrics', 'results', 'outcome'],
    component: 'MetricsCards'
  },
  
  // Timeline / process steps
  TIMELINE: {
    pattern: ['heading_2', 'paragraph', 'image'],
    keywords: ['timeline', 'process', 'steps', 'phases'],
    component: 'Timeline'
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
            <Image
              src={image.url}
              alt={heading?.text || 'Hero image'}
              fill
              className="object-cover"
              unoptimized={true}
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
            <Image
              src={image.url}
              alt={heading?.text || 'Diagram'}
              fill
              className="object-contain bg-gray-50"
              unoptimized={true}
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
              <Image
                src={image.url!}
                alt={image.caption || `Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={true}
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
            <Image
              src={image.url!}
              alt={image.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized={true}
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

// Smart layout detection
const detectLayout = (blocks: NotionBlock[]): string | null => {
  const blockTexts = blocks.map(block => block.text?.toLowerCase() || '').join(' ');
  
  // Check for specific patterns
  for (const [layoutName, config] of Object.entries(LAYOUT_PATTERNS)) {
    const patternMatch = config.pattern.every((expectedType, index) => 
      blocks[index]?.type === expectedType
    );
    
    const keywordMatch = config.keywords ? 
      config.keywords.some(keyword => blockTexts.includes(keyword)) : true;
    
    if (patternMatch && keywordMatch) {
      return layoutName;
    }
  }
  
  return null;
};

// Main Dynamic Layout Component
export default function DynamicLayout({ blocks }: { blocks: NotionBlock[] }) {
  const layoutType = detectLayout(blocks);
  
  switch (layoutType) {
    case 'HERO_WITH_OVERLAY':
      return <HeroOverlay blocks={blocks} />;
    case 'DIAGRAM_FULLWIDTH':
      return <FullWidthDiagram blocks={blocks} />;
    case 'TWO_COLUMN_CONTENT':
      return <TwoColumn blocks={blocks} />;
    case 'IMAGE_GALLERY':
      return <ImageGallery blocks={blocks} />;
    default:
      return null; // Fall back to default NotionRenderer
  }
}
