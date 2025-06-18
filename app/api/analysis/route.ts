import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { createPrompt } from "./utils/createPrompt";

// Allow up to 30 seconds for analysis
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = createClient(await cookies());
  const { answers, user_id, onboarding_response_id } = await req.json();

  const analysis_prompt = createPrompt(answers);

  // Call OpenAI (non-streaming) using generateText
  const result = await generateText({
    model: openai("gpt-4o"),
    messages: [{ role: "user", content: analysis_prompt }],
    maxTokens: 800,
    temperature: 0.7,
  });

  const ai_response = result.text || "";
  console.log("user_id", user_id);
  console.log("onboarding_response_id", onboarding_response_id);
  // Delete previous entries for this user and onboarding_response_id
  const { error: deleteError } = await supabase
    .from("user_interest_analysis")
    .delete()
    .eq("user_id", user_id);
  if (deleteError) {
    console.error("Delete interests error:", deleteError);
  }
  console.log("deleted");
  // Insert into Supabase
  const { error } = await supabase
    .from("user_interest_analysis")
    .insert([
      {
        user_id,
        onboarding_response_id,
        analysis_prompt,
        ai_response,
        ai_model: "gpt-4o",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, record: null });
  }

  return NextResponse.json({ success: true, record: ai_response });
}
