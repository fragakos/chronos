import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RandomFactClient } from "@/components/random-fact/RandomFactClient";
import { Locale } from "@/i18n-config";

export default async function RandomFactPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <RandomFactClient userId={user.id} currentLang={lang} />;
}
