"use client";

import { useRandomFact } from "./hooks/useRandomFact";
import { RandomFactCard } from "./RandomFactCard";

type RandomFactClientProps = {
  userId: string;
};

export const RandomFactClient = ({ userId }: RandomFactClientProps) => {
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
          />
        </div>
      </main>
    </div>
  );
};
