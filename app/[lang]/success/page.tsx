import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SuccessClient } from "@/components/success/success-client";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function SuccessPage({
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

  if (!user) {
    redirect(`/${lang}/auth/login`);
  }

  return <SuccessClient dictionary={dictionary} lang={lang} />;
}
