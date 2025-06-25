import type { MetadataRoute } from "next";

export default function manifest({
  params,
}: {
  params: { lang: string };
}): MetadataRoute.Manifest {
  return {
    name: "Facts Off",
    short_name: "Facts Off",
    description: "Daily historical facts delivered to your inbox",
    start_url: `/${params.lang}`,
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
