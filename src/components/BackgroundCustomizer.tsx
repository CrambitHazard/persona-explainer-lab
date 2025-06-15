
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

interface BackgroundCustomizerProps {
  color1: string;
  color2: string;
  onChange: (color1: string, color2: string) => void;
}

export function BackgroundCustomizer({ color1, color2, onChange }: BackgroundCustomizerProps) {
  const [localColor1, setLocalColor1] = useState(color1);
  const [localColor2, setLocalColor2] = useState(color2);

  function handleApply() {
    onChange(localColor1, localColor2);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Customize background"
          className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10
            rounded-full shadow-xl p-2 ml-2 hover:scale-105 active:scale-95 transition flex items-center justify-center"
          style={{
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 7px 0 rgba(0,0,0,0.08)",
          }}
        >
          <Palette size={20} className="text-emerald-800 dark:text-emerald-200" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 rounded-2xl bg-white/60 dark:bg-black/60 border border-white/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-foreground mb-1 font-semibold">Gradient Color 1</label>
            <input
              type="color"
              value={localColor1}
              onChange={e => setLocalColor1(e.target.value)}
              className="w-9 h-9 p-0 border border-gray-300 rounded-full bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-foreground mb-1 font-semibold">Gradient Color 2</label>
            <input
              type="color"
              value={localColor2}
              onChange={e => setLocalColor2(e.target.value)}
              className="w-9 h-9 p-0 border border-gray-300 rounded-full bg-transparent"
            />
          </div>
          <button
            className="w-full h-9 mt-2 rounded-xl bg-emerald-500 text-white font-medium shadow hover:bg-emerald-600 transition"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
