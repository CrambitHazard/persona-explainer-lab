
import { motion } from "framer-motion";
import React from "react";

interface ExplainerCardProps {
  answer: string;
  persona: string;
  onReset: () => void;
}

export default function ExplainerCard({ answer, persona, onReset }: ExplainerCardProps) {
  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white/70 dark:bg-black/40 rounded-2xl backdrop-blur-xl shadow-2xl px-8 py-10 animate-fade-in relative border border-white/40"
      initial={{ y: 50, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.65, type: "spring" }}
    >
      <div className="absolute top-5 right-6">
        <button
          onClick={onReset}
          className="rounded-full px-4 py-1 bg-white/30 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 border border-white/40 text-sm font-medium shadow transition"
          aria-label="Try again"
        >
          Reset
        </button>
      </div>
      <h2 className="text-lg font-semibold text-primary mb-3">
        🪄 For {persona}
      </h2>
      <div className="text-xl leading-normal text-black dark:text-white/90 prose prose-lg prose-neutral dark:prose-invert whitespace-pre-line selection:bg-yellow-200/80 min-h-[100px]">
        {answer}
      </div>
    </motion.div>
  );
}
