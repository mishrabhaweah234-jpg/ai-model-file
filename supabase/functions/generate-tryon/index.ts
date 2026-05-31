import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Convert a data URL or http(s) URL into { mimeType, base64 } for Google's inlineData format.
async function toInlineData(src: string): Promise<{ mimeType: string; data: string }> {
  if (src.startsWith("data:")) {
    const match = src.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) throw new Error("Invalid data URL");
    return { mimeType: match[1], data: match[2] };
  }
  const resp = await fetch(src);
  if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);
  const mimeType = resp.headers.get("content-type") || "image/jpeg";
  const buf = new Uint8Array(await resp.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  const data = btoa(bin);
  return { mimeType, data };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhoto, selectedItems, angle = "front", baseImage } = await req.json();

    if (!userPhoto || !selectedItems || selectedItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide a photo and at least one clothing item." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    const clothingDescription = selectedItems
      .map((item: { name: string; category: string; description: string }) =>
        `${item.category}: ${item.name} - ${item.description}`
      )
      .join(". ");

    const angleInstructions: Record<string, string> = {
      front: "Show the person from the FRONT view (facing the camera directly).",
      back: "Show the person from the BACK view (facing AWAY from the camera, so the back of their head, back of the outfit, and back of shoes are visible). The person should not be looking at the camera.",
      side: "Show the person from a SIDE PROFILE view (90° to the camera, showing their left or right side).",
      "three-quarter": "Show the person from a 3/4 angle view (rotated about 45° from the camera).",
    };
    const angleText = angleInstructions[angle] || angleInstructions.front;

    const sourceImage = baseImage || userPhoto;
    const inline = await toInlineData(sourceImage);

    const prompt = `You are a virtual fashion try-on assistant. Take this photo of a person and generate a realistic image of them wearing the following outfit: ${clothingDescription}.

CAMERA ANGLE:
${angleText}

CRITICAL OUTPUT REQUIREMENTS:
- The output image MUST be in PORTRAIT orientation (vertical, taller than wide, e.g. 9:16 or 3:4 aspect ratio).
- The person must be standing upright, fully visible, centered in a vertical frame.
- Do NOT produce a landscape (horizontal) image under any circumstance.
- If the input photo is landscape, re-frame it as a portrait composition while keeping the person upright.

PERSON & OUTFIT:
- Keep the person's face, body shape, skin tone, hair, and overall identity EXACTLY the same as the input photo.
- Only change their clothing to match the described items, and rotate them to match the requested camera angle.
- Make the outfit look realistic, well-fitted, and naturally lit.
- The result should look like a high-quality vertical fashion editorial photo.`;

    // Google AI Studio (Gemini) image generation endpoint — free tier available.
    const model = "gemini-2.5-flash-image-preview";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_AI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: inline.mimeType, data: inline.data } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google AI error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded on the free tier. Please wait a minute and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: "Google AI API key is invalid or lacks access to the image model." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "AI generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    let generatedImageUrl: string | undefined;
    let textResponse: string | undefined;
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || "image/png";
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse = (textResponse ?? "") + part.text;
      }
    }

    if (!generatedImageUrl) {
      return new Response(
        JSON.stringify({ error: "AI could not generate an image. Try a different photo or outfit.", textResponse }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ image: generatedImageUrl, message: textResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("try-on error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
