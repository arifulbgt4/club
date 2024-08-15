import { type MetadataRoute } from "next";
import routes from "~/config/routes";
import { siteConfig } from "~/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig().name,
    short_name: siteConfig().shortName,
    description: siteConfig().description,
    start_url: routes.home,
    display: "standalone",
    background_color: siteConfig().backgroundColor,
    theme_color: siteConfig().themeColor,
    icons: [
      {
        src: "/icon/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
