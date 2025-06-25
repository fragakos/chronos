import type { Metadata } from "next";
import "@/app/globals.css";
import Footer from "@/components/footer";
import { NavHeader } from "@/components/nav-header";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import InstallDialog from "@/components/install-dialog";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export const metadata: Metadata = {
  title: "Facts Off",
  description: "Daily historical facts delivered to your inbox",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const currentLang = lang as Locale;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dictionary = await getDictionary(currentLang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Facts Off" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {user && (
            <NavHeader
              user={user}
              currentLang={currentLang}
              dictionary={dictionary}
            />
          )}
          {children}
          <Footer currentLang={currentLang} dict={dictionary} />
          <InstallDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
