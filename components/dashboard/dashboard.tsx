import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InterestQuestionnaire } from "@/components/dashboard/interest-questionnaire";
import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { NavHeader } from "@/components/dashboard/nav-header";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // This should not happen as this component is only for authenticated users
  }

  // Check if user has completed onboarding
  const { data: onboardingResponse } = await supabase
    .from("user_onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Check if user has interests set
  const { data: userInterests } = await supabase
    .from("user_interests")
    .select("*")
    .eq("user_id", user.id);

  const hasCompletedOnboarding = !!onboardingResponse;
  const hasInterests = userInterests && userInterests.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {!hasCompletedOnboarding || !hasInterests ? (
          <InterestQuestionnaire
            hasCompletedOnboarding={hasCompletedOnboarding}
          />
        ) : (
          <DashboardMain user={user} />
        )}
      </main>
    </div>
  );
}
