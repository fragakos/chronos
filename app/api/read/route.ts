import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient(await cookies());
  const { user_id, daily_fact_id } = await req.json();
  console.log("user_id", user_id);
  console.log("daily_fact_id", daily_fact_id);
  if (!user_id || !daily_fact_id) {
    return NextResponse.json(
      { success: false, reason: "missing_parameters" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_daily_facts")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", user_id)
    .eq("daily_fact_id", daily_fact_id);

  if (error) {
    return NextResponse.json(
      { success: false, reason: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
