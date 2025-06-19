import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InterestQuestionnaire } from "@/components/dashboard/interest-questionnaire";

export default async function SetInterestsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user has completed onboarding
  const { data: onboardingResponse } = await supabase
    .from("user_onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const hasCompletedOnboarding = !!onboardingResponse;

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <InterestQuestionnaire
          hasCompletedOnboarding={hasCompletedOnboarding}
        />
      </main>
    </div>
  );
}
