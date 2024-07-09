"use client";
import { formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import Icons from "~/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Update from "./Update";
import type { IssueOptions } from "~/types";
import { IssueType } from "@prisma/client";

const Content = ({ issue }: { issue: IssueOptions }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="mr-5 flex cursor-pointer flex-col items-start rounded-lg border p-4 pr-9 hover:bg-accent">
          <div className="flex w-full flex-col">
            <div className="mb-1 flex items-center">
              <div className="mb-0.5 flex flex-col">
                <div className="text-xs text-muted-foreground">
                  #{issue?.issueNumber} {" • "} in-progress{" "}
                  {formatDistanceToNow(new Date(issue?.updatedAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </div>
                <span className=" text-xl font-semibold">{issue?.title}</span>
              </div>
              <div className="ml-auto text-base text-green-500">
                {issue?.type === IssueType.paid ? (
                  `$ ${issue?.price?.toFixed(2)}`
                ) : (
                  <span className=" text-muted-foreground">open-source</span>
                )}
              </div>
            </div>
          </div>

          {issue?.topics?.length ? (
            <div className=" my-1 flex flex-wrap gap-1">
              {issue?.topics?.map((t, i) => (
                <span
                  key={i}
                  className=" rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            ""
          )}
          <div className="mt-2 flex items-center gap-1.5">
            <Avatar className="h-6 w-6 border border-black">
              <AvatarImage
                src={issue?.assigned?.picture as string}
                title={issue?.assigned?.username as string}
              />
              <AvatarFallback>
                <Icons.spinner className=" animate-spin" />
              </AvatarFallback>
            </Avatar>
            <span className=" font-semibold">{issue?.assigned?.name}</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Update id={issue?.id} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default Content;
