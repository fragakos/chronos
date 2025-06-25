"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Home, ArrowRight } from "lucide-react";
import { getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";

interface SuccessClientProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

export function SuccessClient({ dictionary, lang }: SuccessClientProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push(`/${lang}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, lang]);

  const handleGoHome = () => {
    router.push(`/${lang}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ">
      <div className="max-w-md w-full space-y-8">
        <Card className="bg-card text-card-foreground shadow-lg border border-border">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
              {dictionary.success.title}
            </CardTitle>
            <CardDescription className="text-base">
              {dictionary.success.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                  {dictionary.success.whatsNext}
                </h3>
                <ul className="text-sm space-y-1 text-left">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-primary" />
                    {dictionary.success.features.dailyFacts}
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-primary" />
                    {dictionary.success.features.recommendations}
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-primary" />
                    {dictionary.success.features.progress}
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoHome}
                className="w-full"
                size="lg"
                aria-label="Go to dashboard"
              >
                <Home className="mr-2 h-4 w-4" />
                {dictionary.success.goToDashboard}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {dictionary.success.redirecting}{" "}
                  <span className="font-semibold text-primary">
                    {countdown}
                  </span>{" "}
                  {dictionary.success.seconds}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
