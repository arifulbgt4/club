import { clsx, type ClassValue } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function hasFileNameSpaces(fileName: string) {
  return /\s/.test(fileName);
}
export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const isOurCdnUrl = (url: string) =>
  url?.includes("utfs.io") || url?.includes("uploadthing.com");

export const getImageKeyFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts.at(-1);
};

export class FreePlanLimitError extends Error {
  constructor(message = "Upgrade your plan!") {
    super(message);
  }
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove the leading '#' if it's present
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return the rgba color code
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function redirectError(error?: { digest: string } | any) {
  if (error?.digest?.includes("NEXT_REDIRECT")) {
    return redirect("/api/auth/login/github/refresh/");
  }
}
