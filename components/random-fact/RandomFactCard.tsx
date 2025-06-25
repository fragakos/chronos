import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { RandomFactContent } from "./RandomFactContent";
import { RandomFactActions } from "./RandomFactActions";
import { Locale } from "@/i18n-config";

type RandomFactCardProps = {
  loading: boolean;
  regenerating: boolean;
  error: string | null;
  fact: string | null;
  dailyFactId: number | null;
  handleThanks: () => Promise<void>;
  currentLang: Locale;
};

export const RandomFactCard = ({
  loading,
  regenerating,
  error,
  fact,
  dailyFactId,
  handleThanks,
  currentLang,
}: RandomFactCardProps) => {
  const title = fact?.split("\n")[0] || "";
  const content = fact?.split("\n").slice(1).join("\n") || "";
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between w-full mb-4">
          {/* Left side icons - 20% */}
          <div className="flex items-center justify-center w-1/5">
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Title - 60% */}
          <div className="w-3/5 text-center">
            <CardTitle className="text-lg md:text-xl lg:text-2xl leading-tight">
              {title}
            </CardTitle>
          </div>

          {/* Right side icons - 20% */}
          <div className="flex items-center justify-center w-1/5">
            <div className="p-2 bg-accent/30 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-4 px-1 text-lg">
        <RandomFactContent
          loading={loading}
          regenerating={regenerating}
          error={error}
          fact={content}
          currentLang={currentLang}
        />
        <RandomFactActions
          fact={fact}
          dailyFactId={dailyFactId}
          handleThanks={handleThanks}
          currentLang={currentLang}
        />
      </CardContent>
    </Card>
  );
};
