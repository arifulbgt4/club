import Link from "next/link";
import { Suspense } from "react";
import LocaleToggler from "../shared/locale-toggler";
import ThemeToggle from "../shared/theme-toggle";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t pb-[11px] pt-3">
      <div className="container flex items-center justify-between gap-4  md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="font-medium ">
              Otask
            </Link>{" "}
            . All Rights Reserved.
          </p>
        </div>

        <div className=" space-x-5">
          <Suspense>
            <LocaleToggler />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
