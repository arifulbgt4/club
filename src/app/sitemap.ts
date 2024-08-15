import { type MetadataRoute } from "next";
import routes from "~/config/routes";
import { locales, siteConfig } from "~/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales
    .map((locale) => [
      {
        url: siteConfig(locale).url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${siteConfig(locale).url}${routes.login}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      },
      {
        url: `${siteConfig(locale).url}${routes.about}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      },
      {
        url: `${siteConfig(locale).url}${routes.changelog}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      },
    ])
    .flat() as MetadataRoute.Sitemap;
}
