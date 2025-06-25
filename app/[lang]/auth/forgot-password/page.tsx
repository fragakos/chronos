import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import ForgotPasswordClient from "@/components/auth/forgot-password-client";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ForgotPasswordClient dict={dictionary} />;
}
