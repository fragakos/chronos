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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { TIMEZONES } from "./timezones";

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

    fetchProfile();
  }, [user.id]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const supabase = createClient();

      const profileData = {
        user_id: user.id,
        experience_level: profile?.experience_level || "beginner",
        preferred_fact_length: profile?.preferred_fact_length || "medium",
        daily_notification_enabled: notificationEnabled,
        notification_time: notificationTime,
        timezone: timezone,
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert(profileData);

      if (error) throw error;

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
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
                Get notified daily with a new historical fact tailored to your
                interests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Enable Daily Notifications
                  </Label>
                  <p className="text-sm ">
                    Receive a notification every day with a new historical fact
                  </p>
                </div>
                <Switch
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                />
              </div>

              {notificationEnabled && (
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
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ocus:border-transparent"
                      />
                      <div className="flex items-center space-x-2 text-sm ">
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
                    <p className="text-sm ">
                      Current time in {timezone}: {getCurrentTimeInTimezone()}
                    </p>
                  </div>
                </>
              )}

              {/* Save Button */}
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

            {/* Future Features */}
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Additional notification features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2  rounded-full"></div>
                  <span className="text-sm ">Push notifications on mobile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2  rounded-full"></div>
                  <span className="text-sm ">Email notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2  rounded-full"></div>
                  <span className="text-sm ">Custom notification sounds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2  rounded-full"></div>
                  <span className="text-sm ">Multiple notification times</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2  rounded-full"></div>
                  <span className="text-sm ">Weekend pause options</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium ">Status</p>
                  <p
                    className={`text-lg font-bold ${
                      notificationEnabled ? "text-green-600" : ""
                    }`}
                  >
                    {notificationEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium ">Time</p>
                  <p className="text-lg font-bold ">
                    {notificationEnabled ? notificationTime : "Not set"}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium ">Timezone</p>
                  <p className="text-lg font-bold ">
                    {notificationEnabled ? timezone : "Not set"}
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
