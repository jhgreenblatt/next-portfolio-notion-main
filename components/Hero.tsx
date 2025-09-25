"use client";

import { motion } from "framer-motion";

export default function Hero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-16 pb-10">
      <motion.h1
        className="text-4xl md:text-6xl font-bold tracking-tight"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {title}
      </motion.h1>
      {subtitle ? (
        <motion.p
          className="mt-4 text-gray-600 max-w-2xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </section>
  );
}


