import { NextRequest, NextResponse } from "next/server";
import { sendScheduledNotifications } from "@/app/actions";

// This endpoint should be called every 5 minutes by a cron job
// to check for users who should receive notifications
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication for cron job
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendScheduledNotifications();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in cron notifications:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST endpoint for manual testing
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendScheduledNotifications();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in manual notifications:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
