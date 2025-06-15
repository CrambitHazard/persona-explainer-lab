import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Palette } from "lucide-react";
import { useTheme } from "next-themes";

interface BackgroundCustomizerProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}
const MIN_COLORS = 2;
const MAX_COLORS = 6;

export function BackgroundCustomizer({ colors, onColorsChange }: BackgroundCustomizerProps) {
  const [localColors, setLocalColors] = useState<string[]>(colors);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const updateColor = (idx: number, value: string) => {
    const newColors = localColors.slice();
    newColors[idx] = value;
    setLocalColors(newColors);
  };

  const addColor = () => {
    if (localColors.length < MAX_COLORS) {
      const pastels = ["#b1e5ff", "#b9fbc0", "#ffb4ef", "#ffe066", "#fbc6a4", "#dabfff", "#ffd39e"];
      setLocalColors([...localColors, pastels[Math.floor(Math.random() * pastels.length)]]);
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

  React.useEffect(() => {
    setLocalColors(colors);
  }, [colors]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Customize background mesh"
          className={`
            overflow-hidden p-2 ml-2 rounded-full shadow-[0_2px_16px_0_rgba(0,0,0,0.33)] 
            border border-border
            backdrop-blur-2xl
            bg-gradient-to-br
            ${isDark
              ? "from-black/60 via-slate-800/70 to-slate-900/60"
              : "from-white/60 via-slate-50/80 to-slate-200/70"}
            ring-1 ring-inset ring-border
            flex items-center justify-center
            hover:scale-105 active:scale-95 transition
            relative
          `}
          style={{
            boxShadow: isDark
              ? "0 2px 18px 0 #1bdbcb33, 0 0.5px 4px 0 rgba(0,0,0,0.14)"
              : "0 2px 18px 0 #90eaff66, 0 0.5px 4px 0 rgba(0,0,0,0.09)",
          }}
        >
          <Palette size={20} className={`${isDark ? "text-cyan-200" : "text-emerald-700"} drop-shadow`} />
          <span
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              border: isDark
                ? "1px solid #43fbe3a1"
                : "1px solid #80dfff88",
              boxShadow: isDark
                ? "0 0 8px 2px #90fff644"
                : "0 0 8px 2px #aeefff88",
            }}
          ></span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={`
          w-84 max-w-[20rem] min-w-[14rem] p-6 rounded-2xl
          shadow-[0_12px_36px_0_rgba(39,255,230,0.18)]
          bg-gradient-to-br
          ${isDark
            ? "from-black/85 via-neutral-900/70 to-slate-800/80"
            : "from-white/85 via-slate-50/70 to-slate-200/80"}
          border border-cyan-200/25
          backdrop-blur-3xl
          relative
          flex flex-col gap-3
        `}
        style={{
          boxShadow: isDark
            ? "0 8px 32px 0 rgba(16,255,210,0.18), 0 1.5px 7px 0 rgba(0,0,0,0.10)"
            : "0 8px 32px 0 rgba(100,210,255,0.13), 0 1.5px 7px 0 rgba(0,0,0,0.09)",
        }}
      >
        <div className="mb-2 font-semibold text-cyan-100 tracking-tight text-base select-none px-0">
          <Palette className="inline-block mr-2" size={17}/>
          Mesh Colors
        </div>
        <div className="flex flex-row flex-wrap gap-3 mb-2 items-center">
          {localColors.map((color, i) => (
            <span
              key={i}
              className="relative flex items-center group"
            >
              <input
                type="color"
                value={color}
                onChange={e => updateColor(i, e.target.value)}
                className="w-10 h-10 rounded-full border-2 border-cyan-200 shadow-inner cursor-pointer bg-transparent"
                style={{ boxShadow: "0 2px 12px 0 #00ffcc44" }}
                aria-label={`Color ${i + 1}`}
              />
              {localColors.length > MIN_COLORS && (
                <button
                  className="absolute -right-2 -top-1 bg-black/80 hover:bg-black text-cyan-200 border border-cyan-50/20 shadow rounded-full w-5 h-5 flex items-center justify-center text-xs transition group-hover:flex"
                  onClick={() => removeColor(i)}
                  aria-label="Remove Color"
                  tabIndex={-1}
                  style={{fontWeight: 700}}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </span>
          ))}
          {localColors.length < MAX_COLORS && (
            <button
              onClick={addColor}
              className="bg-black/70 hover:bg-cyan-700/60 text-cyan-200 border border-cyan-200/40 rounded-full shadow w-10 h-10 flex items-center justify-center text-xl transition"
              aria-label="Add color"
              tabIndex={0}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
        <button
          className="w-full h-9 rounded-xl bg-cyan-400/80 text-white font-semibold shadow hover:bg-cyan-500/90 transition"
          onClick={handleApply}
          aria-label="Apply Colors"
        >
          Apply
        </button>
      </PopoverContent>
    </Popover>
  );
}
