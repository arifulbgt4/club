"use client";
import { formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import Icons from "~/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Update from "./Update";
import type { IssueOptions, RequestOptions } from "~/types";
import { type Intent, IntentType, IssueStatus } from "@prisma/client";

const Content = ({
  intent,
  issue,
  request,
}: {
  issue: IssueOptions;
  intent: Intent;
  request: RequestOptions;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer flex-col items-start rounded-lg border p-4 hover:bg-accent">
          <div className="flex w-full flex-col">
            <div className="mb-1 flex items-center">
              <div className="mb-0.5 flex flex-col">
                <div className="flex flex-nowrap items-center text-xs text-muted-foreground">
                  #{issue?.issueNumber} {" • "}
                  {issue?.status === IssueStatus.queue && (
                    <>
                      {" "}
                      <span className="px-1 text-yellow-500">Queue</span>
                      {" • "}
                    </>
                  )}{" "}
                  in-progress{" "}
                  {formatDistanceToNow(new Date(issue?.updatedAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </div>
                <span className=" text-xl font-semibold">{issue?.title}</span>
              </div>
              <div className="ml-auto font-mono font-semibold tracking-wider">
                {intent?.type === IntentType.paid ? (
                  `$${intent?.price?.toFixed(2)}`
                ) : (
                  <span className="font-normal tracking-normal">
                    open-source
                  </span>
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
                src={request?.user?.picture as string}
                title={request?.user?.username as string}
              />
              <AvatarFallback>
                <Icons.spinner className=" animate-spin" />
              </AvatarFallback>
            </Avatar>
            <span className=" font-semibold">{request?.user?.name}</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Update id={intent?.id} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default Content;
