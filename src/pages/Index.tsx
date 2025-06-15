
import React, { useState } from "react";
import ExplainerForm, { ExplainerFormInputs } from "@/components/ExplainerForm";
import ExplainerCard from "@/components/ExplainerCard";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";

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

const Index = () => {
  const [stage, setStage] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<string>("");
  const [persona, setPersona] = useState<string>("");

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

  return (
    <main
      className={`min-h-screen flex items-center justify-center transition-all bg-gradient-to-br from-white via-slate-100 to-emerald-100 dark:from-black dark:via-slate-900 dark:to-emerald-950
      ${stage === "done" ? "backdrop-blur-2xl" : ""}`}
    >
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
