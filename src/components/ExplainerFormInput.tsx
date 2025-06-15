
import React from "react";
import { Input } from "@/components/ui/input";
import { TooltipHelper } from "@/components/ui/tooltip-helper";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface ExplainerFormInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

const TOOLTIP_MAP: Record<string, string> = {
  topic: "What do you want explained?",
  age: "This affects explanation simplicity!",
  fantasyRace: "Elf, dragon, ogre, fairy, goblin, etc.",
  gender: "How should the explanation refer to you?",
  nationality: "Japanese, French, Martian, etc.",
  vibe: "Sassy, hyperactive, annoyed, etc.",
  profession: "Toddler, pirate, professor, etc.",
  era: "Medieval, modern, steampunk, 2040, etc.",
  iq: "For funny effect. E.g., 0 for very silly explanations!",
  specialMode: "e.g., 'Explain with emojis', 'rap style', 'tweet', etc."
};

export function ExplainerFormInput({
  name,
  label,
  value,
  onChange,
  required,
  disabled,
  placeholder,
  inputMode
}: ExplainerFormInputProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={cn("flex flex-col gap-1 transition-all")}>
      <label
        className={cn(
          "block font-medium text-[15px] mb-1",
          isDark ? "text-white/35" : "text-gray-700"
        )}
      >
        {label}
        <TooltipHelper text={TOOLTIP_MAP[name] || ""}>
          <span className="ml-1">🛈</span>
        </TooltipHelper>
      </label>
      <Input
        required={required}
        name={name}
        disabled={disabled}
        value={value}
        inputMode={inputMode}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "transition-all font-medium text-base",
          isDark
            ? "bg-[#10121b] text-white border-none placeholder:text-white/40 focus:bg-[#16192a] shadow-inner"
            : "bg-white text-black border border-gray-200 focus:bg-gray-50",
          "h-11 rounded-lg px-5"
        )}
        style={{
          boxShadow: isDark
            ? "0 1.5px 7px 0 rgba(10,10,45,0.10), 0 0.5px 2px 0 #692a7a22"
            : "0 0.5px 4px 0 rgba(200,200,240,0.05)"
        }}
      />
    </div>
  );
}

export default ExplainerFormInput;
