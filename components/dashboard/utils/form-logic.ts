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

export const experienceLevels = [
  { value: "beginner", label: "Beginner - Just starting to explore history" },
  {
    value: "intermediate",
    label: "Intermediate - Some knowledge of historical events",
  },
  {
    value: "advanced",
    label: "Advanced - Well-versed in many historical topics",
  },
  {
    value: "expert",
    label: "Expert - Deep knowledge across multiple historical periods",
  },
];
export const factLengths = [
  { value: "short", label: "Short - Quick facts and snippets" },
  { value: "medium", label: "Medium - Detailed explanations" },
  { value: "long", label: "Long - Comprehensive historical context" },
];

export const timePeriods = [
  "Ancient History (Before 500 CE)",
  "Medieval Period (500-1500)",
  "Early Modern Period (1500-1800)",
  "19th Century (1800-1900)",
  "20th Century (1900-2000)",
  "Modern Era (2000-Present)",
];

export const learningMotivations = [
  "Personal curiosity",
  "Academic interest",
  "Professional development",
  "Travel planning",
  "Cultural understanding",
  "Family history research",
];

export const regions = [
  "Europe",
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Middle East",
  "Oceania",
];

export const questionnaireSteps = {
  1: {
    title: "Welcome to Chronikos!",
    description:
      "Let's personalize your historical fact experience. This will help us provide you with the most relevant and interesting facts.",
    experienceLevelLabel: "What's your experience level with history?",
    factLengthLabel: "What length of facts do you prefer?",
  },
  2: {
    title: "Historical Periods",
    description:
      "Which historical periods interest you most? (Select all that apply)",
    timePeriodsLabel: "Select historical periods:",
  },
  3: {
    title: "Topics of Interest",
    description:
      "What types of historical topics fascinate you? (Select all that apply)",
    topicsLabel: "Select topics:",
    loading: "Loading topics...",
    error: "Failed to load topics.",
  },
  4: {
    title: "Learning Goals & Regions",
    description:
      "Tell us more about your learning motivations and regional interests",
    learningMotivationsLabel:
      "Why are you interested in learning about history? (Select all that apply)",
    regionsLabel:
      "Which regions of the world interest you most? (Select all that apply)",
    figuresLabel:
      "Are there any specific historical figures you'd like to learn more about?",
    figuresPlaceholder: "e.g., Napoleon, Cleopatra, Leonardo da Vinci...",
  },
  5: {
    title: "Language Preferences",
    description: "What language do you prefer to read in?",
    languageLabel: "Select your preferred language:",
  },
  6: {
    title: "Final Thoughts",
    description:
      "Any additional thoughts or specific interests you'd like to share?",
    openEndedLabel:
      "Is there anything else you'd like us to know about your historical interests?",
    openEndedPlaceholder:
      "Tell us about any specific events, periods, or topics that fascinate you...",
  },
  completed: {
    title: "Update Your Interests",
    description:
      "You've completed the questionnaire before. You can update your preferences below.",
  },
};

export const questions = [
  "What's your experience level with history?",
  "What length of facts do you prefer?",
  "Which historical periods interest you most? (Select all that apply)",
  "What types of historical topics fascinate you? (Select all that apply)",
  "Why are you interested in learning about history? (Select all that apply)",
  "Which regions of the world interest you most? (Select all that apply)",
  "Are there any specific historical figures you'd like to learn more about?",
  "What language do you prefer to read in?",
  "Is there anything else you'd like us to know about your historical interests?",
];
