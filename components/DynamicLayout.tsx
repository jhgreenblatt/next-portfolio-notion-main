"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    duration: 20,
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  // Extract captions for all images (before useEffect that uses it)
  const captions = images.map((image, index) => 
    image.caption || (paragraphs[index] ? cleanBlockText(paragraphs[index]) : '')
  );
  
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);
  
  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );
  
  useEffect(() => {
    if (!emblaApi) return;
    
    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    const handleReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      handleSelect();
    };
    
    handleReInit();
    emblaApi.on('select', handleSelect);
    emblaApi.on('reInit', handleReInit);
    
    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleReInit);
    };
  }, [emblaApi]);
  
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
        {/* Carousel */}
        <div className="overflow-hidden rounded-xl bg-gray-50" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="flex-[0_0_80%] min-w-0 px-4 md:flex-[0_0_60%]"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-700 ease-out ${
                    selectedIndex === index ? 'scale-100 opacity-100 shadow-xl' : 'scale-95 opacity-70'
                  }`}
                >
                  <img
                    src={image.url!}
                    alt={captions[index] || `Gallery image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <div className="absolute inset-y-0 left-0 flex items-center px-2">
          <button
            onClick={scrollPrev}
            className="rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2">
          <button
            onClick={scrollNext}
            className="rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === selectedIndex ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Fixed Caption Area with Fade Transitions */}
        <div className="relative mt-6 min-h-[60px] flex items-center justify-center">
          {captions[selectedIndex] && (
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl text-center">
              {captions[selectedIndex]}
            </p>
          )}
        </div>
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
