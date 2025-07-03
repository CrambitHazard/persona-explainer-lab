import React, { useState } from "react";
import ExplainerForm, { ExplainerFormInputs } from "@/components/ExplainerForm";
import ExplainerCard from "@/components/ExplainerCard";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundCustomizer } from "@/components/BackgroundCustomizer";
import { useTheme } from "next-themes";
import { logPromptAndGetRank, getPromptStats } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";
import { parseCSV, getGenreCandidates, getBestRagCandidate } from "@/lib/utils";
import { getGroqExplanation } from "@/lib/groqClient";
import bookCSV from "../../datasets/Amazon Top 50 Books 2009-2021 - Reworked Sheet (2).csv?raw";
import mangaCSV from "../../datasets/manga.csv?raw";

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

function extractGenre(fields) {
  // Naive: use fantasyRace, profession, or topic as genre
  const genreFields = [fields.fantasyRace, fields.profession, fields.topic, fields.vibe, fields.era];
  return (genreFields.find(g => g && typeof g === 'string') || 'Fiction').toLowerCase();
}

async function getSummaryWithOpenRouter(title, genre) {
  // Use OpenRouter to generate a summary for a book/manga
  const prompt = `Give a 2-3 sentence summary for the following ${genre} work: ${title}`;
  const { text } = await getGroqExplanation({ topic: prompt, age: "18", fantasyRace: "", gender: "", nationality: "", vibe: "", profession: "", era: "", iq: "", specialMode: "" });
  return text;
}

async function getSimilarityScoreWithOpenRouter(userPrompt, summary) {
  // Use OpenRouter to score similarity between user prompt and summary
  const prompt = `Given the following user request: "${userPrompt}", and the following summary: "${summary}", rate how relevant the summary is to the request on a scale of 0 (not relevant) to 10 (very relevant). Only output the number.`;
  const { text } = await getGroqExplanation({ topic: prompt, age: "18", fantasyRace: "", gender: "", nationality: "", vibe: "", profession: "", era: "", iq: "", specialMode: "" });
  const num = parseInt((text || '').match(/\d+/)?.[0] || '0', 10);
  return isNaN(num) ? 0 : num;
}

function Index() {
  const [stage, setStage] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<string>("");
  const [persona, setPersona] = useState<string>("");
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [rank, setRank] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [bookData, setBookData] = useState<any[] | null>(null);
  const [mangaData, setMangaData] = useState<any[] | null>(null);
  const [ragSource, setRagSource] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, boolean> | null>(null);

  async function handleSubmit(fields: ExplainerFormInputs) {
    setStage("loading");
    setResult("");
    setPersona("");
    setRank(null);
    setRagSource(null);

    // Parse datasets if not already
    let books = bookData;
    let mangas = mangaData;
    if (!books) {
      books = parseCSV(bookCSV);
      setBookData(books);
    }
    if (!mangas) {
      mangas = parseCSV(mangaCSV);
      setMangaData(mangas);
    }

    // Extract genre
    const genre = extractGenre(fields);
    // Get 2 candidates from each dataset
    const bookCandidates = getGenreCandidates(genre, books, "Genre");
    const mangaCandidates = getGenreCandidates(genre, mangas, "genres");
    // Combine and take up to 2
    const candidates = [...bookCandidates, ...mangaCandidates].slice(0, 2);

    // For each candidate, get summary and similarity
    const userPrompt = `${fields.topic} (${fields.fantasyRace}, ${fields.profession}, ${fields.vibe}, ${fields.era})`;
    const candidateSummaries = await Promise.all(candidates.map(async (c) => {
      const title = c.Name || c.name;
      const genreField = c.Genre || c.genres;
      const summary = await getSummaryWithOpenRouter(title, genreField);
      const score = await getSimilarityScoreWithOpenRouter(userPrompt, summary);
      return { ...c, summary, score };
    }));
    // Select best
    let best = null;
    let bestScore = -1;
    for (const c of candidateSummaries) {
      if (c.score > bestScore) {
        best = c;
        bestScore = c.score;
      }
    }
    let ragContext = best && best.summary && best.score > 0 ? best.summary : undefined;
    if (ragContext) {
      setRagSource((best.Name || best.name) + (best.Genre ? ` (${best.Genre})` : best.genres ? ` (${best.genres})` : ""));
    }

    // LLM explanation with RAG
    const personaDisplay = `${fields.age}-year-old ${fields.fantasyRace}${fields.gender ? ` (${fields.gender})` : ""}${fields.vibe ? `, ${fields.vibe}` : ""}${fields.profession ? `, ${fields.profession}` : ""}${fields.era ? `, ${fields.era}` : ""}`;
    setPersona(personaDisplay);
    const { text: explanation } = await getGroqExplanation(fields, ragContext);
    setResult(explanation);
    // Log prompt and get rank
    try {
      const userRank = await logPromptAndGetRank(fields);
      setRank(userRank);
      if (userRank === 1) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      // Get stats for each field
      const statsResult = await getPromptStats(fields);
      setStats(statsResult);
    } catch (e) {
      setRank(null);
      setStats(null);
    }
    setStage("done");
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
              max-w-2xl w-full mx-auto rounded-[2.1rem]
              border shadow-2xl
              p-0 md:p-12 pt-8 pb-10
              flex flex-col relative
              backdrop-blur-[8px]
              transition
              ${
                isDark
                  ? `bg-white/6 border-pink-400/30 ring-1 ring-inset ring-pink-400/20
                      shadow-[0_2px_40px_0_rgba(240,82,173,0.08)]`
                  : "bg-white/80 border-cyan-200/50 shadow-lg"
              }
              before:absolute before:inset-0 before:rounded-[2.1rem] before:pointer-events-none
              ${isDark ? "before:bg-white/5" : ""}
            `}
            style={
              isDark
                ? {
                    boxShadow: "0 0 0 1.5px rgba(255,60,120,0.13), 0 8px 40px 0 rgba(40,20,70,0.18)",
                    border: "1.5px solid rgba(255, 64, 166, 0.17)",
                    // Tightened up border
                  }
                : {}
            }
          >
            <ExplainerForm onSubmit={handleSubmit} disabled={stage !== "form"} />
          </div>
        )}
        {stage === "loading" && <Loader label="Summoning LLM wisdom…" />}
        {stage === "done" && (
          <>
            <ExplainerCard answer={result} persona={persona} onReset={handleReset} />
            {ragSource && (
              <div className="mt-4 text-center text-sm text-cyan-300">RAG Source: {ragSource}</div>
            )}
            {rank && (
              <div className="mt-6 text-center">
                {rank === 1 ? (
                  <div className="text-2xl font-bold text-green-400 animate-bounce">🎉 You are the FIRST user to try this combo! 🎉</div>
                ) : (
                  <div className="text-lg text-cyan-200">You are the <b>{rank}{rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'}</b> user to try this combo!</div>
                )}
              </div>
            )}
            {stats && (
              <div className="mt-8 text-center">
                <h3 className="text-cyan-300 text-lg font-bold mb-2">Your Prompt Stats</h3>
                <table className="mx-auto text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 border-b border-cyan-400">Field</th>
                      <th className="px-2 py-1 border-b border-cyan-400">First User?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats).map(([field, isFirst]) => (
                      <tr key={field}>
                        <td className="px-2 py-1 text-cyan-100">{field.replace(/_/g, ' ')}</td>
                        <td className="px-2 py-1">
                          {isFirst ? <span className="text-green-400 font-bold">Yes 🎉</span> : <span className="text-gray-400">No</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
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
