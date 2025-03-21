import { type Viewport, type Metadata } from "next";
import Footer from "~/components/layout/footer";
import Header from "~/components/layout/header";
import ThemeProvider from "~/components/shared/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { siteConfig, siteUrl } from "~/config/site";
import { I18nProviderClient } from "~/locales/client";

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig().themeColor },
    { media: "(prefers-color-scheme: dark)", color: siteConfig().themeColor },
  ],
};

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const locale = params.locale;
  const site = siteConfig(locale);

  return {
    title: {
      default: site.name,
      template: `${site.name} | %s`,
    },
    description: site.description,
    keywords: site.keywords,
    authors: [
      {
        name: site.name,
        url: siteUrl,
      },
    ],
    creator: site.name,
    openGraph: {
      type: "website",
      locale: locale,
      url: siteUrl,
      title: site.name,
      description: site.description,
      siteName: site.name,
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: [`${siteUrl}/opengraph-image`],
      creator: "@otask",
    },
    icons: {
      icon: [
        { url: "/favicon.svg" },
        new URL("/favicon.svg", siteUrl),
        { url: "/favicon.svg", media: "(prefers-color-scheme: dark)" },
      ],
      shortcut: ["/favicon.svg"],
      apple: [
        { url: "/favicon.svg" },
        { url: "/favicon.svg", sizes: "180x180" },
      ],
      other: [
        {
          rel: "apple-touch-icon-precomposed",
          url: "/favicon.svg",
        },
      ],
    },
    manifest: `${siteUrl}/manifest.json`,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
  };
}

export default function SubLayout({
  children,
  loginDialog,
  params: { locale },
}: {
  children: React.ReactNode;
  loginDialog: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Header />
      <main className=" min-h-[calc(100vh-126px)]">
        {children}
        {loginDialog}
      </main>
      <I18nProviderClient locale={locale}>
        <Footer />
      </I18nProviderClient>
      <Toaster />
    </ThemeProvider>
  );
}
