import React from "react";
import DynamicLayout from "./DynamicLayout";
import BlobImage from "./BlobImage";

// Comprehensive Notion block types
export type NotionBlock = {
  type: string;
  text?: string;
  children?: NotionBlock[];
  // Rich text with formatting
  richText?: Array<{
    type: string;
    text: { content: string; link?: { url: string } };
    annotations: {
      bold?: boolean;
      italic?: boolean;
      strikethrough?: boolean;
      underline?: boolean;
      code?: boolean;
      color?: string;
    };
  }>;
  // Media properties
  url?: string;
  caption?: string;
  // List properties
  listItems?: string[];
};

// Helper function to render rich text with formatting
function renderRichText(richText: NotionBlock['richText']) {
  if (!richText) return '';
  
  return richText.map((text, index) => {
    const content = text.text.content;
    let element: React.ReactNode = content;
    
    // Apply formatting
    if (text.annotations.bold) element = <strong key={index}>{element}</strong>;
    if (text.annotations.italic) element = <em key={index}>{element}</em>;
    if (text.annotations.code) element = <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm">{element}</code>;
    if (text.annotations.strikethrough) element = <s key={index}>{element}</s>;
    
    // Handle links
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
}

// Helper function to check if a block is a layout trigger
const isLayoutTrigger = (block: NotionBlock): boolean => {
  const text = block.text?.toLowerCase() || '';
  
  // Check for callout blocks with layout triggers
  if (block.type === 'callout') {
    return /layout:\s*[a-z-]+/.test(text);
  }
  
  // Check for heading blocks with layout triggers
  if (block.type.startsWith('heading')) {
    return /\[layout:\s*[a-z-]+\]/.test(text);
  }
  
  // Check for paragraph blocks with layout triggers
  if (block.type === 'paragraph') {
    return /<!-- layout:\s*[a-z-]+ -->/.test(text);
  }
  
  return false;
};

export default function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  // Filter out layout trigger blocks
  const filteredBlocks = blocks.filter(block => !isLayoutTrigger(block));
  
  // Group blocks into layout sections
  const layoutSections: NotionBlock[][] = [];
  let currentSection: NotionBlock[] = [];
  
  filteredBlocks.forEach((block, index) => {
    // Start a new section on major headings
    if (block.type.startsWith('heading') && currentSection.length > 0) {
      layoutSections.push([...currentSection]);
      currentSection = [block];
    } else {
      currentSection.push(block);
    }
    
    // Push the last section
    if (index === filteredBlocks.length - 1) {
      layoutSections.push([...currentSection]);
    }
  });
  
  return (
    <div className="prose prose-gray max-w-none">
      {layoutSections.map((section, sectionIndex) => {
        // Try dynamic layout first
        const dynamicLayout = <DynamicLayout blocks={section} />;
        
        if (dynamicLayout) {
          return <div key={sectionIndex}>{dynamicLayout}</div>;
        }
        
        // Fall back to individual block rendering
        return section.map((block, blockIndex) => {
          switch (block.type) {
            case "heading_1":
              return (
                <h1 key={`${sectionIndex}-${blockIndex}`} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </h1>
              );
            
            case "heading_2":
              return (
                <h2 key={`${sectionIndex}-${blockIndex}`} className="text-2xl font-semibold mt-6 mb-3 text-gray-900">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </h2>
              );
            
            case "heading_3":
              return (
                <h3 key={`${sectionIndex}-${blockIndex}`} className="text-xl font-medium mt-5 mb-2 text-gray-900">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </h3>
              );
            
            case "paragraph":
              return (
                <p key={`${sectionIndex}-${blockIndex}`} className="mb-4 text-gray-700 leading-relaxed">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </p>
              );
            
            case "bulleted_list_item":
              return (
                <li key={`${sectionIndex}-${blockIndex}`} className="mb-2 text-gray-700">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </li>
              );
            
            case "numbered_list_item":
              return (
                <li key={`${sectionIndex}-${blockIndex}`} className="mb-2 text-gray-700">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </li>
              );
            
            case "image":
              return (
                <div key={`${sectionIndex}-${blockIndex}`} className="my-6">
                  {block.url && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <BlobImage
                        src={block.url}
                        alt={block.caption || 'Notion image'}
                        fill
                        className="object-cover"
                        caption={block.caption}
                      />
                    </div>
                  )}
                </div>
              );
            
            case "quote":
              return (
                <blockquote key={`${sectionIndex}-${blockIndex}`} className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">
                  {block.richText ? renderRichText(block.richText) : block.text}
                </blockquote>
              );
            
            case "callout":
              return (
                <div key={`${sectionIndex}-${blockIndex}`} className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-3">💡</div>
                    <div className="text-blue-800">
                      {block.richText ? renderRichText(block.richText) : block.text}
                    </div>
                  </div>
                </div>
              );
            
            case "divider":
              return <hr key={`${sectionIndex}-${blockIndex}`} className="my-8 border-gray-200" />;
            
            case "code":
              return (
                <pre key={`${sectionIndex}-${blockIndex}`} className="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto">
                  <code className="text-sm text-gray-800">
                    {block.richText ? renderRichText(block.richText) : block.text}
                  </code>
                </pre>
              );
            
            default:
              // Fallback for unknown block types
              return (
                <div key={`${sectionIndex}-${blockIndex}`} className="mb-4 text-gray-700">
                  {block.richText ? renderRichText(block.richText) : block.text || `[${block.type}]`}
                </div>
              );
          }
        });
      })}
    </div>
  );
}


