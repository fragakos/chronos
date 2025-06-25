"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardProfileSummary } from "./DashboardProfileSummary";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { SimpleLoader } from "../ui/simple-loader";

interface DashboardMainProps {
  user: User;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

interface UserProfile {
  user_id: string;
  experience_level: string;
  preferred_fact_length: string;
  daily_notification_enabled: boolean;
  notification_time: string;
  timezone: string;
}

export function DashboardMain({ user, dictionary, lang }: DashboardMainProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116")
          throw profileError; // PGRST116 is "not found"

        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);

  // Fetch analysis when drawer opens
  useEffect(() => {
    if (!isDrawerOpen) return;
    const fetchAnalysis = async () => {
      setAnalysisLoading(true);

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_interest_analysis")
          .select("ai_response")
          .eq("user_id", user.id)
          .order("onboarding_response_id", { ascending: false })
          .limit(1)
          .single();
        if (error) throw error;
        setAnalysis(data?.ai_response || null);
      } catch {
        setAnalysis("Could not load analysis.");
      } finally {
        setAnalysisLoading(false);
      }
    };
    fetchAnalysis();
  }, [isDrawerOpen, user.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <SimpleLoader />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <DashboardWelcome user={user} dictionary={dictionary} lang={lang} />

      {/* User Profile Summary */}
      {userProfile && (
        <DashboardProfileSummary
          userProfile={userProfile}
          analysis={analysis}
          analysisLoading={analysisLoading}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          dictionary={dictionary}
        />
      )}

      {/* User Interests */}
      {/* <DashboardInterests
        userInterests={userInterests}
        getInterestLevelLabel={getInterestLevelLabel}
        getInterestLevelColor={getInterestLevelColor}
      /> */}

      {/* Quick Actions */}
      <DashboardQuickActions dictionary={dictionary} />
    </div>
  );
}
