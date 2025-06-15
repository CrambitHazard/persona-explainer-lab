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

// How visible blobs are; if user chooses fewer, blobs pop, if more: subtle
function calcBlobOpacity(colorCount: number, base: number, dark: boolean) {
  // Opacity scales: 2 colors = 1.00x, 3 = 0.80x, 4 = 0.67x, 5 = 0.52x, 6 = 0.40x (more colors = more transparent)
  const factors = [1, 1, 0.80, 0.67, 0.52, 0.4, 0.32]; // index=colors
  let op = base * (factors[colorCount] ?? 0.4);
  if (dark) op *= 0.9;
  return Number(op.toFixed(3));
}

// For mesh blobs: assign each a random splotch
function randomMeshBlobs(colors: string[], isDark: boolean) {
  // Make sure each blob gets a distributed position/size
  // Use unique but deterministic placements on each render
  let positions = [
    { x: 13, y: 17, s: 33, r: 18 },
    { x: 63, y: 11, s: 21, r: -18 },
    { x: 56, y: 65, s: 34, r: 40 },
    { x: 16, y: 60, s: 24, r: -33 },
    { x: 44, y: 38, s: 24, r: 22 },
    { x: 74, y: 48, s: 28, r: -40 },
  ];
  while (positions.length < colors.length)
    positions = positions.concat(positions.slice(0, colors.length - positions.length));

  const blobCount = colors.length;
  // For fewer blobs, punchier visual; more blobs = lighter, more subtle.
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none w-full h-full">
      {colors.map((color, idx) => {
        const { x, y, s, r } = positions[idx % positions.length];
        const baseOpacity = 0.28; // maximum alpha for one blob
        const finalAlpha = calcBlobOpacity(blobCount, baseOpacity, isDark);
        const size = `clamp(200px, ${s}vw, 520px)`;
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
              filter: `blur(40px) saturate(150%)`,
              borderRadius: "55% 45% 58% 42% / 44% 60% 40% 56%",
              transform: `rotate(${r}deg)`,
              pointerEvents: "none",
              transition: "all 0.7s cubic-bezier(.24,.75,.15,1)",
              zIndex: 1,
            }}
          />
        );
      })}
      {/* Backdrop 'glow' gradient for more punch */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          isDark
            ? "radial-gradient(circle at 43% 67%, rgba(34,255,226,0.09) 0%, rgba(10,12,20,0.57) 100%)"
            : "radial-gradient(circle at 44% 80%, rgba(79,255,228,0.09) 0%, rgba(246,252,251,0.59) 100%)",
        zIndex: 2,
        pointerEvents: "none",
        mixBlendMode: "lighten"
      }} />
    </div>
  );
}

const DEFAULT_COLORS = ["#e0ffe8", "#b1e5ff", "#ffd39e", "#ffe0f4"];

function Index() {
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
        min-h-screen flex items-center justify-center transition-all relative
        ${stage === "done" ? "backdrop-blur-2xl" : ""}
        bg-gradient-to-br
        ${isDark
          ? "from-[#191828] via-[#192230] to-[#13151c]" // dark violet/blue gradient
          : "from-[#eef6fa] via-[#e8fbfa] to-[#fcfcfc]"}
      `}
      style={{
        background: "none"
      }}
    >
      {randomMeshBlobs(colors, isDark)}

      <div className="fixed top-6 right-8 z-50 flex flex-row items-center gap-3">
        <ThemeToggle />
        <BackgroundCustomizer colors={colors} onColorsChange={setColors} />
      </div>
      <div className="w-full py-8 px-2 md:px-0 relative z-20 flex flex-col items-center">
        {stage === "form" && (
          <div
            className={`
              max-w-2xl w-full mx-auto rounded-[1.5rem] md:rounded-[2.1rem]
              p-0 md:p-12 pt-8 pb-10 flex flex-col relative
              transition
              overflow-hidden
              shadow-[0_6px_32px_0_rgba(108,56,140,0.22),0_0.5px_7px_0_rgba(0,0,0,0.15)]
              border
              ${isDark
                ? "border-pink-200/70"
                : "border-cyan-200/50"
              }
            `}
            style={
              isDark
                ? {
                    background: "rgba(22,22,34,0.52)",
                    backdropFilter: "blur(23px) saturate(1.45)",
                    WebkitBackdropFilter: "blur(23px) saturate(1.45)",

                    // Card box shadow for floating look:
                    boxShadow:
                      "0 8px 64px 3px rgba(255,25,140,0.14)," +
                      "0 0px 1.5px 0 rgba(40,20,70,0.11)," +
                      "0 16px 54px 0 rgba(164,51,177,0.07)",

                    border: "1.7px solid rgba(255,120,220,0.22)",

                    position: "relative",
                    // to ensure pseudo-elements overlay.
                  }
                : {
                    background: "rgba(255,255,255,0.82)",
                    // Light mode: soft glass
                  }
            }
          >
            {/* GLOW GRADIENTS ONLY IN DARK */}
            {isDark && (
              <>
                <span
                  // Main bright purple blur at top right, like ref
                  style={{
                    position: "absolute",
                    right: "-88px",
                    top: "-78px",
                    width: "315px",
                    height: "230px",
                    borderRadius: "48% 52% 52% 48%/54% 56% 44% 46%",
                    background: "radial-gradient(circle at 70% 29%, #ef38ff88 0%, #7433ef13 58%, transparent 90%)",
                    filter: "blur(10px)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <span
                  // Main pink blur bottom left, like ref
                  style={{
                    position: "absolute",
                    left: "-68px",
                    bottom: "-56px",
                    width: "215px",
                    height: "186px",
                    borderRadius: "52% 48% 54% 46%/52% 58% 42% 48%",
                    background: "radial-gradient(ellipse at 40% 80%, #ff51a566 0%, #ED2DD944 60%, transparent 100%)",
                    filter: "blur(10px)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <span
                  // Soft diffused light for glare effect, top left
                  style={{
                    position: "absolute",
                    left: "22px",
                    top: "18px",
                    width: "105px",
                    height: "32px",
                    borderRadius: "40% 60% 60% 40%/66% 44% 56% 34%",
                    background: "radial-gradient(circle farthest-side, #fff2 10%, transparent 70%)",
                    filter: "blur(6px)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <span
                  // Light inner white border for frosted "rim"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    border: "1.4px solid rgba(255,255,255,0.19)",
                    zIndex: 2,
                    pointerEvents: "none",
                    boxShadow: "0 1px 16px 0 #ffbae033, 0 0px 0px 1px #fff2"
                  }}
                />
                {/* ...usability: keep form above glows */}
              </>
            )}
            {/* FORM */}
            <div className="relative z-10">
              <ExplainerForm onSubmit={handleSubmit} disabled={stage !== "form"} />
            </div>
          </div>
        )}
        {stage === "loading" && <Loader label="Summoning LLM wisdom…" />}
        {stage === "done" && (
          <ExplainerCard answer={result} persona={persona} onReset={handleReset} />
        )}
        <div className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none z-40 select-none">
          <span className="
              bg-gradient-to-br from-black/75 via-neutral-900/75 to-slate-950/70
              text-cyan-100 px-4 py-1 rounded-full text-xs shadow border border-cyan-200/25
              pointer-events-auto
              backdrop-blur-xl
              font-medium
              ">
            ExplainItToMe · Alpha
          </span>
        </div>
      </div>
    </main>
  );
};

export default Index;
