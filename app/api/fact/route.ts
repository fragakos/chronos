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
  const { user_id } = await req.json();

  //   --- 24-hour restriction check (commented out for debug) ---
  const { data: recent_fact } = await supabase
    .from("user_daily_facts")
    .select("delivered_at")
    .eq("user_id", user_id)
    .order("delivered_at", { ascending: false })
    .limit(1)
    .single();
  if (recent_fact && recent_fact.delivered_at) {
    const lastDelivered = new Date(recent_fact.delivered_at);
    const now = new Date();
    if (now.getTime() - lastDelivered.getTime() < 24 * 60 * 60 * 1000) {
      return NextResponse.json({ success: false, reason: "wait_24h" });
    }
  }

  // Get today's date (YYYY-MM-DD)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const fact_date = `${yyyy}-${mm}-${dd}`;

  // Check if a daily_fact for today already exists
  const { data: daily_fact } = await supabase
    .from("daily_facts")
    .select("id, fact_content")
    .eq("fact_date", fact_date)
    .single();

  let daily_fact_id;
  let fact_content;

  if (!daily_fact) {
    // Get user interest analysis
    const { data: analysis_row, error } = await supabase
      .from("user_interest_analysis")
      .select()
      .eq("user_id", user_id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, record: null });
    }
    const analysis = analysis_row?.ai_response;
    //Get Headings of previous facts
    const { data: previous_facts } = await supabase
      .from("daily_facts")
      .select("fact_heading")
      .eq("user_id", user_id)
      .order("fact_date", { ascending: false })
      .limit(20);
    const previous_headings = previous_facts?.map((fact) => fact.fact_heading);
    const previous_headings_string = previous_headings?.join("\n") || "";

    const analysis_prompt = createPrompt(analysis, previous_headings_string);

    // Call OpenAI (non-streaming) using generateText
    const result = await generateText({
      model: openai("gpt-4o"),
      messages: [{ role: "user", content: analysis_prompt }],
      maxTokens: 800,
      temperature: 0.7,
    });

    // Insert new daily_fact
    const { data: inserted_fact } = await supabase
      .from("daily_facts")
      .insert({
        fact_date,
        fact_heading: result.text.split("\n")[0],
        fact_content: result.text || "",
        source_prompt: analysis_prompt,
        llm_model: "gpt-4o",
        is_verified: false,
      })
      .select("id, fact_content")
      .single();

    let final_fact_row = inserted_fact;
    if (!final_fact_row || !final_fact_row.fact_content) {
      // Fallback: fetch the row by fact_date
      const { data: fetched_fact } = await supabase
        .from("daily_facts")
        .select("id, fact_content")
        .eq("fact_date", fact_date)
        .single();
      final_fact_row = fetched_fact;
    }
    if (!final_fact_row || !final_fact_row.fact_content) {
      return NextResponse.json({
        success: false,
        record: null,
        reason: "fact_insert_failed",
      });
    }
    daily_fact_id = final_fact_row.id;
    fact_content = final_fact_row.fact_content;
  } else {
    daily_fact_id = daily_fact.id;
    fact_content = daily_fact.fact_content;
  }

  // Insert into user_daily_facts
  await supabase.from("user_daily_facts").insert({
    user_id,
    daily_fact_id,
    delivered_at: new Date().toISOString(),
    is_read: false,
  });

  return NextResponse.json({
    success: true,
    record: fact_content,
    daily_fact_id,
  });
}
