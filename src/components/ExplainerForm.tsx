
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

const VIBES = ["Annoyed", "Hyperactive", "Sassy", "Shy", "Stoned"];
const MODES = ["Explain with emojis", "Rap style", "Fairy tale", "Haiku", "Kid’s story", "Tweet"];
const RACES = ["Elf", "Dragon", "Ogre", "Human", "Fairy", "Goblin", "Orc"];
const ERAS = ["Medieval", "Renaissance", "Modern", "2040", "Prehistoric", "1930s", "Cyberpunk"];
const PROFESSIONS = ["Pirate", "Toddler", "Professor", "Baker", "Ninja", "Astronaut", "Pirate Queen"];

export default function ExplainerForm({ onSubmit, disabled }: ExplainerFormProps) {
  const [fields, setFields] = useState<ExplainerFormInputs>({
    topic: "",
    age: "",
    fantasyRace: "",
    gender: "",
    nationality: "",
    vibe: "",
    profession: "",
    era: "",
    iq: "",
    specialMode: "",
    groqKey: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
          <TooltipHelper text="What do you want explained?" />
        </label>
        <Input
          required
          name="topic"
          disabled={disabled}
          maxLength={72}
          autoFocus
          value={fields.topic}
          onChange={handleChange}
          placeholder="Quantum physics, taxes, how tacos work…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Age
          <TooltipHelper text="This affects explanation simplicity!" />
        </label>
        <Input
          required
          name="age"
          disabled={disabled}
          value={fields.age}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          onChange={handleChange}
          placeholder="5, 25, 134…"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Fantasy Race
          <TooltipHelper text="Elf, dragon, ogre, fairy, goblin, etc." />
        </label>
        <select
          name="fantasyRace"
          required
          className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-primary px-3 py-2"
          disabled={disabled}
          value={fields.fantasyRace}
          onChange={handleChange}
        >
          <option value="">Choose…</option>
          {RACES.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Gender
          <TooltipHelper text="How should the explanation refer to you?" />
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
          <TooltipHelper text="Japanese, French, Martian, etc." />
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
          <TooltipHelper text="Sassy, hyperactive, annoyed, etc." />
        </label>
        <select
          name="vibe"
          className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-primary px-3 py-2"
          disabled={disabled}
          value={fields.vibe}
          onChange={handleChange}
        >
          <option value="">Choose…</option>
          {VIBES.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Profession
          <TooltipHelper text="Toddler, pirate, professor, etc." />
        </label>
        <select
          name="profession"
          className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-primary px-3 py-2"
          disabled={disabled}
          value={fields.profession}
          onChange={handleChange}
        >
          <option value="">Choose…</option>
          {PROFESSIONS.map(pro => (
            <option key={pro} value={pro}>{pro}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Era
          <TooltipHelper text="Medieval, modern, steampunk, 2040, etc." />
        </label>
        <select
          name="era"
          className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-primary px-3 py-2"
          disabled={disabled}
          value={fields.era}
          onChange={handleChange}
        >
          <option value="">Choose…</option>
          {ERAS.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          IQ <TooltipHelper text="For funny effect. E.g., 0 for very silly explanations!" />
        </label>
        <Input
          name="iq"
          disabled={disabled}
          value={fields.iq}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={3}
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Special Mode
          <TooltipHelper text="e.g., 'Explain with emojis', 'rap style', 'tweet', etc." />
        </label>
        <select
          name="specialMode"
          className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-primary px-3 py-2"
          disabled={disabled}
          value={fields.specialMode}
          onChange={handleChange}
        >
          <option value="">Choose…</option>
          {MODES.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          <span className="inline-flex items-center gap-1">Groq API Key</span>
          <TooltipHelper text="Get your free API key at https://console.groq.com (never stored)" />
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
