
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "mixtral-8x7b-32768";

serve(async (req) => {
  console.log("[groq-explain] Received request:", req.method, req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("[groq-explain] Handling CORS preflight.");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) {
      console.error("[groq-explain] GROQ_API_KEY is not set.");
      return new Response(
        JSON.stringify({ error: "Groq API Key is not set. Please add it in your project secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body;
    try {
      body = await req.json();
      console.log("[groq-explain] Parsed body:", body);
    } catch (err) {
      console.error("[groq-explain] Failed to parse JSON body.", err);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Construct prompt as in original
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

    // Prepare Groq request
    const payload = {
      model: MODEL,
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.7
    };

    console.log("[groq-explain] Making request to Groq API…");
    const groqResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!groqResponse.ok) {
      // Try to log and parse Groq error response
      try {
        const errorBody = await groqResponse.json();
        const errorMessage =
          errorBody?.error?.message ||
          errorBody?.error?.code ||
          groqResponse.statusText ||
          `API Error: ${groqResponse.status}`;
        console.error("[groq-explain] Groq API Error:", errorMessage, errorBody);
        let clientErrorMessage = errorMessage;

        if (
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes("authentication")
        ) {
          clientErrorMessage =
            "Groq authentication failed. Please make sure your API key is correct and set in the project secrets.";
        } else {
          clientErrorMessage = `The model provider returned an error: ${errorMessage}`;
        }

        return new Response(
          JSON.stringify({
            error: clientErrorMessage,
            details: errorBody,
            prompt
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        // If error body is not JSON
        const errorText = await groqResponse.text();
        console.error(`[groq-explain] Groq API Error (${groqResponse.status}):`, errorText);
        return new Response(
          JSON.stringify({
            error: `Groq API Error: ${errorText}`,
            prompt
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Parse successful Groq response
    const data = await groqResponse.json();
    const answer = data.choices?.[0]?.message?.content;
    if (!answer) {
      console.error("[groq-explain] The model did not return any text. Response:", data);
      return new Response(
        JSON.stringify({
          error: "The model did not return any text. It might be loading or the response format is unexpected.",
          prompt
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    console.log("[groq-explain] Got answer from Groq API:", answer);

    return new Response(
      JSON.stringify({ text: answer.trim(), prompt }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error: any) {
    console.error("[groq-explain] Internal Edge Function failure:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Groq Edge Function failed." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
