
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
      className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-full shadow-xl p-2 transition flex items-center justify-center hover:scale-105 active:scale-95"
      style={{
        boxShadow: "0 6px 32px 0 rgba(0,0,0,0.11), 0 2px 10px 0 rgba(0,0,0,0.10)",
      }}
    >
      {isDark ? (
        <SunMedium size={22} className="text-yellow-400" />
      ) : (
        <MoonStar size={22} className="text-emerald-700" />
      )}
    </button>
  );
}
