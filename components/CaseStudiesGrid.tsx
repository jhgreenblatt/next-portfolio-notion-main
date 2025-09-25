"use client";

import { motion } from "framer-motion";
import CaseCard from "./CaseCard";

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  role?: string;
  year?: string;
};

type Props = {
  cases: CaseStudy[];
};

export default function CaseStudiesGrid({ cases }: Props) {
  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cases.map((c) => (
        <motion.div 
          key={c.id} 
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
        >
          <CaseCard slug={c.slug} title={c.title} summary={c.summary} coverImage={c.coverImage} />
        </motion.div>
      ))}
    </motion.ul>
  );
}
