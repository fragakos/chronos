import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getDictionary } from "@/get-dictionary";
import { SimpleLoader } from "../ui/simple-loader";

interface UserProfile {
  user_id: string;
  experience_level: string;
  preferred_fact_length: string;
  daily_notification_enabled: boolean;
  notification_time: string;
  timezone: string;
}

interface DashboardProfileSummaryProps {
  userProfile: UserProfile;
  analysis: string | null;
  analysisLoading: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

export const DashboardProfileSummary = ({
  userProfile,
  analysis,
  analysisLoading,
  isDrawerOpen,
  setIsDrawerOpen,
  dictionary,
}: DashboardProfileSummaryProps) => (
  <Card>
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="text-lg sm:text-xl">
        {dictionary.dashboard.main.profileSummary.title}
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        {dictionary.dashboard.main.profileSummary.subtitle}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium ">
            {dictionary.dashboard.main.profileSummary.experienceLevel}
          </p>
          <p className="text-base sm:text-lg capitalize">
            {userProfile.experience_level}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium ">
            {dictionary.dashboard.main.profileSummary.preferredFactLength}
          </p>
          <p className="text-base sm:text-lg capitalize">
            {userProfile.preferred_fact_length}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium ">
            {dictionary.dashboard.main.profileSummary.dailyNotifications}
          </p>
          <p className="text-base sm:text-lg">
            {userProfile.daily_notification_enabled ? "Enabled" : "Disabled"}
          </p>
        </div>
        {userProfile.daily_notification_enabled && (
          <div>
            <p className="text-sm font-medium ">
              {dictionary.dashboard.main.profileSummary.notificationTime}
            </p>
            <p className="text-base sm:text-lg">
              {userProfile.notification_time}
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full sm:w-auto"
        >
          <Link
            href="/notifications"
            className="flex items-center justify-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>
              {dictionary.dashboard.main.profileSummary.manageNotifications}
            </span>
          </Link>
        </Button>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="w-full sm:w-auto"
              aria-label="View your AI-generated interest analysis"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {dictionary.dashboard.main.profileSummary.viewAnalysis}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-lg mx-auto">
            <DrawerHeader>
              <DrawerTitle>
                {dictionary.dashboard.main.profileSummary.yourInterestAnalysis}
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {analysisLoading ? (
                <div className="flex items-center justify-center py-8">
                  <SimpleLoader />
                </div>
              ) : analysis ? (
                <div className="prose prose-neutral max-w-none">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-600">
                  {dictionary.dashboard.main.profileSummary.noAnalysisFound}
                </div>
              )}
            </div>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full mt-4 mb-4"
                aria-label="Close analysis drawer"
              >
                {dictionary.dashboard.main.profileSummary.closeAnalysis}
              </Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      </div>
    </CardContent>
  </Card>
);
