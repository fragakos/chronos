import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireData } from "../../utils/form-logic";
import { submitQuestionnaire } from "@/requests/supabase/submitQuestionnaire";
import { getInterestCategories } from "@/requests/supabase/getInterestCategories";
import { type Locale } from "@/i18n-config";

export const useQuestionnaireForm = (lang: Locale) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const handleSelectAll = (
    field: keyof QuestionnaireData,
    allValues: string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: allValues }));
  };

  const handleDeselectAll = (field: keyof QuestionnaireData) => {
    setFormData((prev) => ({ ...prev, [field]: [] }));
  };

  const isAllSelected = (
    field: keyof QuestionnaireData,
    allValues: string[]
  ) => {
    const currentValues = formData[field] as string[];
    return (
      allValues.length > 0 &&
      allValues.every((value) => currentValues.includes(value))
    );
  };

  const handleToggleSelectAll = (
    field: keyof QuestionnaireData,
    allValues: string[]
  ) => {
    if (isAllSelected(field, allValues)) {
      handleDeselectAll(field);
    } else {
      handleSelectAll(field, allValues);
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
        router.push(`/${lang}/success`);
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

  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
    scrollToTop();
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
    scrollToTop();
  };

  return {
    currentStep,
    setCurrentStep,
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
    scrollToTop,
  };
};
