"use client";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import SearchTopics from "../SearchTopics";
import type { SearchByTopicsProps } from "./Types";

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
    <SearchTopics
      value={params}
      onChange={onChange}
      isAuthenticate={isAuthenticate}
    />
  );
};

export default SearchByTopics;
