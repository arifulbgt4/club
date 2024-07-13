"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Sheet, SheetTrigger } from "~/components/ui/sheet";
import { type Intent, IntentType } from "@prisma/client";
import RequestList from "./RequestList";
import type { IssueOptions, RequestOptions } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Icons from "~/components/shared/icons";

const Content = ({
  issue,
  intent,
}: {
  issue: IssueOptions;
  intent: Intent;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="mr-5 flex cursor-pointer flex-nowrap items-start justify-between gap-5 rounded-lg border p-4 pr-9  hover:bg-accent">
          <div className="flex flex-col">
            <div className="flex w-full flex-col">
              <div className="mb-1 flex items-center">
                <div className="mb-0.5 flex flex-col">
                  <div className="text-xs text-muted-foreground">
                    #{issue?.issueNumber} {" • "} published{" "}
                    {formatDistanceToNow(new Date(intent?.updatedAt), {
                      addSuffix: true,
                      includeSeconds: true,
                    })}
                  </div>
                  <span className=" text-xl font-semibold">{issue?.title}</span>
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
            <div className="mt-2 flex items-center">
              <span className=" text-xs font-bold text-muted-foreground">
                {issue?.request?.length === 0 && " No request yet"}
              </span>
              <div className=" flex items-center">
                {issue?.request?.map((u: RequestOptions) => (
                  <Avatar
                    key={u?.id}
                    className=" -mr-2 h-6 w-6 border border-black"
                  >
                    <AvatarImage
                      src={u?.user?.picture as string}
                      title={u?.user?.username as string}
                    />
                    <AvatarFallback>
                      <Icons.spinner className=" animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                ))}
                {issue?.request?.length === 8 && (
                  <div className=" z-50 flex h-6 w-7 items-center justify-center rounded-full border bg-white shadow">
                    <span className="text-center text-xs font-black text-red-600">
                      9+
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" flex w-28 justify-end pt-3 text-right font-mono font-semibold tracking-wider">
            {intent?.type === IntentType.paid ? (
              `$${intent?.price?.toFixed(2) ?? (0).toFixed(2)}`
            ) : (
              <span className="font-normal tracking-normal">open-source</span>
            )}
          </div>
        </div>
      </SheetTrigger>
      {open && (
        <RequestList id={issue?.id} setOpen={setOpen} intentId={intent?.id} />
      )}
    </Sheet>
  );
};

export default Content;
