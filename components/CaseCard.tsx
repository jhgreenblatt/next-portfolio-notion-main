"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  slug: string;
  title: string;
  summary?: string;
  coverImage?: string;
};

export default function CaseCard({ slug, title, summary, coverImage }: Props) {
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
          <h3 className="font-semibold">{title}</h3>
          {summary ? <p className="text-sm text-gray-600 mt-1">{summary}</p> : null}
        </div>
      </Link>
    </motion.li>
  );
}


