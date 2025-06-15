
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[TEST] groq-explain called: method =", req.method);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Try to parse JSON, fallback if not present
    let message = "";
    try {
      const body = await req.json();
      message = body?.test || "No test key";
    } catch {
      message = "No body parsed";
    }

    console.log("[TEST] groq-explain success, responding back");

    // Respond with a known success message for testing
    return new Response(
      JSON.stringify({ msg: "Hello from groq-explain!", echo: message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[TEST] Error in test groq-explain:", error);
    return new Response(
      JSON.stringify({ error: "Test groq-explain function failed." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
