import { type MetadataRoute } from "next";
import { siteUrl } from "~/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/profile",
        "/repo",
        "/task",
        "/settings",
        "/billing",
      ],
    },
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
