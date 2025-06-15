
import React, { useState } from "react";
import ExplainerForm, { ExplainerFormInputs } from "@/components/ExplainerForm";
import ExplainerCard from "@/components/ExplainerCard";
import Loader from "@/components/ui/loader";
import { getGroqExplanation } from "@/lib/groqClient";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [stage, setStage] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<string>("");
  const [persona, setPersona] = useState<string>("");

  async function handleSubmit(fields: ExplainerFormInputs) {
    setStage("loading");
    setResult("");
    setPersona("");
    try {
      const personaDisplay = `${fields.age}-year-old ${fields.fantasyRace}${fields.gender ? ` (${fields.gender})` : ""}${fields.vibe ? `, ${fields.vibe}` : ""}${fields.profession ? `, ${fields.profession}` : ""}${fields.era ? `, ${fields.era}` : ""}`;
      setPersona(personaDisplay);
      const { text } = await getGroqExplanation(
        {
          topic: fields.topic,
          age: fields.age,
          fantasyRace: fields.fantasyRace,
          gender: fields.gender,
          nationality: fields.nationality,
          vibe: fields.vibe,
          profession: fields.profession,
          era: fields.era,
          iq: fields.iq,
          specialMode: fields.specialMode,
        },
        fields.groqKey
      );
      setResult(text.trim());
      setStage("done");
    } catch (e: any) {
      toast({
        title: "Whoops!",
        description: e?.message ? String(e.message) : "Failed to get response from LLM.",
        variant: "destructive",
      });
      setStage("form");
    }
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
