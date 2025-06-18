import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", request.url));
}
