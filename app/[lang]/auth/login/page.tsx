import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import LoginClient from "@/components/auth/login-client";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <LoginClient dict={dictionary} />;
}
