import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { User } from "@supabase/supabase-js";
import StarWarsButton from "@/components/ui/starWarsButton";

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
      <div className="flex items-center justify-center w-full">
        <StarWarsButton label="Get Random Fact" link="/random-fact" />
      </div>
    </CardContent>
  </Card>
);
