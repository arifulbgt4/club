import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api/(?!add/collect$)|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
