import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — healthcare access and vulnerability mapping`,
    short_name: SITE_NAME,
    description:
      "An open geospatial platform mapping healthcare access against population vulnerability across Saudi Arabia.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0d0f14",
    theme_color: "#0a6e5f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
