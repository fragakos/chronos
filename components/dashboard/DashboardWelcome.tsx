import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Sparkles, Settings, BookOpen } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface DashboardWelcomeProps {
  user: User;
}

export const DashboardWelcome = ({ user }: DashboardWelcomeProps) => (
  <Card>
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
        <span>
          Welcome back, {user.user_metadata?.full_name || user.email}!
        </span>
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        Ready to discover fascinating historical facts tailored to your
        interests?
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          asChild
          className="flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Link href="/random-fact">
            <Sparkles className="h-4 w-4" />
            <span>Get Random Fact</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Link href="/set-interests">
            <Settings className="h-4 w-4" />
            <span>Update Interests</span>
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);
