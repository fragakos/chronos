import { Label } from "@/components/ui/label";
import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { StepNavigation } from "../components/StepNavigation";
import {
  QuestionnaireData,
  languages,
  questionnaireSteps,
} from "../../utils/form-logic";
import { getDictionary } from "@/get-dictionary";

interface LanguageStepProps {
  formData: QuestionnaireData;
  onInputChange: (field: keyof QuestionnaireData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
};

export const LanguageStep = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  dictionary,
}: LanguageStepProps) => {
  return (
    <QuestionnaireCard
      title={questionnaireSteps(dictionary)[5].title}
      description={questionnaireSteps(dictionary)[5].description}
    >
      <div>
        <Label htmlFor="language" className="font-semibold">
          {questionnaireSteps(dictionary)[5].languageLabel}
        </Label>
        <div className="mt-3 flex flex-col gap-2">
          {languages().map((language) => (
            <label
              key={language.value}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
              tabIndex={0}
              aria-label={language.label}
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  onInputChange("language", language.value)
                )
              }
            >
              <input
                type="radio"
                name="language"
                value={language.value}
                checked={formData.language === language.value}
                onChange={(e) => onInputChange("language", e.target.value)}
                className="accent-primary focus:ring-2 focus:ring-ring"
                aria-checked={formData.language === language.value}
              />
              <span className="text-sm">{language.label}</span>
            </label>
          ))}
        </div>
      </div>

      <StepNavigation
        showBack={true}
        showNext={true}
        onBack={onBack}
        onNext={onNext}
        backLabel="Back"
        nextLabel="Next"
      />
    </QuestionnaireCard>
  );
};
