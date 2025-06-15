
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  // Reuse same buildPrompt logic as frontend
  function buildPrompt({
    topic, age, fantasyRace, gender, nationality, vibe, profession, era, iq, specialMode
  }: any) {
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

  const prompt = buildPrompt(body);

  try {
    const out = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.7,
      })
    });

    const data = await out.json();
    const answer = data.choices?.[0]?.message?.content || "No answer.";
    return new Response(JSON.stringify({ text: answer, prompt }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? "Groq Edge Function failed." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
