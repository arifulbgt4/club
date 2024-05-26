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
        />
      </DialogContent>
    </Dialog>
  );
}
