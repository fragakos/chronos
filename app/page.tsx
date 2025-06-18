import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import LandingPage from "@/components/landing/landing-page";
import Dashboard from "@/components/dashboard/dashboard";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, show the landing page
  if (!user) {
    return <LandingPage />;
  }

  // If user is authenticated, show the dashboard
  return <Dashboard />;
}
