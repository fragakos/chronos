"use client";

import { useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
      checkSubscription();
    }
  }, []);

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

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
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
        setSubscription(sub);
        setMessage("Successfully subscribed to push notifications!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to subscribe to push notifications.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      setMessage("Error subscribing to push notifications.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        const result = await unsubscribeUser();
        if (result.success) {
          setSubscription(null);
          setMessage("Successfully unsubscribed from push notifications!");
          setTimeout(() => setMessage(""), 3000);
        } else {
          setMessage("Failed to unsubscribe from push notifications.");
          setTimeout(() => setMessage(""), 3000);
        }
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      setMessage("Error unsubscribing from push notifications.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          {subscription
            ? "You are subscribed to push notifications for daily historical facts."
            : "Subscribe to receive daily historical facts as push notifications."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded-md ${
              message.includes("Successfully")
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-2">
          {subscription ? (
            <Button onClick={unsubscribeFromPush} variant="destructive">
              Unsubscribe from Notifications
            </Button>
          ) : (
            <Button onClick={subscribeToPush}>
              Subscribe to Notifications
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => router.push("/notifications")}
          >
            Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
