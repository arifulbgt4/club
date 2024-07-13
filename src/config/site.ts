export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteConfig = (locale?: string) => ({
  name: "Otask",
  url: siteUrl + "/" + locale,
  ogImage: `${siteUrl}/${locale}/opengraph-image`,
  description: "Quick Starter Template for your Next project.",
  links: {
    twitter: "https://x.com/arifulbgt4",
    github: "https://github.com/arifulbgt4",
  },
  minimumAmount: 3,
});

export type SiteConfig = typeof siteConfig;
