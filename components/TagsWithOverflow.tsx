"use client";

import { useState } from "react";

type TagsWithOverflowProps = {
  tags: string[];
  maxVisible?: number;
};

export default function TagsWithOverflow({ tags, maxVisible = 2 }: TagsWithOverflowProps) {
  const [showAll, setShowAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!tags || tags.length === 0) return null;

  const visibleTags = showAll ? tags : tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {visibleTags.map((tag, index) => (
        <span 
          key={index}
          className="text-sm border border-gray-300 rounded-full px-3 py-1 whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
      
      {remainingCount > 0 && !showAll && (
        <button
          onClick={toggleExpanded}
          className="text-sm border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          +{remainingCount}
        </button>
      )}
      
      {showAll && remainingCount > 0 && (
        <button
          onClick={toggleExpanded}
          className="text-sm border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Show less
        </button>
      )}
    </div>
  );
}
