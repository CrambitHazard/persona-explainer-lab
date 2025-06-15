
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import ExplainerFormInput from "./ExplainerFormInput";
import { ExplainerFormSection } from "./ExplainerFormSection";

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

const FIELD_CONFIGS = [
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
];

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
      <ExplainerFormSection
        className=""
        title="ExplainItToMe"
        subtitle="Enter a topic, set a magical persona, and get a world-class LLM explanation."
      >
        {/* Heading section only */}
      </ExplainerFormSection>

      {FIELD_CONFIGS.map((f, idx) => (
        <ExplainerFormInput
          key={f.name}
          name={f.name}
          label={f.label}
          required={f.required}
          value={fields[f.name as keyof ExplainerFormInputs]}
          onChange={handleChange}
          disabled={disabled}
          placeholder={f.placeholder}
          inputMode={f.name === "age" || f.name === "iq" ? "numeric" : undefined}
        />
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
