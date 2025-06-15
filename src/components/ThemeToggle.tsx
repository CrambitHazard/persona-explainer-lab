
import React from "react";
import { useTheme } from "next-themes";
import { MoonStar, SunMedium } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative transition
        shadow-[0_2px_16px_0_rgba(0,0,0,0.35)]
        rounded-full border border-white/20 
        overflow-hidden flex items-center justify-center
        p-2
        backdrop-blur-2xl 
        bg-gradient-to-br
        ${isDark
          ? "from-black/70 via-neutral-800/70 to-slate-950/60"
          : "from-white/60 via-slate-50/80 to-slate-200/70"}
        ring-1 ring-inset ring-white/20
        hover:scale-105 active:scale-95
      `}
      style={{
        boxShadow: isDark
          ? "0 2px 24px 1px rgba(0,0,0,0.45), 0 1.5px 7px 0 rgba(0,0,0,0.13)"
          : "0 2px 24px 0 rgba(128,220,255,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.07)",
      }}
    >
      <span className="z-10">
        {isDark ? (
          <SunMedium size={22} className="text-yellow-300 drop-shadow" />
        ) : (
          <MoonStar size={22} className="text-emerald-700 drop-shadow" />
        )}
      </span>
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: isDark
            ? "1px solid rgba(200,255,235,0.12)"
            : "1px solid rgba(80,160,255,0.14)",
          boxShadow: isDark
            ? "0 0 10px 2px #2fecd1bb"
            : "0 0 8px 2px #aeefff77",
        }}
      ></span>
    </button>
  );
}
