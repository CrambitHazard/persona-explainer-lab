
import React from "react";
import { useTheme } from "next-themes";
import { ToggleLeft, ToggleRight } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10
        rounded-full shadow-xl p-2 transition flex items-center justify-center hover:scale-105 active:scale-95
        glass-toggle"
      style={{
        boxShadow:
          "0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 7px 0 rgba(0,0,0,0.08)",
      }}
    >
      {isDark ? (
        <ToggleLeft size={24} className="text-slate-900 dark:text-emerald-100" />
      ) : (
        <ToggleRight size={24} className="text-emerald-700 dark:text-emerald-200" />
      )}
    </button>
  );
}
