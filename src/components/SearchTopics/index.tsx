/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandDialog,
} from "~/components/ui/command";
import type { SearchTopicsProps } from "./Types";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import Icons from "../shared/icons";
import { Button } from "../ui/button";

const SearchTopics: FC<SearchTopicsProps> = ({
  value = [],
  onChange,
  isAuthenticate = true,
}) => {
  const [open, setOpen] = useState(false);
  const [topicsValue, setTopicsValue] = useState<string[]>(value);
  const [loading, setLoading] = useState<boolean>(false);
  const { register, watch, setValue } = useForm();
  const [topics, setTopics] = useState<string[]>([]);
  const searchQuery = watch("query");

  const searchTopics = async (query: string) => {
    setLoading(true);
    const res = await fetch(`/api/v1/search/topics?q=${query}`, {
      method: "GET",
    });
    if (!res.ok) {
      return;
    }
    const topicsData = await res.json();
    setTopics(topicsData?.map((t: { name: string }) => t?.name));
    setLoading(false);
  };

  const removeTopic = useCallback(
    (t: string) => {
      if (topicsValue?.length <= 1) {
        if (!!onChange) {
          onChange([]);
        }
        return setTopicsValue([]);
      }
      if (!!onChange) {
        onChange([...topicsValue?.filter((v) => v !== t)]);
      }
      setTopicsValue((pre) => pre.filter((v) => v !== t));
    },
    [topicsValue]
  );

  const debouncedSearch = useCallback(debounce(searchTopics, 300), []);
  useEffect(() => {
    if (!!searchQuery) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="flex flex-1">
      <div className="relative flex min-h-12 w-full flex-wrap items-center gap-2 rounded-lg border px-2 py-1">
        <div className="flex flex-wrap gap-1">
          {topicsValue?.map((p, i) => (
            <Button
              key={i}
              size="sm"
              onClick={() => removeTopic(p)}
              className="h-6 px-2 hover:text-destructive"
            >
              {p}
              <X className="ml-1 h-4 w-4" />
            </Button>
          ))}
        </div>
        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-x-1.5 px-2 py-1 text-sm text-muted-foreground"
        >
          <span className="-mb-[1px] text-lg">🔍</span>
          {isAuthenticate ? "Search topics" : "Login and search"}
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="-m-[1px] flex flex-nowrap items-center rounded-md border px-3">
            <Search className="h-5 w-5" />
            <Input
              className=" h-auto w-full border-0 py-3 !outline-none  !ring-offset-0 focus-visible:ring-0"
              {...register("query")}
              placeholder="Search topics"
            />
            {loading && (
              <div className=" absolute right-3 top-3">
                <Icons.spinner className=" animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            <CommandGroup forceMount heading="Topics">
              {topics?.map((t, i) => (
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setTopicsValue([...topicsValue, t]);
                    if (!!onChange) {
                      onChange([...topicsValue, t]);
                    }
                    setValue("query", "");
                    setTopics([]);
                  }}
                  className=" cursor-pointer"
                  key={i}
                >
                  <span>{t}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {!topics?.length && <CommandEmpty>No results found.</CommandEmpty>}
          </CommandList>
        </CommandDialog>
      </div>
    </div>
  );
};

export default SearchTopics;
