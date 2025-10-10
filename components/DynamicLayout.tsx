"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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

// Helper function to clean layout trigger text from block text
const cleanBlockText = (block: NotionBlock): string => {
  if (!block) return '';
  const text = block.text || '';
  
  // Remove [layout:xxx] from headings
  if (block.type.startsWith('heading')) {
    return text.replace(/\[layout:\s*[a-z-]+\]\s*/i, '').trim();
  }
  
  // Remove <!-- layout:xxx --> from paragraphs
  if (block.type === 'paragraph') {
    return text.replace(/<!--\s*layout:\s*[a-z-]+\s*-->\s*/i, '').trim();
  }
  
  return text;
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
              alt={cleanBlockText(heading) || 'Hero image'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-8">
                {heading && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {cleanBlockText(heading)}
                  </h1>
                )}
                {paragraph && (
                  <p className="text-xl md:text-2xl leading-relaxed">
                    {cleanBlockText(paragraph)}
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
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{cleanBlockText(heading)}</h2>
      )}
      
      {paragraph && (
        <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-4xl">
          {cleanBlockText(paragraph)}
        </p>
      )}
      
      {image?.url && (
        <div className="relative">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <BlobImage
              src={image.url}
              alt={cleanBlockText(heading) || 'Diagram'}
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
        <h2 className="text-3xl font-bold mb-8 text-gray-900">{cleanBlockText(heading)}</h2>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <div key={index}>
              <p className="text-lg text-gray-700 leading-relaxed">
                {cleanBlockText(paragraph)}
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
  // Find the heading (if exists) and filter all images
  const heading = blocks.find(block => block.type.startsWith('heading'));
  const images = blocks.filter(block => block.type === 'image');
  
  // Also capture any paragraphs that might be used as captions (fallback)
  const paragraphs = blocks.filter(block => block.type === 'paragraph');
  
  /* 
   * 🎨 Embla Carousel Customization Options:
   * 
   * loop: true/false - Enable infinite looping
   * align: 'start' | 'center' | 'end' - How slides align in viewport
   * skipSnaps: false - Prevent skipping slides when scrolling
   * duration: 25 - Scroll duration in ms (default: 25)
   * slidesToScroll: 1 - Number of slides to scroll at once
   * 
   * Autoplay({ delay: 4000, stopOnInteraction: true })
   *   delay: Time in ms between auto-advances
   *   stopOnInteraction: Stop autoplay when user interacts
   */
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  // If no images found, don't render the carousel
  if (images.length === 0) {
    console.log('ImageGallery: No images found in blocks', blocks);
    return null;
  }
  
  console.log('ImageGallery rendering with', images.length, 'images');
  
  return (
    <div className="my-16">
      {heading && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900">{cleanBlockText(heading)}</h2>
      )}
      
      <div className="relative">
        {/* Embla Carousel */}
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => {
              // Use Notion's native caption, or fallback to corresponding paragraph
              const caption = image.caption || (paragraphs[index] ? cleanBlockText(paragraphs[index]) : '');
              
              return (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] min-w-0 relative"
                >
                  {/* 
                    * 🎨 Image Display Options:
                    * aspect-[16/9] - Container aspect ratio (mobile & desktop)
                    * object-contain - Shows full image with letterboxing (current)
                    * object-cover - Crops image to fill container
                    * bg-gray-900 - Background color for letterboxing
                    */}
                  <div className="relative aspect-[16/9] bg-gray-900">
                    <BlobImage
                      src={image.url!}
                      alt={caption || `Gallery image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                    {caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <p className="text-white text-lg font-medium">
                          {caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors group"
              aria-label="Previous image"
            >
              <svg 
                className="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors group"
              aria-label="Next image"
            >
              <svg 
                className="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Dots Navigation */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIndex 
                    ? 'bg-gray-800 w-8' 
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Centered = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, paragraph] = blocks;
  
  return (
    <div className="my-16 text-center max-w-4xl mx-auto">
      {heading && (
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{cleanBlockText(heading)}</h2>
      )}
      {paragraph && (
        <p className="text-lg text-gray-700 leading-relaxed">{cleanBlockText(paragraph)}</p>
      )}
    </div>
  );
};

const Comparison = ({ blocks }: { blocks: NotionBlock[] }) => {
  const [heading, paragraph1, image1, paragraph2, image2] = blocks;
  
  return (
    <div className="my-16">
      {heading && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">{cleanBlockText(heading)}</h2>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {paragraph1 && (
            <p className="text-lg text-gray-700 leading-relaxed">{cleanBlockText(paragraph1)}</p>
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
            <p className="text-lg text-gray-700 leading-relaxed">{cleanBlockText(paragraph2)}</p>
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
  // Check all blocks for callout triggers, first 3 for heading/paragraph triggers
  const firstBlocks = blocks.slice(0, 3);
  
  console.log('Detecting layout trigger in blocks:', blocks.map(b => b.type).join(', '));
  
  // Check entire section for callout triggers (callouts can be anywhere)
  for (const block of blocks) {
    const text = block.text?.toLowerCase() || '';
    
    // Check for callout blocks with layout triggers
    if (block.type === 'callout') {
      console.log('Found callout block with text:', text);
      // Look for layout:hero-overlay, layout:fullwidth-diagram, etc.
      const layoutMatch = text.match(/layout:\s*([a-z-]+)/);
      if (layoutMatch) {
        const layoutType = layoutMatch[1].replace(/-/g, '_').toUpperCase();
        console.log('Detected layout type from callout:', layoutType);
        return layoutType;
      }
    }
  }
  
  // Check first 3 blocks for heading/paragraph triggers
  for (const block of firstBlocks) {
    const text = block.text?.toLowerCase() || '';
    
    // Check for special heading patterns
    if (block.type.startsWith('heading')) {
      // Look for [LAYOUT:hero-overlay] in heading text
      const headingMatch = text.match(/\[layout:\s*([a-z-]+)\]/);
      if (headingMatch) {
        const layoutType = headingMatch[1].replace(/-/g, '_').toUpperCase();
        console.log('Detected layout type from heading:', layoutType);
        return layoutType;
      }
    }
    
    // Check for paragraph blocks with layout triggers
    if (block.type === 'paragraph') {
      const paragraphMatch = text.match(/<!-- layout:\s*([a-z-]+) -->/);
      if (paragraphMatch) {
        const layoutType = paragraphMatch[1].replace(/-/g, '_').toUpperCase();
        console.log('Detected layout type from paragraph:', layoutType);
        return layoutType;
      }
    }
  }
  
  console.log('No layout trigger detected');
  return null;
};

// Helper function to check if a block is a layout trigger
const isLayoutTriggerBlock = (block: NotionBlock): boolean => {
  const text = block.text?.toLowerCase() || '';
  
  if (block.type === 'callout') {
    return /layout:\s*[a-z-]+/.test(text);
  }
  
  if (block.type.startsWith('heading')) {
    // Don't filter out headings - just clean them up
    return false;
  }
  
  if (block.type === 'paragraph') {
    return /<!-- layout:\s*[a-z-]+ -->/.test(text);
  }
  
  return false;
};

// Main Dynamic Layout Component
export default function DynamicLayout({ blocks }: { blocks: NotionBlock[] }) {
  const layoutType = detectLayoutTrigger(blocks);
  
  // Filter out the layout trigger blocks before passing to components
  const contentBlocks = blocks.filter(block => !isLayoutTriggerBlock(block));
  
  switch (layoutType) {
    case 'HERO_OVERLAY':
      return <HeroOverlay blocks={contentBlocks} />;
    case 'FULLWIDTH_DIAGRAM':
      return <FullWidthDiagram blocks={contentBlocks} />;
    case 'TWO_COLUMN':
      return <TwoColumn blocks={contentBlocks} />;
    case 'IMAGE_GALLERY':
      return <ImageGallery blocks={contentBlocks} />;
    case 'METRICS_CARDS':
      return <FullWidthDiagram blocks={contentBlocks} />; // Reuse diagram layout for metrics
    case 'TIMELINE':
      return <FullWidthDiagram blocks={contentBlocks} />; // Reuse diagram layout for timeline
    case 'CENTERED':
      return <Centered blocks={contentBlocks} />;
    case 'COMPARISON':
      return <Comparison blocks={contentBlocks} />;
    default:
      return null; // Fall back to default NotionRenderer
  }
}
