import React, { useState } from "react";
import ExplainerForm, { ExplainerFormInputs } from "@/components/ExplainerForm";
import ExplainerCard from "@/components/ExplainerCard";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundCustomizer } from "@/components/BackgroundCustomizer";
import { useTheme } from "next-themes";

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

// Start with a nice pastel mesh
const DEFAULT_COLORS = ["#e0ffe8", "#b1e5ff", "#ffd39e", "#ffe0f4"];

function randomMeshBlobs(colors: string[], isDark: boolean) {
  // mesh: produce random splotches (20-40% window width/height), soft blur, mix z-index
  // We'll return absolutely-positioned divs in a wrapping div
  const blobCount = colors.length;
  // these values create a visually pleasing effect
  const positions = [
    { x: 13, y: 17, s: 33, o: 0.21, r: 18 },
    { x: 63, y: 11, s: 21, o: 0.20, r: -18 },
    { x: 56, y: 65, s: 34, o: 0.16, r: 40 },
    { x: 16, y: 60, s: 24, o: 0.19, r: -33 },
    { x: 44, y: 38, s: 24, o: 0.16, r: 22 },
    { x: 74, y: 48, s: 28, o: 0.19, r: -40 },
  ];

  // Each blob gets a random position/size from above (cycled)
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none w-full h-full">
      {colors.map((color, idx) => {
        const { x, y, s, o, r } = positions[idx % positions.length];
        // Larger on desktop, a bit smaller on mobile
        const size = `clamp(200px, ${s}vw, 480px)`;
        const finalAlpha = isDark ? o * 0.85 : o;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: color,
              opacity: finalAlpha,
              filter: `blur(32px) saturate(140%)`,
              borderRadius: "61% 39% 70% 30% / 30% 66% 34% 70%",
              transform: `rotate(${r}deg)`,
              pointerEvents: "none",
              transition: "all 0.6s cubic-bezier(.24,.75,.15,1)",
            }}
          />
        );
      })}
      {/* Dim in dark mode: */}
      {isDark && (
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 43% 67%, rgba(24,28,44,0.61) 0%, rgba(10,12,20,0.52) 100%)"
        }} />
      )}
    </div>
  );
}

const Index = () => {
  const [stage, setStage] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<string>("");
  const [persona, setPersona] = useState<string>("");
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

  function handleBackgroundChange(newColors: string[]) {
    setColors(newColors);
  }

  return (
    <main
      className={`
        min-h-screen flex items-center justify-center transition-all
        ${stage === "done" ? "backdrop-blur-2xl" : ""}
      `}
      style={{
        background: "none" // mesh replaces gradient
      }}
    >
      {/* The mesh blobs background */}
      {randomMeshBlobs(colors, isDark)}

      {/* Top-right overlays: glassmorphic controls */}
      <div className="fixed top-6 right-8 z-50 flex flex-row items-center gap-2">
        <ThemeToggle />
        <BackgroundCustomizer colors={colors} onColorsChange={handleBackgroundChange} />
      </div>
      <div className="w-full py-8 px-2 md:px-0 relative">
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
