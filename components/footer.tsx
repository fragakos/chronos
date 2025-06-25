import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";
import LanguageSwitcher from "@/components/language-switcher";
import { type Locale } from "@/i18n-config";
import { type getDictionary } from "@/get-dictionary";

const Footer = ({
  currentLang,
  dict,
}: {
  currentLang: Locale;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {dict.footer.brand.name}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {dict.footer.brand.description}
            </p>
            <p className="text-sm text-muted-foreground/70">
              {dict.footer.brand.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {dict.footer.quickLinks.title}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLang}/auth/signup`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.quickLinks.signUp}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLang}/auth/login`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.quickLinks.signIn}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLang}/auth/forgot-password`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.footer.quickLinks.forgotPassword}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {dict.footer.language.title}
            </h3>
            <LanguageSwitcher currentLang={currentLang} />
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {dict.footer.bottom.copyright}
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">
              {dict.footer.bottom.madeWith}
            </span>
            <Heart className="h-4 w-4 text-destructive" />
            <span className="text-muted-foreground text-sm">
              {dict.footer.bottom.forHistoryLovers}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
