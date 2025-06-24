"use server";

import webpush from "web-push";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

webpush.setVapidDetails(
  "mailto:fragakos98@gmail.com", // Replace with your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(subscription: PushSubscription) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Store subscription in user_profiles table
    const { error } = await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        push_subscription: subscription,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      console.error("Error storing subscription:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error subscribing user:", error);
    return { success: false, error: "Failed to subscribe user" };
  }
}

export async function unsubscribeUser() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Remove subscription from user_profiles table
    const { error } = await supabase
      .from("user_profiles")
      .update({
        push_subscription: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error removing subscription:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return { success: false, error: "Failed to unsubscribe user" };
  }
}

export async function sendNotification(
  message: string,
  title: string = "Chronikos"
) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get all users with push subscriptions and notifications enabled
    const { data: users, error } = await supabase
      .from("user_profiles")
      .select("user_id, push_subscription, notification_time, timezone")
      .not("push_subscription", "is", null)
      .eq("daily_notification_enabled", true);

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    if (!users || users.length === 0) {
      return { success: true, message: "No users to notify" };
    }

    const notifications = users.map(async (user) => {
      try {
        await webpush.sendNotification(
          user.push_subscription,
          JSON.stringify({
            title,
            body: message,
            icon: "/web-app-manifest-192x192.png",
            badge: "/web-app-manifest-192x192.png",
            data: {
              url: "/",
              dateOfArrival: Date.now(),
            },
          })
        );
      } catch (error) {
        console.error(
          `Error sending notification to user ${user.user_id}:`,
          error
        );
      }
    });

    await Promise.all(notifications);

    return {
      success: true,
      message: `Notifications sent to ${users.length} users`,
    };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, error: "Failed to send notifications" };
  }
}

export async function sendScheduledNotifications() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get today's fact
    const today = new Date().toISOString().split("T")[0];
    const { data: todaysFact, error: factError } = await supabase
      .from("daily_facts")
      .select("*")
      .eq("fact_date", today)
      .single();

    if (factError || !todaysFact) {
      console.error("No fact found for today:", factError);
      return { success: false, error: "No fact available for today" };
    }

    // Get current time in various timezones and find users who should receive notifications now
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Get users whose notification time matches current time (within 5 minutes)
    const { data: users, error: usersError } = await supabase
      .from("user_profiles")
      .select("user_id, push_subscription, notification_time, timezone")
      .not("push_subscription", "is", null)
      .eq("daily_notification_enabled", true);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }

    if (!users || users.length === 0) {
      return { success: true, message: "No users to notify" };
    }

    // Filter users based on their notification time
    const usersToNotify = users.filter((user) => {
      if (!user.notification_time) return false;

      const [notificationHour, notificationMinute] = user.notification_time
        .split(":")
        .map(Number);

      // Check if current time matches notification time (within 5 minutes)
      const timeDiff = Math.abs(
        currentHour * 60 +
          currentMinute -
          (notificationHour * 60 + notificationMinute)
      );
      return timeDiff <= 5;
    });

    if (usersToNotify.length === 0) {
      return {
        success: true,
        message: "No users scheduled for notification at this time",
      };
    }

    // Send notifications to eligible users
    const notifications = usersToNotify.map(async (user) => {
      try {
        await webpush.sendNotification(
          user.push_subscription,
          JSON.stringify({
            title: todaysFact.fact_heading || "Today's Historical Fact",
            body: todaysFact.fact_content.substring(0, 100) + "...",
            icon: "/web-app-manifest-192x192.png",
            badge: "/web-app-manifest-192x192.png",
            data: {
              url: "/",
              factId: todaysFact.id,
              dateOfArrival: Date.now(),
            },
          })
        );

        // Record fact delivery
        await supabase.from("user_daily_facts").insert({
          user_id: user.user_id,
          daily_fact_id: todaysFact.id,
          delivered_at: new Date().toISOString(),
          is_read: false,
        });
      } catch (error) {
        console.error(
          `Error sending notification to user ${user.user_id}:`,
          error
        );
      }
    });

    await Promise.all(notifications);

    return {
      success: true,
      message: `Scheduled notifications sent to ${usersToNotify.length} users`,
    };
  } catch (error) {
    console.error("Error sending scheduled notifications:", error);
    return { success: false, error: "Failed to send scheduled notifications" };
  }
}
