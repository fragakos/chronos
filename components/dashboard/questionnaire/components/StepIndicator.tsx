interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
  stepLabel = "Step",
}: StepIndicatorProps) => {
  return (
    <div className="mt-8 text-center">
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={
              `w-3 h-3 rounded-full transition-colors duration-200 ` +
              (step === currentStep
                ? "bg-primary"
                : step < currentStep
                ? "bg-[#695037]"
                : "bg-muted border border-border")
            }
            aria-label={`${stepLabel} ${step}`}
            tabIndex={0}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {stepLabel} {currentStep} of {totalSteps}
      </p>
    </div>
  );
};
