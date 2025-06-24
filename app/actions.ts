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

    // Get users with push subscriptions and notifications enabled
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
      return {
        success: true,
        message: "No users to notify",
        debug: {
          serverUtcTime: new Date().toISOString(),
          totalUsersWithNotifications: 0,
          allUsers: [],
        },
      };
    }

    // Debug: Log all users and their local times
    console.log(
      `DEBUG - Processing ${users.length} users with notifications enabled`
    );

    // Filter users whose notification time is now or passed within the last 5 minutes
    const usersToNotify = users.filter((user) => {
      if (!user.notification_time || !user.timezone) return false;

      try {
        // Get current time in user's timezone
        const now = new Date();
        const userTime = new Date(
          now.toLocaleString("en-US", { timeZone: user.timezone })
        );
        const userHour = userTime.getHours();
        const userMinute = userTime.getMinutes();

        // Parse user's preferred notification time
        const [notificationHour, notificationMinute] = user.notification_time
          .split(":")
          .map(Number);

        // Current time in minutes since midnight
        const currentTimeInMinutes = userHour * 60 + userMinute;
        // Notification time in minutes since midnight
        const notificationTimeInMinutes =
          notificationHour * 60 + notificationMinute;

        // Check if notification time has passed within the last 5 minutes
        // This means current time >= notification time and <= notification time + 5 minutes
        const timeDiff = currentTimeInMinutes - notificationTimeInMinutes;

        const shouldNotify = timeDiff >= 0 && timeDiff <= 5;

        // Debug logging
        console.log(`DEBUG - User ${user.user_id}:`, {
          timezone: user.timezone,
          userLocalTime: `${userHour.toString().padStart(2, "0")}:${userMinute
            .toString()
            .padStart(2, "0")}`,
          notificationTime: user.notification_time,
          timeDiffMinutes: timeDiff,
          shouldNotify: shouldNotify,
          utcTime: now.toISOString(),
          userTimeString: userTime.toString(),
        });

        return shouldNotify;
      } catch (error) {
        console.error(
          `Error processing timezone for user ${user.user_id}:`,
          error
        );
        return false;
      }
    });

    if (usersToNotify.length === 0) {
      return {
        success: true,
        message: "No users scheduled for notification at this time",
        debug: {
          serverUtcTime: new Date().toISOString(),
          totalUsersWithNotifications: users.length,
          usersInTimeWindow: [],
          allUsersDebug: users.map((user) => {
            if (!user.notification_time || !user.timezone) {
              return {
                userId: user.user_id,
                timezone: user.timezone || "NOT_SET",
                notificationTime: user.notification_time || "NOT_SET",
                error: "Missing timezone or notification time",
              };
            }

            try {
              const now = new Date();
              const userTime = new Date(
                now.toLocaleString("en-US", { timeZone: user.timezone })
              );
              const userHour = userTime.getHours();
              const userMinute = userTime.getMinutes();
              const [notificationHour, notificationMinute] =
                user.notification_time.split(":").map(Number);
              const currentTimeInMinutes = userHour * 60 + userMinute;
              const notificationTimeInMinutes =
                notificationHour * 60 + notificationMinute;
              const timeDiff = currentTimeInMinutes - notificationTimeInMinutes;

              return {
                userId: user.user_id,
                timezone: user.timezone,
                userLocalTime: `${userHour
                  .toString()
                  .padStart(2, "0")}:${userMinute.toString().padStart(2, "0")}`,
                notificationTime: user.notification_time,
                timeDiffMinutes: timeDiff,
                shouldNotify: timeDiff >= 0 && timeDiff <= 5,
                utcTime: now.toISOString(),
              };
            } catch (error) {
              return {
                userId: user.user_id,
                timezone: user.timezone,
                notificationTime: user.notification_time,
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          }),
        },
      };
    }

    // Check if users have already been notified today to prevent duplicates
    const today = new Date().toISOString().split("T")[0];
    const { data: alreadyNotified, error: notifiedError } = await supabase
      .from("user_daily_facts")
      .select("user_id")
      .gte("delivered_at", today)
      .lt("delivered_at", today + "T23:59:59")
      .in(
        "user_id",
        usersToNotify.map((u) => u.user_id)
      );

    if (notifiedError) {
      console.error("Error checking already notified users:", notifiedError);
    }

    const alreadyNotifiedUserIds = new Set(
      alreadyNotified?.map((n) => n.user_id) || []
    );
    const usersToActuallyNotify = usersToNotify.filter(
      (user) => !alreadyNotifiedUserIds.has(user.user_id)
    );

    if (usersToActuallyNotify.length === 0) {
      return {
        success: true,
        message: "All eligible users have already been notified today",
      };
    }

    // Send notifications to eligible users
    const notifications = usersToActuallyNotify.map(async (user) => {
      try {
        await webpush.sendNotification(
          user.push_subscription,
          JSON.stringify({
            title: "Facts Off",
            body: "Time to get your fact",
            icon: "/web-app-manifest-192x192.png",
            badge: "/web-app-manifest-192x192.png",
            data: {
              url: "/",
              dateOfArrival: Date.now(),
            },
          })
        );

        // Record notification delivery (without specific fact reference)
        await supabase.from("user_daily_facts").insert({
          user_id: user.user_id,
          daily_fact_id: null, // No specific fact, just a reminder
          delivered_at: new Date().toISOString(),
          is_read: false,
        });

        console.log(
          `Notification sent to user ${user.user_id} at ${user.notification_time} ${user.timezone}`
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
      message: `Scheduled notifications sent to ${usersToActuallyNotify.length} users`,
      details: {
        totalEligible: usersToNotify.length,
        alreadyNotified: alreadyNotifiedUserIds.size,
        newlyNotified: usersToActuallyNotify.length,
      },
      debug: {
        serverUtcTime: new Date().toISOString(),
        totalUsersWithNotifications: users.length,
        usersInTimeWindow: usersToNotify.map((user) => ({
          userId: user.user_id,
          timezone: user.timezone,
          notificationTime: user.notification_time,
          alreadyNotifiedToday: alreadyNotifiedUserIds.has(user.user_id),
        })),
      },
    };
  } catch (error) {
    console.error("Error sending scheduled notifications:", error);
    return { success: false, error: "Failed to send scheduled notifications" };
  }
}
