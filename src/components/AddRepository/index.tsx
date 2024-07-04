/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Lock, LockOpen, PlusCircleIcon, Search } from "lucide-react";
import type { AddRepositoryProps } from "./Types";
import { Input } from "../ui/input";
import type { ProviderPublic } from "~/types";
import Icons from "../shared/icons";
import { useRouter } from "next/navigation";

export default function RepoImport({ providers }: AddRepositoryProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPub, setLoadingPub] = useState<boolean>(false);
  const [repo, setRepo] = useState([]);
  const [provider, setProvider] = useState<ProviderPublic>(providers[0]);

  const router = useRouter();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement> | null) => {
    setLoading(true);
    const res = await fetch(
      `/api/v1/search/repositories?q=${e?.target?.value || ""}&s=${provider?.id}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    setRepo(data);
    setLoading(false);
  };

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
    onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className=" bg-accent-foreground text-accent hover:text-inherit"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Import a repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Git Repository</DialogTitle>
          <DialogDescription>
            Import a github repository to published your issues
          </DialogDescription>
        </DialogHeader>
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
                </SelectContent>
              </Select>
              <div className=" relative flex flex-1 items-center px-3">
                <Search className="h-5 w-5" />
                <Input
                  type="search"
                  className=" w-full border-0 !outline-none  !ring-offset-0 focus-visible:ring-0"
                  placeholder="Search..."
                  onChange={onChange}
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
                        <span className=" text-xs font-light">
                          {r?.full_name}
                        </span>
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
              ) : (
                <div className="px-3 py-6">
                  <em>No repositories found</em>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
