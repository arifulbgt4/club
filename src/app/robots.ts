import { type MetadataRoute } from "next";
import routes from "~/config/routes";
import { siteUrl } from "~/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        routes.profile,
        routes.repository,
        routes.collaborate,
        routes.settings,
        routes.task,
        routes.billing,
      ],
    },
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
