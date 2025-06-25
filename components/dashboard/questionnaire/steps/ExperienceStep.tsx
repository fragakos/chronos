import { Label } from "@/components/ui/label";
import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { StepNavigation } from "../components/StepNavigation";
import {
  QuestionnaireData,
  experienceLevels,
  factLengths,
  questionnaireSteps,
} from "../../utils/form-logic";
import { getDictionary } from "@/get-dictionary";

interface ExperienceStepProps {
  formData: QuestionnaireData;
  onInputChange: (field: keyof QuestionnaireData, value: string) => void;
  onNext: () => void;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
};

export const ExperienceStep = ({
  formData,
  onInputChange,
  onNext,
  dictionary,
}: ExperienceStepProps) => {
  return (
    <QuestionnaireCard
      title={questionnaireSteps(dictionary)[1].title}
      description={questionnaireSteps(dictionary)[1].description}
    >
      <div>
        <Label htmlFor="experience" className="font-semibold">
          {questionnaireSteps(dictionary)[1].experienceLevelLabel}
        </Label>
        <div className="mt-3 flex flex-col gap-2">
          {experienceLevels(dictionary).map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
              tabIndex={0}
              aria-label={level.label}
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  onInputChange("experience_level", level.value)
                )
              }
            >
              <input
                type="radio"
                name="experience"
                value={level.value}
                checked={formData.experience_level === level.value}
                onChange={(e) =>
                  onInputChange("experience_level", e.target.value)
                }
                className="accent-primary focus:ring-0 focus:ring-offset-0 focus:border-none focus:outline-none"
                aria-checked={formData.experience_level === level.value}
              />
              <span className="text-sm">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="factLength" className="font-semibold">
          {questionnaireSteps(dictionary)[1].factLengthLabel}
        </Label>
        <div className="mt-3 flex flex-col gap-2">
          {factLengths(dictionary).map((length) => (
            <label
              key={length.value}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
              tabIndex={0}
              aria-label={length.label}
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  onInputChange("preferred_fact_length", length.value)
                )
              }
            >
              <input
                type="radio"
                name="factLength"
                value={length.value}
                checked={formData.preferred_fact_length === length.value}
                onChange={(e) =>
                  onInputChange("preferred_fact_length", e.target.value)
                }
                className="accent-primary focus:ring-0 focus:ring-offset-0 focus:border-none focus:outline-none"
                aria-checked={formData.preferred_fact_length === length.value}
              />
              <span className="text-sm">{length.label}</span>
            </label>
          ))}
        </div>
      </div>

      <StepNavigation showNext={true} onNext={onNext} nextLabel="Next" />
    </QuestionnaireCard>
  );
};
