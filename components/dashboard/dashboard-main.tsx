"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardProfileSummary } from "./DashboardProfileSummary";
import { DashboardInterests } from "./DashboardInterests";
import { DashboardQuickActions } from "./DashboardQuickActions";

interface DashboardMainProps {
  user: User;
}

interface UserInterest {
  id: number;
  user_id: string;
  category_id: number;
  interest_level: number;
  interest_categories: {
    id: number;
    name: string;
    description: string;
  };
}

interface UserProfile {
  user_id: string;
  experience_level: string;
  preferred_fact_length: string;
  daily_notification_enabled: boolean;
  notification_time: string;
  timezone: string;
}

export function DashboardMain({ user }: DashboardMainProps) {
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();

        // Fetch user interests with category details
        const { data: interests, error: interestsError } = await supabase
          .from("user_interests")
          .select(
            `
            *,
            interest_categories (
              id,
              name,
              description
            )
          `
          )
          .eq("user_id", user.id)
          .order("interest_level", { ascending: false });

        if (interestsError) throw interestsError;

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116")
          throw profileError; // PGRST116 is "not found"

        setUserInterests(interests || []);
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
      setAnalysis(null);
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

  const getInterestLevelLabel = (level: number) => {
    switch (level) {
      case 5:
        return "Very High";
      case 4:
        return "High";
      case 3:
        return "Medium";
      case 2:
        return "Low";
      case 1:
        return "Very Low";
      default:
        return "Unknown";
    }
  };

  const getInterestLevelColor = (level: number) => {
    switch (level) {
      case 5:
        return "text-red-600";
      case 4:
        return "text-orange-600";
      case 3:
        return "text-yellow-600";
      case 2:
        return "text-blue-600";
      case 1:
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <DashboardWelcome user={user} />

      {/* User Profile Summary */}
      {userProfile && (
        <DashboardProfileSummary
          userProfile={userProfile}
          analysis={analysis}
          analysisLoading={analysisLoading}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      )}

      {/* User Interests */}
      <DashboardInterests
        userInterests={userInterests}
        getInterestLevelLabel={getInterestLevelLabel}
        getInterestLevelColor={getInterestLevelColor}
      />

      {/* Quick Actions */}
      <DashboardQuickActions />
    </div>
  );
}
