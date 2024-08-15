export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const locales = ["en", "fr"];

export const siteConfig = (locale?: string) => ({
  name: "Otask",
  shortName: "Become a problem solver or publish your issue",
  url: siteUrl + "/" + locale,
  ogImage: `${siteUrl}/${locale}/opengraph-image`,
  description:
    "Encouraging individuals to either take on the role of solving existing problems or to share their own issues for others to address, fostering a collaborative and supportive environment.",
  keywords: ["otask", "issue", "github", "repository", "pull request"],
  backgroundColor: "#020817",
  themeColor: "#01e601",
  minimumAmount: 3,
  qualifyIssue: 3,
});

export type SiteConfig = typeof siteConfig;
