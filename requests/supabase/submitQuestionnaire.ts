"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { QuestionnaireData } from "@/components/dashboard/utils/form-logic";

export async function submitQuestionnaire(formData: QuestionnaireData) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Upsert user profile with relevant fields from formData
    const { error: profileError } = await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        experience_level: formData.experience_level,
        preferred_fact_length: formData.preferred_fact_length,
      },
      { onConflict: "user_id" }
    );

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      return { error: "Failed to update user profile" };
    }

    // Save onboarding response
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("user_onboarding_responses")
      .upsert(
        {
          user_id: user.id,
          response_data: formData,
          completed_at: new Date().toISOString(),
          version: "1.0",
        },
        {
          onConflict: "user_id,version",
        }
      )
      .select();
    if (onboardingError) {
      console.error("Onboarding error:", onboardingError);
      return { error: "Failed to save onboarding response" };
    }

    // Get interest categories
    const { data: categories, error: categoriesError } = await supabase
      .from("interest_categories")
      .select("*");

    if (categoriesError) {
      console.error("Categories error:", categoriesError);
      return { error: "Failed to fetch interest categories" };
    }

    // Delete existing user interests to avoid conflicts
    const { error: deleteError } = await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Delete interests error:", deleteError);
      return { error: "Failed to clear existing interests" };
    }

    // Create user interests based on questionnaire responses
    const userInterests = categories?.map((category) => {
      let interestLevel = 1; // Default low interest

      // Determine interest level based on questionnaire responses
      if (formData.topics.includes(category.name)) {
        interestLevel = 4;
      } else if (
        formData.time_periods.some((period) =>
          category.description?.toLowerCase().includes(period.toLowerCase())
        )
      ) {
        interestLevel = 3;
      } else if (
        formData.regional_interests.some((region) =>
          category.description?.toLowerCase().includes(region.toLowerCase())
        )
      ) {
        interestLevel = 2;
      }

      return {
        user_id: user.id,
        category_id: category.id,
        interest_level: interestLevel,
      };
    });

    if (userInterests && userInterests.length > 0) {
      const { error: interestsError } = await supabase
        .from("user_interests")
        .insert(userInterests);

      if (interestsError) {
        console.error("Insert interests error:", interestsError);
        return { error: "Failed to save user interests" };
      }
    }

    return {
      success: true,
      user_id: user.id,
      onboarding_response_id: onboardingData[0].id,
    };
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return { error: "Internal server error" };
  }
}
