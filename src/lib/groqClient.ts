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

/**
 * Calls the OpenRouter API to generate a persona-based explanation using the best free conversational model.
 * Supports RAG by prepending ragContext to the prompt if provided.
 *
 * Args:
 *   inputs (GroqInputs): The persona and topic fields for the explanation.
 *   ragContext (string, optional): Additional context to prepend for retrieval-augmented generation.
 *
 * Returns:
 *   Promise<GroqResult>: The generated explanation and the prompt used.
 *
 * Raises:
 *   Error: If the API call fails or the API key is missing.
 */
export async function getGroqExplanation(inputs: GroqInputs, ragContext?: string): Promise<GroqResult> {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("VITE_OPENROUTER_API_KEY is not set in environment variables.");

    const model = "deepseek/deepseek-r1-0528:free";
    let prompt = buildPrompt(inputs);
    if (ragContext) {
        prompt = `${ragContext}\n\n${prompt}`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: "You are a creative persona explainer. Be vivid, fun, and adapt to the persona." },
                { role: "user", content: prompt },
            ],
            max_tokens: 512,
            temperature: 0.8,
        })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter API error: ${err}`);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No answer.";
    return { text, prompt };
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
