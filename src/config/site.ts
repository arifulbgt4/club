export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteConfig = (locale?: string) => ({
  name: "ChadNext",
  url: siteUrl + "/" + locale,
  ogImage: `${siteUrl}/${locale}/opengraph-image`,
  description: "Quick Starter Template for your Next project.",
  links: {
    twitter: "https://twitter.com/immoinulmoin",
    github: "https://github.com/moinulmoin/chadnext",
  },
});

export type SiteConfig = typeof siteConfig;
