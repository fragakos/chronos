"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { QuestionnaireData } from "./utils/form-logic";
import { submitQuestionnaire } from "@/requests/supabase/submitQuestionnaire";
import {
  experienceLevels,
  factLengths,
  timePeriods,
  learningMotivations,
  regions,
  questionnaireSteps,
} from "./utils/form-logic";
import { getInterestCategories } from "@/requests/supabase/getInterestCategories";
import { submissionLoadingStates } from "./utils/loadingStates";
interface InterestQuestionnaireProps {
  hasCompletedOnboarding: boolean;
}

export function InterestQuestionnaire({
  hasCompletedOnboarding,
}: InterestQuestionnaireProps) {
  // const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const languages = ["English", "Greek"];
  const [formData, setFormData] = useState<QuestionnaireData>({
    experience_level: "beginner",
    preferred_fact_length: "medium",
    time_periods: [],
    topics: [],
    learning_motivations: [],
    historical_figures: "",
    regional_interests: [],
    open_ended_response: "",
    language: "English",
  });
  const [topics, setTopics] = useState<string[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  useEffect(() => {
    setTopicsLoading(true);
    getInterestCategories()
      .then((data) => {
        setTopics(data);
        setTopicsError(null);
      })
      .catch((err) => {
        setTopicsError(err.message || "Failed to load topics.");
        setTopics([]);
      })
      .finally(() => setTopicsLoading(false));
  }, []);

  const handleInputChange = (
    field: keyof QuestionnaireData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { success, user_id, onboarding_response_id, error } =
        await submitQuestionnaire(formData);
      if (!success) {
        alert("There was an error saving your responses. Please try again.");
        throw new Error(error || "Failed to save questionnaire");
      }
      const interestAnalysis = await fetch("/api/analysis", {
        method: "POST",
        body: JSON.stringify({
          answers: formData,
          user_id,
          onboarding_response_id,
        }),
      });
      const interestAnalysisData = await interestAnalysis.json();
      if (interestAnalysisData.success) {
        window.location.reload();
      } else {
        alert("There was an error saving your responses. Please try again.");
      }
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      alert("There was an error saving your responses. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-card text-card-foreground shadow-md border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps[1].title}</CardTitle>
              <CardDescription>
                {questionnaireSteps[1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label htmlFor="experience" className="font-semibold">
                  {questionnaireSteps[1].experienceLevelLabel}
                </Label>
                <div className="mt-3 flex flex-col gap-2">
                  {experienceLevels.map((level) => (
                    <label
                      key={level.value}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                      tabIndex={0}
                      aria-label={level.label}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleInputChange("experience_level", level.value)
                        )
                      }
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={level.value}
                        checked={formData.experience_level === level.value}
                        onChange={(e) =>
                          handleInputChange("experience_level", e.target.value)
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
                  {questionnaireSteps[1].factLengthLabel}
                </Label>
                <div className="mt-3 flex flex-col gap-2">
                  {factLengths.map((length) => (
                    <label
                      key={length.value}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                      tabIndex={0}
                      aria-label={length.label}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleInputChange(
                            "preferred_fact_length",
                            length.value
                          )
                        )
                      }
                    >
                      <input
                        type="radio"
                        name="factLength"
                        value={length.value}
                        checked={
                          formData.preferred_fact_length === length.value
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "preferred_fact_length",
                            e.target.value
                          )
                        }
                        className="accent-primary focus:ring-0 focus:ring-offset-0 focus:border-none focus:outline-none"
                        aria-checked={
                          formData.preferred_fact_length === length.value
                        }
                      />
                      <span className="text-sm">{length.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  aria-label="Next step"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="bg-card text-card-foreground shadow-md border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps[2].title}</CardTitle>
              <CardDescription>
                {questionnaireSteps[2].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {timePeriods.map((period) => (
                  <label
                    key={period}
                    className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                    tabIndex={0}
                    aria-label={period}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () =>
                        handleMultiSelect("time_periods", period)
                      )
                    }
                  >
                    <input
                      type="checkbox"
                      checked={formData.time_periods.includes(period)}
                      onChange={() => handleMultiSelect("time_periods", period)}
                      className="accent-primary focus:ring-2 focus:ring-ring"
                      aria-checked={formData.time_periods.includes(period)}
                    />
                    <span className="text-sm">{period}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  aria-label="Back step"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  aria-label="Next step"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="bg-card text-card-foreground shadow-md border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps[3].title}</CardTitle>
              <CardDescription>
                {questionnaireSteps[3].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {topicsLoading ? (
                <div className="text-center text-muted-foreground">
                  {questionnaireSteps[3].loading}
                </div>
              ) : topicsError ? (
                <div className="text-center text-destructive">
                  {topicsError}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topics.map((topic) => (
                    <label
                      key={topic}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                      tabIndex={0}
                      aria-label={topic}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleMultiSelect("topics", topic)
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        checked={formData.topics.includes(topic)}
                        onChange={() => handleMultiSelect("topics", topic)}
                        className="accent-primary focus:ring-2 focus:ring-ring"
                        aria-checked={formData.topics.includes(topic)}
                      />
                      <span className="text-sm">{topic}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  aria-label="Back step"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  aria-label="Next step"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="bg-card text-card-foreground shadow-md border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps[4].title}</CardTitle>
              <CardDescription>
                {questionnaireSteps[4].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label className="font-semibold">
                  {questionnaireSteps[4].learningMotivationsLabel}
                </Label>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {learningMotivations.map((motivation) => (
                    <label
                      key={motivation}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                      tabIndex={0}
                      aria-label={motivation}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleMultiSelect("learning_motivations", motivation)
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        checked={formData.learning_motivations.includes(
                          motivation
                        )}
                        onChange={() =>
                          handleMultiSelect("learning_motivations", motivation)
                        }
                        className="accent-primary focus:ring-2 focus:ring-ring"
                        aria-checked={formData.learning_motivations.includes(
                          motivation
                        )}
                      />
                      <span className="text-sm">{motivation}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="font-semibold">
                  {questionnaireSteps[4].regionsLabel}
                </Label>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                      tabIndex={0}
                      aria-label={region}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleMultiSelect("regional_interests", region)
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        checked={formData.regional_interests.includes(region)}
                        onChange={() =>
                          handleMultiSelect("regional_interests", region)
                        }
                        className="accent-primary focus:ring-2 focus:ring-ring"
                        aria-checked={formData.regional_interests.includes(
                          region
                        )}
                      />
                      <span className="text-sm">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="figures" className="font-semibold">
                  {questionnaireSteps[4].figuresLabel}
                </Label>
                <Input
                  id="figures"
                  placeholder={questionnaireSteps[4].figuresPlaceholder}
                  value={formData.historical_figures}
                  onChange={(e) =>
                    handleInputChange("historical_figures", e.target.value)
                  }
                  className="mt-2"
                  aria-label="Specific historical figures"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  aria-label="Back step"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(5)}
                  aria-label="Next step"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card className="bg-card text-card-foreground shadow-md border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps[5].title}</CardTitle>
              <CardDescription>
                {questionnaireSteps[5].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label htmlFor="language" className="font-semibold">
                  {questionnaireSteps[5].languageLabel}
                </Label>
                <div className="mt-3 flex flex-col gap-2">
                  {languages.map((language) => (
                    <label
                      key={language}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 border border-border hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                      tabIndex={0}
                      aria-label={language}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () =>
                          handleInputChange("language", language)
                        )
                      }
                    >
                      <input
                        type="radio"
                        name="language"
                        value={language}
                        checked={formData.language === language}
                        onChange={(e) =>
                          handleInputChange("language", e.target.value)
                        }
                        className="accent-primary focus:ring-2 focus:ring-ring"
                        aria-checked={formData.language === language}
                      />
                      <span className="text-sm">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(4)}
                  aria-label="Back step"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(6)}
                  aria-label="Next step"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 6:
        return (
          <Card className="bg-card text-card-foreground shadow-md border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps[6].title}</CardTitle>
              <CardDescription>
                {questionnaireSteps[6].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label htmlFor="openEnded" className="font-semibold">
                  {questionnaireSteps[6].openEndedLabel}
                </Label>
                <Textarea
                  id="openEnded"
                  placeholder={questionnaireSteps[6].openEndedPlaceholder}
                  value={formData.open_ended_response}
                  onChange={(e) =>
                    handleInputChange("open_ended_response", e.target.value)
                  }
                  className="mt-2"
                  aria-label="Additional historical interests"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(5)}
                  aria-label="Back step"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  aria-label="Complete setup"
                >
                  Complete Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MultiStepLoader
        loadingStates={submissionLoadingStates}
        loading={isSubmitting}
        loop={false}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {hasCompletedOnboarding && (
          <Card className="mb-6 bg-card text-card-foreground border border-border">
            <CardHeader>
              <CardTitle>{questionnaireSteps.completed.title}</CardTitle>
              <CardDescription>
                {questionnaireSteps.completed.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        {renderStep()}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={
                  `w-3 h-3 rounded-full transition-colors duration-200 ` +
                  (step === currentStep
                    ? "bg-primary"
                    : step < currentStep
                    ? "bg-green-500"
                    : "bg-muted border border-border")
                }
                aria-label={`Step ${step}`}
                tabIndex={0}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep} of {Object.keys(questionnaireSteps).length - 1}
          </p>
        </div>
      </div>
    </>
  );
}
