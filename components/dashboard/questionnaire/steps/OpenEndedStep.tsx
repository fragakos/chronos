import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { StepNavigation } from "../components/StepNavigation";
import { QuestionnaireData, questionnaireSteps } from "../../utils/form-logic";
import { getDictionary } from "@/get-dictionary";

interface OpenEndedStepProps {
  formData: QuestionnaireData;
  onInputChange: (field: keyof QuestionnaireData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

export const OpenEndedStep = ({
  formData,
  onInputChange,
  onSubmit,
  onBack,
  isSubmitting,
  dictionary,
}: OpenEndedStepProps) => {
  return (
    <QuestionnaireCard
      title={questionnaireSteps(dictionary)[6].title}
      description={questionnaireSteps(dictionary)[6].description}
    >
      <div>
        <Label htmlFor="openEnded" className="font-semibold">
          {questionnaireSteps(dictionary)[6].openEndedLabel}
        </Label>
        <Textarea
          id="openEnded"
          placeholder={questionnaireSteps(dictionary)[6].openEndedPlaceholder}
          value={formData.open_ended_response}
          onChange={(e) => onInputChange("open_ended_response", e.target.value)}
          className="mt-2"
          aria-label="Additional historical interests"
        />
      </div>

      <StepNavigation
        showBack={true}
        onBack={onBack}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isLastStep={true}
        backLabel="Back"
        submitLabel="Complete Setup"
      />
    </QuestionnaireCard>
  );
};
