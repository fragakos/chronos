import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { SelectAllButton } from "../components/SelectAllButton";
import { StepNavigation } from "../components/StepNavigation";
import {
  QuestionnaireData,
  timePeriods,
  questionnaireSteps,
} from "../../utils/form-logic";
import { getDictionary } from "@/get-dictionary";

interface TimePeriodsStepProps {
  formData: QuestionnaireData;
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

export const TimePeriodsStep = ({
  formData,
  onMultiSelect,
  onToggleSelectAll,
  isAllSelected,
  onNext,
  onBack,
  dictionary,
}: TimePeriodsStepProps) => {
  const timePeriodsData = timePeriods(dictionary);
  const timePeriodsValues = timePeriodsData.map((p) => p.value);

  return (
    <QuestionnaireCard
      title={questionnaireSteps(dictionary)[2].title}
      description={questionnaireSteps(dictionary)[2].description}
    >
      <SelectAllButton
        isAllSelected={isAllSelected("time_periods", timePeriodsValues)}
        onToggleSelectAll={() =>
          onToggleSelectAll("time_periods", timePeriodsValues)
        }
        selectAllLabel="Select all time periods"
        deselectAllLabel="Deselect all time periods"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {timePeriodsData.map((period) => (
          <label
            key={period.value}
            className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
            tabIndex={0}
            aria-label={period.label}
            onKeyDown={(e) =>
              handleKeyDown(e, () =>
                onMultiSelect("time_periods", period.value)
              )
            }
          >
            <input
              type="checkbox"
              checked={formData.time_periods.includes(period.value)}
              onChange={() => onMultiSelect("time_periods", period.value)}
              className="accent-primary focus:ring-2 focus:ring-ring"
              aria-checked={formData.time_periods.includes(period.value)}
            />
            <span className="text-sm">{period.label}</span>
          </label>
        ))}
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
