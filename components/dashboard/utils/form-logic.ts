import { getDictionary } from "@/get-dictionary";

export interface QuestionnaireData {
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  preferred_fact_length: "short" | "medium" | "long";
  time_periods: string[];
  topics: string[];
  learning_motivations: string[];
  historical_figures: string;
  regional_interests: string[];
  open_ended_response: string;
  language: string;
}

export const experienceLevels = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
) => [
  {
    value: "beginner",
    label: dictionary.questionnaire.experienceLevels.beginner,
  },
  {
    value: "intermediate",
    label: dictionary.questionnaire.experienceLevels.intermediate,
  },
  {
    value: "advanced",
    label: dictionary.questionnaire.experienceLevels.advanced,
  },
  {
    value: "expert",
    label: dictionary.questionnaire.experienceLevels.expert,
  },
];
export const factLengths = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
) => [
  { value: "short", label: dictionary.questionnaire.factLengths.short },
  { value: "medium", label: dictionary.questionnaire.factLengths.medium },
  { value: "long", label: dictionary.questionnaire.factLengths.long },
];

export const timePeriods = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
) => [
  { value: "ancient", label: dictionary.questionnaire.timePeriods.ancient },
  { value: "medieval", label: dictionary.questionnaire.timePeriods.medieval },
  {
    value: "early_modern",
    label: dictionary.questionnaire.timePeriods.early_modern,
  },
  {
    value: "19th_century",
    label: dictionary.questionnaire.timePeriods.century_19,
  },
  {
    value: "20th_century",
    label: dictionary.questionnaire.timePeriods.century_20,
  },
  { value: "modern", label: dictionary.questionnaire.timePeriods.modern },
];

export const learningMotivations = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
) => [
  {
    value: "personal_curiosity",
    label: dictionary.questionnaire.learningMotivations.personal_curiosity,
  },
  {
    value: "academic_interest",
    label: dictionary.questionnaire.learningMotivations.academic_interest,
  },
  {
    value: "professional_development",
    label:
      dictionary.questionnaire.learningMotivations.professional_development,
  },
  {
    value: "travel_planning",
    label: dictionary.questionnaire.learningMotivations.travel_planning,
  },
  {
    value: "cultural_understanding",
    label: dictionary.questionnaire.learningMotivations.cultural_understanding,
  },
  {
    value: "family_history_research",
    label: dictionary.questionnaire.learningMotivations.family_history_research,
  },
];

export const regions = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
) => [
  { value: "europe", label: dictionary.questionnaire.regions.europe },
  { value: "asia", label: dictionary.questionnaire.regions.asia },
  { value: "africa", label: dictionary.questionnaire.regions.africa },
  {
    value: "north_america",
    label: dictionary.questionnaire.regions.north_america,
  },
  {
    value: "south_america",
    label: dictionary.questionnaire.regions.south_america,
  },
  { value: "middle_east", label: dictionary.questionnaire.regions.middle_east },
  { value: "oceania", label: dictionary.questionnaire.regions.oceania },
];

export const languages = () => [
  { value: "English", label: "English" },
  { value: "Greek", label: "Greek" },
];

export const questionnaireSteps = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>
) => ({
  1: {
    title: dictionary.questionnaire.steps.welcome.title,
    description: dictionary.questionnaire.steps.welcome.description,
    experienceLevelLabel:
      dictionary.questionnaire.steps.welcome.experienceLevelLabel,
    factLengthLabel: dictionary.questionnaire.steps.welcome.factLengthLabel,
  },
  2: {
    title: dictionary.questionnaire.steps.historicalPeriods.title,
    description: dictionary.questionnaire.steps.historicalPeriods.description,
    timePeriodsLabel:
      dictionary.questionnaire.steps.historicalPeriods.timePeriodsLabel,
  },
  3: {
    title: dictionary.questionnaire.steps.topics.title,
    description: dictionary.questionnaire.steps.topics.description,
    topicsLabel: dictionary.questionnaire.steps.topics.topicsLabel,
    loading: dictionary.questionnaire.steps.topics.loading,
    error: dictionary.questionnaire.steps.topics.error,
  },
  4: {
    title: dictionary.questionnaire.steps.learningGoalsRegions.title,
    description:
      dictionary.questionnaire.steps.learningGoalsRegions.description,
    learningMotivationsLabel:
      dictionary.questionnaire.steps.learningGoalsRegions
        .learningMotivationsLabel,
    regionsLabel:
      dictionary.questionnaire.steps.learningGoalsRegions.regionsLabel,
    figuresLabel:
      dictionary.questionnaire.steps.learningGoalsRegions.figuresLabel,
    figuresPlaceholder:
      dictionary.questionnaire.steps.learningGoalsRegions.figuresPlaceholder,
  },
  5: {
    title: dictionary.questionnaire.steps.languagePreferences.title,
    description: dictionary.questionnaire.steps.languagePreferences.description,
    languageLabel:
      dictionary.questionnaire.steps.languagePreferences.languageLabel,
  },
  6: {
    title: dictionary.questionnaire.steps.finalThoughts.title,
    description: dictionary.questionnaire.steps.finalThoughts.description,
    openEndedLabel: dictionary.questionnaire.steps.finalThoughts.openEndedLabel,
    openEndedPlaceholder:
      dictionary.questionnaire.steps.finalThoughts.openEndedPlaceholder,
  },
  completed: {
    title: dictionary.questionnaire.steps.completed.title,
    description: dictionary.questionnaire.steps.completed.description,
  },
});

export const questions = [
  "What's your experience level with history?",
  "What length of facts do you prefer?",
  "Which historical periods interest you most?",
  "What types of historical topics fascinate you?",
  "What are your learning motivations?",
  "Are there any specific historical figures you'd like to learn more about?",
  "Which regions of the world interest you most?",
  "Is there anything else you'd like to tell us about your historical interests?",
  "What language do you prefer to read in? (English or Greek)",
];
