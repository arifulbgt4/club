"use client";
import { useCallback, useState } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PlusCircleIcon, Search } from "lucide-react";
// import RepoSearch from "./RepoSearch";
import type { AddRepositoryProps } from "./Types";
import { Input } from "../ui/input";
import type { Provider } from "@prisma/client";

export default function RepoImport({ providers }: AddRepositoryProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [repo, setRepo] = useState([]);
  const [provider, setProvider] = useState<Provider>(providers[0]);

  const getRepos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/repo/gitrepo", { method: "GET" });
      const data = await res.json();
      setRepo(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open && !repo?.length) {
          getRepos();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">
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
            <div className="  flex">
              <Select
                defaultValue={provider?.name as string}
                onValueChange={(v) => {
                  const selected = providers?.find(
                    (p) => p?.name === v
                  ) as Provider;
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
              <div className=" flex flex-1 items-center px-3">
                <Search className="h-5 w-5" />
                <Input
                  className=" w-full border-0 !outline-none  !ring-offset-0 focus-visible:ring-0"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* <RepoSearch
          organization={organization}
          user={user as User}
          repo={repo}
          loading={loading}
        /> */}
      </DialogContent>
    </Dialog>
  );
}
