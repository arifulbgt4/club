/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { type FC, useCallback, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import { Lock, LockOpen, Plus, Search } from "lucide-react";
import type { RepositoryListProps } from "./Types";
import { Input } from "../ui/input";
import type { ProviderPublic } from "~/types";
import Icons from "../shared/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";

const RepositoryList: FC<RepositoryListProps> = ({ providers, setOpen }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPub, setLoadingPub] = useState<boolean>(false);
  const [repo, setRepo] = useState([]);
  const [afterText, setAfterText] = useState("");
  const [provider, setProvider] = useState<ProviderPublic>(providers[0]);

  const router = useRouter();
  const { register, watch } = useForm();

  const searchQuery = watch("query");

  const fetchResults = async (query: string) => {
    setLoading(true);
    const res = await fetch(
      `/api/v1/search/repositories?s=${provider?.id}&q=${query || ""}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    setAfterText(query);
    setRepo(data);
    setLoading(false);
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 300), [
    provider,
  ]);

  const onPublishRepo = async (repoName: string) => {
    setLoadingPub(true);
    const res = await fetch("/api/v1/repo/publish", {
      method: "POST",
      body: JSON.stringify({ p: provider.id, name: repoName }),
    });
    if (!res.ok) {
      setLoadingPub(false);
      return;
    }
    const pubId = await res.json();
    router.refresh();
    setTimeout(() => {
      router.push(`/repository/${pubId}`);
      setLoadingPub(false);
      setOpen(false);
    }, 500);
  };

  useEffect(() => {
    debouncedFetchResults(searchQuery);
  }, [searchQuery, debouncedFetchResults]);

  return (
    <div className=" flex flex-col">
      <div className="rounded-lg border shadow-md">
        <div className="  flex border-b">
          <Select
            defaultValue={provider?.name as string}
            onValueChange={(v) => {
              const selected = providers?.find(
                (p) => p?.name === v
              ) as ProviderPublic;
              setProvider(selected);
            }}
          >
            <SelectTrigger className=" w-auto">
              <SelectValue placeholder="Select a Organization" />
            </SelectTrigger>
            <SelectContent className=" w-52">
              <SelectGroup>
                {providers?.map((p) => (
                  <SelectItem
                    key={p.id}
                    value={p.name as string}
                    className=" cursor-pointer"
                  >
                    <div className="flex">
                      <Avatar className="mr-2 h-[20px] w-[20px]">
                        <AvatarImage src={p?.picture || ""} />
                      </Avatar>
                      <p className=" font-black">{p?.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
              <Link
                href="https://github.com/apps/issueclub/installations/select_target"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "mt-3"
                )}
              >
                <Plus className="mr-1 h-5 w-5" />
                Add GitHub Account
              </Link>
            </SelectContent>
          </Select>
          <div className=" relative flex flex-1 items-center px-3">
            <Search className="h-5 w-5" />
            <Input
              type="search"
              className=" w-full border-0 !outline-none  !ring-offset-0 focus-visible:ring-0"
              placeholder="Search..."
              {...register("query")}
            />

            {loading && (
              <div className=" absolute right-3">
                <Icons.spinner className=" animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col pt-3">
          {!!repo?.length ? (
            repo?.map((r: any) => (
              <div
                key={r?.id}
                className="flex justify-between rounded border-b p-3 hover:bg-accent"
              >
                <div className="mr-2 flex">
                  <div className="mr-2 mt-2 h-4 w-4 ">
                    {r?.private ? (
                      <Lock className=" mr-2 h-5 w-5" />
                    ) : (
                      <LockOpen className=" mr-2 h-5 w-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className=" font-medium">{r?.name}</span>
                    <span className=" text-xs font-light">{r?.full_name}</span>
                  </div>
                </div>
                <Button
                  onClick={() => onPublishRepo(r?.name)}
                  size="sm"
                  disabled={loadingPub}
                  variant="outline"
                  className=" hover:bg-accent-foreground hover:text-accent"
                >
                  Import
                </Button>
              </div>
            ))
          ) : !loading ? (
            <div className=" p-3 text-center italic text-muted-foreground">
              No repositories found {afterText && ` for "${afterText}"`}
            </div>
          ) : (
            <div className="p-3 text-center italic text-muted-foreground">
              Searching...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryList;
