import React, { useState } from "react";
import ExplainerForm, { ExplainerFormInputs } from "@/components/ExplainerForm";
import ExplainerCard from "@/components/ExplainerCard";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundCustomizer } from "@/components/BackgroundCustomizer";

// List of fun random explanations as placeholders.
const RANDOM_EXPLANATIONS = [
  "Imagine tiny invisible elves tossing bouncy balls at each other, but the balls keep turning into waves and back. That's quantum physics!",
  "Taxes are like dragons who want a portion of your gold for protecting your castle from goblins.",
  "Tacos are just Mexican treasure chests full of delicious magic.",
  "AI is just a really fast librarian who reads millions of books to answer your questions.",
  "Think of gravity as an invisible spaghetti rope holding you to the planet!",
  "Music is like a wizard casting a spell on your brain with sound.",
  "Photosynthesis is like plants having a food party using sunlight as their invitation!",
];

function getRandomExplanation() {
  const i = Math.floor(Math.random() * RANDOM_EXPLANATIONS.length);
  return RANDOM_EXPLANATIONS[i];
}

const DEFAULT_COLOR1 = "#e0ffe8";
const DEFAULT_COLOR2 = "#b1e5ff";

const Index = () => {
  const [stage, setStage] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<string>("");
  const [persona, setPersona] = useState<string>("");
  const [color1, setColor1] = useState(DEFAULT_COLOR1);
  const [color2, setColor2] = useState(DEFAULT_COLOR2);

  async function handleSubmit(fields: ExplainerFormInputs) {
    setStage("loading");
    setResult("");
    setPersona("");
    // Simulate thinking/loading
    setTimeout(() => {
      const personaDisplay = `${fields.age}-year-old ${fields.fantasyRace}${fields.gender ? ` (${fields.gender})` : ""}${fields.vibe ? `, ${fields.vibe}` : ""}${fields.profession ? `, ${fields.profession}` : ""}${fields.era ? `, ${fields.era}` : ""}`;
      setPersona(personaDisplay);
      setResult(getRandomExplanation());
      setStage("done");
    }, 600);
  }

  function handleReset() {
    setStage("form");
    setResult("");
    setPersona("");
  }

  function handleBackgroundChange(new1: string, new2: string) {
    setColor1(new1);
    setColor2(new2);
  }

  return (
    <main
      className={`
        min-h-screen flex items-center justify-center transition-all
        ${stage === "done" ? "backdrop-blur-2xl" : ""}
      `}
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        transition: "background 0.6s cubic-bezier(.24,.75,.15,1)",
      }}
    >
      {/* Top-right overlays: glassmorphic controls */}
      <div className="fixed top-6 right-8 z-50 flex flex-row items-center gap-2">
        <ThemeToggle />
        <BackgroundCustomizer color1={color1} color2={color2} onChange={handleBackgroundChange} />
      </div>
      <div className="w-full py-8 px-2 md:px-0">
        {stage === "form" && <ExplainerForm onSubmit={handleSubmit} disabled={stage !== "form"} />}
        {stage === "loading" && <Loader label="Summoning LLM wisdom…" />}
        {stage === "done" && (
          <ExplainerCard answer={result} persona={persona} onReset={handleReset} />
        )}
        <div className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none z-40">
          <span className="bg-white/70 dark:bg-black/70 text-muted-foreground px-4 py-1 rounded-full text-xs shadow border border-white/30 pointer-events-auto select-none">
            ExplainItToMe · Alpha
          </span>
        </div>
      </div>
    </main>
  );
};

export default Index;
