
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
      className="
        max-w-2xl mx-auto px-8 py-10 animate-fade-in relative
        rounded-2xl
        border border-white/60 dark:border-white/20
        shadow-2xl
        backdrop-blur-3xl
        bg-white/30 dark:bg-white/10
        before:content-[''] before:absolute before:inset-0 
        before:rounded-2xl
        before:pointer-events-none
        before:bg-gradient-to-br before:from-white/80 before:via-white/40 before:to-white/10
        before:opacity-70
        overflow-hidden
      "
      style={{
        boxShadow: "0 8px 40px 0 rgba(0,0,0,0.18), 0 1.5px 7px 0 rgba(0,0,0,0.03)",
      }}
      initial={{ y: 50, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.65, type: "spring" }}
    >
      <div className="absolute top-5 right-6 z-10">
        <button
          onClick={onReset}
          className="rounded-full px-4 py-1 bg-white/70 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/70 text-sm font-medium shadow transition backdrop-blur-lg"
          aria-label="Try again"
        >
          Reset
        </button>
      </div>
      <h2 className="text-lg font-semibold text-primary mb-3 z-10 relative">
        🪄 For {persona}
      </h2>
      <div className="text-xl leading-normal text-black dark:text-white/90 prose prose-lg prose-neutral dark:prose-invert whitespace-pre-line selection:bg-yellow-200/80 min-h-[100px] z-10 relative">
        {answer}
      </div>
    </motion.div>
  );
}

