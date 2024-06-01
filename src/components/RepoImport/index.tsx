"use client";
import { type Organization, type User } from "@prisma/client";
import { useCallback, useState } from "react";

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
import { PlusCircleIcon } from "lucide-react";
import RepoSearch from "./RepoSearch";

export default function RepoImport({
  organization,
  user,
}: {
  organization: Organization[];
  user: User;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [repo, setRepo] = useState([]);

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

        <RepoSearch
          organization={organization}
          user={user as User}
          repo={repo}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
