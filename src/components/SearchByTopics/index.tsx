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

  return (
    <div
      className={cn(
        !isAuthenticate && "pointer-events-none",
        "flex min-h-12 w-full items-center gap-2 rounded-lg border px-2 py-1"
      )}
    >
      <SearchTopics
        value={params}
        onChange={(v) => {
          if (!!v?.length) {
            router.push(`/?topics=${v.join(",")}`);
            return;
          }
          router.push("/");
        }}
      />
      {/* <Search className="h-5 w-5" />
      <div className="flex">
        {params?.map((p, i) => (
          <Button
            key={i}
            size="sm"
            onClick={() => removeTopic(p)}
            className="mx-1 h-6 px-2 hover:text-destructive"
          >
            {p}
            <X className="ml-1 h-4 w-4" />
          </Button>
        ))}
      </div>
      {isMounted ? (
        <Select
          value=""
          className="  bg-transparent"
          isDisabled={!isAuthenticate}
          classNames={{
            indicatorsContainer: () => "w-0 !hidden",
            control: () =>
              "!bg-transparent !border-0 !shadow-none !cursor-text",
            valueContainer: () => "!p-0",
            input: () => "!text-inherit !p-0",
            menu: () => "!bg-accent !text-inherit !w-[240px]",
            option: ({ isFocused }) =>
              isFocused
                ? "!bg-accent-foreground !text-accent"
                : "!bg-transparent !text-inherit",
          }}
          onChange={(v: any) => {
            router.push(
              `/?topics=${!!params?.length ? params.join(",") + "," + v?.value : v?.value}`
            );
          }}
          inputValue={inputValue}
          placeholder={isAuthenticate ? "Search by topics" : "Login and search"}
          noOptionsMessage={() => <p>Search topics</p>}
          loadingMessage={() => (
            <div className=" flex justify-center">
              <Icons.spinner className=" animate-spin" />
            </div>
          )}
          onInputChange={(newValue) => setInputValue(newValue)}
          loadOptions={loadOptions}
          defaultOptions={false}
          cacheOptions
        />
      ) : null} */}
    </div>
  );
};

export default SearchByTopics;
