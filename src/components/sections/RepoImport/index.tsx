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

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { validateRequest } from "~/server/auth";
import { getOrganizations, getUserRepos } from "./action";
import RepoSearch from "./RepoSearch";
import { type User } from "@prisma/client";

export async function RepoImport() {
  const { user } = await validateRequest();
  const organization = await getOrganizations();
  const repo = await getUserRepos();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" font-bold" variant="outline">
          Import a repo
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
        />
      </DialogContent>
    </Dialog>
  );
}
