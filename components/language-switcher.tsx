"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";

const languages = {
  en: {
    name: "English",
    flag: "en",
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
        <Button variant="outline" size="icon">
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
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
              <span className="text-sm font-medium">{language.name}</span>
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
