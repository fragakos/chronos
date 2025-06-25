import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import LandingPage from "@/app/[lang]/landing-page";
import Dashboard from "@/components/dashboard/dashboard";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, show the landing page
  if (!user) {
    return <LandingPage dictionary={dictionary} currentLang={lang} />;
  }

  // If user is authenticated, show the dashboard
  return <Dashboard dictionary={dictionary} lang={lang} />;
}
