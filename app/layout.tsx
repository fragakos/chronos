import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import { NavHeader } from "@/components/nav-header";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import InstallDialog from "@/components/install-dialog";

export const metadata: Metadata = {
  title: "Facts Off",
  description: "Daily historical facts delivered to your inbox",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Facts Off" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {user && <NavHeader user={user} />}
          {children}
          <Footer />
          <InstallDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
