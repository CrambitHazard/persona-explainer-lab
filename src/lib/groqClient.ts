export interface GroqInputs {
  topic: string;
  age: string;
  fantasyRace: string;
  gender?: string;
  nationality?: string;
  vibe?: string;
  profession?: string;
  era?: string;
  iq?: string;
  specialMode?: string;
}

export interface GroqResult {
  text: string;
  prompt: string;
}

export async function getGroqExplanation(inputs: GroqInputs): Promise<GroqResult> {
  // New: Calling the Supabase Edge Function instead of Groq directly
  const response = await fetch("/functions/v1/groq-explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs)
  });
  if (!response.ok) throw new Error("Groq Edge Function API error");
  const data = await response.json();
  return { text: data.text || "No answer.", prompt: data.prompt || "" };
}

// Compose the actual LLM prompt from user fields
export function buildPrompt({
  topic, age, fantasyRace, gender, nationality, vibe, profession, era, iq, specialMode
}: GroqInputs) {
  return [
    `Explain "${topic}" to a ${age}-year-old ${fantasyRace}`,
    gender ? gender : "",
    nationality ? `from ${nationality}` : "",
    vibe ? `who is feeling ${vibe}` : "",
    profession ? `who works as a ${profession}` : "",
    era ? `in the era of ${era}` : "",
    iq ? `with an IQ of ${iq}` : "",
    specialMode ? `in "${specialMode}" mode` : "",
    "",
    "The result should be short, fun, and easy to understand. Use vivid style and adapt to the persona."
  ]
    .filter(Boolean)
    .join(" ");
}
