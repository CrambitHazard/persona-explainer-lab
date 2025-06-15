
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[groq-explain] Received request:", req.method, req.url);

  if (req.method === "OPTIONS") {
    console.log("[groq-explain] Handling CORS preflight.");
    return new Response(null, { headers: corsHeaders });
  }

  if (!GROQ_API_KEY) {
    console.error("[groq-explain] GROQ_API_KEY not configured.");
    return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
    console.log("[groq-explain] Parsed body:", body);
  } catch (err) {
    console.error("[groq-explain] Failed to parse JSON body.", err);
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

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
  console.log("[groq-explain] Built prompt:", prompt);

  try {
    console.log("[groq-explain] Making request to Groq API…");
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
    if (!out.ok) {
      console.error("[groq-explain] Error from Groq API:", data);
      return new Response(JSON.stringify({ error: data.error || "Groq API error", details: data, prompt }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("[groq-explain] Got answer from Groq API:", answer);
    return new Response(JSON.stringify({ text: answer, prompt }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[groq-explain] Edge function failure:", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Groq Edge Function failed." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
