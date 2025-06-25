import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import ResetPasswordClient from "@/components/auth/reset-password-client";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ResetPasswordClient dict={dictionary} />;
}
