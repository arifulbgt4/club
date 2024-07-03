/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, type FC } from "react";
import type { SearchByTopicsProps } from "./Types";
import Select from "react-select/async";
import Icons from "../shared/icons";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

const SearchByTopics: FC<SearchByTopicsProps> = ({
  params,
  isAuthenticate,
}) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    const res = await fetch(`/api/v1/search/topics?q=${inputValue}`, {
      method: "GET",
    });
    if (!res.ok) {
      return;
    }
    const topics = await res.json();
    return topics?.map((topic: { name: string }) => ({
      label: topic.name,
      value: topic.name,
    }));
  };

  const removeTopic = (t: string) => {
    if (params?.length === 1) {
      return router.push("/");
    }
    router.push(`/?topics=${params.filter((v) => v !== t).join(",")}`);
  };

  return (
    <div
      className={cn(
        !isAuthenticate && "pointer-events-none",
        "flex w-full items-center gap-2 rounded-lg border px-2 py-1"
      )}
    >
      <Search className="h-5 w-5" />
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
      <Select
        value=""
        className="  bg-transparent"
        classNames={{
          indicatorsContainer: () => "w-0 !hidden",
          control: () => "!bg-transparent !border-0 !shadow-none !cursor-text",
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
    </div>
  );
};

export default SearchByTopics;
