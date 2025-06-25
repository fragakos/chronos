"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { useQuestionnaireForm } from "./hooks/useQuestionnaireForm";
import { StepIndicator } from "./components/StepIndicator";
import {
  ExperienceStep,
  TimePeriodsStep,
  TopicsStep,
  MotivationsAndRegionsStep,
  LanguageStep,
  OpenEndedStep,
} from "./steps";
import { questionnaireSteps } from "../utils/form-logic";
import {
  submissionLoadingStatesEn,
  submissionLoadingStatesEl,
} from "../utils/loadingStates";
import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";

interface InterestQuestionnaireProps {
  hasCompletedOnboarding: boolean;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

export function InterestQuestionnaire({
  hasCompletedOnboarding,
  dictionary,
  lang,
}: InterestQuestionnaireProps) {
  const {
    currentStep,
    isSubmitting,
    formData,
    topics,
    topicsLoading,
    topicsError,
    handleInputChange,
    handleMultiSelect,
    handleToggleSelectAll,
    isAllSelected,
    handleSubmit,
    goToNextStep,
    goToPreviousStep,
  } = useQuestionnaireForm(lang);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ExperienceStep
            formData={formData}
            onInputChange={handleInputChange}
            onNext={goToNextStep}
            dictionary={dictionary}
          />
        );
      case 2:
        return (
          <TimePeriodsStep
            formData={formData}
            onMultiSelect={handleMultiSelect}
            onToggleSelectAll={handleToggleSelectAll}
            isAllSelected={isAllSelected}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            dictionary={dictionary}
          />
        );
      case 3:
        return (
          <TopicsStep
            formData={formData}
            topics={topics}
            topicsLoading={topicsLoading}
            topicsError={topicsError}
            onMultiSelect={handleMultiSelect}
            onToggleSelectAll={handleToggleSelectAll}
            isAllSelected={isAllSelected}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            dictionary={dictionary}
          />
        );
      case 4:
        return (
          <MotivationsAndRegionsStep
            formData={formData}
            onInputChange={handleInputChange}
            onMultiSelect={handleMultiSelect}
            onToggleSelectAll={handleToggleSelectAll}
            isAllSelected={isAllSelected}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            dictionary={dictionary}
          />
        );
      case 5:
        return (
          <LanguageStep
            formData={formData}
            onInputChange={handleInputChange}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            dictionary={dictionary}
          />
        );
      case 6:
        return (
          <OpenEndedStep
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={goToPreviousStep}
            isSubmitting={isSubmitting}
            dictionary={dictionary}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MultiStepLoader
        loadingStates={
          lang === "el" ? submissionLoadingStatesEl : submissionLoadingStatesEn
        }
        loading={isSubmitting}
        loop={false}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {hasCompletedOnboarding && (
          <Card className="mb-6 bg-card text-card-foreground border border-border">
            <CardHeader>
              <CardTitle>
                {questionnaireSteps(dictionary).completed.title}
              </CardTitle>
              <CardDescription>
                {questionnaireSteps(dictionary).completed.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {renderStep()}

        <StepIndicator
          currentStep={currentStep}
          totalSteps={Object.keys(questionnaireSteps(dictionary)).length - 1}
          stepLabel="Step"
        />
      </div>
    </>
  );
}
