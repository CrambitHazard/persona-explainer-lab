
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

export async function getGroqExplanation(inputs: GroqInputs, apiKey: string): Promise<GroqResult> {
  const prompt = buildPrompt(inputs);

  const result = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      max_tokens: 512,
      temperature: 0.7
    }),
  });
  if (!result.ok) throw new Error("Groq API error");
  const data = await result.json();
  const answer = data.choices?.[0]?.message?.content || "No answer.";
  return { text: answer, prompt };
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
