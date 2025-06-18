"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { NavHeader } from "@/components/dashboard/nav-header";
import type { User } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
type RandomFactClientProps = {
  userId: string;
  user: User;
};

export const RandomFactClient = ({ userId, user }: RandomFactClientProps) => {
  const router = useRouter();
  const [fact, setFact] = useState<string | null>(null);
  const [dailyFactId, setDailyFactId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<boolean>(false);

  const fetchFact = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFact(null);
    setDailyFactId(null);
    try {
      const res = await fetch("/api/fact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success && data.record) {
        setFact(data.record);
        setDailyFactId(data.daily_fact_id || null);
      } else if (data.reason === "wait_24h") {
        setError(
          "You can only generate one personalized fact every 24 hours. Please come back later!"
        );
      } else {
        setError(
          `Could not generate a fact at this time. Please try again later. ${data.reason}`
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleThanks = async () => {
    if (dailyFactId) {
      console.log("dailyFactId", dailyFactId);
      await fetch("/api/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, daily_fact_id: dailyFactId }),
      });
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader
        user={user}
        showBackButton={true}
        backLabel="Back to Dashboard"
      />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Random Historical Fact
            </h2>
            <p className="text-gray-600">
              Discover fascinating historical facts tailored to your interests
            </p>
          </div>

          {/* Fact Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle>Personalized Fact</CardTitle>
              <CardDescription>
                {loading || regenerating
                  ? "Generating your personalized fact..."
                  : error
                  ? "Error"
                  : "Generated just for you!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {loading || regenerating ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-gray-500">Generating...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg text-red-700">
                  {error}
                </div>
              ) : fact ? (
                <div className="bg-gray-50 p-6 rounded-lg text-left whitespace-pre-line text-gray-800">
                  <ReactMarkdown>{fact}</ReactMarkdown>
                </div>
              ) : null}

              {fact && dailyFactId !== null && (
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="default"
                    onClick={handleThanks}
                    tabIndex={0}
                    aria-label="Back to Dashboard"
                    type="button"
                  >
                    Thanks!
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
