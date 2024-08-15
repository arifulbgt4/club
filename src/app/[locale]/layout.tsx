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
      template: `%s - ${site.shortName}`,
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
      url: site.url,
      title: site.name,
      description: site.description,
      siteName: site.name,
      images: [
        {
          url: `${site.url}/opengraph-image`,
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
      images: [`${site.url}/opengraph-image`],
      creator: "@otask",
    },
    icons: {
      icon: "/icon/favicon.ico",
      shortcut: "/icon/favicon-16x16.png",
      apple: "/apple-icon/apple-touch-icon.png",
    },
    manifest: `${siteUrl}/manifest.json`,
    metadataBase: new URL(site.url),
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
