import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { SelectAllButton } from "../components/SelectAllButton";
import { StepNavigation } from "../components/StepNavigation";
import {
  QuestionnaireData,
  learningMotivations,
  regions,
  questionnaireSteps,
} from "../../utils/form-logic";
import { getDictionary } from "@/get-dictionary";

interface MotivationsAndRegionsStepProps {
  formData: QuestionnaireData;
  onInputChange: (field: keyof QuestionnaireData, value: string) => void;
  onMultiSelect: (field: keyof QuestionnaireData, value: string) => void;
  onToggleSelectAll: (
    field: keyof QuestionnaireData,
    allValues: string[]
  ) => void;
  isAllSelected: (
    field: keyof QuestionnaireData,
    allValues: string[]
  ) => boolean;
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

export const MotivationsAndRegionsStep = ({
  formData,
  onInputChange,
  onMultiSelect,
  onToggleSelectAll,
  isAllSelected,
  onNext,
  onBack,
  dictionary,
}: MotivationsAndRegionsStepProps) => {
  const learningMotivationsData = learningMotivations(dictionary);
  const learningMotivationsValues = learningMotivationsData.map((m) => m.value);

  const regionsData = regions(dictionary);
  const regionsValues = regionsData.map((r) => r.value);

  return (
    <QuestionnaireCard
      title={questionnaireSteps(dictionary)[4].title}
      description={questionnaireSteps(dictionary)[4].description}
    >
      <div>
        <Label className="font-semibold">
          {questionnaireSteps(dictionary)[4].learningMotivationsLabel}
        </Label>
        <SelectAllButton
          isAllSelected={isAllSelected(
            "learning_motivations",
            learningMotivationsValues
          )}
          onToggleSelectAll={() =>
            onToggleSelectAll("learning_motivations", learningMotivationsValues)
          }
          selectAllLabel="Select all learning motivations"
          deselectAllLabel="Deselect all learning motivations"
          className="pt-4"
        />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningMotivationsData.map((motivation) => (
            <label
              key={motivation.value}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
              tabIndex={0}
              aria-label={motivation.label}
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  onMultiSelect("learning_motivations", motivation.value)
                )
              }
            >
              <input
                type="checkbox"
                checked={formData.learning_motivations.includes(
                  motivation.value
                )}
                onChange={() =>
                  onMultiSelect("learning_motivations", motivation.value)
                }
                className="accent-primary focus:ring-2 focus:ring-ring"
                aria-checked={formData.learning_motivations.includes(
                  motivation.value
                )}
              />
              <span className="text-sm">{motivation.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="font-semibold">
          {questionnaireSteps(dictionary)[4].regionsLabel}
        </Label>
        <SelectAllButton
          isAllSelected={isAllSelected("regional_interests", regionsValues)}
          onToggleSelectAll={() =>
            onToggleSelectAll("regional_interests", regionsValues)
          }
          selectAllLabel="Select all regions"
          deselectAllLabel="Deselect all regions"
          className="pt-4"
        />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {regionsData.map((region) => (
            <label
              key={region.value}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
              tabIndex={0}
              aria-label={region.label}
              onKeyDown={(e) =>
                handleKeyDown(e, () =>
                  onMultiSelect("regional_interests", region.value)
                )
              }
            >
              <input
                type="checkbox"
                checked={formData.regional_interests.includes(region.value)}
                onChange={() =>
                  onMultiSelect("regional_interests", region.value)
                }
                className="accent-primary focus:ring-2 focus:ring-ring"
                aria-checked={formData.regional_interests.includes(
                  region.value
                )}
              />
              <span className="text-sm">{region.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="figures" className="font-semibold">
          {questionnaireSteps(dictionary)[4].figuresLabel}
        </Label>
        <Input
          id="figures"
          placeholder={questionnaireSteps(dictionary)[4].figuresPlaceholder}
          value={formData.historical_figures}
          onChange={(e) => onInputChange("historical_figures", e.target.value)}
          className="mt-2"
          aria-label="Specific historical figures"
        />
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
