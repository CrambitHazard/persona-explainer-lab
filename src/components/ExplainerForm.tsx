
import React, { useState } from "react";
import { TooltipHelper } from "./ui/tooltip-helper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface ExplainerFormInputs {
  topic: string;
  age: string;
  fantasyRace: string;
  gender: string;
  nationality: string;
  vibe: string;
  profession: string;
  era: string;
  iq: string;
  specialMode: string;
}

interface ExplainerFormProps {
  onSubmit: (inputs: ExplainerFormInputs) => void;
  disabled?: boolean;
}

export default function ExplainerForm({ onSubmit, disabled }: ExplainerFormProps) {
  const [fields, setFields] = useState<ExplainerFormInputs>({
    topic: "Quantum physics",
    age: "8",
    fantasyRace: "Elf",
    gender: "Nonbinary",
    nationality: "Japanese",
    vibe: "Sassy",
    profession: "Astronaut",
    era: "2040",
    iq: "120",
    specialMode: "Rap style",
  });

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(fields);
  }

  return (
    <form
      className={cn(
        "w-full max-w-2xl mx-auto grid grid-cols-2 gap-5 p-0",
        "bg-transparent shadow-none border-none",
        disabled && "opacity-70 pointer-events-none"
      )}
      style={{ backdropFilter: "none" }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="col-span-2 text-center mb-2 select-none">
        <h1 className={cn(
          "text-2xl font-bold mb-1 transition",
          isDark ? "text-white/25" : "text-black/40"
        )}>
          ExplainItToMe
        </h1>
        <p className={cn(
          "text-base font-medium max-w-lg mx-auto mb-2 transition",
          isDark ? "text-white/40" : "text-gray-700/80"
        )}>
          Enter a topic, set a magical persona, and get a world-class LLM explanation.
        </p>
      </div>

      {/* Fields */}
      {[
        { name: "topic", label: "Topic", required: true, placeholder: "Quantum physics, taxes, how tacos work…" },
        { name: "age", label: "Age", required: true, placeholder: "5, 25, 134…" },
        { name: "fantasyRace", label: "Fantasy Race", required: true, placeholder: "Elf, Dragon, Ogre…" },
        { name: "gender", label: "Gender", placeholder: "Optional: Female, Male, Enby, etc." },
        { name: "nationality", label: "Nationality", placeholder: "Optional" },
        { name: "vibe", label: "Vibe", placeholder: "Sassy, Hyperactive, Annoyed…" },
        { name: "profession", label: "Profession", placeholder: "Pirate, Toddler, Professor…" },
        { name: "era", label: "Era", placeholder: "Medieval, Modern, 2040…" },
        { name: "iq", label: "IQ", placeholder: "Optional" },
        { name: "specialMode", label: "Special Mode", placeholder: "Explain with emojis, rap style, tweet…" },
      ].map((f, idx) => (
        <div key={f.name} className={cn("flex flex-col gap-1 transition-all")}>
          <label className={cn(
            "block font-medium text-[15px] mb-1",
            isDark ? "text-white/35" : "text-gray-700"
          )}>
            {f.label}
            <TooltipHelper
              text={
                {
                  "topic": "What do you want explained?",
                  "age": "This affects explanation simplicity!",
                  "fantasyRace": "Elf, dragon, ogre, fairy, goblin, etc.",
                  "gender": "How should the explanation refer to you?",
                  "nationality": "Japanese, French, Martian, etc.",
                  "vibe": "Sassy, hyperactive, annoyed, etc.",
                  "profession": "Toddler, pirate, professor, etc.",
                  "era": "Medieval, modern, steampunk, 2040, etc.",
                  "iq": "For funny effect. E.g., 0 for very silly explanations!",
                  "specialMode": "e.g., 'Explain with emojis', 'rap style', 'tweet', etc."
                }[f.name] || ""
              }
            >
              <span className="ml-1">🛈</span>
            </TooltipHelper>
          </label>
          <Input
            required={f.required}
            name={f.name}
            disabled={disabled}
            value={fields[f.name as keyof ExplainerFormInputs]}
            inputMode={f.name === "age" || f.name === "iq" ? "numeric" : undefined}
            onChange={handleChange}
            placeholder={f.placeholder}
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
      ))}

      <div className="col-span-2 mt-5 flex items-center justify-center">
        <Button
          size="lg"
          disabled={!fields.topic || !fields.age || !fields.fantasyRace || disabled}
          className={cn(
            "px-8 font-extrabold text-lg shadow bg-white text-gray-900 border border-gray-100 rounded-xl",
            "hover:bg-gray-100 transition"
          )}
          type="submit"
        >
          Summon Explanation ✨
        </Button>
      </div>
    </form>
  );
}
// ... end of file
