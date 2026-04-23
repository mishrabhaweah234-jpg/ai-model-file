import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a descriptive prompt for the clothing items
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: sourceImage },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

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
