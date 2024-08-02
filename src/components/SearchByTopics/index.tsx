"use client";
import { type FC } from "react";
import type { SearchByTopicsProps } from "./Types";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import SearchTopics from "../SearchTopics";

const SearchByTopics: FC<SearchByTopicsProps> = ({
  params,
  isAuthenticate,
}) => {
  const router = useRouter();

  function onChange(v: string[]) {
    if (!!v?.length) {
      router.push(`/?topics=${v.join(",")}`);
      return;
    }
    router.push("/");
  }

  return (
    <div
      className={cn(
        !isAuthenticate && "pointer-events-none",
        "flex min-h-12 w-full items-center gap-2 rounded-lg border px-2 py-1"
      )}
    >
      <SearchTopics value={params} onChange={onChange} />
    </div>
  );
};

export default SearchByTopics;
