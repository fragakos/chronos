import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  showBack?: boolean;
  showNext?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
}

export const StepNavigation = ({
  showBack = false,
  showNext = false,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  isLastStep = false,
  backLabel = "Back",
  nextLabel = "Next",
  submitLabel = "Complete Setup",
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between">
      {showBack ? (
        <Button variant="outline" onClick={onBack} aria-label="Back step">
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-label="Complete setup"
        >
          {submitLabel}
        </Button>
      ) : showNext ? (
        <Button onClick={onNext} aria-label="Next step">
          {nextLabel}
        </Button>
      ) : null}
    </div>
  );
};
