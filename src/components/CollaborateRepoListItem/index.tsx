"use client";
import React, { type FC } from "react";
import type { CollaborateRepoListItemProps } from "./Types";
import Link from "next/link";
import { Github } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useParams } from "next/navigation";
import { cn } from "~/lib/utils";

const CollaborateRepoListItem: FC<CollaborateRepoListItemProps> = (r) => {
  const { id } = useParams();
  return (
    <li
      className={cn(
        id === r?.collaborateId && "pointer-events-none bg-accent",
        "mb-0.5 rounded-md hover:bg-accent"
      )}
    >
      <Link
        href={`/collaborate/${r?.collaborateId}`}
        className="flex flex-nowrap px-2 py-1"
      >
        <div className=" mt-0.5 flex h-6 w-6 items-center justify-center text-muted-foreground">
          <Github className="h-4 w-4" />
        </div>
        <div className="ml-1 flex flex-col">
          <span className="mb-1 font-semibold">{r.name}</span>
          <div className="flex items-center">
            <Avatar className="h-4 w-4 rounded border">
              <AvatarImage
                src={r?.provider?.picture as string}
                alt={r?.provider?.name as string}
              />
            </Avatar>
            <span className="ml-1 text-sm text-muted-foreground">
              {r?.provider?.name}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default CollaborateRepoListItem;
