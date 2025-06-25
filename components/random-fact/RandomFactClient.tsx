"use client";

import { useRandomFact } from "./hooks/useRandomFact";
import { RandomFactCard } from "./RandomFactCard";
import { Locale } from "@/i18n-config";

type RandomFactClientProps = {
  userId: string;
  currentLang: Locale;
};

export const RandomFactClient = ({
  userId,
  currentLang,
}: RandomFactClientProps) => {
  const { fact, dailyFactId, loading, error, regenerating, handleThanks } =
    useRandomFact(userId);

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <RandomFactCard
            loading={loading}
            regenerating={regenerating}
            error={error}
            fact={fact}
            dailyFactId={dailyFactId}
            handleThanks={handleThanks}
            currentLang={currentLang}
          />
        </div>
      </main>
    </div>
  );
};
