import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type UseRandomFactReturn = {
  fact: string | null;
  dailyFactId: number | null;
  loading: boolean;
  error: string | null;
  regenerating: boolean;
  handleThanks: () => Promise<void>;
};

export const useRandomFact = (userId: string): UseRandomFactReturn => {
  const router = useRouter();
  const [fact, setFact] = useState<string | null>(null);
  const [dailyFactId, setDailyFactId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const hasFetched = useRef(false);

  const fetchFact = useCallback(async () => {
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
      } else if (data.reason === "wait_12h") {
        setError(
          "You can only generate one personalized fact every 12 hours. Please come back later!"
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
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchFact();
    }
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

  return {
    fact,
    dailyFactId,
    loading,
    error,
    regenerating,
    handleThanks,
  };
};
