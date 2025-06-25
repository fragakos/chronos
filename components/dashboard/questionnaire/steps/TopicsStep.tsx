import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { SelectAllButton } from "../components/SelectAllButton";
import { StepNavigation } from "../components/StepNavigation";
import { QuestionnaireData, questionnaireSteps } from "../../utils/form-logic";
import { getDictionary } from "@/get-dictionary";

interface TopicsStepProps {
  formData: QuestionnaireData;
  topics: string[];
  topicsLoading: boolean;
  topicsError: string | null;
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

export const TopicsStep = ({
  formData,
  topics,
  topicsLoading,
  topicsError,
  onMultiSelect,
  onToggleSelectAll,
  isAllSelected,
  onNext,
  onBack,
  dictionary,
}: TopicsStepProps) => {
  const renderContent = () => {
    if (topicsLoading) {
      return (
        <div className="text-center text-muted-foreground">
          {questionnaireSteps(dictionary)[3].loading}
        </div>
      );
    }

    if (topicsError) {
      return <div className="text-center text-destructive">{topicsError}</div>;
    }

    return (
      <>
        <SelectAllButton
          isAllSelected={isAllSelected("topics", topics)}
          onToggleSelectAll={() => onToggleSelectAll("topics", topics)}
          selectAllLabel="Select all topics"
          deselectAllLabel="Deselect all topics"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((topic) => (
            <label
              key={topic}
              className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
              tabIndex={0}
              aria-label={topic}
              onKeyDown={(e) =>
                handleKeyDown(e, () => onMultiSelect("topics", topic))
              }
            >
              <input
                type="checkbox"
                checked={formData.topics.includes(topic)}
                onChange={() => onMultiSelect("topics", topic)}
                className="accent-primary focus:ring-2 focus:ring-ring"
                aria-checked={formData.topics.includes(topic)}
              />
              <span className="text-sm">
                {
                  dictionary.questionnaire.topics[
                    topic as keyof typeof dictionary.questionnaire.topics
                  ]
                }
              </span>
            </label>
          ))}
        </div>
      </>
    );
  };

  return (
    <QuestionnaireCard
      title={questionnaireSteps(dictionary)[3].title}
      description={questionnaireSteps(dictionary)[3].description}
    >
      {renderContent()}

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
