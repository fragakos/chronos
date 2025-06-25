import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n-config";

type RandomFactActionsProps = {
  fact: string | null;
  dailyFactId: number | null;
  handleThanks: () => Promise<void>;
  currentLang: Locale;
};

export const RandomFactActions = ({
  fact,
  dailyFactId,
  handleThanks,
  currentLang,
}: RandomFactActionsProps) => {
  if (!fact || dailyFactId === null) {
    return null;
  }

  return (
    <div className="flex justify-center space-x-4">
      <Button
        variant="default"
        onClick={handleThanks}
        tabIndex={0}
        aria-label="Back to Dashboard"
        type="button"
      >
        {currentLang === "el" ? "Ευχαριστώ!" : "Thanks!"}
      </Button>
    </div>
  );
};
