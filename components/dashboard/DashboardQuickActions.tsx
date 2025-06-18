import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Sparkles, Settings, BookOpen, Bell } from "lucide-react";

export const DashboardQuickActions = () => (
  <Card>
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
      <CardDescription className="text-sm sm:text-base">
        Common tasks and features
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Button
          variant="outline"
          className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
          asChild
        >
          <Link href="/random-fact">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">Random Fact</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
          asChild
        >
          <Link href="/set-interests">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">Update Interests</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
          asChild
        >
          <Link href="/history">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">View History</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
          asChild
        >
          <Link href="/notifications">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm">Notifications</span>
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);
