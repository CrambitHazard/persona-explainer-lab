import React, { useState } from "react";
import { TooltipHelper } from "./ui/tooltip-helper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  groqKey: string;
}

interface ExplainerFormProps {
  onSubmit: (inputs: ExplainerFormInputs) => void;
  disabled?: boolean;
}

export default function ExplainerForm({ onSubmit, disabled }: ExplainerFormProps) {
  // Provide default values for all fields:
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
    groqKey: "",
  });

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
        "w-full max-w-2xl mx-auto grid grid-cols-2 gap-5 p-10 bg-white shadow-lg rounded-2xl border border-gray-200 transition-all",
        disabled && "opacity-70 pointer-events-none"
      )}
      style={{ backdropFilter: "blur(4px)" }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="col-span-2 text-center mb-2">
        <h1 className="text-2xl font-bold mb-1">ExplainItToMe</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Enter a topic, set a magical persona, and get a world-class LLM explanation.
        </p>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Topic
          <TooltipHelper text="What do you want explained?">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          required
          name="topic"
          disabled={disabled}
          value={fields.topic}
          onChange={handleChange}
          placeholder="Quantum physics, taxes, how tacos work…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Age
          <TooltipHelper text="This affects explanation simplicity!">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          required
          name="age"
          disabled={disabled}
          value={fields.age}
          inputMode="numeric"
          onChange={handleChange}
          placeholder="5, 25, 134…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Fantasy Race
          <TooltipHelper text="Elf, dragon, ogre, fairy, goblin, etc.">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          required
          name="fantasyRace"
          disabled={disabled}
          value={fields.fantasyRace}
          onChange={handleChange}
          placeholder="Elf, Dragon, Ogre…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Gender
          <TooltipHelper text="How should the explanation refer to you?">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="gender"
          disabled={disabled}
          value={fields.gender}
          onChange={handleChange}
          placeholder="Optional: Female, Male, Enby, etc."
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Nationality
          <TooltipHelper text="Japanese, French, Martian, etc.">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="nationality"
          disabled={disabled}
          value={fields.nationality}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Vibe
          <TooltipHelper text="Sassy, hyperactive, annoyed, etc.">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="vibe"
          disabled={disabled}
          value={fields.vibe}
          onChange={handleChange}
          placeholder="Sassy, Hyperactive, Annoyed…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Profession
          <TooltipHelper text="Toddler, pirate, professor, etc.">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="profession"
          disabled={disabled}
          value={fields.profession}
          onChange={handleChange}
          placeholder="Pirate, Toddler, Professor…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Era
          <TooltipHelper text="Medieval, modern, steampunk, 2040, etc.">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="era"
          disabled={disabled}
          value={fields.era}
          onChange={handleChange}
          placeholder="Medieval, Modern, 2040…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          IQ <TooltipHelper text="For funny effect. E.g., 0 for very silly explanations!">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="iq"
          disabled={disabled}
          value={fields.iq}
          inputMode="numeric"
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Special Mode
          <TooltipHelper text="e.g., 'Explain with emojis', 'rap style', 'tweet', etc.">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          name="specialMode"
          disabled={disabled}
          value={fields.specialMode}
          onChange={handleChange}
          placeholder="Explain with emojis, rap style, tweet…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          <span className="inline-flex items-center gap-1">Groq API Key</span>
          <TooltipHelper text="Get your free API key at https://console.groq.com (never stored)">
            <span className="ml-1">🛈</span>
          </TooltipHelper>
        </label>
        <Input
          required
          name="groqKey"
          type="password"
          autoComplete="off"
          disabled={disabled}
          value={fields.groqKey}
          onChange={handleChange}
          placeholder="Paste your Groq API key"
        />
      </div>

      <div className="col-span-2 mt-2 flex items-center justify-center">
        <Button
          size="lg"
          disabled={!fields.topic || !fields.age || !fields.fantasyRace || !fields.groqKey || disabled}
          className="px-8 font-bold text-lg"
          type="submit"
        >
          Summon Explanation ✨
        </Button>
      </div>
    </form>
  );
}
