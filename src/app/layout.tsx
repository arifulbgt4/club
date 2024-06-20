import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { cn } from "~/lib/utils";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = cookies().get("Next-Locale")?.value || "en";
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
