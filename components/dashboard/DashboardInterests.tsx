import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

interface InterestCategory {
  id: number;
  name: string;
  description: string;
}

interface UserInterest {
  id: number;
  user_id: string;
  category_id: number;
  interest_level: number;
  interest_categories: InterestCategory;
}

interface DashboardInterestsProps {
  userInterests: UserInterest[];
  getInterestLevelLabel: (level: number) => string;
  getInterestLevelColor: (level: number) => string;
}

export const DashboardInterests = ({
  userInterests,
  getInterestLevelLabel,
  getInterestLevelColor,
}: DashboardInterestsProps) => (
  <Card>
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
        <Star className="h-5 w-5" />
        <span>Your Historical Interests</span>
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        Categories you&apos;re most interested in learning about
      </CardDescription>
    </CardHeader>
    <CardContent>
      {userInterests.length === 0 ? (
        <p className="text-gray-600 text-sm sm:text-base">
          No interests set yet. Complete the questionnaire to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {userInterests
            .filter((interest) => interest.interest_level >= 3)
            .map((interest) => (
              <div
                key={interest.id}
                className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {interest.interest_categories.name}
                  </h3>
                  <span
                    className={`text-xs sm:text-sm font-medium ${getInterestLevelColor(
                      interest.interest_level
                    )}`}
                  >
                    {getInterestLevelLabel(interest.interest_level)}
                  </span>
                </div>
                {interest.interest_categories.description && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    {interest.interest_categories.description}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </CardContent>
  </Card>
);
