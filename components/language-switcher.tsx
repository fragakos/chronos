"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";

const languages = {
  en: {
    name: "English",
    flag: "🇺🇸",
  },
  el: {
    name: "Ελληνικά",
    flag: "🇬🇷",
  },
} as const;

const LanguageSwitcher = ({ currentLang }: { currentLang: Locale }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLang: Locale) => {
    if (newLang === currentLang) return;

    // Get the current path without the language prefix
    const segments = pathname.split("/");
    const pathWithoutLang = segments.slice(2).join("/");

    // Create new path with the selected language
    const newPath = `/${newLang}${
      pathWithoutLang ? `/${pathWithoutLang}` : ""
    }`;

    router.push(newPath);
  };

  const currentLanguage = languages[currentLang];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent/50"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>{currentLanguage.flag}</span>
            <span className="text-sm font-medium">{currentLanguage.name}</span>
          </span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {i18n.locales.map((locale) => {
          const language = languages[locale];
          const isActive = locale === currentLang;

          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
              {isActive && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
