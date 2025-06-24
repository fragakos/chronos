import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/app/actions";

// Test endpoint to manually send a push notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, title } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await sendNotification(
      message,
      title || "Test Notification from Chronikos"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in test notification:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
