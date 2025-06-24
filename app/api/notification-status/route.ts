import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Endpoint to check notification system status
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Check if there's a fact for today
    const today = new Date().toISOString().split("T")[0];
    const { data: todaysFact, error: factError } = await supabase
      .from("daily_facts")
      .select("id, fact_heading, fact_date")
      .eq("fact_date", today)
      .single();

    // Get notification statistics
    const { data: activeSubscriptions, error: subsError } = await supabase
      .from("user_profiles")
      .select("user_id")
      .not("push_subscription", "is", null)
      .eq("daily_notification_enabled", true);

    // Get today's delivery stats
    const { data: todaysDeliveries, error: deliveryError } = await supabase
      .from("user_daily_facts")
      .select("user_id, is_read, delivered_at")
      .gte("delivered_at", today + "T00:00:00")
      .lt("delivered_at", today + "T23:59:59");

    const status = {
      date: today,
      factAvailable: !!todaysFact,
      fact: todaysFact
        ? {
            id: todaysFact.id,
            heading: todaysFact.fact_heading,
            date: todaysFact.fact_date,
          }
        : null,
      statistics: {
        activeSubscriptions: activeSubscriptions?.length || 0,
        todaysDeliveries: todaysDeliveries?.length || 0,
        readCount: todaysDeliveries?.filter((d) => d.is_read).length || 0,
      },
      errors: {
        factError: factError?.message || null,
        subsError: subsError?.message || null,
        deliveryError: deliveryError?.message || null,
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error checking notification status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
