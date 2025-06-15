
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Palette } from "lucide-react";

interface BackgroundCustomizerProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}
const MIN_COLORS = 2;
const MAX_COLORS = 6;

export function BackgroundCustomizer({ colors, onColorsChange }: BackgroundCustomizerProps) {
  const [localColors, setLocalColors] = useState<string[]>(colors);

  const updateColor = (idx: number, value: string) => {
    const newColors = localColors.slice();
    newColors[idx] = value;
    setLocalColors(newColors);
  };

  const addColor = () => {
    if (localColors.length < MAX_COLORS) {
      setLocalColors([...localColors, "#ffb4ef"]); // default to some pastel
    }
  };

  const removeColor = (idx: number) => {
    if (localColors.length > MIN_COLORS) {
      const newColors = localColors.slice();
      newColors.splice(idx, 1);
      setLocalColors(newColors);
    }
  };

  const handleApply = () => {
    onColorsChange(localColors);
  };

  // Reset local state if parent colors change
  React.useEffect(() => {
    setLocalColors(colors);
  }, [colors]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Customize background mesh"
          className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10 rounded-full shadow-xl p-2 ml-2 hover:scale-105 active:scale-95 transition flex items-center justify-center"
          style={{
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.16), 0 1.5px 7px 0 rgba(0,0,0,0.08)",
          }}
        >
          <Palette size={20} className="text-emerald-800 dark:text-emerald-200" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-5 rounded-2xl bg-white/60 dark:bg-black/70 border border-white/30 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-row flex-wrap gap-2">
            {localColors.map((color, i) => (
              <span
                key={i}
                className="relative flex items-center group"
              >
                <input
                  type="color"
                  value={color}
                  onChange={e => updateColor(i, e.target.value)}
                  className="w-10 h-10 rounded-full border-2 border-white/70 shadow-inner cursor-pointer bg-transparent"
                  style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.09)" }}
                  aria-label={`Color ${i + 1}`}
                />
                {localColors.length > MIN_COLORS && (
                  <button
                    className="absolute -right-2 -top-1 bg-white/80 hover:bg-white text-red-500 border shadow rounded-full w-5 h-5 flex items-center justify-center text-xs transition hidden group-hover:flex"
                    style={{
                      fontWeight: 700,
                      border: "1px solid #eee",
                      boxShadow: "0px 0.5px 2px 0 rgba(0,0,0,0.08)"
                    }}
                    onClick={() => removeColor(i)}
                    aria-label="Remove Color"
                    tabIndex={-1}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </span>
            ))}
            {localColors.length < MAX_COLORS && (
              <button
                onClick={addColor}
                className="bg-white/80 hover:bg-white border border-white/70 text-emerald-400 rounded-full shadow w-10 h-10 flex items-center justify-center text-xl transition"
                aria-label="Add color"
                tabIndex={0}
              >
                <Plus size={18} />
              </button>
            )}
          </div>
          <button
            className="w-full h-9 mt-2 rounded-xl bg-emerald-500 text-white font-medium shadow-lg hover:bg-emerald-600 transition"
            onClick={handleApply}
            aria-label="Apply Colors"
          >
            Apply
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
