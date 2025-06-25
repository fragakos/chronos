import {
  QuestionnaireData,
  questions,
} from "@/components/dashboard/utils/form-logic";

export const createPrompt = (answers: QuestionnaireData) => {
  const keys = Object.keys(answers) as (keyof QuestionnaireData)[];
  const parsedAnswers = keys.map((key, index) => {
    const question = questions[index];
    let answer = answers[key];
    if (Array.isArray(answer)) {
      answer = answer.join(", ");
    }
    return `${question}: ${answer || "(none)"}`;
  });
  const analysis_prompt = `You are an expert behavioral analyst specializing in interest profiling and personality assessment. Your task is to analyze a set of questions and answers from a user to create a comprehensive interest profile.

**INPUT:** A set of questions and corresponding user answers

**YOUR ANALYSIS SHOULD INCLUDE:**

1. **Primary Interest Categories**: Identify the main areas of interest (e.g., technology, arts, sports, business, science, etc.) with confidence levels for each

2. **Interest Depth Assessment**: Determine whether interests appear to be:
   - Surface-level/casual
   - Moderate engagement
   - Deep expertise/passion

3. **Behavioral Patterns**: Note patterns in how the user approaches topics:
   - Analytical vs. creative thinking
   - Practical vs. theoretical orientation
   - Individual vs. collaborative preferences
   - Risk-taking vs. conservative tendencies

4. **Motivation Drivers**: Identify what seems to drive their interests:
   - Achievement/competition
   - Learning/knowledge acquisition
   - Social connection
   - Creative expression
   - Problem-solving
   - Financial gain

5. **Communication Style**: Analyze their response patterns:
   - Detail-oriented vs. big-picture
   - Formal vs. casual
   - Confident vs. uncertain
   - Emotional vs. logical

6. **Potential Applications**: Suggest how this interest profile could be used for:
   - Content recommendations
   - Product suggestions
   - Career guidance
   - Learning paths
   - Social connections

7. **Language Preferences**: Analyze their response patterns:
   - English vs. Greek

**OUTPUT FORMAT:**
Provide a structured text analysis with clear sections, specific examples from their answers, and actionable insights. Rate confidence levels (High/Medium/Low) for each major finding. Include both explicit interests (directly stated) and implicit interests (inferred from response patterns).

**QUESTIONS AND ANSWERS TO ANALYZE:**
\n${parsedAnswers.join("\n")}`;
  return analysis_prompt;
};
