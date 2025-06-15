
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
      className={`
        max-w-2xl mx-auto px-10 py-12 animate-fade-in relative
        rounded-3xl
        border border-cyan-200/30
        shadow-[0_12px_48px_0_rgba(36,255,236,0.19)]
        backdrop-blur-3xl
        bg-gradient-to-br from-black/85 via-neutral-900/80 to-slate-900/85
        before:content-[''] before:absolute before:inset-0 
        before:rounded-3xl 
        before:pointer-events-none
        before:bg-gradient-to-t before:from-white/10 before:to-white/0
        before:opacity-90
        overflow-hidden
      `}
      style={{
        boxShadow: "0 14px 56px 0 rgba(20,230,189,0.22), 0 1.5px 7px 0 rgba(0,0,0,0.11)",
      }}
      initial={{ y: 50, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.65, type: "spring" }}
    >
      <div className="absolute top-5 right-8 z-10">
        <button
          onClick={onReset}
          className={`
            rounded-full px-4 py-1
            bg-gradient-to-r from-black/60 via-cyan-900/60 to-slate-900/60
            hover:from-black/90 hover:via-cyan-900/80 hover:to-slate-900/90
            border border-cyan-200/35
            text-cyan-100 font-medium shadow transition backdrop-blur-[6px]
            ring-1 ring-inset ring-cyan-200/20
          `}
          aria-label="Try again"
        >
          Reset
        </button>
      </div>
      <h2 className="text-lg font-semibold text-cyan-100 mb-3 z-10 relative">
        🪄 For {persona}
      </h2>
      <div className={`
        text-xl leading-normal text-cyan-50/90
        prose prose-lg prose-neutral dark:prose-invert whitespace-pre-line
        selection:bg-cyan-400/30 min-h-[100px] z-10 relative
      `}>
        {answer}
      </div>
    </motion.div>
  );
}
