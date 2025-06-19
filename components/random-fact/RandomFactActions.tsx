import { Button } from "@/components/ui/button";

type RandomFactActionsProps = {
  fact: string | null;
  dailyFactId: number | null;
  handleThanks: () => Promise<void>;
};

export const RandomFactActions = ({
  fact,
  dailyFactId,
  handleThanks,
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
        Thanks!
      </Button>
    </div>
  );
};
