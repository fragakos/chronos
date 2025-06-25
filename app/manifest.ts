import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { i18n, type Locale } from "@/i18n-config";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  // Simple locale detection - you could make this more sophisticated
  let locale: Locale = i18n.defaultLocale;
  for (const supportedLocale of i18n.locales) {
    if (acceptLanguage.includes(supportedLocale)) {
      locale = supportedLocale;
      break;
    }
  }

  return {
    name: "Facts Off",
    short_name: "Facts Off",
    description: "Daily historical facts delivered to your inbox",
    start_url: `/${locale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
