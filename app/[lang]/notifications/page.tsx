import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationSettingsPage from "./notification-settings";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const dictionary = await getDictionary(lang);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <NotificationSettingsPage user={user} dictionary={dictionary} lang={lang} />
  );
}
