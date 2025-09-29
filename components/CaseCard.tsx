"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  slug: string;
  title: string;
  summary?: string;
  coverImage?: string;
  role?: string;
  year?: string;
  tags?: string[];
  publishedDate?: string;
  articleType?: string;
};

export default function CaseCard({ 
  slug, 
  title, 
  summary, 
  coverImage, 
  role, 
  year, 
  tags, 
  articleType 
}: Props) {
  return (
    <motion.li
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="rounded-lg overflow-hidden border border-gray-200/70 bg-white"
    >
      <Link href={`/case/${slug}`} className="block">
        {coverImage ? (
          <div className="relative aspect-[16/9]">
            <Image src={coverImage} alt={title} fill className="object-cover" />
          </div>
        ) : null}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">{title}</h3>
            {articleType ? (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full ml-2">
                {articleType}
              </span>
            ) : null}
          </div>
          
          {(role || year) ? (
            <div className="text-xs text-gray-500 mb-2">
              {[role, year].filter(Boolean).join(" · ")}
            </div>
          ) : null}
          
          {summary ? <p className="text-sm text-gray-600 mb-3">{summary}</p> : null}
          
          {tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.li>
  );
}


