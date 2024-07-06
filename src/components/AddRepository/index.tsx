/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { PlusCircleIcon } from "lucide-react";
import type { AddRepositoryProps } from "./Types";
import RepositoryList from "./RepositoryList";

export default function RepoImport({ providers }: AddRepositoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="secondary" className=" rounded-br-none">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Import repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Git Repository</DialogTitle>
          <DialogDescription>
            Import a github repository to published your issues
          </DialogDescription>
        </DialogHeader>
        <RepositoryList providers={providers} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
