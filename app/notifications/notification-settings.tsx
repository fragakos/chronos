"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { TIMEZONES } from "./timezones";
import { subscribeUser, unsubscribeUser } from "@/app/actions";

interface NotificationSettingsProps {
  user: User;
}

interface UserProfile {
  user_id: string;
  experience_level: string;
  preferred_fact_length: string;
  daily_notification_enabled: boolean;
  notification_time: string;
  timezone: string;
}

export default function NotificationSettingsPage({
  user,
}: NotificationSettingsProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("09:00");
  const [timezone, setTimezone] = useState("UTC");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Push notification states
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [pushSubscription, setPushSubscription] =
    useState<PushSubscription | null>(null);
  const [pushMessage, setPushMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setProfile(data);
          setNotificationEnabled(data.daily_notification_enabled || false);
          setNotificationTime(data.notification_time || "09:00");
          setTimezone(data.timezone || "UTC");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializePushNotifications = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        setIsPushSupported(true);
        await registerServiceWorker();
        await checkPushSubscription();
      }
    };

    fetchProfile();
    initializePushNotifications();
  }, [user.id]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      console.log("Service Worker registered:", registration);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  const checkPushSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setPushSubscription(sub);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      const result = await subscribeUser(sub);
      if (result.success) {
        setPushSubscription(sub);
        // Automatically enable daily notifications when subscribing to push
        setNotificationEnabled(true);
        setPushMessage("Successfully subscribed to daily push notifications!");
        setTimeout(() => setPushMessage(""), 3000);

        // Auto-save the settings
        await saveSettings(true, notificationTime, timezone);
      } else {
        setPushMessage("Failed to subscribe to push notifications.");
        setTimeout(() => setPushMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      setPushMessage("Error subscribing to push notifications.");
      setTimeout(() => setPushMessage(""), 3000);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
        const result = await unsubscribeUser();
        if (result.success) {
          setPushSubscription(null);
          // Automatically disable daily notifications when unsubscribing from push
          setNotificationEnabled(false);
          setPushMessage("Successfully unsubscribed from daily notifications!");
          setTimeout(() => setPushMessage(""), 3000);

          // Auto-save the settings
          await saveSettings(false, notificationTime, timezone);
        } else {
          setPushMessage("Failed to unsubscribe from push notifications.");
          setTimeout(() => setPushMessage(""), 3000);
        }
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      setPushMessage("Error unsubscribing from push notifications.");
      setTimeout(() => setPushMessage(""), 3000);
    }
  };

  const saveSettings = async (enabled: boolean, time: string, tz: string) => {
    try {
      const supabase = createClient();

      const profileData = {
        user_id: user.id,
        experience_level: profile?.experience_level || "beginner",
        preferred_fact_length: profile?.preferred_fact_length || "medium",
        daily_notification_enabled: enabled,
        notification_time: time,
        timezone: tz,
      };

      console.log("Saving profile data:", profileData);

      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(profileData, {
          onConflict: "user_id",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Profile saved successfully:", data);
      setProfile(data);
      return { success: true };
    } catch (error) {
      console.error("Error saving settings:", error);
      return { success: false };
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const result = await saveSettings(
        notificationEnabled,
        notificationTime,
        timezone
      );

      if (result.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentTimeInTimezone = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      timeZone: timezone,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ">
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="">Loading notification settings...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Notification Settings</h2>
            <p className="">
              Configure when you&apos;d like to receive your daily historical
              facts
            </p>
          </div>

          {/* Main Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Daily Notifications</span>
              </CardTitle>
              <CardDescription>
                Subscribe to receive daily historical facts as push
                notifications at your preferred time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Push Notification Status */}
              {isPushSupported && (
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Push Notifications
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {pushSubscription
                            ? "You're subscribed to receive push notifications"
                            : "Subscribe to receive notifications on this device"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {pushSubscription ? (
                        <Button
                          onClick={unsubscribeFromPush}
                          variant="outline"
                          size="sm"
                        >
                          Unsubscribe
                        </Button>
                      ) : (
                        <Button onClick={subscribeToPush} size="sm">
                          Subscribe
                        </Button>
                      )}
                    </div>
                  </div>
                  {pushMessage && (
                    <div
                      className={`mt-3 p-2 rounded text-sm ${
                        pushMessage.includes("Successfully")
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {pushMessage}
                    </div>
                  )}
                </div>
              )}

              {(pushSubscription || !isPushSupported) && (
                <>
                  {/* Notification Time */}
                  <div className="space-y-2">
                    <Label htmlFor="notification-time" className="text-base">
                      Notification Time
                    </Label>
                    <div className="flex items-center space-x-4">
                      <input
                        id="notification-time"
                        type="time"
                        value={notificationTime}
                        onChange={(e) => setNotificationTime(e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>in your timezone</span>
                      </div>
                    </div>
                  </div>

                  {/* Timezone Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-base">
                      Timezone
                    </Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Current time in {timezone}: {getCurrentTimeInTimezone()}
                    </p>
                  </div>
                </>
              )}

              {/* Save Button */}
              {(pushSubscription || !isPushSupported) && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {saveStatus === "success" && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">
                          Settings saved successfully!
                        </span>
                      </div>
                    )}
                    {saveStatus === "error" && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">
                          Error saving settings. Please try again.
                        </span>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Understanding the notification system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6  rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Set Your Time</p>
                    <p className="text-xs ">
                      Choose when you want to receive notifications
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6  rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Daily Fact Generation</p>
                    <p className="text-xs ">
                      AI creates a personalized fact for you
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Notification Delivery</p>
                    <p className="text-xs">
                      Receive your fact at the scheduled time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Features */}
            <Card>
              <CardHeader>
                <CardTitle>Available Features</CardTitle>
                <CardDescription>
                  Current notification capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    Push notifications on all devices
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    Customizable notification time
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Timezone support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">PWA installation support</span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Coming Soon:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        Email notifications
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        Custom notification sounds
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        Multiple notification times
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        Weekend pause options
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>Your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      notificationEnabled ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {notificationEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Time
                  </p>
                  <p className="text-lg font-bold">
                    {notificationEnabled ? notificationTime : "Not set"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Timezone
                  </p>
                  <p className="text-lg font-bold">
                    {notificationEnabled ? timezone : "Not set"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Push Notifications
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      pushSubscription ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {pushSubscription ? "Subscribed" : "Not subscribed"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
