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
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

interface DashboardWelcomeProps {
  user: User;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

export const DashboardWelcome = ({
  user,
  dictionary,
  lang,
}: DashboardWelcomeProps) => (
  <Card>
    <CardHeader className="pb-4 sm:pb-6">
      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
        <span>
          {dictionary.dashboard.main.welcome}
          {user.user_metadata?.full_name || user.email}!
        </span>
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        {dictionary.dashboard.main.subtitle}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center w-full">
        <StarWarsButton
          label={dictionary.dashboard.main.getRandomFact}
          link={`/${lang}/random-fact`}
        />
      </div>
    </CardContent>
  </Card>
);
