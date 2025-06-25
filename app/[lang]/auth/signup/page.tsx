import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import SignupClient from "@/components/auth/signup-client";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <SignupClient dict={dictionary} />;
}
